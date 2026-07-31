"use client";
/* eslint-disable react-hooks/immutability -- mutating three.js objects (scene,
   materials, transforms) inside useFrame is the intended react-three-fiber
   render-loop pattern, not a React state mutation. */
/* eslint-disable react-hooks/purity -- procedural geometry uses Math.random()
   once to scatter the particle field; it's built in a memo and never re-run. */

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Ximo's dragon — the founder-provided "fantasy dragon" GLB (single dense mesh,
 * NO armature/skin/animation clips in the file itself). It is RIGGED AT LOAD
 * with a 24-bone serpent skeleton and flies a continuous head-led loop, the
 * same rig authored in the Claude Design project "Ximo Dragon Rigged".
 *
 * How the rig gets here without costing the visitor anything:
 *  - the skeleton is derived from the mesh by a voxel/geodesic pipeline
 *    (solid fill → distance field → centerline → 24 joints by arc length).
 *    Measured at ~1.4 s on desktop, so it is NOT run in the browser.
 *  - it is baked once, offline, into `/models/dragon-rig.bin` (~190 KB):
 *    the 24 joint positions, the body length, and ONE seed-joint byte per
 *    vertex. Skin weights are a pure function of those three, so the client
 *    reconstructs bit-identical skinIndex/skinWeight in ~40 ms.
 *  - see docs/dragon-rig.md for how to re-bake if the model ever changes.
 *
 * The motion is "follow-the-leader": the head samples a closed Catmull-Rom
 * flight path, every joint behind it sits at its exact rest distance from the
 * one ahead (so no segment can stretch or compress), and a travelling
 * serpentine offset runs down the body — head → neck → torso → tail.
 *
 * Respects prefers-reduced-motion (holds the bind pose; note the canvas itself
 * is also skipped entirely by JourneyBackground in that case) and pauses all
 * updates while the tab is hidden.
 */

// TODO(Manuel): para volver al dragón anterior, cambia esta ruta a
// "/models/dragon-opt.glb" — ambos viven en public/models/. OJO: el esqueleto
// (dragon-rig.bin) se horneó contra la malla de dragon2-opt.glb y se indexa por
// vértice, así que si cambias de modelo hay que volver a hornearlo — el código
// lanza un error claro si no coinciden. Ver docs/dragon-rig.md.
const MODEL_URL = "/models/dragon2-opt.glb";
const RIG_URL = "/models/dragon-rig.bin";

/** Joint index of the rig root (mid body); head chain runs up, tail chain down. */
const RIG_ROOT = 9;

/** Flight feel — the design project's defaults (amplitude / wavelength). */
const FLIGHT_AMP = 0.45;
const FLIGHT_WAV = 1.6;

/** How many world units the whole flight loop should span (bigger = bigger dragon). */
const FLIGHT_FIT = 10.5;

/**
 * ── Aura azul ────────────────────────────────────────────────────────────
 * Dos capas, ambas montadas sobre el MISMO esqueleto, así que respiran con el
 * cuerpo sin cálculo extra por frame:
 *  1. borde fresnel sobre la piel del dragón (energía sobre las escamas)
 *  2. un casco inflado a lo largo de las normales, additive y en BackSide —
 *     el cuerpo tapa su interior, así que solo se ve lo que sobresale de la
 *     silueta: el halo. Es el truco clásico de outline, sin post-procesado.
 * Una onda viajera recorre el cuerpo y el brillo sube hacia la cola, de modo
 * que la estela se lee como energía que va quedando atrás.
 */
const AURA_COLOR = new THREE.Color("#1e9bff");
const AURA_INFLATE = 0.01; // unidades de modelo, antes del FLIGHT_FIT
const AURA_GAIN = 0.5; // intensidad del halo exterior
const BODY_GLOW = 0.32; // intensidad del borde sobre la piel

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

type RigData = {
  jointCount: number;
  bodyLength: number;
  joints: THREE.Vector3[];
  seed: Uint8Array;
};

