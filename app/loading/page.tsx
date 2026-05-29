"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(30,206,206,0.08) 0%, transparent 70%)"
        }} />
      </div>
      <div className="ximo-soft-grid pointer-events-none absolute inset-0 opacity-25" />

      {/* ── Loading symbol ── */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Ring container — 200px */}
        <div className="relative mb-10 flex h-[200px] w-[200px] items-center justify-center">

          {/* Outer static ring */}
          <div className="absolute inset-0 rounded-full ximo-ring-glow"
            style={{ border: "1.5px solid rgba(30,206,206,0.25)" }} />

          {/* Spinning arc */}
          <div className="ximo-ring-spin absolute inset-0 rounded-full" style={{
            border: "2px solid transparent",
            borderTopColor: "rgba(30,206,206,0.9)",
            borderRightColor: "rgba(30,206,206,0.4)",
          }} />

          {/* Inner ring */}
          <div className="absolute rounded-full" style={{
            inset: "14px",
            border: "0.5px solid rgba(30,206,206,0.12)",
          }} />

          {/* Logo — fills the inner circle (172px available) */}
          <div className="ximo-logo-appear relative z-10 flex items-center justify-center rounded-full px-6">
            <Image
              src="/brand/ximo-logo.png"
              alt="Ximo"
              width={152}
              height={50}
              className="w-[152px] h-auto object-contain"
              style={{ filter: "drop-shadow(0 0 18px rgba(30,206,206,0.55))" }}
              priority
            />
          </div>
        </div>

        {/* Copy */}
        <p className="ximo-fade-up text-sm font-bold" style={{ color: "#F5F5F0" }}>
          Preparando tu experiencia…
        </p>
        <p className="ximo-fade-up delay-100 mt-1.5 text-xs" style={{ color: "rgba(245,245,240,0.38)" }}>
          Cargando Ximo
        </p>

        {/* Progress */}
        <div className="mt-7 h-px w-36 overflow-hidden rounded-full"
          style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg,#1ECECE,#C9A84C)" }} />
        </div>
        <p className="mt-2 text-[10px] font-mono tabular-nums" style={{ color: "rgba(30,206,206,0.4)" }}>
          {progress}%
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{ background: "linear-gradient(to top, #07131F, transparent)" }} />
    </div>
  );
}
