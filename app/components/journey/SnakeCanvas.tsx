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
 * Ximo's emblem — the QUETZALCÓATL (Aztec feathered serpent) — rendered in 3D.
 * The serpent's glowing crystal BODY is a vertical spiral (helix) and its
 * feathered HEAD (built to match the logo: swept-back plume crest, angular
 * open-jaw snout with teeth, prominent eye, teal colour, shown in profile)
 * leads the descent: as the user scrolls DOWN the head looks down and travels
 * down. Background, glow, fog and a drifting particle field lerp across five
 * "worlds" so each scene change reads clearly. Fully procedural — no asset.
 */

// World palettes (scroll 0 → 1). High contrast so scene changes read clearly.
const BG = ["#05060d", "#241016", "#04222b", "#241a05", "#0B2A4A"].map((c) => new THREE.Color(c));
const GLOW = ["#3b82f6", "#a855f7", "#1ECECE", "#f5b820", "#7fe0ff"].map((c) => new THREE.Color(c));

// Logo teal — the head keeps this identity colour across every world.
const TEAL_DEEP = new THREE.Color("#1c5666");
const TEAL_MID = new THREE.Color("#2f8da0");
const TEAL_LITE = new THREE.Color("#7fe3ec");

function lerpPalette(palette: THREE.Color[], p: number, out: THREE.Color) {
  const n = palette.length - 1;
  const x = Math.min(n, Math.max(0, p * n));
  const i = Math.floor(x);
  out.copy(palette[i]).lerp(palette[Math.min(n, i + 1)], x - i);
  return out;
}

/** Shared crystal-teal material props for the feathered head. */
const tealCrystal = {
  roughness: 0.06,
  metalness: 0,
  clearcoat: 1,
  clearcoatRoughness: 0.04,
  transparent: true,
  opacity: 0.97,
  ior: 1.7,
} as const;

/**
 * The feathered-serpent head, built in PROFILE: snout points +X (screen-right,
 * like the logo), the plume crest fans up-and-back (−X / +Y), everything thin
 * in Z so it reads as a clean side silhouette. Parent controls look-down + drop.
 */
