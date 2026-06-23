"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const SnakeCanvas = dynamic(() => import("./SnakeCanvas"), { ssr: false });

/** Dark gradient shown before the canvas mounts, and as the no-3D fallback. */
const FALLBACK_BG =
  "radial-gradient(900px 600px at 70% 8%, rgba(37,99,235,0.18), transparent 60%)," +
  "radial-gradient(700px 500px at 20% 80%, rgba(30,206,206,0.14), transparent 60%)," +
  "linear-gradient(180deg,#080b16 0%,#06222a 45%,#0B1F33 100%)";

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

  return (
    <div aria-hidden className="fixed inset-0 -z-10" style={{ background: FALLBACK_BG }}>
      {use3D && <SnakeCanvas scroll={scroll} />}
    </div>
  );
}
