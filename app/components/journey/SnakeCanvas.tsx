"use client";
/* eslint-disable react-hooks/immutability -- mutating three.js objects (scene,
   materials, transforms) inside useFrame is the intended react-three-fiber
   render-loop pattern, not a React state mutation. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * The crystal / blue-fire snake from the Ximo logo, rendered as a procedural
 * helix that the camera descends through as the user scrolls. Background color,
 * snake glow, lighting and fog lerp across five "worlds" (origin → dream).
 *
 * Pure procedural geometry — no external 3D asset. Tuned to stay light:
 * capped DPR, simple materials, one tube + an additive glow shell.
 */

// World palettes (scroll 0 → 1). Background stays dark so the snake glows.
const BG = ["#080b16", "#15171e", "#06222a", "#1c1708", "#0B1F33"].map((c) => new THREE.Color(c));
const GLOW = ["#2563eb", "#3b82f6", "#1ECECE", "#C9A84C", "#8fd4ff"].map((c) => new THREE.Color(c));

function lerpPalette(palette: THREE.Color[], p: number, out: THREE.Color) {
  const n = palette.length - 1;
  const x = Math.min(n, Math.max(0, p * n));
  const i = Math.floor(x);
  const f = x - i;
  out.copy(palette[i]).lerp(palette[Math.min(n, i + 1)], f);
  return out;
}

function Snake({ scroll }: { scroll: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const key = useRef<THREE.PointLight>(null);
  const { scene } = useThree();

  // Helix curve = the snake's body, tapering as it descends.
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const turns = 5;
    const N = 420;
    const radius = 2.2;
    const height = 22;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const a = t * Math.PI * 2 * turns;
      const r = radius * (1 - 0.18 * t);
      pts.push(new THREE.Vector3(Math.cos(a) * r, height * (0.5 - t), Math.sin(a) * r));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 700, 0.24, 18, false);
  }, []);
  const glowGeo = useMemo(() => {
    const g = geo.clone();
    return g;
  }, [geo]);

  useMemo(() => {
    scene.fog = new THREE.Fog("#080b16", 8, 34);
  }, [scene]);

  const bgC = useMemo(() => new THREE.Color(), []);
  const glowC = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const p = scroll.current ?? 0;
    lerpPalette(BG, p, bgC);
    lerpPalette(GLOW, p, glowC);

    scene.background = bgC;
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(bgC);

    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      // Descend through the helix as the user scrolls.
      group.current.position.y = -6 + p * 12;
    }
    if (core.current) {
      const m = core.current.material as THREE.MeshPhysicalMaterial;
      m.emissive.copy(glowC);
      m.color.copy(glowC).lerp(new THREE.Color("#ffffff"), 0.25);
    }
    if (glow.current) {
      (glow.current.material as THREE.MeshBasicMaterial).color.copy(glowC);
    }
    if (key.current) key.current.color.copy(glowC);

    // Gentle parallax toward the cursor.
    state.camera.position.x += (state.pointer.x * 0.6 - state.camera.position.x) * 0.03;
    state.camera.position.y += (state.pointer.y * 0.4 - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      {/* Crystal core */}
      <mesh ref={core} geometry={geo}>
        <meshPhysicalMaterial
          roughness={0.06}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.04}
          transparent
          opacity={0.92}
          emissiveIntensity={1.5}
          ior={1.6}
        />
      </mesh>
      {/* Additive "blue fire" glow shell */}
      <mesh ref={glow} geometry={glowGeo} scale={1.18}>
        <meshBasicMaterial transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight ref={key} position={[3, 4, 5]} intensity={60} distance={40} />
    </group>
  );
}

export default function SnakeCanvas({ scroll }: { scroll: React.RefObject<number> }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 50 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[-6, -3, 4]} intensity={25} distance={40} color="#1ECECE" />
      <Snake scroll={scroll} />
    </Canvas>
  );
}
