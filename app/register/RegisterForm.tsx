"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction, type AuthState } from "@/lib/auth/actions";

const COUNTRIES = ["México", "Estados Unidos", "Colombia", "Argentina", "Otro"];
const YEARS = ["2025", "2026", "2027", "2028", "2029"];

const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-widest";
const labelStyle = { color: "var(--text-label)" } as const;
const fieldClass = "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200";
const selectClass = "w-full rounded-xl px-3 py-3 text-sm outline-none transition-all duration-200 appearance-none";
const fieldStyle = { background: "var(--bg-surf)", border: "1px solid var(--border)", color: "var(--text)" } as const;

const initial: AuthState = {};

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(signUpAction, initial);

  return (
    <form action={formAction}>
      {/* Form fields */}
      <div className="ximo-fade-up delay-100 space-y-3.5">
        <div>
          <label className={labelClass} style={labelStyle}>Nombre completo</label>
          <input name="full_name" type="text" autoComplete="name" placeholder="Manuel Zúñiga" className={fieldClass} style={fieldStyle} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Correo electrónico</label>
          <input name="email" type="email" required autoComplete="email" placeholder="atleta@ejemplo.com" className={fieldClass} style={fieldStyle} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Contraseña</label>
          <input name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="Mínimo 8 caracteres" className={fieldClass} style={fieldStyle} />
        </div>
        {/* 3-col grid */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass} style={labelStyle}>Deporte</label>
            <div className="flex w-full items-center gap-1.5 rounded-xl px-3 py-3 text-sm" style={fieldStyle}>
              <span aria-hidden style={{ color: "var(--teal)" }}>🏊</span>
              <span className="font-semibold">Natación</span>
            </div>
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>País</label>
            <select name="country" defaultValue="México" className={selectClass} style={fieldStyle}>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Graduación</label>
            <select name="graduation_year" defaultValue="2027" className={selectClass} style={fieldStyle}>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Plan preview */}
      <div className="ximo-fade-up delay-200 mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>Mensual</p>
          <p className="mt-2 text-xl font-black" style={{ color: "var(--text)" }}>$149<span className="text-xs font-medium" style={{ color: "var(--text-label)" }}>/mes</span></p>
          <p className="mt-1 text-[10px]" style={{ color: "var(--text-3)" }}>Facturado mensual</p>
        </div>
        <div className="relative rounded-2xl p-4" style={{ background: "var(--teal-bg)", border: "1px solid var(--teal-border)" }}>
          <div className="absolute -top-2 left-3 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest" style={{ background: "var(--gold)", color: "var(--bg)" }}>
            Recomendado
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>Anual</p>
          <p className="mt-2 text-xl font-black" style={{ color: "var(--text)" }}>$99<span className="text-xs font-medium" style={{ color: "var(--text-label)" }}>/mes</span></p>
          <p className="mt-1 text-[10px]" style={{ color: "var(--gold)" }}>Ahorra vs mensual</p>
        </div>
      </div>

      {state.error && (
        <p className="ximo-fade-up mt-3 text-center text-[12px] font-semibold" style={{ color: "var(--error)" }}>
          {state.error}
        </p>
      )}

      <p className="ximo-fade-up delay-300 mt-3 text-center text-[10px]" style={{ color: "var(--text-3)" }}>
        La suscripción desbloquea la app completa. Sin plan gratuito.
      </p>

      {/* CTA */}
      <div className="ximo-fade-up delay-400 mt-5 space-y-3">
        <button type="submit" disabled={pending} className="ximo-glass-btn teal w-full text-sm">
          {pending ? "Creando cuenta…" : "Crear cuenta"}
        </button>
        <Link href="/login" className="block">
          <span className="ximo-glass-btn dark block w-full text-center text-sm">Ya tengo cuenta</span>
        </Link>
      </div>

      <p className="ximo-fade-up delay-500 mt-5 text-center text-[10px]" style={{ color: "var(--text-3)" }}>
        Después de crear tu cuenta podrás elegir un plan mensual o anual.
      </p>
    </form>
  );
}
