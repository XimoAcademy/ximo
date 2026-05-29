"use client";

import { useRouter } from "next/navigation";

export default function IntroPage() {
  const router = useRouter();

  return (
    <div
      className="relative flex min-h-screen cursor-pointer select-none items-center justify-center overflow-hidden"
      onClick={() => router.push("/loading")}
    >
      {/* ── Living brand gradient (Image 2: cyan → green → lime → gold) ── */}
      <div className="ximo-brand-gradient-live absolute inset-0" />

      {/* Soft drifting light orbs over the gradient for depth */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="ximo-orb absolute"
          style={{
            width: 720,
            height: 720,
            top: "-22%",
            left: "-12%",
            background: "radial-gradient(circle, rgba(255,255,255,0.28) 0%, transparent 65%)",
          }}
        />
        <div
          className="ximo-orb absolute"
          style={{
            width: 620,
            height: 620,
            bottom: "-20%",
            right: "-10%",
            background: "radial-gradient(circle, rgba(232,206,78,0.30) 0%, transparent 65%)",
            animationDelay: "-5s",
          }}
        />
        <div
          className="ximo-orb absolute"
          style={{
            width: 520,
            height: 520,
            top: "30%",
            left: "55%",
            background: "radial-gradient(circle, rgba(47,180,204,0.22) 0%, transparent 65%)",
            animationDelay: "-9s",
          }}
        />
      </div>

      {/* Subtle vignette so the white wordmark always reads */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 35%, rgba(14,42,46,0.18) 100%)" }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">

        {/* Wordmark — Argent-style serif, white, matching Image 2 */}
        <h1
          className="ximo-intro-text font-display"
          style={{
            fontSize: "clamp(80px, 17vw, 188px)",
            fontWeight: 600,
            lineHeight: 1,
            color: "#FFFFFF",
            textShadow: "0 2px 40px rgba(14,42,46,0.25)",
          }}
        >
          Ximo
        </h1>

        {/* Tagline — matches Image 2 "-Live the Dream-" */}
        <p
          className="ximo-intro-text font-display mt-6"
          style={{
            animationDelay: "0.35s",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "clamp(15px, 2.4vw, 22px)",
            letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.92)",
            textShadow: "0 1px 16px rgba(14,42,46,0.2)",
          }}
        >
          - Live the Dream -
        </p>

        {/* Secondary line (Spanish positioning) */}
        <p
          className="ximo-fade-up mt-10 max-w-xs text-sm font-medium leading-relaxed delay-500"
          style={{ color: "rgba(255,255,255,0.78)" }}
        >
          Tu camino deportivo, organizado.
        </p>

        {/* Touch hint — not a button */}
        <p
          className="ximo-fade-up mt-16 text-[10px] font-semibold uppercase tracking-[0.4em] delay-700"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Toca para continuar
        </p>
      </div>
    </div>
  );
}
