"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction, type AuthState } from "@/lib/auth/actions";
import { RESIDENCE_COUNTRIES } from "@/lib/intl/residenceCountries";

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
            <div className="relative">
              <select name="country" defaultValue="México" className={`${selectClass} pr-7`} style={fieldStyle}>
                {RESIDENCE_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <span aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px]" style={{ color: "var(--text-label)" }}>▼</span>
            </div>
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Graduación</label>
            <div className="relative">
              <select name="graduation_year" defaultValue="2027" className={`${selectClass} pr-7`} style={fieldStyle}>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <span aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px]" style={{ color: "var(--text-label)" }}>▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo notice (replaces pricing during the free testing phase) */}
      <div className="ximo-fade-up delay-200 mt-6 rounded-2xl p-4" style={{ background: "var(--teal-bg)", border: "1px solid var(--teal-border)" }}>
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--teal)" }}>Versión demo</p>
        <p className="mt-1.5 text-[12px] leading-relaxed" style={{ color: "var(--text-2)" }}>
          Ximo está en fase de prueba. El acceso es gratuito durante el demo. Si más adelante se habilita un plan de pago, te avisaremos antes y tendrás que aceptarlo — no se cobra nada automáticamente.
        </p>
      </div>

      {/* Privacy notice + terms consent (LFPDPPP — explicit, recorded via checkbox) */}
      <div className="ximo-fade-up delay-300 mt-5 flex items-start gap-2.5">
        <input
          id="privacy_accepted"
          name="privacy_accepted"
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--teal)]"
        />
        <label htmlFor="privacy_accepted" className="cursor-pointer text-[11px] leading-relaxed" style={{ color: "var(--text-2)" }}>
          He leído y acepto el{" "}
          <Link href="/privacidad" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2" style={{ color: "var(--teal)" }}>Aviso de Privacidad</Link>{" "}
          y los{" "}
          <Link href="/terminos" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2" style={{ color: "var(--teal)" }}>Términos</Link>{" "}
          de Ximo.
        </label>
      </div>

      {/* Optional, separate marketing opt-in (never pre-checked) */}
      <div className="ximo-fade-up delay-300 mt-3 flex items-start gap-2.5">
        <input
          id="marketing_opt_in"
          name="marketing_opt_in"
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--teal)]"
        />
        <label htmlFor="marketing_opt_in" className="cursor-pointer text-[11px] leading-relaxed" style={{ color: "var(--text-2)" }}>
          (Opcional) Quiero recibir correos con novedades y promociones de Ximo. Puedo darme de baja cuando quiera.
        </label>
      </div>

      {/* Minors note */}
      <p className="ximo-fade-up delay-300 mt-3 text-[10px] leading-relaxed" style={{ color: "var(--text-3)" }}>
        Si eres menor de edad, usa Ximo con autorización de tu madre, padre o tutor. No compartas datos sensibles,
        documentos oficiales o información de pago sin autorización.
      </p>

      {state.error && (
        <p className="ximo-fade-up mt-3 text-center text-[12px] font-semibold" style={{ color: "var(--error)" }}>
          {state.error}
        </p>
      )}

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
        Acceso gratuito durante la fase de prueba.
      </p>
    </form>
  );
}