function QuetzalHead({ skull }: { skull: React.RefObject<THREE.Mesh | null> }) {
  // Plume crest — a fan of feather blades sweeping up and back over the head.
  const feathers = useMemo(() => {
    const COUNT = 9;
    const out: { pos: [number, number, number]; rotZ: number; len: number; color: string }[] = [];
    for (let i = 0; i < COUNT; i++) {
      const f = i / (COUNT - 1); // 0 = front of crest, 1 = back of neck
      const ang = Math.PI * 0.42 + f * Math.PI * 0.7; // ~76° → ~202°
      const pivotX = -0.35;
      const pivotY = 0.28;
      const baseR = 0.5;
      const len = 1.5 - Math.abs(f - 0.45) * 1.1; // longest near the crown
      const cx = pivotX + Math.cos(ang) * baseR;
      const cy = pivotY + Math.sin(ang) * baseR;
      const col = TEAL_DEEP.clone().lerp(TEAL_LITE, 0.2 + f * 0.7);
      out.push({ pos: [cx + (Math.cos(ang) * len) / 2, cy + (Math.sin(ang) * len) / 2, 0], rotZ: ang - Math.PI / 2, len, color: `#${col.getHexString()}` });
    }
    return out;
  }, []);

  // Teeth along the open jaw.
  const teeth = useMemo(() => [0.62, 0.78, 0.94].map((x, i) => ({ x, i })), []);

  return (
    <group>
      {/* Cranium + upper snout — angular crystal skull, snout toward +X. */}
      <mesh ref={skull} position={[0.12, 0.05, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[0.52, 1.0, 0.36]}>
        <coneGeometry args={[0.6, 1.45, 4]} />
        <meshPhysicalMaterial {...tealCrystal} color={`#${TEAL_MID.getHexString()}`} emissive={TEAL_MID} emissiveIntensity={1.0} />
      </mesh>
      {/* Back of the head / jaw hinge. */}
      <mesh position={[-0.42, 0.04, 0]} scale={[0.5, 0.62, 0.4]}>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshPhysicalMaterial {...tealCrystal} color={`#${TEAL_DEEP.getHexString()}`} emissive={TEAL_DEEP} emissiveIntensity={0.8} />
      </mesh>
      {/* Lower jaw — dropped + forward so the mouth reads as open. */}
      <mesh position={[0.34, -0.4, 0]} rotation={[0, 0, -Math.PI / 2 - 0.22]} scale={[0.34, 0.85, 0.32]}>
        <coneGeometry args={[0.5, 1.1, 4]} />
        <meshPhysicalMaterial {...tealCrystal} color={`#${TEAL_DEEP.getHexString()}`} emissive={TEAL_DEEP} emissiveIntensity={0.8} />
      </mesh>
      {/* Teeth. */}
      {teeth.map(({ x, i }) => (
        <mesh key={`ut${i}`} position={[x, -0.16, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.05, 0.2, 6]} />
          <meshStandardMaterial color="#eafcff" emissive="#bfeff5" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* Eye — small bright glowing disc with a dark pupil, like the emblem. */}
      <mesh position={[-0.04, 0.18, 0.22]}>
        <sphereGeometry args={[0.1, 18, 18]} />
        <meshStandardMaterial color="#fff7df" emissive="#ffd76a" emissiveIntensity={5} toneMapped={false} />
      </mesh>
      <mesh position={[-0.01, 0.17, 0.31]}>
        <sphereGeometry args={[0.045, 14, 14]} />
        <meshStandardMaterial color="#0a1417" emissive="#0a1417" />
      </mesh>
      {/* Feathered plume crest. */}
      {feathers.map((ft, i) => (
        <mesh key={`f${i}`} position={ft.pos} rotation={[0, 0, ft.rotZ]} scale={[0.45, 1, 0.3]}>
          <coneGeometry args={[0.13, ft.len, 4]} />
          <meshPhysicalMaterial {...tealCrystal} color={ft.color} emissive={ft.color} emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* A second, smaller barb row under the jaw (serpent "beard"). */}
      {[0, 1, 2].map((i) => {
        const ang = Math.PI * 1.15 + i * 0.16;
        return (
          <mesh key={`b${i}`} position={[0.0 + Math.cos(ang) * 0.5, -0.5 + Math.sin(ang) * 0.5, 0]} rotation={[0, 0, ang - Math.PI / 2]} scale={[0.4, 1, 0.3]}>
            <coneGeometry args={[0.09, 0.55, 4]} />
            <meshPhysicalMaterial {...tealCrystal} color={`#${TEAL_MID.getHexString()}`} emissive={TEAL_MID} emissiveIntensity={0.4} />
          </mesh>
        );
      })}
      {/* Inner light so the head reads as lit crystal, not a dark blob. */}
      <pointLight position={[0.2, 0.1, 0.6]} intensity={5} distance={6} color="#9fe6f0" />
    </group>
  );
}

function Dragon({ disp }: { disp: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const headGroup = useRef<THREE.Group>(null);
  const skull = useRef<THREE.Mesh>(null);
  const key = useRef<THREE.PointLight>(null);
  const pts = useRef<THREE.Points>(null);
  const { scene } = useThree();

  // Helix = the serpent's body, tapering toward the tail.
  const tube = useMemo(() => {
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
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(v), 800, 0.26, 20, false);
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
  const skullC = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const p = disp.current ?? 0;
    const t = state.clock.elapsedTime;
    lerpPalette(BG, p, bgC);
    lerpPalette(GLOW, p, glowC);

    scene.background = bgC;
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(bgC);

    // BODY spiral: spins continuously + drifts down a little with scroll.
    if (group.current) {
      group.current.rotation.y = p * Math.PI * 6 + t * 0.22;
      group.current.position.y = -1.5 - p * 5;
    }
    if (core.current) {
      const m = core.current.material as THREE.MeshPhysicalMaterial;
      m.emissive.copy(glowC);
      m.color.copy(glowC).lerp(white, 0.3);
    }
    if (glow.current) (glow.current.material as THREE.MeshBasicMaterial).color.copy(glowC);
    if (key.current) key.current.color.copy(glowC);
    if (pts.current) {
      pts.current.rotation.y -= delta * 0.04;
      (pts.current.material as THREE.PointsMaterial).color.copy(glowC);
    }

    // HEAD: leads the descent. As the user scrolls DOWN (p→1) the head travels
    // down AND tips its snout down to look where it's heading. Kept in profile
    // (slight idle sway) so the feathered silhouette always reads like the logo.
    if (headGroup.current) {
      headGroup.current.position.y = 1.6 - p * 6.6 + Math.sin(t * 0.7) * 0.18;
      headGroup.current.position.x = -1.5 + Math.sin(t * 0.5) * 0.12;
      headGroup.current.position.z = 1.8;
      // rotation.z tips the +X snout: slightly up at top → well down as you scroll.
      headGroup.current.rotation.z = 0.14 - p * 0.95 + Math.sin(t * 0.8) * 0.03;
      headGroup.current.rotation.y = Math.sin(t * 0.45) * 0.18; // gentle life
    }
    // Keep the skull's emissive mostly teal, with a touch of the world glow.
    if (skull.current) {
      skullC.copy(TEAL_MID).lerp(glowC, 0.22);
      (skull.current.material as THREE.MeshPhysicalMaterial).emissive.copy(skullC);
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

      {/* Spinning crystal BODY of the serpent. */}
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
        {/* Additive glow shell. */}
        <mesh ref={glow} geometry={tube} scale={1.25}>
          <meshBasicMaterial transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <pointLight ref={key} position={[3, 4, 5]} intensity={90} distance={45} />
      </group>

      {/* Feathered HEAD — leads, looks down, descends with scroll. */}
      <group ref={headGroup} scale={1.45}>
        <QuetzalHead skull={skull} />
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
      <ambientLight intensity={0.45} />
      <pointLight position={[-7, -4, 5]} intensity={40} distance={45} color="#1ECECE" />
      <pointLight position={[6, 6, 6]} intensity={30} distance={40} color="#7fe3ec" />
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
