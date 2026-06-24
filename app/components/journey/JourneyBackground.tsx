"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const SnakeCanvas = dynamic(() => import("./SnakeCanvas"), { ssr: false });

/** Enchanted-forest gradient shown before the canvas mounts / as no-3D fallback. */
const FALLBACK_BG =
  "radial-gradient(1100px 760px at 50% -5%, rgba(120,255,210,0.16), transparent 60%)," +
  "radial-gradient(800px 560px at 16% 92%, rgba(124,255,176,0.12), transparent 60%)," +
  "radial-gradient(700px 520px at 88% 30%, rgba(63,210,255,0.10), transparent 60%)," +
  "linear-gradient(180deg,#04130e 0%,#072321 45%,#05101c 100%)";

/** Keyframes for the atmosphere (light shafts, wisps, swaying foliage, glow). */
function AtmosphereKeyframes() {
  return (
    <style>{`
      @keyframes ximoray { 0%,100%{opacity:.30} 50%{opacity:.65} }
      @keyframes ximofloat {
        0%{transform:translate(0,0); opacity:.25}
        50%{transform:translate(14px,-30px); opacity:.75}
        100%{transform:translate(0,0); opacity:.25}
      }
      @keyframes ximosway { 0%,100%{transform:rotate(-2.2deg)} 50%{transform:rotate(2.6deg)} }
      @keyframes ximosway2 { 0%,100%{transform:rotate(2deg)} 50%{transform:rotate(-2.4deg)} }
      @keyframes ximoglow { 0%,100%{opacity:.35} 50%{opacity:1} }
      @media (prefers-reduced-motion: reduce){
        .ximo-anim{animation:none !important}
      }
    `}</style>
  );
}

