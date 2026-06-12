"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import AuthShell, { authLabelClass, authLabelStyle, authInputClass, authInputStyle } from "../components/AuthShell";
import { updatePasswordAction, type AuthState } from "@/lib/auth/actions";

const initial: AuthState = {};

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(updatePasswordAction, initial);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");

  const mismatch = confirm.length > 0 && pw !== confirm;
  const tooShort = pw.length > 0 && pw.length < 8;
  const valid = pw.length >= 8 && pw === confirm;

  return (
    <AuthShell
      badge="Nueva contraseña"
      footer={
        <Link href="/login" className="font-semibold" style={{ color: "var(--teal)" }}>
          Volver a iniciar sesión
        </Link>
      }
    >
      <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>
        Crear nueva contraseña
      </h1>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
        Elige una contraseña nueva y segura para tu cuenta de Ximo.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="pw" className={authLabelClass} style={authLabelStyle}>
            Nueva contraseña
          </label>
          <input
            id="pw"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className={authInputClass}
            style={authInputStyle}
          />
        </div>
        <div>
          <label htmlFor="confirm" className={authLabelClass} style={authLabelStyle}>
            Confirmar contraseña
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repite tu contraseña"
            className={authInputClass}
            style={authInputStyle}
          />
        </div>

        {(mismatch || tooShort) && (
          <p className="text-[11px] font-semibold" style={{ color: "var(--error)" }}>
            {tooShort ? "La contraseña debe tener al menos 8 caracteres." : "Las contraseñas no coinciden."}
          </p>
        )}
        {state.error && (
          <p className="text-[12px] font-semibold" style={{ color: "var(--error)" }}>{state.error}</p>
        )}

        <button type="submit" disabled={!valid || pending} className="ximo-glass-btn teal w-full text-sm">
          {pending ? "Actualizando…" : "Actualizar contraseña"}
        </button>
      </form>
    </AuthShell>
  );
}
