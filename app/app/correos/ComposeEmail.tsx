"use client";

import { useActionState, useState } from "react";
import { createEmailAction, type ActionResult } from "./actions";
import { EMAIL_STATUSES, EMAIL_TEMPLATES } from "@/lib/data/email-templates";
import { FieldLabel } from "../components/ui";
import type { CoachOption } from "@/lib/data/emails";
import posthog from "posthog-js";

export default function ComposeEmail({ coaches }: { coaches: CoachOption[] }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(createEmailAction, null);

  // Close and clear on action success, adjusting state during render (the
  // form subtree unmounts when closed; subject/body live here, so clear them).
  const [prevState, setPrevState] = useState<ActionResult | null>(null);
  if (state !== prevState) {
    setPrevState(state);
    if (state?.ok) {
      setSubject("");
      setBody("");
      setOpen(false);
    }
  }

  function applyTemplate(id: string) {
    const t = EMAIL_TEMPLATES.find((x) => x.id === id);
    if (!t) return;
    setSubject(t.subject);
    setBody(t.body);
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="ximo-glass-btn teal text-xs">+ Redactar correo</button>
    );
  }

  function handleSubmit() {
    posthog.capture("coach_email_saved", { has_coach: subject.length > 0 });
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="rounded-2xl p-4 sm:p-5"
      style={{ background: "var(--surface)", border: "1px solid var(--teal-border)" }}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-black" style={{ color: "var(--text)" }}>Nuevo correo</p>
        <button type="button" onClick={() => setOpen(false)} className="text-xs" style={{ color: "var(--text-label)" }}>Cancelar</button>
      </div>

      <div className="space-y-3">
        <label className="block">
          <FieldLabel>Usar plantilla</FieldLabel>
          <select className="ximo-input" defaultValue="" onChange={(e) => { if (e.target.value) applyTemplate(e.target.value); }}>
            <option value="">Empezar en blanco…</option>
            {EMAIL_TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <FieldLabel>Coach</FieldLabel>
            <select name="coach_id" className="ximo-input" defaultValue="">
              <option value="">Sin vincular</option>
              {coaches.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="block">
            <FieldLabel>Estado</FieldLabel>
            <select name="status" className="ximo-input" defaultValue="Borrador">
              {EMAIL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>

        <label className="block">
          <FieldLabel>Asunto</FieldLabel>
          <input name="subject" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Asunto del correo" className="ximo-input" />
        </label>
        <label className="block">
          <FieldLabel>Mensaje</FieldLabel>
          <textarea name="body" rows={10} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Escribe tu correo o elige una plantilla…" className="ximo-input resize-y" style={{ whiteSpace: "pre-wrap" }} />
        </label>
      </div>

      {state?.error && <p className="mt-3 text-xs font-semibold" style={{ color: "var(--error)" }}>{state.error}</p>}

      <div className="mt-4 flex justify-end">
        <button type="submit" disabled={pending} className="ximo-glass-btn teal text-xs disabled:opacity-50">
          {pending ? "Guardando…" : "Guardar correo"}
        </button>
      </div>
    </form>
  );
}
