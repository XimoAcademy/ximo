"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { GlassPanel } from "../components/ui";
import { completeOnboardingAction, type OnboardingResult } from "./actions";

const STEPS = [
  { key: "perfil", title: "Perfil deportivo" },
  { key: "objetivo", title: "Objetivo" },
  { key: "universidades", title: "Universidades" },
  { key: "documentos", title: "Documentos" },
  { key: "plan", title: "Listo" },
];

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>{children}</span>
);

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [state, formAction, pending] = useActionState<OnboardingResult | null, FormData>(completeOnboardingAction, null);
  const total = STEPS.length;
  const isLast = step === total - 1;
  const pct = Math.round(((step + 1) / total) * 100);

  return (
    <div className="mx-auto max-w-[640px] space-y-6 py-2">
      <div className="ximo-fade-up text-center">
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ border: "1px solid var(--gold-border)", color: "var(--gold)", background: "var(--gold-bg)" }}>
          Configuración inicial
        </span>
        <h1 className="mt-3 text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>Bienvenido a Ximo</h1>
        <p className="mt-1.5 text-sm" style={{ color: "var(--text-label)" }}>Cinco pasos rápidos para personalizar tu camino deportivo.</p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Paso {step + 1} de {total}</span>
          <span className="text-[11px] font-black" style={{ color: "var(--teal)" }}>{pct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--border-subtle)" }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--teal-muted), var(--gold))", transition: "width 0.5s cubic-bezier(0.22,1,0.36,1)" }} />
        </div>
      </div>

      <form action={formAction}>
        <GlassPanel className="p-6">
          {/* Step 0: profile */}
          <div className={step === 0 ? "block" : "hidden"}>
            <h2 className="text-lg font-black" style={{ color: "var(--text)" }}>Perfil deportivo</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>Cuéntanos sobre ti como atleta.</p>
            <div className="mt-5 space-y-3">
              <label className="block"><Label>Prueba principal</Label><input name="primary_event" placeholder="50 libre" className="ximo-input" /></label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block"><Label>Mejor tiempo (opcional)</Label><input name="best_time" placeholder="26.04" className="ximo-input font-mono" /></label>
                <label className="block"><Label>Año de graduación</Label><input name="graduation_year" type="number" min={2024} max={2035} placeholder="2027" className="ximo-input" /></label>
              </div>
            </div>
          </div>

          {/* Step 1: goal */}
          <div className={step === 1 ? "block" : "hidden"}>
            <h2 className="text-lg font-black" style={{ color: "var(--text)" }}>Objetivo principal</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>¿Qué quieres lograr con Ximo?</p>
            <div className="mt-5 space-y-3">
              <label className="block"><Label>Meta de recruiting</Label>
                <select name="goal" className="ximo-input" defaultValue="Llegar a una universidad NCAA con beca">
                  <option>Llegar a una universidad NCAA con beca</option>
                  <option>Competir en NCAA D1</option>
                  <option>Organizar mi proceso de recruiting</option>
                  <option>Mejorar mis marcas y mi perfil</option>
                </select>
              </label>
              <label className="block"><Label>División objetivo</Label>
                <select name="target_division" className="ximo-input" defaultValue="">
                  <option value="">Sin definir todavía</option>
                  <option value="NCAA D1">NCAA D1</option>
                  <option value="NCAA D2">NCAA D2</option>
                  <option value="NCAA D3">NCAA D3</option>
                  <option value="NAIA">NAIA</option>
                </select>
              </label>
            </div>
          </div>

          {/* Step 2: universities */}
          <div className={step === 2 ? "block" : "hidden"}>
            <h2 className="text-lg font-black" style={{ color: "var(--text)" }}>Universidades de interés</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>Agrega las primeras que quieras seguir. Podrás cambiarlas después.</p>
            <div className="mt-5 space-y-3">
              <input name="university_1" placeholder="Universidad 1" className="ximo-input" />
              <input name="university_2" placeholder="Universidad 2" className="ximo-input" />
              <input name="university_3" placeholder="Universidad 3" className="ximo-input" />
              <p className="text-[11px]" style={{ color: "var(--text-3)" }}>¿No sabes cuáles? Explora el directorio NCAA D1 más tarde.</p>
            </div>
          </div>

          {/* Step 3: documents */}
          <div className={step === 3 ? "block" : "hidden"}>
            <h2 className="text-lg font-black" style={{ color: "var(--text)" }}>Documentos iniciales</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>Te preparamos el checklist estándar de recruiting.</p>
            <label className="mt-5 flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
              <input type="checkbox" name="seed_docs" defaultChecked className="h-4 w-4 accent-[var(--teal)]" />
              <span className="text-sm" style={{ color: "var(--text-2)" }}>Crear mi checklist de documentos (transcript, video, SAT/TOEFL y más)</span>
            </label>
          </div>

          {/* Step 4: done */}
          <div className={step === 4 ? "block" : "hidden"}>
            <h2 className="text-lg font-black" style={{ color: "var(--text)" }}>Tu plan de acción está listo</h2>
            <div className="mt-5 rounded-2xl p-5 text-center" style={{ background: "var(--teal-bg)", border: "1px solid var(--teal-border)" }}>
              <p className="text-3xl">🏊</p>
              <p className="mt-2 text-sm font-bold" style={{ color: "var(--text)" }}>Generaremos tus primeras tareas y universidades</p>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>
                Guardaremos tu perfil, tus universidades de interés y tu primer plan de acción. Puedes ajustarlo cuando
                quieras desde tu dashboard.
              </p>
            </div>
            {state?.error && <p className="mt-3 text-center text-xs font-semibold" style={{ color: "var(--error)" }}>{state.error}</p>}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
              className="ximo-glass-chip rounded-full px-4 py-2 text-xs font-semibold disabled:opacity-40">← Atrás</button>

            {isLast ? (
              <button type="submit" disabled={pending} className="ximo-glass-btn teal text-sm disabled:opacity-50">
                {pending ? "Guardando…" : "Crear mi plan y entrar"}
              </button>
            ) : (
              <button type="button" onClick={() => setStep((s) => Math.min(total - 1, s + 1))} className="ximo-glass-btn teal text-sm">Continuar</button>
            )}
          </div>
        </GlassPanel>
      </form>

      <p className="text-center text-[11px]" style={{ color: "var(--text-3)" }}>
        Puedes saltarte esto e <Link href="/app" className="font-semibold" style={{ color: "var(--teal)" }}>ir directo a la app</Link>.
      </p>
    </div>
  );
}
