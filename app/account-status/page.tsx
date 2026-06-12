"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "../components/AuthShell";
import { checkAccessAction, type AccessState } from "@/lib/auth/actions";

const STEPS = ["Cuenta encontrada", "Suscripción verificada", "Preparando dashboard"];

export default function AccountStatusPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [access, setAccess] = useState<AccessState | "checking">("checking");

  // Check real auth + subscription state on mount.
  useEffect(() => {
    let cancelled = false;
    checkAccessAction().then(({ state }) => {
      if (cancelled) return;
      if (state === "unauthenticated") {
        router.replace("/login");
        return;
      }
      setAccess(state);
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  const active = access === "active";

  useEffect(() => {
    if (step < STEPS.length) {
      const t = setTimeout(() => setStep((s) => s + 1), 700 + Math.random() * 250);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setFinished(true), 500);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <AuthShell badge="Validando acceso">
      <h1 className="text-center text-2xl font-black" style={{ color: "var(--text)" }}>
        {finished ? "Cuenta lista" : "Validando tu cuenta"}
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
        {finished
          ? "Tu acceso se valida con una suscripción activa."
          : "Estamos verificando tu cuenta y el estado de tu suscripción."}
      </p>

      {/* Steps */}
      <div className="mt-6 space-y-2.5">
        {STEPS.map((label, i) => {
          const state = i < step ? "done" : i === step ? "active" : "idle";
          return (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{
                background: "var(--surface)",
                border: `1px solid ${state === "idle" ? "var(--border-subtle)" : "var(--teal-border)"}`,
                opacity: state === "idle" ? 0.5 : 1,
                transition: "opacity 0.4s ease, border-color 0.4s ease",
              }}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                  state === "active" ? "ximo-ring-spin" : ""
                }`}
                style={
                  state === "done"
                    ? { background: "var(--teal-bg)", color: "var(--teal)", border: "1px solid var(--teal-border)" }
                    : state === "active"
                    ? { border: "2px solid transparent", borderTopColor: "var(--teal)", borderRightColor: "var(--teal-dim)" }
                    : { background: "var(--surface-hover)", color: "var(--text-3)" }
                }
              >
                {state === "done" ? "✓" : state === "idle" ? "·" : ""}
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: state === "idle" ? "var(--text-3)" : "var(--text)" }}
              >
                {i === 1 && access === "inactive" ? "Suscripción pendiente" : label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Result CTA */}
      {finished && access !== "checking" && (
        <div className="ximo-fade-up mt-6">
          {active ? (
            <>
              <Link href="/app" className="ximo-glass-btn teal block w-full text-center text-sm">
                Entrar a Ximo
              </Link>
              <p className="mt-3 text-center text-[11px]" style={{ color: "var(--text-3)" }}>
                Suscripción activa · acceso completo a la app
              </p>
            </>
          ) : (
            <>
              <Link href="/subscribe" className="ximo-glass-btn gold shiny block w-full text-center text-sm">
                Activar suscripción
              </Link>
              <p className="mt-3 text-center text-[11px]" style={{ color: "var(--text-3)" }}>
                La suscripción desbloquea la app completa.
              </p>
            </>
          )}
        </div>
      )}
    </AuthShell>
  );
}
