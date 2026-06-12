"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInAction, type AuthState } from "@/lib/auth/actions";

const initial: AuthState = {};
const labelClass = "block text-[10px] font-bold uppercase tracking-widest";
const labelStyle = { color: "var(--text-label)" } as const;
const inputClass = "w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200";
const inputStyle = { background: "var(--bg-surf)", border: "1px solid var(--border)", color: "var(--text)" } as const;

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signInAction, initial);
  const params = useSearchParams();
  const justReset = params.get("reset") === "1";
  const justDeleted = params.get("deleted") === "1";

  return (
    <>
      {/* Heading */}
      <div className="ximo-fade-up mb-8">
        <h1 className="text-3xl font-black" style={{ color: "var(--text)" }}>
          Inicia sesión en Ximo
        </h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
          Entra a tu cuenta para continuar con tu dashboard deportivo.
        </p>
      </div>

      {justReset && (
        <div
          className="ximo-fade-up mb-4 rounded-xl px-4 py-3 text-[12px] font-semibold"
          style={{ background: "var(--success-bg)", color: "var(--success)", border: "1px solid var(--success)" }}
        >
          Contraseña actualizada. Inicia sesión con tu nueva contraseña.
        </div>
      )}

      {justDeleted && (
        <div
          className="ximo-fade-up mb-4 rounded-xl px-4 py-3 text-[12px] font-semibold"
          style={{ background: "var(--surface-hover)", color: "var(--text-2)", border: "1px solid var(--border)" }}
        >
          Tu cuenta y todos tus datos fueron eliminados. Gracias por haber sido parte de Ximo.
        </div>
      )}

      <form action={formAction} className="ximo-fade-up delay-100 space-y-4">
        <div>
          <label htmlFor="email" className={`mb-2 ${labelClass}`} style={labelStyle}>
            Correo electrónico
          </label>
          <input id="email" name="email" type="email" required autoComplete="email"
            placeholder="atleta@ejemplo.com" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className={labelClass} style={labelStyle}>
              Contraseña
            </label>
            <Link href="/forgot-password" className="text-[10px] font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--teal)" }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <input id="password" name="password" type="password" required autoComplete="current-password"
            placeholder="••••••••" className={inputClass} style={inputStyle} />
        </div>

        {state.error && (
          <p className="text-[12px] font-semibold" style={{ color: "var(--error)" }}>
            {state.error}
          </p>
        )}

        <div className="mt-6 space-y-3">
          <button type="submit" disabled={pending} className="ximo-glass-btn teal w-full text-sm">
            {pending ? "Entrando…" : "Entrar"}
          </button>
          <Link href="/register" className="block">
            <span className="ximo-glass-btn dark block w-full text-center text-sm">Crear cuenta</span>
          </Link>
        </div>
      </form>

      {/* Subscription validation note */}
      <div
        className="ximo-fade-up delay-300 mt-8 rounded-2xl p-4"
        style={{ background: "var(--teal-bg)", border: "1px solid var(--teal-border)" }}
      >
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px]"
            style={{ background: "var(--teal-bg)", color: "var(--teal)" }}
          >
            ✓
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: "var(--teal)" }}>Validación de suscripción</p>
            <p className="mt-1 text-[11px] leading-relaxed" style={{ color: "var(--text-2)" }}>
              Después de iniciar sesión, Ximo verificará que tu suscripción mensual esté activa.
            </p>
          </div>
        </div>
      </div>

      <p className="ximo-fade-up delay-400 mt-4 text-center text-[10px]" style={{ color: "var(--text-3)" }}>
        Tu acceso se valida con una suscripción activa.
      </p>
    </>
  );
}
