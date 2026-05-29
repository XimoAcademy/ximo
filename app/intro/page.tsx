"use client";

import { useRouter } from "next/navigation";

export default function IntroPage() {
  const router = useRouter();

  return (
    <div
      className="relative flex min-h-screen cursor-pointer select-none items-center justify-center overflow-hidden"
      style={{ background: "#07131F" }}
      onClick={() => router.push("/loading")}
    >
      {/* ── Animated ambient orbs ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Primary teal orb */}
        <div
          className="ximo-orb absolute"
          style={{
            width: 800,
            height: 800,
            top: "-25%",
            left: "-20%",
            background: "radial-gradient(circle, rgba(30,206,206,0.16) 0%, transparent 65%)",
          }}
        />
        {/* Gold orb */}
        <div
          className="ximo-orb absolute"
          style={{
            width: 650,
            height: 650,
            bottom: "-20%",
            right: "-15%",
            background: "radial-gradient(circle, rgba(201,168,76,0.14) 0%, transparent 65%)",
            animationDelay: "-4s",
          }}
        />
        {/* Center diffuse teal */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 1000,
            height: 420,
            background: "radial-gradient(ellipse, rgba(30,206,206,0.08) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />
        {/* Lime accent bottom-left */}
        <div
          className="ximo-orb absolute"
          style={{
            width: 400,
            height: 400,
            bottom: "5%",
            left: "5%",
            background: "radial-gradient(circle, rgba(184,216,64,0.07) 0%, transparent 65%)",
            animationDelay: "-8s",
          }}
        />
      </div>

      {/* Soft grid */}
      <div className="ximo-soft-grid pointer-events-none absolute inset-0 opacity-50" />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">

        {/* Live the Dream */}
        <p
          className="ximo-fade-up mb-10 text-[9px] font-bold uppercase tracking-[0.45em] delay-100"
          style={{ color: "rgba(30,206,206,0.55)" }}
        >
          Live the Dream
        </p>

        {/* Wordmark */}
        <h1
          className="ximo-zoom-enter delay-150"
          style={{
            fontSize: "clamp(96px, 20vw, 220px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "#F5F5F0",
            textShadow:
              "0 0 80px rgba(30,206,206,0.3), 0 0 160px rgba(30,206,206,0.12), 0 2px 60px rgba(0,0,0,0.7)",
          }}
        >
          Ximo
        </h1>

        {/* Gradient rule */}
        <div
          className="ximo-fade-up mt-7 delay-300"
          style={{
            width: 120,
            height: 2,
            background: "linear-gradient(90deg, transparent, #1ECECE, #C9A84C, transparent)",
            borderRadius: 99,
          }}
        />

        {/* Subtitle */}
        <p
          className="ximo-fade-up mt-9 max-w-xs text-sm font-medium leading-relaxed delay-400"
          style={{ color: "rgba(245,245,240,0.38)" }}
        >
          Tu camino deportivo, organizado.
        </p>

        {/* Touch hint — not a button */}
        <p
          className="ximo-fade-up mt-16 text-[9px] font-medium uppercase tracking-[0.35em] delay-700"
          style={{ color: "rgba(30,206,206,0.28)" }}
        >
          Toca para continuar
        </p>
      </div>

      {/* Bottom vignette */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to top, #07131F, transparent)" }}
      />
    </div>
  );
}
