"use client";
/* eslint-disable react-hooks/immutability -- mutating three.js objects (scene,
   materials, transforms) inside useFrame is the intended react-three-fiber
   render-loop pattern, not a React state mutation. */
/* eslint-disable react-hooks/purity -- procedural geometry uses Math.random()
   once to scatter the particle field; it's built in a memo and never re-run. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

type WaveMaterial = THREE.Material & { userData: { shader?: { uniforms: { uTime: { value: number } } } } };

/**
 * Ximo's dragon — a real GLB model (public/models/dragon.glb) flown through the
 * scroll "journey". The model has no rig/animation, so it MOVES as a rigid body:
 * a slow showcase turn + idle float, and as the user scrolls DOWN it descends
 * and tips its head down to look where it's heading. Background, fog and a
 * drifting particle field lerp across five "worlds" so each scene change reads.
 */

const MODEL_URL = "/models/dragon-opt.glb";

// Enchanted-forest "worlds" (scroll 0 → 1), inspired by the Ori games: deep
// mossy dark backgrounds lit by bioluminescent spirit colours.
const BG = ["#05140f", "#06231d", "#082a2a", "#16210a", "#071a2c"].map((c) => new THREE.Color(c));
const GLOW = ["#3fe0cf", "#9affb0", "#34dcf0", "#ffcf5e", "#7fe8ff"].map((c) => new THREE.Color(c));

function lerpPalette(palette: THREE.Color[], p: number, out: THREE.Color) {
  const n = palette.length - 1;
  const x = Math.min(n, Math.max(0, p * n));
  const i = Math.floor(x);
  out.copy(palette[i]).lerp(palette[Math.min(n, i + 1)], x - i);
  return out;
}

