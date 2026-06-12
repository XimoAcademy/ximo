"use client";

import { useActionState } from "react";
import Link from "next/link";
import AuthShell, { authLabelClass, authLabelStyle, authInputClass, authInputStyle } from "../components/AuthShell";
import { requestPasswordResetAction, type AuthState } from "@/lib/auth/actions";

const initial: AuthState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initial);
  const sent = state.sent;

  return (
    <AuthShell
      badge="Recuperar acceso"
      footer={
        <>
          ¿Recordaste tu contraseña?{" "}
          <Link href="/login" className="font-semibold" style={{ color: "var(--teal)" }}>
            Inicia sesión
          </Link>
        </>
      }
    >
      <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>
        Recuperar contraseña
      </h1>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
        Te enviaremos un enlace para restablecer tu contraseña.
      </p>

      {sent ? (
        <div
          className="mt-6 rounded-2xl p-4"
          style={{ background: "var(--teal-bg)", border: "1px solid var(--teal-border)" }}
        >
          <div className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px]"
              style={{ background: "var(--teal-bg)", color: "var(--teal)" }}
            >
              ✓
            </span>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)" }}>
              Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña en
              los próximos minutos. Revisa también tu carpeta de spam.
            </p>
          </div>
          <Link href="/login" className="ximo-glass-btn dark mt-4 block w-full text-center text-sm">
            Volver a iniciar sesión
          </Link>
        </div>
      ) : (
        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className={authLabelClass} style={authLabelStyle}>
              Correo electrónico
            </label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="atleta@ejemplo.com" className={authInputClass} style={authInputStyle} />
          </div>
          {state.error && (
            <p className="text-[12px] font-semibold" style={{ color: "var(--error)" }}>{state.error}</p>
          )}
          <button type="submit" disabled={pending} className="ximo-glass-btn teal w-full text-sm">
            {pending ? "Enviando…" : "Enviar instrucciones"}
          </button>
          <p className="text-center text-[11px]" style={{ color: "var(--text-3)" }}>
            Te enviaremos un enlace seguro de un solo uso.
          </p>
        </form>
      )}
    </AuthShell>
  );
}
