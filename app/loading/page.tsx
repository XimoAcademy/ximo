"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Emblem from "../components/Emblem";

export default function LoadingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [14, 32, 51, 68, 83, 95, 100];
    let i = 0;
    const tick = () => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
        if (i < steps.length) setTimeout(tick, 300 + Math.random() * 200);
        else setTimeout(() => router.push("/login"), 480);
      }
    };
    const t = setTimeout(tick, 350);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--bg, #07131F)" }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(30,206,206,0.10) 0%, transparent 70%)"
      }} />
      <div className="ximo-soft-grid pointer-events-none absolute inset-0 opacity-25" />

      {/* ── Loading medallion ── */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-10 flex h-[208px] w-[208px] items-center justify-center">

          {/* Outer diffused glow */}
          <div className="ximo-ring-glow absolute rounded-full" style={{ inset: "-6px" }} />

          {/* Spinning accent arc — sits just outside the medallion */}
          <div className="ximo-ring-spin absolute inset-0 rounded-full" style={{
            border: "2px solid transparent",
            borderTopColor: "#1ECECE",
            borderRightColor: "rgba(30,206,206,0.35)",
          }} />

          {/* Complete polished outer ring */}
          <div className="absolute rounded-full" style={{
            inset: "6px",
            border: "1.5px solid rgba(30,206,206,0.45)",
            boxShadow: "0 0 0 1px rgba(7,19,31,0.6), inset 0 0 24px rgba(30,206,206,0.12)",
          }} />

          {/* Logo medallion — fills the ring (ring interior ≈ 196px) */}
          <div className="ximo-logo-appear relative z-10 flex items-center justify-center overflow-hidden rounded-full"
            style={{ width: "clamp(160px, 90%, 192px)", height: "clamp(160px, 90%, 192px)", boxShadow: "0 0 32px rgba(30,206,206,0.3)" }}>
            <Emblem size={192} rounded style={{ width: "100%", height: "100%" }} />
          </div>
        </div>

        {/* Copy */}
        <p className="ximo-fade-up text-sm font-bold" style={{ color: "#F5F5F0" }}>
          Preparando tu experiencia
        </p>
        <p className="ximo-fade-up delay-100 mt-1.5 text-xs" style={{ color: "rgba(245,245,240,0.45)" }}>
          Estamos cargando Ximo
        </p>

        {/* Progress */}
        <div className="mt-7 h-px w-36 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg,#1ECECE,#C9A84C)" }} />
        </div>
        <p className="mt-2 text-[10px] font-mono tabular-nums" style={{ color: "rgba(30,206,206,0.5)" }}>
          {progress}%
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{ background: "linear-gradient(to top, var(--bg), transparent)" }} />
    </div>
  );
}
