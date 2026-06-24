"use client";
/* eslint-disable react-hooks/immutability -- mutating three.js objects (scene,
   materials, transforms) inside useFrame is the intended react-three-fiber
   render-loop pattern, not a React state mutation. */
/* eslint-disable react-hooks/purity -- procedural geometry uses Math.random()
   once to scatter the particle field; it's built in a memo and never re-run. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * The crystal / blue-fire dragon from the Ximo logo as a vertical spiral
 * (helix) that SPINS and travels as the user scrolls up and down. Background,
 * glow, lighting, fog and a drifting particle field lerp across five "worlds"
 * (origin → dream) so each scene change is clearly visible. Procedural — no
 * external 3D asset. Tuned to stay light (capped DPR, simple materials).
 */

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

function Dragon({ disp }: { disp: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Mesh>(null);
  const key = useRef<THREE.PointLight>(null);
  const pts = useRef<THREE.Points>(null);
  const { scene } = useThree();

  // Helix = the dragon's body, tapering toward the tail. We also pull the
  // leading point + tangent off the curve so the HEAD can be planted there and
  // oriented along the direction of travel.
  const { tube, headPos, headQuat } = useMemo(() => {
    const v: THREE.Vector3[] = [];
    const turns = 6;
    const N = 480;
    const radius = 2.3;
    const height = 26;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const a = t * Math.PI * 2 * turns;
      const r = radius * (1 - 0.16 * t);
      v.push(new THREE.Vector3(Math.cos(a) * r, height * (0.5 - t), Math.sin(a) * r));
    }
    const curve = new THREE.CatmullRomCurve3(v);
    const t = new THREE.TubeGeometry(curve, 800, 0.26, 20, false);
    const p0 = curve.getPoint(0);
    const tan = curve.getTangent(0).normalize();
    // Model is built facing +Z; rotate so the snout points along the tangent.
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), tan);
    return {
      tube: t,
      headPos: p0.toArray() as [number, number, number],
      headQuat: q.toArray() as [number, number, number, number],
    };
  }, []);

  // Drifting particle field — makes worlds feel alive and motion obvious.
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
    scene.fog = new THREE.Fog("#05060d", 9, 38);
  }, [scene]);

  const bgC = useMemo(() => new THREE.Color(), []);
  const glowC = useMemo(() => new THREE.Color(), []);
  const white = useMemo(() => new THREE.Color("#ffffff"), []);

  useFrame((state, delta) => {
    const p = disp.current ?? 0;
    lerpPalette(BG, p, bgC);
    lerpPalette(GLOW, p, glowC);

    scene.background = bgC;
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(bgC);

    if (group.current) {
      // Spiral SPINS with scroll (up & down) + a clearly visible idle drift so
      // motion reads immediately, before the user even scrolls.
      group.current.rotation.y = p * Math.PI * 6 + state.clock.elapsedTime * 0.22;
      // The HEAD sits at the top of the helix (local y≈+13). Keep it riding in
      // the upper third of the frame (above the centred content cards) with a
      // gentle bob so it stays VISIBLE the whole way down, while it spins/orbits
      // and the body coils away beneath it.
      group.current.position.y = -11 + Math.sin(state.clock.elapsedTime * 0.6) * 0.5;
    }
    if (core.current) {
      const m = core.current.material as THREE.MeshPhysicalMaterial;
      m.emissive.copy(glowC);
      m.color.copy(glowC).lerp(white, 0.3);
    }
    if (head.current) {
      const m = head.current.material as THREE.MeshPhysicalMaterial;
      m.emissive.copy(glowC);
      m.color.copy(glowC).lerp(white, 0.4);
    }
    if (glow.current) (glow.current.material as THREE.MeshBasicMaterial).color.copy(glowC);
    if (key.current) key.current.color.copy(glowC);
    if (pts.current) {
      pts.current.rotation.y -= delta * 0.04;
      (pts.current.material as THREE.PointsMaterial).color.copy(glowC);
    }

    // Camera: dolly in slightly with scroll + cursor parallax → "dynamic" feel.
    const camZ = 10 - p * 2.5;
    state.camera.position.x += (state.pointer.x * 1.1 - state.camera.position.x) * 0.04;
    state.camera.position.y += (state.pointer.y * 0.7 - state.camera.position.y) * 0.04;
    state.camera.position.z += (camZ - state.camera.position.z) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group>
      <points ref={pts} geometry={particleGeo}>
        <pointsMaterial size={0.05} transparent opacity={0.6} depthWrite={false} sizeAttenuation />
      </points>
      <group ref={group}>
        <mesh ref={core} geometry={tube}>
          <meshPhysicalMaterial
            roughness={0.05}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.03}
            transparent
            opacity={0.94}
            emissiveIntensity={2.2}
            ior={1.7}
          />
        </mesh>
        {/* Additive "blue fire" glow shell */}
        <mesh ref={glow} geometry={tube} scale={1.25}>
          <meshBasicMaterial transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>

        {/* ── Crystal dragon HEAD, planted at the leading end of the spiral ── */}
        <group position={headPos} quaternion={headQuat} scale={1.35}>
          {/* Elongated crystal skull (snout points +Z, along the tangent). */}
          <mesh ref={head} scale={[0.62, 0.56, 1.05]}>
            <sphereGeometry args={[0.7, 32, 24]} />
            <meshPhysicalMaterial
              roughness={0.04}
              metalness={0}
              clearcoat={1}
              clearcoatRoughness={0.03}
              transparent
              opacity={0.96}
              emissiveIntensity={2.6}
              ior={1.7}
            />
          </mesh>
          {/* Brow / upper snout ridge for a more dragon-like silhouette. */}
          <mesh position={[0, 0.12, 0.34]} scale={[0.42, 0.3, 0.6]}>
            <sphereGeometry args={[0.5, 24, 18]} />
            <meshPhysicalMaterial roughness={0.05} clearcoat={1} transparent opacity={0.9} ior={1.6} />
          </mesh>
          {/* Glowing eyes. */}
          <mesh position={[0.27, 0.16, 0.42]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#fff6d8" emissive="#ffd76a" emissiveIntensity={6} toneMapped={false} />
          </mesh>
          <mesh position={[-0.27, 0.16, 0.42]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#fff6d8" emissive="#ffd76a" emissiveIntensity={6} toneMapped={false} />
          </mesh>
          {/* Two swept-back horns. */}
          <mesh position={[0.22, 0.42, -0.18]} rotation={[-0.9, 0, 0.25]}>
            <coneGeometry args={[0.09, 0.7, 12]} />
            <meshPhysicalMaterial roughness={0.1} clearcoat={1} transparent opacity={0.92} ior={1.6} />
          </mesh>
          <mesh position={[-0.22, 0.42, -0.18]} rotation={[-0.9, 0, -0.25]}>
            <coneGeometry args={[0.09, 0.7, 12]} />
            <meshPhysicalMaterial roughness={0.1} clearcoat={1} transparent opacity={0.92} ior={1.6} />
          </mesh>
          {/* Inner glow so the head reads as lit crystal, not a dark blob. */}
          <pointLight position={[0, 0.1, 0.5]} intensity={6} distance={6} color="#bfe9ff" />
        </group>

        <pointLight ref={key} position={[3, 4, 5]} intensity={90} distance={45} />
      </group>
    </group>
  );
}

export default function SnakeCanvas({ scroll }: { scroll: React.RefObject<number> }) {
  // Smooth (damped) scroll so the spiral motion feels fluid, not jumpy.
  const disp = useRef(0);
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 10], fov: 52 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      onCreated={({ invalidate }) => invalidate()}
    >
      <Damper scroll={scroll} disp={disp} />
      <ambientLight intensity={0.4} />
      <pointLight position={[-7, -4, 5]} intensity={40} distance={45} color="#1ECECE" />
      <Dragon disp={disp} />
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
