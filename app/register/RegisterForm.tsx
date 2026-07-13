"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpAction, type AuthState } from "@/lib/auth/actions";
import { RESIDENCE_COUNTRIES } from "@/lib/intl/residenceCountries";
import { validateGradYear, validateDob } from "@/lib/education/fields";

const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-widest";
const labelStyle = { color: "var(--text-label)" } as const;
const fieldClass = "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200";
const selectClass = "w-full rounded-xl px-3 py-3 text-sm outline-none transition-all duration-200 appearance-none";
const fieldStyle = { background: "var(--bg-surf)", border: "1px solid var(--border)", color: "var(--text)" } as const;

const initial: AuthState = {};

// Today as YYYY-MM-DD (date-only, no timezone shift) for the max attribute.
function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const GRAD_ERR: Record<string, string> = {
  required: "Escribe tu año de graduación.",
  not_four_digits: "Escribe exactamente cuatro dígitos (por ejemplo, 2027).",
  out_of_range: "Escribe un año válido.",
  invalid: "Escribe un año válido.",
};
const DOB_ERR: Record<string, string> = {
  future: "La fecha no puede estar en el futuro.",
  invalid: "Ingresa una fecha válida.",
  too_old: "Ingresa una fecha válida.",
  required: "Ingresa tu fecha de nacimiento.",
};

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(signUpAction, initial);
  const [gradYear, setGradYear] = useState("2027");
  const [dob, setDob] = useState("");

  // Client-side validation (server re-validates authoritatively).
  const gradResult = validateGradYear(gradYear, { required: true });
  const gradError = !gradResult.ok ? GRAD_ERR[gradResult.error] : null;
  const dobResult = validateDob(dob);
  const dobError = !dobResult.ok ? DOB_ERR[dobResult.error] : null;
  const clientInvalid = !gradResult.ok || !dobResult.ok;

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
        {/* Date of birth — private, masked from analytics/session replay. */}
        <div>
          <label className={labelClass} style={labelStyle} htmlFor="date_of_birth">Fecha de nacimiento</label>
          <input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            required
            max={todayISO()}
            autoComplete="bday"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className={`${fieldClass} ph-no-capture`}
            style={fieldStyle}
            data-sentry-mask="true"
            aria-invalid={dobError ? true : undefined}
            aria-describedby={dobError ? "dob-error" : undefined}
          />
          {dobError && (
            <p id="dob-error" className="mt-1 text-[11px] font-semibold" style={{ color: "var(--error)" }}>{dobError}</p>
          )}
        </div>
        {/* Sport / country / four-digit graduation year */}
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
            <label className={labelClass} style={labelStyle} htmlFor="graduation_year">Graduación</label>
            <input
              id="graduation_year"
              name="graduation_year"
              type="text"
              inputMode="numeric"
              maxLength={4}
              required
              placeholder="2027"
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
              className={fieldClass}
              style={fieldStyle}
              aria-invalid={gradError ? true : undefined}
              aria-describedby={gradError ? "grad-error" : undefined}
            />
          </div>
        </div>
        {gradError && (
          <p id="grad-error" className="text-[11px] font-semibold" style={{ color: "var(--error)" }}>{gradError}</p>
        )}
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
        <button type="submit" disabled={pending || clientInvalid} className="ximo-glass-btn teal w-full text-sm disabled:opacity-50">
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
