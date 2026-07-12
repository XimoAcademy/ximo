"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { updateUniversityAction, deleteUniversityAction, type ActionResult } from "../actions";
import { RECRUITING_STAGES, PRIORITIES } from "@/lib/data/recruiting-constants";
import { FieldLabel } from "../../components/ui";
import type { UniversityRow } from "@/lib/data/universities";
import posthog from "posthog-js";

export default function EditUniversityForm({ uni }: { uni: UniversityRow }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    updateUniversityAction,
    null
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const fd = new FormData(e.currentTarget);
    posthog.capture("recruiting_stage_updated", {
      recruiting_stage: String(fd.get("recruiting_stage") ?? ""),
      priority: String(fd.get("priority") ?? ""),
    });
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="id" value={uni.id} />

      <label className="block">
        <FieldLabel>Nombre</FieldLabel>
        <input name="name" required defaultValue={uni.name} className="ximo-input" />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block"><FieldLabel>División</FieldLabel><input name="division" defaultValue={uni.division ?? ""} className="ximo-input" /></label>
        <label className="block"><FieldLabel>Ubicación</FieldLabel><input name="location" defaultValue={uni.location ?? ""} className="ximo-input" /></label>
      </div>

      <label className="block"><FieldLabel>Sitio web</FieldLabel><input name="website" type="url" defaultValue={uni.website ?? ""} className="ximo-input" /></label>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <FieldLabel>Etapa</FieldLabel>
          <select name="recruiting_stage" className="ximo-input" defaultValue={uni.recruiting_stage ?? "Investigando"}>
            {RECRUITING_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="block">
          <FieldLabel>Prioridad</FieldLabel>
          <select name="priority" className="ximo-input" defaultValue={uni.priority ?? "Media"}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <label className="block">
          <FieldLabel>Tipo</FieldLabel>
          <select name="fit_type" className="ximo-input" defaultValue={uni.fit_type ?? ""}>
            <option value="">Sin definir</option>
            <option value="Safety">Safety</option>
            <option value="Target">Target</option>
            <option value="Reach">Reach</option>
          </select>
        </label>
      </div>

      <label className="block"><FieldLabel>Claridad de beca</FieldLabel><input name="scholarship_clarity" defaultValue={uni.scholarship_clarity ?? ""} placeholder="Ej. Beca atlética parcial confirmada" className="ximo-input" /></label>
      <label className="block"><FieldLabel>Notas de costo</FieldLabel><input name="cost_notes" defaultValue={uni.cost_notes ?? ""} placeholder="Ej. Costo anual estimado ~$28k USD" className="ximo-input" /></label>
      <label className="block"><FieldLabel>Notas</FieldLabel><textarea name="notes" rows={4} defaultValue={uni.notes ?? ""} className="ximo-input resize-none" placeholder="Conversaciones, fechas clave y pendientes con esta universidad…" /></label>

      {state?.ok && <p className="text-xs font-semibold" style={{ color: "var(--success)" }}>Cambios guardados.</p>}
      {state?.error && <p className="text-xs font-semibold" style={{ color: "var(--error)" }}>{state.error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button type="submit" disabled={pending} className="ximo-glass-btn teal text-xs disabled:opacity-50">
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={async () => {
            if (!confirm("¿Eliminar esta universidad de tu lista?")) return;
            const fd = new FormData();
            fd.set("id", uni.id);
            await deleteUniversityAction(fd);
            router.push("/app/universidades");
          }}
          className="ximo-text-btn"
        >
          Eliminar universidad
        </button>
      </div>
    </form>
  );
}
