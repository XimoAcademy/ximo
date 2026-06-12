"use client";

import { useActionState, useState } from "react";
import { createTaskAction, type ActionResult } from "./actions";

const MODULES = ["Recruiting", "Universidades", "Coaches", "Documentos", "Correos", "Progreso", "Cursos", "General"];

export default function AddTaskForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    createTaskAction,
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
        + Nueva tarea
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
        <p className="text-sm font-black" style={{ color: "var(--text)" }}>Nueva tarea</p>
        <button type="button" onClick={() => setOpen(false)} className="text-xs" style={{ color: "var(--text-label)" }}>
          Cancelar
        </button>
      </div>

      <div className="space-y-3">
        <input
          name="title"
          required
          autoFocus
          placeholder="¿Qué necesitas hacer?"
          className="ximo-input w-full"
        />
        <textarea
          name="description"
          rows={2}
          placeholder="Detalles (opcional)"
          className="ximo-input w-full resize-none"
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Módulo</span>
            <select name="module" className="ximo-input w-full" defaultValue="General">
              {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Prioridad</span>
            <select name="priority" className="ximo-input w-full" defaultValue="media">
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Fecha límite</span>
            <input type="date" name="due_date" className="ximo-input w-full" />
          </label>
        </div>
      </div>

      {state?.error && (
        <p className="mt-3 text-xs font-semibold" style={{ color: "var(--error)" }}>{state.error}</p>
      )}

      <div className="mt-4 flex justify-end">
        <button type="submit" disabled={pending} className="ximo-glass-btn teal text-xs disabled:opacity-50">
          {pending ? "Creando…" : "Crear tarea"}
        </button>
      </div>
    </form>
  );
}
