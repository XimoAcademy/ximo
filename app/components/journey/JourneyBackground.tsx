"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const SnakeCanvas = dynamic(() => import("./SnakeCanvas"), { ssr: false });

/** Enchanted-forest gradient shown before the canvas mounts / as no-3D fallback. */
const FALLBACK_BG =
  "radial-gradient(1000px 700px at 50% 0%, rgba(63,224,200,0.12), transparent 60%)," +
  "radial-gradient(700px 500px at 18% 90%, rgba(124,255,176,0.10), transparent 60%)," +
  "linear-gradient(180deg,#05140f 0%,#082523 45%,#06121f 100%)";

/**
 * Ori-style foreground frame: a canopy vignette plus dark foliage silhouettes
 * (hanging leaves up top, grass tufts in the bottom corners) that sit ABOVE the
 * 3D dragon but BELOW the page content, so the scene feels like a deep
 * enchanted forest you're peering into.
 */
function FoliageFrame() {
  const topLeaves = [
    { cx: 70, cy: 30, rx: 26, ry: 70, rot: 18 },
    { cx: 150, cy: 70, rx: 22, ry: 60, rot: 40 },
    { cx: 40, cy: 110, rx: 20, ry: 56, rot: -8 },
    { cx: 1530, cy: 30, rx: 26, ry: 70, rot: -18 },
    { cx: 1450, cy: 70, rx: 22, ry: 60, rot: -40 },
    { cx: 1560, cy: 110, rx: 20, ry: 56, rot: 8 },
  ];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0" style={{ zIndex: 5 }}>
      {/* Canopy darkening — focuses the centre, deepens the forest. */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(125% 85% at 50% 32%, transparent 52%, rgba(2,12,9,0.62) 100%)" }}
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="none">
        <defs>
          <radialGradient id="ximo-leaf" cx="50%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#0c3026" />
            <stop offset="100%" stopColor="#03120c" />
          </radialGradient>
        </defs>
        <g fill="url(#ximo-leaf)" stroke="rgba(120,240,210,0.12)" strokeWidth="1.4">
          {/* Hanging leaves, top corners. */}
          {topLeaves.map((l, i) => (
            <ellipse key={i} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry} transform={`rotate(${l.rot} ${l.cx} ${l.cy})`} />
          ))}
          {/* Grass / fern tufts, bottom corners (jagged silhouettes). */}
          <path d="M-30,920 L40,690 L75,905 L120,670 L160,900 L205,705 L245,912 L300,740 L330,920 Z" />
          <path d="M1630,920 L1560,690 L1525,905 L1480,670 L1440,900 L1395,705 L1355,912 L1300,740 L1270,920 Z" />
          {/* Shorter back layer for depth. */}
          <path opacity="0.7" d="M-30,925 L70,780 L110,915 L165,770 L210,915 L270,795 L320,925 Z" />
          <path opacity="0.7" d="M1630,925 L1530,780 L1490,915 L1435,770 L1390,915 L1330,795 L1280,925 Z" />
        </g>
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
 * Fixed background layer for the scroll journey. Renders the 3D crystal snake
 * over a per-world background; falls back to an animated CSS gradient when the
 * user prefers reduced motion or the device can't run WebGL. Tracks scroll
 * progress (0→1) into a ref the canvas reads each frame.
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
  // layers (which sit at z-index -1/-2) so the 3D scene is actually visible;
  // page content sits at z-10 above it.
  return (
    <div aria-hidden className="fixed inset-0" style={{ background: FALLBACK_BG, zIndex: 0 }}>
      {use3D && <SnakeCanvas scroll={scroll} />}
      <FoliageFrame />
    </div>
  );
}
