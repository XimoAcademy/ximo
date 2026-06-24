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

/**
 * Ximo's dragon — a real GLB model (public/models/dragon.glb) flown through the
 * scroll "journey". The model has no rig/animation, so it MOVES as a rigid body:
 * a slow showcase turn + idle float, and as the user scrolls DOWN it descends
 * and tips its head down to look where it's heading. Background, fog and a
 * drifting particle field lerp across five "worlds" so each scene change reads.
 */

const MODEL_URL = "/models/dragon-opt.glb";

// World palettes (scroll 0 → 1). High contrast so scene changes read clearly.
const BG = ["#05060d", "#241016", "#04222b", "#241a05", "#0B2A4A"].map((c) => new THREE.Color(c));
const GLOW = ["#3b82f6", "#a855f7", "#1ECECE", "#f5b820", "#7fe0ff"].map((c) => new THREE.Color(c));

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

  // Centre the model on the origin and scale it to a consistent height, once.
  const { fitScale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return { fitScale: 7 / maxDim, offset: center };
  }, [scene]);

  useFrame((state, delta) => {
    const p = disp.current ?? 0;
    const t = state.clock.elapsedTime;
    if (outer.current) {
      // Slow showcase turn + extra spin tied to scroll → "dynamic".
      outer.current.rotation.y = t * 0.25 + p * Math.PI * 1.5;
      // Look DOWN as you scroll down.
      outer.current.rotation.x = -0.05 + p * 0.6 + Math.sin(t * 0.6) * 0.04;
      outer.current.rotation.z = Math.sin(t * 0.4) * 0.05;
      // Descend with scroll + idle float.
      outer.current.position.y = 1.2 - p * 6.5 + Math.sin(t * 0.8) * 0.25;
      outer.current.position.x = Math.sin(t * 0.5) * 0.2;
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

  const particleGeo = useMemo(() => {
    const COUNT = 1300;
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 3 + Math.random() * 9;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useMemo(() => {
    scene.fog = new THREE.Fog("#05060d", 10, 45);
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
      <pointsMaterial size={0.05} transparent opacity={0.6} depthWrite={false} sizeAttenuation />
    </points>
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
