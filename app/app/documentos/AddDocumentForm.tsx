"use client";

import { useActionState, useState } from "react";
import { createDocumentAction, type ActionResult } from "./actions";

export default function AddDocumentForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(createDocumentAction, null);

  // Close on action success, adjusting state during render (the form subtree
  // unmounts when closed, so its fields are fresh on the next open).
  const [prevState, setPrevState] = useState<ActionResult | null>(null);
  if (state !== prevState) {
    setPrevState(state);
    if (state?.ok) setOpen(false);
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="ximo-glass-btn teal text-xs">+ Agregar documento</button>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl p-4 sm:p-5"
      style={{ background: "var(--surface)", border: "1px solid var(--teal-border)" }}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-black" style={{ color: "var(--text)" }}>Nuevo documento</p>
        <button type="button" onClick={() => setOpen(false)} className="text-xs" style={{ color: "var(--text-label)" }}>Cancelar</button>
      </div>
      <div className="space-y-3">
        <input name="title" required autoFocus placeholder="Nombre del documento" className="ximo-input" />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Importancia</span>
            <select name="type" className="ximo-input" defaultValue="media">
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Estado</span>
            <select name="status" className="ximo-input" defaultValue="pendiente">
              <option value="pendiente">Pendiente</option>
              <option value="revisar">Revisar</option>
              <option value="listo">Listo</option>
            </select>
          </label>
        </div>
        <textarea name="notes" rows={2} placeholder="Nota (opcional)" className="ximo-input resize-none" />
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
