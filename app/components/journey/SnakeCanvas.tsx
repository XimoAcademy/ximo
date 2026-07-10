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

type WaveShader = { uniforms: { uTime: { value: number }; uStrength: { value: number }; uScroll: { value: number } } };
type WaveMaterial = THREE.Material & { userData: { shader?: WaveShader } };

/**
 * Ximo's dragon — the founder-provided "fantasy dragon" GLB (single dense mesh,
 * NO armature/skin/animation clips, so THREE.AnimationMixer cannot animate it).
 * It swims like an Eastern serpent dragon via PROCEDURAL vertex-shader
 * deformation (spec: prompt_para_claude_dragon.md, "web-only fallback"):
 *
 *  - per-vertex longitudinal coordinate (0 = tail at -Y, 1 = head at +Y)
 *  - travelling waves whose phase is delayed toward the tail, so motion clearly
 *    runs head → neck → torso → tail (overlapping action / follow-through)
 *  - amplitude low at the head (face stays recognizable), strongest through the
 *    middle body and tail (long smooth S-curves)
 *  - subtle longitudinal roll/banking so the body doesn't read as a flat ribbon
 *  - the root additionally drifts along a slow looping path on top of the
 *    scroll-driven descent through the journey's "worlds"
 *
 * Respects prefers-reduced-motion (wave strength 0 → calm drift; note the
 * canvas itself is also skipped entirely by JourneyBackground in that case)
 * and pauses all updates while the tab is hidden.
 */

// TODO(Manuel): para volver al dragón anterior, cambia esta ruta a
// "/models/dragon-opt.glb" — ambos viven en public/models/.
const MODEL_URL = "/models/dragon2-opt.glb";

/**
 * ── Dragon motion version ────────────────────────────────────────────────
 * "v3": cinematic eastern-dragon swim (head-led travelling wave, tail
 *       follow-through, banking roll, looping drift). Current.
 * "v1": original subtle wave (pre jul-2026). Kept for instant revert.
 * (v2 lives in git history — commit 1e199aa — if ever needed.)
 */
const DRAGON_MOTION: "v3" | "v1" = "v3";

// Visual elongation of the body along its length axis (reads more serpentine).
const STRETCH_Y = 1.16;

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

// GLSL injected into <common>: the eastern-dragon swim. `t` is the longitudinal
// coordinate (0 = tail, 1 = head). Phase is delayed toward the tail (lag), so a
// crest born at the head visibly travels down the body — overlapping action.
const DRAGON_WAVE_V3 = /* glsl */ `
  attribute float aLongitudinal;
  uniform float uTime;
  uniform float uStrength;
  uniform float uScroll;

  vec3 dragonWave(vec3 p, float t) {
    float lag = 1.0 - t;
    float phaseA = uTime * 1.05 - lag * 7.2;
    float phaseB = uTime * 0.72 - lag * 4.7 + 1.25;

    // Head controlled and recognizable; middle/tail carry the follow-through.
    float tailGain = mix(1.22, 0.30, smoothstep(0.30, 1.0, t));
    float middleGain = 0.45 + 0.55 * sin(t * 3.14159265);
    float amp = tailGain * middleGain * uStrength;

    float side = sin(phaseA) * 0.115 * amp;
    side += sin(phaseA * 0.53 + 1.9) * 0.038 * amp;

    float depth = cos(phaseB) * 0.082 * amp;
    depth += sin(phaseA * 1.42 - 0.8) * 0.020 * amp;

    float lift = sin(uTime * 0.48 + t * 4.2) * 0.023 * uStrength;
    lift += (uScroll - 0.5) * 0.06;

    p.x += side;
    p.z += depth;
    p.y += lift;

    // Slight longitudinal roll/banking so the body never reads as a flat ribbon.
    float roll = sin(phaseA - 0.55) * 0.13 * amp;
    float c = cos(roll);
    float s = sin(roll);
    p.xz = mat2(c, -s, s, c) * p.xz;
    return p;
  }
`;

// v1 legacy: single gentle sine, linear tail weight (kept for instant revert).
const DRAGON_WAVE_V1 = /* glsl */ `
  attribute float aLongitudinal;
  uniform float uTime;
  uniform float uStrength;
  uniform float uScroll;

  vec3 dragonWave(vec3 p, float t) {
    float ph2 = t * 6.5 + uTime * 2.0;
    float aw = (1.25 - t) * uStrength;
    p.x += sin(ph2) * 0.08 * aw;
    p.z += cos(ph2) * 0.04 * aw;
    return p;
  }
`;

