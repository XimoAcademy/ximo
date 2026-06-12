"use client";

import { COACH_STATUSES } from "@/lib/data/recruiting-constants";
import type { CoachRow, UniversityOption } from "@/lib/data/coaches";

function toDateInput(ts: string | null | undefined): string {
  if (!ts) return "";
  return ts.slice(0, 10);
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>{children}</span>
);

/** Shared coach form fields, used by both the add and edit forms. */
export default function CoachFields({
  coach,
  universities,
}: {
  coach?: CoachRow;
  universities: UniversityOption[];
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block"><Label>Nombre</Label><input name="name" required defaultValue={coach?.name ?? ""} placeholder="Nombre del coach" className="ximo-input" /></label>
        <label className="block"><Label>Cargo</Label><input name="role" defaultValue={coach?.role ?? ""} placeholder="Ej. Head Coach" className="ximo-input" /></label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block"><Label>Correo</Label><input name="email" type="email" defaultValue={coach?.email ?? ""} placeholder="coach@universidad.edu" className="ximo-input" /></label>
        <label className="block"><Label>Teléfono</Label><input name="phone" defaultValue={coach?.phone ?? ""} placeholder="Opcional" className="ximo-input" /></label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <Label>Universidad</Label>
          <select name="university_id" className="ximo-input" defaultValue={coach?.university_id ?? ""}>
            <option value="">Sin vincular</option>
            {universities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </label>
        <label className="block">
          <Label>Estado</Label>
          <select name="status" className="ximo-input" defaultValue={coach?.status ?? "Sin contactar"}>
            {COACH_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block"><Label>Último contacto</Label><input type="date" name="last_contact_at" defaultValue={toDateInput(coach?.last_contact_at)} className="ximo-input" /></label>
        <label className="block"><Label>Próximo follow-up</Label><input type="date" name="next_follow_up_at" defaultValue={toDateInput(coach?.next_follow_up_at)} className="ximo-input" /></label>
      </div>
      <label className="block"><Label>Notas</Label><textarea name="notes" rows={3} defaultValue={coach?.notes ?? ""} placeholder="Contexto, próximos pasos, claridad de beca…" className="ximo-input resize-none" /></label>
    </div>
  );
}
