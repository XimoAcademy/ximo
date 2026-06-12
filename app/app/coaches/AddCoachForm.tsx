"use client";

import { useActionState, useState } from "react";
import { createCoachAction, type ActionResult } from "./actions";
import CoachFields from "./CoachFields";
import type { UniversityOption } from "@/lib/data/coaches";

export default function AddCoachForm({ universities }: { universities: UniversityOption[] }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(createCoachAction, null);

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
        + Agregar coach
      </button>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl p-4 sm:p-5"
      style={{ background: "var(--surface)", border: "1px solid var(--teal-border)" }}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-black" style={{ color: "var(--text)" }}>Nuevo coach</p>
        <button type="button" onClick={() => setOpen(false)} className="text-xs" style={{ color: "var(--text-label)" }}>Cancelar</button>
      </div>
      <CoachFields universities={universities} />
      {state?.error && <p className="mt-3 text-xs font-semibold" style={{ color: "var(--error)" }}>{state.error}</p>}
      <div className="mt-4 flex justify-end">
        <button type="submit" disabled={pending} className="ximo-glass-btn teal text-xs disabled:opacity-50">
          {pending ? "Agregando…" : "Agregar coach"}
        </button>
      </div>
    </form>
  );
}
