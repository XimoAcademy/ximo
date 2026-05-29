"use client";

import Image from "next/image";
import Link from "next/link";
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
        if (i < steps.length) {
          setTimeout(tick, 300 + Math.random() * 220);
        } else {
          setTimeout(() => router.push("/login"), 500);
        }
      }
    };
    const t = setTimeout(tick, 350);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{ background: "#07131F" }}
    >
      {/* Ambient bg */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30,206,206,0.07) 0%, transparent 70%)"
        }} />
      </div>
      <div className="ximo-soft-grid pointer-events-none absolute inset-0 opacity-30" />

      {/* ── Loading symbol — circular glow ring ── */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Outer glow ring container */}
        <div className="relative mb-10 flex h-48 w-48 items-center justify-center">

          {/* Diffused outer glow */}
          <div
            className="ximo-ring-glow absolute inset-0 rounded-full"
            style={{
              background: "transparent",
            }}
          />

          {/* Outer static ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1.5px solid rgba(30,206,206,0.3)",
            }}
          />

          {/* Spinning arc ring */}
          <div
            className="ximo-ring-spin absolute inset-0 rounded-full"
            style={{
              border: "1.5px solid transparent",
              borderTopColor: "rgba(30,206,206,0.85)",
              borderRightColor: "rgba(30,206,206,0.35)",
              filter: "drop-shadow(0 0 6px rgba(30,206,206,0.6))",
            }}
          />

          {/* Inner ring */}
          <div
            className="absolute rounded-full"
            style={{
              inset: "12px",
              border: "0.5px solid rgba(30,206,206,0.15)",
            }}
          />

          {/* Logo */}
          <div className="ximo-logo-appear relative z-10 flex items-center justify-center">
            <Image
              src="/brand/ximo-logo.png"
              alt="Ximo"
              width={100}
              height={34}
              className="h-9 w-auto object-contain"
              style={{ filter: "drop-shadow(0 0 16px rgba(30,206,206,0.5))" }}
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

        {/* Progress bar */}
        <div
          className="mt-7 h-px w-40 overflow-hidden rounded-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #1ECECE, #C9A84C)",
            }}
          />
        </div>
        <p
          className="mt-2 text-[10px] font-mono tabular-nums"
          style={{ color: "rgba(30,206,206,0.4)" }}
        >
          {progress}%
        </p>
      </div>

      {/* Vignette */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{ background: "linear-gradient(to top, #07131F, transparent)" }}
      />
    </div>
  );
}
