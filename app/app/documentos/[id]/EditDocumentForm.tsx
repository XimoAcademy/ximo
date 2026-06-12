"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { updateDocumentAction, deleteDocumentAction, type ActionResult } from "../actions";
import { FieldLabel } from "../../components/ui";
import type { DocumentRow } from "@/lib/data/documents";

export default function EditDocumentForm({ doc }: { doc: DocumentRow }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(updateDocumentAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={doc.id} />
      <label className="block"><FieldLabel>Nombre</FieldLabel><input name="title" required defaultValue={doc.title} className="ximo-input" /></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <FieldLabel>Importancia</FieldLabel>
          <select name="type" className="ximo-input" defaultValue={doc.type ?? "media"}>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </label>
        <label className="block">
          <FieldLabel>Estado</FieldLabel>
          <select name="status" className="ximo-input" defaultValue={doc.status ?? "pendiente"}>
            <option value="pendiente">Pendiente</option>
            <option value="revisar">Revisar</option>
            <option value="listo">Listo</option>
          </select>
        </label>
      </div>
      <label className="block"><FieldLabel>Notas</FieldLabel><textarea name="notes" rows={3} defaultValue={doc.notes ?? ""} className="ximo-input resize-none" placeholder="Plazos, detalles o recordatorios sobre este documento…" /></label>

      {state?.ok && <p className="text-xs font-semibold" style={{ color: "var(--success)" }}>Cambios guardados.</p>}
      {state?.error && <p className="text-xs font-semibold" style={{ color: "var(--error)" }}>{state.error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button type="submit" disabled={pending} className="ximo-glass-btn teal text-xs disabled:opacity-50">
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={async () => {
            if (!confirm("¿Eliminar este documento y su archivo?")) return;
            const fd = new FormData();
            fd.set("id", doc.id);
            await deleteDocumentAction(fd);
            router.push("/app/documentos");
          }}
          className="ximo-text-btn"
        >
          Eliminar documento
        </button>
      </div>
    </form>
  );
}
