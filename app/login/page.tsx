import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Emblem from "../components/Emblem";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Entra a tu cuenta de Ximo y continúa tu camino al college deportivo.",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen">

      {/* ── Left panel — decorative ── */}
      <div
        className="relative hidden overflow-hidden lg:flex lg:w-[44%] xl:w-[48%] flex-col justify-between p-14"
        style={{ background: "var(--hero-bg)", borderRight: "1px solid var(--border-subtle)" }}
      >
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute" style={{ width: 500, height: 500, top: "-10%", left: "-10%", background: "radial-gradient(circle, var(--teal-bg) 0%, transparent 65%)", filter: "blur(60px)" }} />
          <div className="absolute" style={{ width: 400, height: 400, bottom: "0%", right: "-5%", background: "radial-gradient(circle, var(--gold-bg) 0%, transparent 65%)", filter: "blur(60px)" }} />
        </div>

        {/* Grid overlay */}
        <div className="ximo-soft-grid pointer-events-none absolute inset-0 opacity-50" />

        {/* Logo */}
        <div className="relative">
          <Emblem size={88} />
          <span
            className="mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase"
            style={{ border: "1px solid var(--gold-border)", color: "var(--gold)", background: "var(--gold-bg)" }}
          >
            Suscripción activa
          </span>
        </div>

        {/* Feature list */}
        <div className="relative space-y-7">
          {[
            { icon: "◫", label: "Universidades NCAA", sub: "Encuentra programas alineados a tu nivel" },
            { icon: "⬘", label: "Coaches", sub: "Construye relaciones y da seguimiento" },
            { icon: "◑", label: "Progreso deportivo", sub: "Visualiza marcas y el camino hacia tus metas" },
            { icon: "◉", label: "Comunidad atleta", sub: "Avanza con otros atletas serios" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3.5">
              <span className="mt-0.5 text-base shrink-0" style={{ color: "var(--gold)" }}>{item.icon}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{item.label}</p>
                <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="relative text-[10px] font-medium tracking-wide" style={{ color: "var(--text-3)" }}>
          Ximo · México primero
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 sm:px-10">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="mb-10 flex justify-center lg:hidden">
            <Emblem size={64} />
          </div>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>

          {/* Nav links */}
          <div className="ximo-fade-up delay-500 mt-8 flex items-center justify-center gap-5 text-[10px] font-medium" style={{ color: "var(--text-3)" }}>
            <Link href="/" className="transition-opacity hover:opacity-70">Página principal</Link>
            <span style={{ color: "var(--border-strong)" }}>·</span>
            <Link href="/build-log" className="transition-opacity hover:opacity-70">Build log</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