/** Parse `/models/dragon-rig.bin` — "XRIG" | v | verts | joints | L | pts | seeds. */
function parseRig(buf: ArrayBuffer): RigData {
  const dv = new DataView(buf);
  const magic = String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3));
  if (magic !== "XRIG") throw new Error(`dragon-rig.bin: bad magic "${magic}"`);
  const version = dv.getUint32(4, true);
  if (version !== 1) throw new Error(`dragon-rig.bin: unsupported version ${version}`);
  const verts = dv.getUint32(8, true);
  const jointCount = dv.getUint32(12, true);
  const bodyLength = dv.getFloat32(16, true);
  const HEAD = 20;
  const joints: THREE.Vector3[] = [];
  for (let j = 0; j < jointCount; j += 1) {
    joints.push(new THREE.Vector3(
      dv.getFloat32(HEAD + j * 12, true),
      dv.getFloat32(HEAD + j * 12 + 4, true),
      dv.getFloat32(HEAD + j * 12 + 8, true)
    ));
  }
  return { jointCount, bodyLength, joints, seed: new Uint8Array(buf, HEAD + jointCount * 12, verts) };
}

/**
 * Rebuild the skeleton + skin weights and bind them to a SkinnedMesh.
 *
 * Skin weights reproduce the offline bake exactly: for each vertex the baked
 * seed joint defines an 11-joint window, the 4 nearest of those get gaussian
 * weights (sigma = 1.5 segment lengths) and are normalised. Done with a manual
 * top-4 selection rather than sort+slice — same result, no per-vertex garbage.
 */