/** Loads the dragon GLB, normalises its size/centre, and drives its motion. */
function DragonModel({ disp }: { disp: React.RefObject<number> }) {
  const { scene } = useGLTF(MODEL_URL);
  const outer = useRef<THREE.Group>(null);
  // JourneyBackground already skips the whole canvas on reduced motion; this is
  // belt-and-braces in case the component is ever mounted directly.
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const { fitScale, offset, mats } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const minY = box.min.y;
    const height = size.y || 1;

    const list: WaveMaterial[] = [];
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;

      // Per-vertex longitudinal coordinate: 0 at the tail (-Y) → 1 at the head (+Y).
      const pos = mesh.geometry.attributes.position as THREE.BufferAttribute;
      const longitudinal = new Float32Array(pos.count);
      for (let i = 0; i < pos.count; i += 1) {
        longitudinal[i] = THREE.MathUtils.clamp((pos.getY(i) - minY) / height, 0, 1);
      }
      mesh.geometry.setAttribute("aLongitudinal", new THREE.BufferAttribute(longitudinal, 1));
      // Shader displacement can leave the original bounds — never cull the dragon.
      mesh.frustumCulled = false;

      const arr = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      arr.forEach((m) => {
        m.onBeforeCompile = (shader) => {
          shader.uniforms.uTime = { value: 0 };
          shader.uniforms.uStrength = { value: reducedMotion ? 0 : 1 };
          shader.uniforms.uScroll = { value: 0 };
          shader.vertexShader = shader.vertexShader
            .replace("#include <common>", "#include <common>\n" + (DRAGON_MOTION === "v3" ? DRAGON_WAVE_V3 : DRAGON_WAVE_V1))
            .replace("#include <begin_vertex>", "vec3 transformed = dragonWave(position, aLongitudinal);");
          (m as WaveMaterial).userData.shader = shader as unknown as WaveShader;
        };
        m.customProgramCacheKey = () => `ximo-dragon-wave-${DRAGON_MOTION}`;
        m.needsUpdate = true;
        list.push(m as WaveMaterial);
      });
    });
    return { fitScale: 7 / maxDim, offset: center, mats: list };
  }, [scene, reducedMotion]);

  useFrame((state) => {
    // Pause everything while the tab is hidden (browsers throttle RAF anyway;
    // this also freezes the clock-driven uniforms cheaply).
    if (typeof document !== "undefined" && document.hidden) return;

    const p = disp.current ?? 0;
    const t = state.clock.elapsedTime;
    for (const m of mats) {
      const sh = m.userData.shader;
      if (sh) {
        sh.uniforms.uTime.value = reducedMotion ? 0 : t;
        sh.uniforms.uScroll.value = p;
      }
    }

    if (outer.current) {
      // Base path: the journey's downward spiral (front-biased helix driven by
      // scroll). On top of it, a slow time-based looping drift + banking so the
      // whole creature keeps swimming even when the visitor stops scrolling.
      const TURNS = 2.4;
      const ang = (p - 0.16) * Math.PI * 2 * TURNS;
      const R = 2.6 - p * 0.8;
      const travel = t * 0.22;
      const drift = reducedMotion ? 0 : 1;

      outer.current.position.x = Math.sin(ang) * R + Math.sin(travel) * 0.5 * drift;
      outer.current.position.z = 1.4 + Math.cos(ang) * 1.4 + Math.cos(travel * 0.63) * 0.22 * drift;
      outer.current.position.y = 1.1 - p * 8.5 + Math.sin(travel * 0.71 + 0.9) * 0.24 * drift;

      // Face along the spiral, wander the heading slowly, look down as you
      // scroll, and bank into the turns (roll follows with its own phase).
      outer.current.rotation.y = -ang + Math.PI / 2 + Math.sin(travel * 0.58) * 0.13 * drift;
      outer.current.rotation.x = -0.05 + p * 0.5 + Math.sin(t * 0.6) * 0.04 * drift;
      outer.current.rotation.z = Math.cos(travel * 0.83) * 0.09 * drift;
    }
  });

  return (
    <group ref={outer}>
      <group
        scale={[fitScale, fitScale * STRETCH_Y, fitScale]}
        position={[-offset.x * fitScale, -offset.y * fitScale * STRETCH_Y, -offset.z * fitScale]}
      >
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

  // Fewer spirit motes on small screens — the mist should never cost the phone.
  const COUNT = typeof window !== "undefined" && window.innerWidth < 768 ? 700 : 1700;
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
  // Cap pixel ratio harder on phones — the dragon mesh is dense.
  const maxDpr = typeof window !== "undefined" && window.innerWidth < 768 ? 1.25 : 1.5;
  return (
    <Canvas
      dpr={[1, maxDpr]}
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
