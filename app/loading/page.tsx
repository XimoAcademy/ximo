"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const steps = [12, 28, 45, 62, 78, 91, 100];
    let i = 0;
    const tick = () => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
        setTimeout(tick, i === steps.length ? 200 : 320 + Math.random() * 200);
      } else {
        setDone(true);
        setTimeout(() => router.push("/login"), 600);
      }
    };
    const t = setTimeout(tick, 400);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{ background: "#07131F" }}
    >
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="ximo-orb absolute"
          style={{
            width: 600,
            height: 600,
            top: "-20%",
            left: "-10%",
            background: "radial-gradient(circle, rgba(47,127,134,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="ximo-orb absolute"
          style={{
            width: 500,
            height: 500,
            bottom: "-15%",
            right: "-8%",
            background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)",
            animationDelay: "-5s",
          }}
        />
      </div>

      {/* Grid */}
      <div className="ximo-soft-grid pointer-events-none absolute inset-0 opacity-40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">

        {/* Logo */}
        <div className="ximo-float mb-10">
          <Image
            src="/brand/ximo-logo.png"
            alt="Ximo"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
            style={{ filter: "drop-shadow(0 0 20px rgba(47,127,134,0.4))" }}
            priority
          />
        </div>

        {/* Spinner ring */}
        <div className="relative mb-10 flex h-16 w-16 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1.5px solid rgba(47,127,134,0.12)",
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1.5px solid transparent",
              borderTopColor: "#2F7F86",
              borderRightColor: "rgba(201,168,76,0.6)",
              animation: "ximo-spin-slow 1.4s cubic-bezier(0.4,0,0.6,1) infinite",
            }}
          />
          {/* Center dot */}
          <div
            className="ximo-glow-pulse h-2 w-2 rounded-full"
            style={{ background: "#2F7F86" }}
          />
        </div>

        {/* Copy */}
        <h2
          className="ximo-fade-up text-base font-bold"
          style={{ color: "#F5F5F0" }}
        >
          Preparando tu experiencia…
        </h2>
        <p
          className="ximo-fade-up mt-2 text-sm delay-100"
          style={{ color: "rgba(245,245,240,0.4)" }}
        >
          Organizando tu dashboard deportivo.
        </p>

        {/* Progress bar */}
        <div
          className="mt-8 h-px w-48 overflow-hidden rounded-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #2F7F86, #C9A84C)",
            }}
          />
        </div>
        <p
          className="mt-2.5 text-[10px] font-mono tabular-nums"
          style={{ color: "rgba(127,175,178,0.4)" }}
        >
          {progress}%
        </p>

        {/* Fallback */}
        {done && (
          <div className="ximo-fade-in mt-8">
            <Link
              href="/login"
              className="text-xs font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: "rgba(127,175,178,0.6)" }}
            >
              Continuar
            </Link>
          </div>
        )}
      </div>

      {/* Bottom vignette */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{ background: "linear-gradient(to top, #07131F, transparent)" }}
      />
    </div>
  );
}