function buildRiggedDragon(scene: THREE.Group, rig: RigData) {
  scene.updateMatrixWorld(true);
  let src: THREE.Mesh | null = null;
  scene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh && !src) src = m;
  });
  if (!src) throw new Error("dragon GLB: no mesh found");
  const source = src as THREE.Mesh;

  const geo = source.geometry.clone();
  geo.applyMatrix4(source.matrixWorld); // bake node transform — the bake did the same
  const pos = geo.attributes.position as THREE.BufferAttribute;

  const { joints, jointCount: NJ, bodyLength: L, seed } = rig;

  // The seed array is indexed by vertex, so it is only valid for the exact mesh
  // it was baked against. Fail loudly rather than skinning to garbage.
  if (seed.length !== pos.count) {
    throw new Error(
      `dragon-rig.bin was baked for ${seed.length} vertices but ${MODEL_URL} has ${pos.count}. Re-bake the rig (see docs/dragon-rig.md).`
    );
  }

  // ── bones: root mid-body, one chain to the head, one to the tail ──
  const bones: THREE.Bone[] = [];
  const jointOfBone: number[] = [];
  const jointBone = new Array<THREE.Bone>(NJ);
  const mk = (name: string, j: number, parent: THREE.Bone | null) => {
    const b = new THREE.Bone();
    b.name = name;
    if (parent) b.position.copy(joints[j]).sub(joints[jointOfBone[bones.indexOf(parent)]]);
    else b.position.copy(joints[j]);
    parent?.add(b);
    bones.push(b);
    jointOfBone.push(j);
    jointBone[j] = b;
    return b;
  };
  const root = mk("root", RIG_ROOT, null);
  let prev = root;
  let n = 1;
  for (let j = RIG_ROOT + 1; j < NJ; j += 1) {
    const name = j === NJ - 1 ? "head" : j === NJ - 2 ? "neck" : `spine_${String(n++).padStart(2, "0")}`;
    prev = mk(name, j, prev);
  }
  prev = root;
  n = 1;
  for (let j = RIG_ROOT - 1; j >= 0; j -= 1) {
    prev = mk(j === 0 ? "tail_tip" : `tail_${String(n++).padStart(2, "0")}`, j, prev);
  }
  const boneIndexOfJoint = joints.map((_, j) => bones.indexOf(jointBone[j]));

  // ── skin weights from the baked seed joints ──
  const SIGMA = (L / (NJ - 1)) * 1.5;
  const si = new Uint16Array(pos.count * 4);
  const sw = new Float32Array(pos.count * 4);
  const bj = new Int32Array(4);
  const bd = new Float64Array(4);
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 1) {
    v.fromBufferAttribute(pos, i);
    const s = seed[i];
    const lo = Math.max(0, s - 5);
    const hi = Math.min(NJ - 1, s + 5);
    let filled = 0;
    for (let j = lo; j <= hi; j += 1) {
      const d = v.distanceTo(joints[j]);
      // insert into the running top-4-nearest
      let k = filled < 4 ? filled : 3;
      if (filled === 4 && d >= bd[3]) continue;
      while (k > 0 && bd[k - 1] > d) {
        bd[k] = bd[k - 1];
        bj[k] = bj[k - 1];
        k -= 1;
      }
      bd[k] = d;
      bj[k] = j;
      if (filled < 4) filled += 1;
    }
    let sum = 0;
    for (let k = 0; k < filled; k += 1) {
      bd[k] = Math.exp(-(bd[k] / SIGMA) * (bd[k] / SIGMA));
      sum += bd[k];
    }
    if (sum < 1e-8) {
      bd[0] = 1;
      sum = 1;
    }
    for (let k = 0; k < filled; k += 1) {
      si[i * 4 + k] = boneIndexOfJoint[bj[k]];
      sw[i * 4 + k] = bd[k] / sum;
    }
  }
  geo.setAttribute("skinIndex", new THREE.BufferAttribute(si, 4));
  geo.setAttribute("skinWeight", new THREE.BufferAttribute(sw, 4));

  // Longitudinal coordinate for the aura: the baked seed joint already IS a
  // position along the body (0 = tail_tip → 1 = head), so it costs nothing.
  const along = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i += 1) along[i] = seed[i] / (NJ - 1);
  geo.setAttribute("aLong", new THREE.BufferAttribute(along, 1));

  // Shared clock for both aura layers, ticked once per frame.
  const auraTime = { value: 0 };

  // ── layer 1: fresnel rim on the dragon's own skin ──
  // The GLTF material is cached by useGLTF and shared, so clone before
  // injecting — otherwise a remount would stack the patch onto the cache.
  const bodyMat = (Array.isArray(source.material) ? source.material[0] : source.material).clone() as THREE.MeshStandardMaterial;
  bodyMat.name = "ximo_dragon_skin";
  bodyMat.onBeforeCompile = (shader) => {
    shader.uniforms.uAuraTime = auraTime;
    shader.uniforms.uBodyGlow = { value: BODY_GLOW };
    shader.uniforms.uAuraColor = { value: AURA_COLOR };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float aLong;\nvarying float vLong;\nvarying float vRim;")
      // project_vertex defines mvPosition; defaultnormal_vertex (pulled in for
      // skinned meshes) defines transformedNormal. Both exist by here.
      .replace(
        "#include <project_vertex>",
        "#include <project_vertex>\nvLong = aLong;\nvRim = 1.0 - abs( dot( normalize( transformedNormal ), normalize( -mvPosition.xyz ) ) );"
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying float vLong;\nvarying float vRim;\nuniform float uAuraTime;\nuniform float uBodyGlow;\nuniform vec3 uAuraColor;"
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        {
          // High exponent → the glow stays on the grazing edges instead of
          // washing blue over the scales and killing the dragon's own colour.
          float rim = pow( clamp( vRim, 0.0, 1.0 ), 3.2 );
          float pulse = 0.65 + 0.35 * sin( vLong * 14.0 - uAuraTime * 3.2 );
          float tail = mix( 1.25, 0.55, smoothstep( 0.0, 0.9, vLong ) );
          totalEmissiveRadiance += uAuraColor * rim * pulse * tail * uBodyGlow;
        }`
      );
  };
  bodyMat.customProgramCacheKey = () => "ximo-dragon-skin-aura";
  bodyMat.needsUpdate = true;

  // ── layer 2: inflated additive shell → the halo around the body ──
  const auraMat = new THREE.MeshBasicMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  });
  auraMat.name = "ximo_dragon_aura";
  auraMat.onBeforeCompile = (shader) => {
    shader.uniforms.uAuraTime = auraTime;
    shader.uniforms.uAuraGain = { value: AURA_GAIN };
    shader.uniforms.uAuraColor = { value: AURA_COLOR };
    shader.uniforms.uInflate = { value: AURA_INFLATE };
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nattribute float aLong;\nvarying float vLong;\nvarying float vRim;\nuniform float uInflate;"
      )
      // Offset along the BIND normal before skinning, so the shell is carried
      // by the skeleton exactly like the body instead of drifting off it.
      .replace("#include <begin_vertex>", "vec3 transformed = position + normal * uInflate;")
      .replace(
        "#include <project_vertex>",
        "#include <project_vertex>\nvLong = aLong;\nvRim = 1.0 - abs( dot( normalize( transformedNormal ), normalize( -mvPosition.xyz ) ) );"
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying float vLong;\nvarying float vRim;\nuniform float uAuraTime;\nuniform float uAuraGain;\nuniform vec3 uAuraColor;"
      )
      .replace(
        "#include <opaque_fragment>",
        // The body is a spiky, non-convex mesh, so the inflated hull pokes
        // through the gaps between fins. A high exponent collapses the halo
        // onto the silhouette, where rim → 1, and hides that show-through.
        `float rim = pow( clamp( vRim, 0.0, 1.0 ), 3.0 );
        float pulse = 0.70 + 0.30 * sin( vLong * 14.0 - uAuraTime * 3.2 );
        float tail = mix( 1.35, 0.45, smoothstep( 0.0, 0.9, vLong ) );
        float a = rim * pulse * tail * uAuraGain;
        gl_FragColor = vec4( uAuraColor * a, a );`
      );
  };
  auraMat.customProgramCacheKey = () => "ximo-dragon-halo";
  auraMat.needsUpdate = true;

  const skeleton = new THREE.Skeleton(bones);

  const mesh = new THREE.SkinnedMesh(geo, bodyMat);
  mesh.name = "ximo_dragon";
  mesh.frustumCulled = false; // the flight path leaves the bind-pose bounds

  // Same geometry and same skeleton — the halo deforms with the body for free.
  const aura = new THREE.SkinnedMesh(geo, auraMat);
  aura.name = "ximo_dragon_aura";
  aura.frustumCulled = false;
  aura.renderOrder = 2;

  const rigGroup = new THREE.Group();
  rigGroup.name = "ximo_dragon_rig";
  rigGroup.add(mesh);
  rigGroup.add(aura);
  rigGroup.add(root);
  root.updateMatrixWorld(true);
  mesh.bind(skeleton);
  aura.bind(skeleton);
  mesh.updateMatrixWorld(true);
  aura.updateMatrixWorld(true);

  return { rigGroup, mesh, aura, auraTime, bones, jointOfBone, joints, NJ, L };
}

/**
 * Follow-the-leader flight solver. The head walks a closed Catmull-Rom loop;
 * each joint behind it is pinned at its exact rest distance from the one ahead,
 * so the body can never stretch or bunch. Returns an `update(t)` to call per
 * frame. Ported from the design project's rigged page.
 */
function makeFlight(rigged: ReturnType<typeof buildRiggedDragon>) {
  const { bones, jointOfBone, joints, NJ } = rigged;

  const bIdx = new Map(bones.map((b, i) => [b, i]));
  const parentIdx = bones.map((b) => (b.parent && bIdx.has(b.parent as THREE.Bone) ? bIdx.get(b.parent as THREE.Bone)! : -1));
  const jOf = jointOfBone;
  const childJ = jOf.map((j) => (j === RIG_ROOT ? RIG_ROOT + 1 : j > RIG_ROOT ? (j < NJ - 1 ? j + 1 : -1) : j > 0 ? j - 1 : -1));
  const restDir = bones.map((_, i) =>
    childJ[i] >= 0
      ? joints[childJ[i]].clone().sub(joints[jOf[i]]).normalize()
      : joints[jOf[i]].clone().sub(joints[jOf[parentIdx[i]]]).normalize()
  );

  const cum = new Array<number>(NJ);
  cum[NJ - 1] = 0;
  for (let j = NJ - 2; j >= 0; j -= 1) cum[j] = cum[j + 1] + joints[j + 1].distanceTo(joints[j]);
  const Lbody = cum[0];
  const segLen = joints.map((_, j) => (j < NJ - 1 ? cum[j] - cum[j + 1] : 0));

  // Closed flight loop, scaled so its arc length is 1.65 body lengths.
  const pathPts: THREE.Vector3[] = [];
  for (let k = 0; k < 16; k += 1) {
    const th = (k / 16) * Math.PI * 2;
    pathPts.push(new THREE.Vector3(Math.cos(th), 0.16 * Math.sin(3 * th), 0.55 * Math.sin(2 * th)));
  }
  let curve = new THREE.CatmullRomCurve3(pathPts, true, "catmullrom", 0.5);
  const k0 = (Lbody * 1.65) / curve.getLength();
  curve = new THREE.CatmullRomCurve3(pathPts.map((p) => p.multiplyScalar(k0)), true, "catmullrom", 0.5);
  const pathLen = curve.getLength();

  // Bind frame of each bone: forward along its segment, dorsal up.
  const XAX = new THREE.Vector3(1, 0, 0);
  const qBind = bones.map((_, i) => {
    const f = restDir[i].clone();
    const sgn = jOf[i] >= RIG_ROOT ? 1 : -1;
    const u = new THREE.Vector3().crossVectors(XAX, f).normalize().multiplyScalar(sgn);
    const r = new THREE.Vector3().crossVectors(u, f).normalize();
    return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(r, u, f)).invert();
  });

  const T = joints.map(() => new THREE.Vector3());
  const P = joints.map(() => new THREE.Vector3());
  const Wq = bones.map(() => new THREE.Quaternion());
  const Uw = bones.map(() => new THREE.Vector3(0, 1, 0));
  const UP = new THREE.Vector3(0, 1, 0);
  const n1 = new THREE.Vector3();
  const n2 = new THREE.Vector3();
  const tan = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const tmp2 = new THREE.Vector3();
  const F = new THREE.Vector3();
  const U = new THREE.Vector3();
  const Rv = new THREE.Vector3();
  const mT = new THREE.Matrix4();
  const qT = new THREE.Quaternion();
  const invQ = new THREE.Quaternion();
  const qL = new THREE.Quaternion();

  // Extent of the animated loop (path + serpentine offset + body thickness),
  // so the caller can scale the whole flight to a predictable size.
  const bbox = new THREE.Box3();
  for (let k = 0; k <= 200; k += 1) bbox.expandByPoint(curve.getPointAt(k / 200, tmp));
  bbox.expandByScalar(FLIGHT_AMP * 0.11 + 0.1);
  const size = bbox.getSize(new THREE.Vector3());
  const fitScale = FLIGHT_FIT / (Math.max(size.x, size.y, size.z) || 1);

  const update = (t: number) => {
    const sHead = t * 0.16;
    // 1 — sample the flight path, head first, plus a travelling serpentine offset
    for (let j = NJ - 1; j >= 0; j -= 1) {
      let u = sHead - cum[j] / pathLen;
      u -= Math.floor(u);
      curve.getPointAt(u, P[j]);
      curve.getTangentAt(u, tan);
      n1.copy(tan).cross(UP);
      if (n1.lengthSq() < 1e-6) n1.set(1, 0, 0);
      n1.normalize();
      n2.copy(tan).cross(n1).normalize();
      const f = cum[j] / Lbody;
      const ph = f * Math.PI * 2 * (2 / FLIGHT_WAV) - t * 2;
      const a = FLIGHT_AMP * 0.11 * (0.25 + 0.75 * f);
      P[j].addScaledVector(n1, Math.sin(ph) * a).addScaledVector(n2, Math.cos(ph) * a * 0.5);
    }
    // 2 — follow-the-leader: exact rest distance behind the joint ahead
    T[NJ - 1].copy(P[NJ - 1]);
    for (let j = NJ - 2; j >= 0; j -= 1) {
      tmp.copy(P[j]).sub(T[j + 1]);
      const len = tmp.length() || 1;
      T[j].copy(T[j + 1]).addScaledVector(tmp, segLen[j] / len);
    }
    // 3 — drive the bones straight onto those joint positions
    for (let i = 0; i < bones.length; i += 1) {
      const p = parentIdx[i];
      const b = bones[i];
      const j = jOf[i];
      const c = childJ[i];
      if (c < 0) F.copy(T[j]).sub(T[jOf[p]]).normalize();
      else F.copy(T[c]).sub(T[j]).normalize();
      const ref = p < 0 ? UP : Uw[p];
      U.copy(ref).addScaledVector(F, -ref.dot(F));
      if (U.lengthSq() < 1e-8) U.copy(UP).addScaledVector(F, -UP.dot(F));
      if (U.lengthSq() < 1e-8) U.set(0, 0, 1).addScaledVector(F, -F.z);
      U.normalize();
      // Ease the transported up back toward world up by a CAPPED angle — a raw
      // lerp collapses to zero length when the two are near-antiparallel, which
      // flipped the basis 180° for a single frame.
      tmp2.copy(UP).addScaledVector(F, -UP.dot(F));
      if (tmp2.lengthSq() > 1e-6) {
        tmp2.normalize();
        const d = Math.max(-1, Math.min(1, U.dot(tmp2)));
        if (d > 0.05) {
          const ang = Math.acos(d);
          if (ang > 1e-4) U.lerp(tmp2, Math.min(1, 0.1 / ang));
          if (U.lengthSq() > 1e-8) U.normalize();
          else U.copy(tmp2);
        }
      }
      Rv.crossVectors(U, F);
      if (Rv.lengthSq() < 1e-8) Rv.set(1, 0, 0).addScaledVector(F, -F.x);
      Rv.normalize();
      U.crossVectors(F, Rv).normalize();
      qT.setFromRotationMatrix(mT.makeBasis(Rv, U, F));
      Wq[i].copy(qT).multiply(qBind[i]);
      Uw[i].copy(U);
      if (p < 0) {
        b.position.copy(T[j]);
        b.quaternion.copy(Wq[i]);
      } else {
        invQ.copy(Wq[p]).invert();
        b.position.copy(T[j]).sub(T[jOf[p]]).applyQuaternion(invQ);
        b.quaternion.copy(qL.copy(invQ).multiply(Wq[i]));
      }
    }
  };

  return { update, fitScale };
}

// ── One-time cinematic entrance ─────────────────────────────────────────────
// The dragon is HIDDEN during the initial hero view. When the visitor scrolls
// past "↓ Entra al viaje ↓" (latched `entered` ref from JourneyBackground),
// a TIME-based timeline plays exactly once: the dragon starts deep in the
// background, small and below-left, swims a soft S-curve toward the camera
// (head leading, body wave slightly amplified) and settles into the transform
// the scroll-driven journey dictates. Scrolling up never reverses it.
const ENTRANCE_SECS = 4.6;
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/** Loads the dragon GLB + baked rig, binds the skeleton, and drives its motion. */
function DragonModel({ disp, entered }: { disp: React.RefObject<number>; entered: React.RefObject<boolean> }) {
  const { scene } = useGLTF(MODEL_URL);
  const rigBuffer = useLoader(THREE.FileLoader, RIG_URL, (loader) => {
    (loader as THREE.FileLoader).setResponseType("arraybuffer");
  }) as unknown as ArrayBuffer;
  const outer = useRef<THREE.Group>(null);
  // Latched entrance state — never resets during the page visit.
  const ent = useRef({ firstFrame: true, started: false, t0: 0, done: false });
  // JourneyBackground already skips the whole canvas on reduced motion; this is
  // belt-and-braces in case the component is ever mounted directly.
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const { rigGroup, fitScale, flight, auraTime } = useMemo(() => {
    const rig = parseRig(rigBuffer);
    const rigged = buildRiggedDragon(scene as THREE.Group, rig);
    const f = makeFlight(rigged);
    // Settle on frame 0 so the very first render already shows the flight pose
    // rather than the coiled bind pose.
    f.update(0);
    // The halo shell doubles the skinned triangles (325k → 650k). Same policy
    // as the dpr cap and the mote count above: phones skip it. The fresnel rim
    // on the skin stays — it rides the body's own draw call, so it's free.
    rigged.aura.visible = typeof window === "undefined" || window.innerWidth >= 768;
    return { rigGroup: rigged.rigGroup, fitScale: f.fitScale, flight: f, auraTime: rigged.auraTime };
  }, [scene, rigBuffer]);

  useFrame((state) => {
    // NOTE: no manual document.hidden guard — r3f's frameloop runs on
    // requestAnimationFrame, which the browser already suspends for hidden
    // tabs/occluded windows, so rendering pauses natively. (A manual guard
    // here also freezes forced composites, e.g. screenshots/preview tools.)
    const p = disp.current ?? 0;
    const t = state.clock.elapsedTime;

    // ── Entrance state machine (one-way: hidden → entering → settled) ──
    const e0 = ent.current;
    if (!e0.started && entered.current) {
      e0.started = true;
      e0.t0 = t;
      // Restored scroll (page loads already past the trigger) or reduced
      // motion: skip the show, present the final state immediately.
      if (e0.firstFrame || reducedMotion) e0.done = true;
    }
    e0.firstFrame = false;
    let e = 1; // eased entrance progress (1 = settled in final transform)
    if (!e0.done && e0.started) {
      const lin = Math.min(1, (t - e0.t0) / ENTRANCE_SECS);
      if (lin >= 1) e0.done = true;
      e = easeInOutCubic(lin);
    }
    const k = e0.started ? 1 - e : 1; // remaining entrance amount

    // Skeletal flight: the head leads the loop and the body follows it. Runs a
    // touch faster while travelling in, so the creature reads as "arriving".
    if (!reducedMotion) {
      flight.update(t * (1 + 0.35 * k));
      auraTime.value = t; // travelling pulse down the aura
    }

    if (outer.current) {
      // Hidden until the visitor passes "Entra al viaje" — also guarantees the
      // dragon never flashes at its final spot before the entrance begins.
      outer.current.visible = e0.started;
      if (!e0.started) return;
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

      // ── Entrance offsets: fade out with k so the path CONVERGES onto the
      // base transform above (the camera sits at +Z looking at the origin, so
      // "deep in the background" = far negative Z). Starts ~30% scale, below
      // and to the left, and weaves a 3D S-curve with restrained yaw/pitch/
      // roll that relaxes as it approaches — head first, wave amplified above.
      if (k > 0) {
        outer.current.position.z += -16 * k * k;
        outer.current.position.x += -1.6 * k + Math.sin(e * Math.PI * 3) * 2.1 * k;
        outer.current.position.y += -2.4 * k + Math.sin(e * Math.PI * 2 + 0.6) * 0.9 * k;
        outer.current.rotation.y += Math.sin(e * Math.PI * 2.4) * 0.45 * k;
        outer.current.rotation.x += 0.22 * k + Math.sin(e * Math.PI * 2) * 0.1 * k;
        outer.current.rotation.z += Math.sin(e * Math.PI * 3.1) * 0.28 * k;
      }
      const s = 0.3 + 0.7 * e;
      outer.current.scale.setScalar(s);
    }
  });

  return (
    // visible={false} until the entrance triggers (useFrame flips it) — the
    // GLB is still preloaded and compiled while the hero is on screen.
    <group ref={outer} visible={false}>
      {/* The flight loop is already centred on the rig's origin, so the only
          normalisation needed is a uniform fit to FLIGHT_FIT world units. */}
      <group scale={fitScale}>
        <primitive object={rigGroup} />
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

export default function SnakeCanvas({
  scroll,
  entered,
}: {
  scroll: React.RefObject<number>;
  entered: React.RefObject<boolean>;
}) {
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
        <DragonModel disp={disp} entered={entered} />
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
