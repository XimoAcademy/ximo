"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import AuthShell from "../components/AuthShell";
import { resendConfirmationAction, type AuthState } from "@/lib/auth/actions";

const initial: AuthState = {};

export default function VerifyEmailPage() {
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, pending] = useActionState(resendConfirmationAction, initial);

  return (
    <AuthShell
      badge="Verificación"
      footer={
        <>
          ¿Correo equivocado?{" "}
          <Link href="/register" className="font-semibold" style={{ color: "var(--teal)" }}>
            Crear otra cuenta
          </Link>
        </>
      }
    >
      <div
        className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
        style={{ background: "var(--teal-bg)", border: "1px solid var(--teal-border)", color: "var(--teal)" }}
      >
        ✉
      </div>

      <h1 className="text-center text-2xl font-black" style={{ color: "var(--text)" }}>
        Verifica tu correo
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
        Te enviamos un enlace de verificación a tu correo. Ábrelo para confirmar tu cuenta y continuar
        con la validación de tu suscripción.
      </p>

      <div className="mt-6 space-y-3">
        <Link href="/account-status" className="ximo-glass-btn teal block w-full text-center text-sm">
          Ya verifiqué mi correo
        </Link>

        {state.sent ? (
          <p
            className="rounded-xl px-4 py-3 text-center text-[12px] font-semibold"
            style={{ background: "var(--success-bg)", color: "var(--success)", border: "1px solid var(--success)" }}
          >
            Si tu correo está registrado y sin confirmar, te reenviamos el enlace. Revisa tu bandeja y spam.
          </p>
        ) : !showForm ? (
          <button type="button" onClick={() => setShowForm(true)} className="ximo-glass-btn dark w-full text-sm">
            Reenviar correo
          </button>
        ) : (
          <form action={formAction} className="space-y-2.5">
            <input
              name="email"
              type="email"
              required
              autoFocus
              placeholder="Tu correo electrónico"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: "var(--bg-surf)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
            {state.error && <p className="text-[12px] font-semibold" style={{ color: "var(--error)" }}>{state.error}</p>}
            <button type="submit" disabled={pending} className="ximo-glass-btn dark w-full text-sm disabled:opacity-50">
              {pending ? "Reenviando…" : "Reenviar enlace de verificación"}
            </button>
          </form>
        )}
      </div>

      <p className="mt-5 text-center text-[11px]" style={{ color: "var(--text-3)" }}>
        Revisa tu carpeta de spam si no lo encuentras en unos minutos.{" "}
        <Link href="/login" className="font-semibold" style={{ color: "var(--teal)" }}>
          Volver a iniciar sesión
        </Link>
      </p>
    </AuthShell>
  );
}
