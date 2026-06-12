"use client";

import { useActionState, useState } from "react";
import { createUniversityAction, type ActionResult } from "./actions";
import { RECRUITING_STAGES, PRIORITIES } from "@/lib/data/recruiting-constants";

export default function AddUniversityForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    createUniversityAction,
    null
  );

  // Close on action success, adjusting state during render (the form subtree
  // unmounts when closed, so its fields are fresh on the next open).
  const [prevState, setPrevState] = useState<ActionResult | null>(null);
  if (state !== prevState) {
    setPrevState(state);
    if (state?.ok) setOpen(false);
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="ximo-glass-btn teal text-xs">
        + Agregar universidad
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl p-4 sm:p-5"
      style={{ background: "var(--surface)", border: "1px solid var(--teal-border)" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-black" style={{ color: "var(--text)" }}>Nueva universidad</p>
        <button type="button" onClick={() => setOpen(false)} className="text-xs" style={{ color: "var(--text-label)" }}>
          Cancelar
        </button>
      </div>

      <div className="space-y-3">
        <input name="name" required autoFocus placeholder="Nombre de la universidad" className="ximo-input" />
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="division" placeholder="División (ej. NCAA D1)" className="ximo-input" />
          <input name="location" placeholder="Ubicación (ej. Austin, TX)" className="ximo-input" />
        </div>
        <input name="website" type="url" placeholder="Sitio web (opcional)" className="ximo-input" />
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Etapa</span>
            <select name="recruiting_stage" className="ximo-input" defaultValue="Investigando">
              {RECRUITING_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Prioridad</span>
            <select name="priority" className="ximo-input" defaultValue="Media">
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Tipo</span>
            <select name="fit_type" className="ximo-input" defaultValue="">
              <option value="">Sin definir</option>
              <option value="Safety">Safety</option>
              <option value="Target">Target</option>
              <option value="Reach">Reach</option>
            </select>
          </label>
        </div>
      </div>

      {state?.error && <p className="mt-3 text-xs font-semibold" style={{ color: "var(--error)" }}>{state.error}</p>}

      <div className="mt-4 flex justify-end">
        <button type="submit" disabled={pending} className="ximo-glass-btn teal text-xs disabled:opacity-50">
          {pending ? "Agregando…" : "Agregar"}
        </button>
      </div>
    </form>
  );
}
