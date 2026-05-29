"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function IntroPage() {
  const router = useRouter();

  return (
    <div
      className="relative flex min-h-screen cursor-pointer items-center justify-center overflow-hidden"
      style={{ background: "#07131F" }}
      onClick={() => router.push("/loading")}
    >
      {/* ── Ambient orbs ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Teal orb — top left */}
        <div
          className="ximo-orb absolute"
          style={{
            width: 700,
            height: 700,
            top: "-20%",
            left: "-15%",
            background: "radial-gradient(circle, rgba(47,127,134,0.22) 0%, transparent 70%)",
          }}
        />
        {/* Gold orb — bottom right */}
        <div
          className="ximo-orb absolute"
          style={{
            width: 600,
            height: 600,
            bottom: "-18%",
            right: "-12%",
            background: "radial-gradient(circle, rgba(201,168,76,0.16) 0%, transparent 70%)",
            animationDelay: "-4s",
          }}
        />
        {/* Teal center glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 900,
            height: 400,
            background: "radial-gradient(ellipse, rgba(47,127,134,0.1) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* ── Soft grid ── */}
      <div className="ximo-soft-grid pointer-events-none absolute inset-0 opacity-60" />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center select-none">

        {/* Tagline top */}
        <p
          className="ximo-fade-up mb-8 text-[10px] font-bold uppercase tracking-[0.35em] delay-100"
          style={{ color: "rgba(127,175,178,0.6)" }}
        >
          Live the Dream
        </p>

        {/* Wordmark */}
        <h1
          className="ximo-zoom-enter delay-150"
          style={{
            fontSize: "clamp(88px, 18vw, 200px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "#F5F5F0",
            textShadow:
              "0 0 80px rgba(47,127,134,0.35), 0 0 160px rgba(47,127,134,0.15), 0 2px 60px rgba(0,0,0,0.6)",
          }}
        >
          Ximo
        </h1>

        {/* Animated teal-gold rule */}
        <div
          className="ximo-fade-up mt-6 delay-300"
          style={{
            width: 120,
            height: 2,
            background: "linear-gradient(90deg, transparent, #2F7F86, #C9A84C, transparent)",
            borderRadius: 99,
          }}
        />

        {/* Subtitle */}
        <p
          className="ximo-fade-up mt-8 max-w-xs text-sm font-medium leading-relaxed delay-400"
          style={{ color: "rgba(245,245,240,0.45)" }}
        >
          Tu camino deportivo, organizado.
        </p>

        {/* CTA */}
        <div className="ximo-fade-up mt-12 delay-600">
          <Link
            href="/loading"
            onClick={(e) => e.stopPropagation()}
            className="ximo-btn-press group inline-flex items-center gap-3 rounded-full px-8 py-3.5 text-sm font-bold transition-all duration-300"
            style={{
              background: "rgba(47,127,134,0.15)",
              border: "1px solid rgba(47,127,134,0.35)",
              color: "#7FAFB2",
              backdropFilter: "blur(12px)",
            }}
          >
            <span>Entrar a Ximo</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-200 group-hover:translate-x-1">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Click hint */}
        <p
          className="ximo-fade-up mt-8 text-[10px] tracking-widest delay-800"
          style={{ color: "rgba(245,245,240,0.18)" }}
        >
          Toca en cualquier lugar para continuar
        </p>
      </div>

      {/* ── Bottom vignette ── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to top, #07131F, transparent)" }}
      />
    </div>
  );
}