/** Loads the dragon GLB, normalises its size/centre, and drives its motion. */
function DragonModel({ disp }: { disp: React.RefObject<number> }) {
  const { scene } = useGLTF(MODEL_URL);
  const outer = useRef<THREE.Group>(null);
  const mats = useRef<WaveMaterial[]>([]);

  // Centre + scale the model, and inject a SERPENTINE body wave into every
  // material's vertex shader so the mesh itself undulates (the GLB has no rig).
  const { fitScale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    const minY = box.min.y;
    const height = size.y || 1;
    const amp = maxDim * 0.08;
    const list: WaveMaterial[] = [];
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const arr = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      arr.forEach((m) => {
        m.onBeforeCompile = (shader) => {
          shader.uniforms.uTime = { value: 0 };
          shader.uniforms.uAmp = { value: amp };
          shader.uniforms.uMinY = { value: minY };
          shader.uniforms.uHeight = { value: height };
          shader.uniforms.uFreq = { value: 6.5 };
          shader.uniforms.uSpeed = { value: 2.0 };
          shader.vertexShader =
            "uniform float uTime,uAmp,uMinY,uHeight,uFreq,uSpeed;\n" + shader.vertexShader;
          shader.vertexShader = shader.vertexShader.replace(
            "#include <begin_vertex>",
            [
              "#include <begin_vertex>",
              "float ph = (position.y - uMinY) / uHeight;",
              "float ph2 = ph * uFreq + uTime * uSpeed;",
              // Amplitude grows toward the tail (low y) so it swishes while the
              // head stays comparatively steady — a natural serpentine slither.
              "float aw = 1.25 - ph;",
              "transformed.x += sin(ph2) * uAmp * aw;",
              "transformed.z += cos(ph2) * uAmp * 0.5 * aw;",
            ].join("\n"),
          );
          (m as WaveMaterial).userData.shader = shader as unknown as WaveMaterial["userData"]["shader"];
        };
        m.needsUpdate = true;
        list.push(m as WaveMaterial);
      });
    });
    mats.current = list;
    return { fitScale: 7 / maxDim, offset: center };
  }, [scene]);

  useFrame((state, delta) => {
    const p = disp.current ?? 0;
    const t = state.clock.elapsedTime;
    for (const m of mats.current) {
      const sh = m.userData.shader;
      if (sh) sh.uniforms.uTime.value = t;
    }
    if (outer.current) {
      // SPIRAL DOWNWARD: the dragon swings around a vertical axis while
      // descending as the user scrolls — a helix path, FRONT-BIASED in depth so
      // it never hides behind the origin. Phased so it's front-and-centre at the
      // hero (≈16% scroll), then spirals out and down as you go deeper.
      const TURNS = 2.4;
      const ang = (p - 0.16) * Math.PI * 2 * TURNS; // scroll-driven spiral
      const R = 2.6 - p * 0.8; // the spiral tightens as it sinks
      outer.current.position.x = Math.sin(ang) * R;
      outer.current.position.z = 1.4 + Math.cos(ang) * 1.4; // 0 → 2.8, always in front
      outer.current.position.y = 1.1 - p * 8.5 + Math.sin(t * 0.8) * 0.2;
      // Bank into the turn (face along the spiral) + look down as you scroll.
      outer.current.rotation.y = -ang + Math.PI / 2;
      outer.current.rotation.x = -0.05 + p * 0.5 + Math.sin(t * 0.6) * 0.04;
      outer.current.rotation.z = Math.sin(t * 0.4) * 0.06;
    }
    void delta;
  });

  return (
    <group ref={outer}>
      <group scale={fitScale} position={[-offset.x * fitScale, -offset.y * fitScale, -offset.z * fitScale]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}
useGLTF.preload(MODEL_URL);

/** Background worlds: scene colour, fog and a drifting particle field. */
function Worlds({ disp }: { disp: React.RefObject<number> }) {
  const pts = useRef<THREE.Points>(null);
  const { scene } = useThree();

  const COUNT = 1700;
  const particleGeo = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 2.5 + Math.random() * 10;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 32;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [COUNT]);

  useMemo(() => {
    // Far fog so the forest recedes into the misty distance / horizon.
    scene.fog = new THREE.Fog("#05060d", 16, 90);
  }, [scene]);

  const bgC = useMemo(() => new THREE.Color(), []);
  const glowC = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const p = disp.current ?? 0;
    lerpPalette(BG, p, bgC);
    lerpPalette(GLOW, p, glowC);
    scene.background = bgC;
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(bgC);
    if (pts.current) {
      pts.current.rotation.y -= delta * 0.04;
      // Spirit motes drift gently upward, wrapping around — floaty, alive.
      const arr = (pts.current.geometry.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        arr[i] += delta * 0.35;
        if (arr[i] > 16) arr[i] = -16;
      }
      (pts.current.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
      (pts.current.material as THREE.PointsMaterial).color.copy(glowC);
    }

    // Camera: dolly in slightly with scroll + cursor parallax → "dynamic" feel.
    const camZ = 12 - p * 2.5;
    state.camera.position.x += (state.pointer.x * 1.2 - state.camera.position.x) * 0.04;
    state.camera.position.y += (state.pointer.y * 0.8 - state.camera.position.y) * 0.04;
    state.camera.position.z += (camZ - state.camera.position.z) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <points ref={pts} geometry={particleGeo}>
      <pointsMaterial
        size={0.09}
        transparent
        opacity={0.75}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * A receding forest: a dark ground plane and a field of silhouette pine trees
 * scattered into the distance on both sides, fading into fog toward the horizon.
 * Keeps a clear corridor down the centre so the dragon stays unobstructed.
 */
function Forest() {
  const { trees, ground } = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    const COUNT = 95;
    const base = -5.5;
    for (let i = 0; i < COUNT; i++) {
      const side = Math.random() < 0.5 ? -1 : 1;
      const x = side * (7 + Math.random() * 44); // clear centre corridor
      const z = -10 - Math.random() * 60; // behind the dragon, receding
      const h = 5 + Math.random() * 11;
      for (let k = 0; k < 3; k++) {
        const cr = Math.max(0.25, (1.8 - k * 0.5) * (0.7 + Math.random() * 0.3));
        const cone = new THREE.ConeGeometry(cr, h * 0.5, 6);
        cone.translate(x, base + h * 0.28 + k * h * 0.24, z);
        geos.push(cone);
      }
      const trunk = new THREE.CylinderGeometry(0.16, 0.28, h * 0.36, 5);
      trunk.translate(x, base + h * 0.18, z);
      geos.push(trunk);
    }
    const trees = mergeGeometries(geos, false) ?? new THREE.BufferGeometry();
    geos.forEach((g) => g.dispose());
    const ground = new THREE.PlaneGeometry(300, 220, 1, 1);
    return { trees, ground };
  }, []);

  return (
    <group>
      <mesh geometry={ground} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.5, -26]}>
        <meshStandardMaterial color="#04150d" roughness={1} metalness={0} />
      </mesh>
      <mesh geometry={trees}>
        <meshStandardMaterial color="#072017" emissive="#04160e" emissiveIntensity={0.5} roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

export default function SnakeCanvas({ scroll }: { scroll: React.RefObject<number> }) {
  // Smooth (damped) scroll so the motion feels fluid, not jumpy.
  const disp = useRef(0);
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 12], fov: 50 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      onCreated={({ invalidate }) => invalidate()}
    >
      <Damper scroll={scroll} disp={disp} />
      <ambientLight intensity={0.7} />
      <hemisphereLight intensity={0.5} groundColor="#0a1020" color="#bfe9ff" />
      <directionalLight position={[5, 8, 6]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-7, -4, 5]} intensity={50} distance={50} color="#1ECECE" />
      <pointLight position={[6, 6, 6]} intensity={40} distance={45} color="#7fe3ec" />
      <Forest />
      <Worlds disp={disp} />
      <Suspense fallback={null}>
        <DragonModel disp={disp} />
      </Suspense>
    </Canvas>
  );
}

/** Eases the raw scroll value toward the target each frame. */
function Damper({ scroll, disp }: { scroll: React.RefObject<number>; disp: React.RefObject<number> }) {
  useFrame((_, delta) => {
    const target = scroll.current ?? 0;
    disp.current += (target - disp.current) * Math.min(1, delta * 3.5);
  });
  return null;
}
