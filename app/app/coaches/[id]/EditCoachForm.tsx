"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { updateCoachAction, deleteCoachAction, type ActionResult } from "../actions";
import CoachFields from "../CoachFields";
import type { CoachRow, UniversityOption } from "@/lib/data/coaches";

export default function EditCoachForm({
  coach,
  universities,
}: {
  coach: CoachRow;
  universities: UniversityOption[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(updateCoachAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={coach.id} />
      <CoachFields coach={coach} universities={universities} />

      {state?.ok && <p className="text-xs font-semibold" style={{ color: "var(--success)" }}>Cambios guardados.</p>}
      {state?.error && <p className="text-xs font-semibold" style={{ color: "var(--error)" }}>{state.error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button type="submit" disabled={pending} className="ximo-glass-btn teal text-xs disabled:opacity-50">
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={async () => {
            if (!confirm("¿Eliminar este coach?")) return;
            const fd = new FormData();
            fd.set("id", coach.id);
            await deleteCoachAction(fd);
            router.push("/app/coaches");
          }}
          className="ximo-text-btn"
        >
          Eliminar coach
        </button>
      </div>
    </form>
  );
}