/** Volumetric god rays streaming down through the canopy (Ori signature). */
function GodRays() {
  const rays = [
    { left: "10%", w: 130, rot: 13, delay: 0, dur: 9 },
    { left: "28%", w: 90, rot: 11, delay: 2.4, dur: 11 },
    { left: "48%", w: 180, rot: 15, delay: 4.8, dur: 10 },
    { left: "66%", w: 100, rot: 12, delay: 1.6, dur: 12 },
    { left: "82%", w: 140, rot: 14, delay: 3.6, dur: 9.5 },
  ];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0" style={{ zIndex: 2, mixBlendMode: "screen" }}>
      {rays.map((r, i) => (
        <div
          key={i}
          className="ximo-anim absolute"
          style={{
            left: r.left,
            top: "-25%",
            height: "150%",
            width: r.w,
            transform: `rotate(${r.rot}deg)`,
            transformOrigin: "top center",
            background:
              "linear-gradient(to bottom, rgba(190,255,228,0.20), rgba(120,220,255,0.07) 42%, transparent 76%)",
            filter: "blur(22px)",
            animation: `ximoray ${r.dur}s ease-in-out ${r.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/** Drifting spirit wisps — soft glowing orbs (the lights of the forest). */
function SpiritWisps() {
  const orbs = [
    { left: "16%", top: "28%", size: 90, color: "rgba(130,235,255,0.55)", dur: 22, delay: 0 },
    { left: "74%", top: "20%", size: 64, color: "rgba(255,216,120,0.5)", dur: 27, delay: 4 },
    { left: "58%", top: "58%", size: 120, color: "rgba(150,255,196,0.42)", dur: 31, delay: 8 },
    { left: "30%", top: "70%", size: 56, color: "rgba(130,235,255,0.5)", dur: 24, delay: 2 },
    { left: "88%", top: "62%", size: 74, color: "rgba(190,255,170,0.45)", dur: 29, delay: 6 },
  ];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0" style={{ zIndex: 4, mixBlendMode: "screen" }}>
      {orbs.map((o, i) => (
        <div
          key={i}
          className="ximo-anim absolute rounded-full"
          style={{
            left: o.left,
            top: o.top,
            width: o.size,
            height: o.size,
            background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
            filter: "blur(6px)",
            animation: `ximofloat ${o.dur}s ease-in-out ${o.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/** A hanging vine with leaves and a glowing bud — sways gently like in wind. */
function Vine({ x, length, sway, delay }: { x: number; length: number; sway: string; delay: number }) {
  const n = Math.max(3, Math.round(length / 90));
  const leaves = Array.from({ length: n }, (_, i) => {
    const y = 40 + (i / n) * (length - 40);
    const side = i % 2 === 0 ? 1 : -1;
    return { y, side, rot: side * (30 + (i % 3) * 12) };
  });
  return (
    <g
      className="ximo-anim"
      style={{ transformBox: "fill-box", transformOrigin: "50% 0%", animation: `${sway} 7s ease-in-out ${delay}s infinite` }}
    >
      <path d={`M${x},-10 C ${x + 14},${length * 0.33} ${x - 14},${length * 0.66} ${x},${length}`} stroke="rgba(10,40,32,0.95)" strokeWidth="5" fill="none" />
      {leaves.map((l, i) => (
        <ellipse key={i} cx={x + l.side * 22} cy={l.y} rx={16} ry={40} transform={`rotate(${l.rot} ${x + l.side * 22} ${l.y})`} fill="url(#ximo-leaf)" stroke="rgba(120,240,210,0.14)" strokeWidth="1.2" />
      ))}
      <circle className="ximo-anim" cx={x} cy={length} r={5} fill="#bdf7e6" style={{ animation: `ximoglow 4s ease-in-out ${delay + 1}s infinite`, filter: "drop-shadow(0 0 6px rgba(150,255,220,0.9))" }} />
    </g>
  );
}

/**
 * Ori-style foreground frame: lush, layered foliage silhouettes — hanging vines,
 * corner leaf clusters and dense grass tufts with glowing flora — plus a canopy
 * vignette. Sits ABOVE the 3D dragon but BELOW the page content.
 */
function FoliageFrame() {
  const topLeaves = [
    { cx: 70, cy: 30, rx: 30, ry: 80, rot: 18 },
    { cx: 160, cy: 78, rx: 24, ry: 66, rot: 42 },
    { cx: 38, cy: 120, rx: 22, ry: 60, rot: -8 },
    { cx: 240, cy: 40, rx: 20, ry: 52, rot: 30 },
    { cx: 1530, cy: 30, rx: 30, ry: 80, rot: -18 },
    { cx: 1440, cy: 78, rx: 24, ry: 66, rot: -42 },
    { cx: 1562, cy: 120, rx: 22, ry: 60, rot: 8 },
    { cx: 1360, cy: 40, rx: 20, ry: 52, rot: -30 },
  ];
  const flora = [
    { cx: 70, cy: 815, r: 6, d: 0 },
    { cx: 150, cy: 845, r: 5, d: 1.2 },
    { cx: 250, cy: 805, r: 7, d: 2.1 },
    { cx: 1540, cy: 815, r: 6, d: 0.6 },
    { cx: 1450, cy: 845, r: 5, d: 1.8 },
    { cx: 1350, cy: 805, r: 7, d: 2.6 },
  ];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0" style={{ zIndex: 5 }}>
      {/* Canopy darkening — focuses the centre, deepens the forest. */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(130% 90% at 50% 30%, transparent 48%, rgba(2,12,9,0.7) 100%)" }}
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="none">
        <defs>
          <radialGradient id="ximo-leaf" cx="50%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#0e3a2c" />
            <stop offset="100%" stopColor="#03120c" />
          </radialGradient>
          <linearGradient id="ximo-mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(80,200,180,0.10)" />
            <stop offset="100%" stopColor="rgba(80,200,180,0)" />
          </linearGradient>
        </defs>

        {/* Soft misty canopy band along the very top for depth. */}
        <rect x="0" y="0" width="1600" height="150" fill="url(#ximo-mist)" />

        {/* Back foliage layer — lighter + blurred for parallax depth. */}
        <g fill="#06241b" opacity="0.55" style={{ filter: "blur(3px)" }}>
          <path d="M-30,930 L60,740 L120,915 L200,720 L260,915 L350,760 L400,930 Z" />
          <path d="M1630,930 L1540,740 L1480,915 L1400,720 L1340,915 L1250,760 L1200,930 Z" />
        </g>

        {/* Hanging vines (swaying). */}
        <Vine x={120} length={300} sway="ximosway" delay={0} />
        <Vine x={300} length={210} sway="ximosway2" delay={1.3} />
        <Vine x={1300} length={300} sway="ximosway2" delay={0.6} />
        <Vine x={1480} length={220} sway="ximosway" delay={1.9} />

        {/* Front foliage — corner leaf clusters + dense grass tufts. */}
        <g fill="url(#ximo-leaf)" stroke="rgba(120,240,210,0.14)" strokeWidth="1.4">
          {topLeaves.map((l, i) => (
            <ellipse key={i} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry} transform={`rotate(${l.rot} ${l.cx} ${l.cy})`} />
          ))}
          <path d="M-30,920 L40,680 L75,905 L120,660 L160,900 L205,700 L245,912 L300,730 L340,905 L380,760 L410,920 Z" />
          <path d="M1630,920 L1560,680 L1525,905 L1480,660 L1440,900 L1395,700 L1355,912 L1300,730 L1260,905 L1220,760 L1190,920 Z" />
        </g>

        {/* Glowing flora nestled in the grass. */}
        {flora.map((f, i) => (
          <circle
            key={i}
            className="ximo-anim"
            cx={f.cx}
            cy={f.cy}
            r={f.r}
            fill="#cffaec"
            style={{ animation: `ximoglow 4.5s ease-in-out ${f.d}s infinite`, filter: "drop-shadow(0 0 7px rgba(150,255,220,0.85))" }}
          />
        ))}
      </svg>
    </div>
  );
}

function webglOK(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Fixed background layer for the scroll journey. Renders the 3D dragon over a
 * per-world enchanted-forest background (god rays, spirit wisps, layered
 * foliage); falls back to a static gradient when reduced-motion / no WebGL.
 * Tracks scroll progress (0→1) into a ref the canvas reads each frame.
 */
export default function JourneyBackground() {
  const scroll = useRef(0);
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- WebGL/reduced-motion can only be detected client-side on mount
    setUse3D(!reduced && webglOK());

    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      scroll.current = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // z-index 0 keeps this ABOVE the global body::before/::after decorative
  // layers (which sit at z-index -1/-2) so the scene is actually visible;
  // page content sits at z-10 above it.
  return (
    <div aria-hidden className="fixed inset-0" style={{ background: FALLBACK_BG, zIndex: 0 }}>
      <AtmosphereKeyframes />
      {use3D && <SnakeCanvas scroll={scroll} />}
      <GodRays />
      <SpiritWisps />
      <FoliageFrame />
    </div>
  );
}
