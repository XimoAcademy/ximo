"use client";

import { useActionState } from "react";
import { saveProfileAction, type ActionResult } from "./actions";
import type { ProfileRow, AthleteRow } from "@/lib/data/profile";

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>{children}</span>
);

export default function ProfileForm({ profile, athlete }: { profile: ProfileRow | null; athlete: AthleteRow | null }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(saveProfileAction, null);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>Información personal</p>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block"><Label>Nombre completo</Label><input name="full_name" required defaultValue={profile?.full_name ?? ""} className="ximo-input" /></label>
            <label className="block"><Label>Usuario</Label><input name="username" defaultValue={profile?.username ?? ""} placeholder="@usuario" className="ximo-input" /></label>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block"><Label>País</Label><input name="country" defaultValue={profile?.country ?? "México"} className="ximo-input" /></label>
            <label className="block"><Label>Deporte</Label><input name="sport" defaultValue={profile?.sport ?? "Natación"} className="ximo-input" /></label>
            <label className="block"><Label>Año de graduación</Label><input name="graduation_year" type="number" min={2024} max={2035} defaultValue={profile?.graduation_year ?? ""} placeholder="2027" className="ximo-input" /></label>
          </div>
          <label className="block"><Label>Bio</Label><textarea name="bio" rows={3} defaultValue={profile?.bio ?? ""} placeholder="Cuéntale a los coaches quién eres en una frase." className="ximo-input resize-none" /></label>
        </div>
      </div>

      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>Información deportiva</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block"><Label>Prueba principal</Label><input name="primary_event" defaultValue={athlete?.primary_event ?? ""} placeholder="50 libre" className="ximo-input" /></label>
          <label className="block"><Label>Prueba secundaria</Label><input name="secondary_event" defaultValue={athlete?.secondary_event ?? ""} placeholder="100 mariposa" className="ximo-input" /></label>
          <label className="block"><Label>División objetivo</Label>
            <select name="target_division" className="ximo-input" defaultValue={athlete?.target_division ?? ""}>
              <option value="">Sin definir</option>
              <option value="NCAA D1">NCAA D1</option>
              <option value="NCAA D2">NCAA D2</option>
              <option value="NCAA D3">NCAA D3</option>
              <option value="NAIA">NAIA</option>
              <option value="NJCAA">NJCAA</option>
            </select>
          </label>
          <label className="block"><Label>Meta de recruiting</Label><input name="recruiting_goal" defaultValue={athlete?.recruiting_goal ?? ""} placeholder="College athlete con beca" className="ximo-input" /></label>
        </div>
      </div>

      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>Información académica</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block"><Label>GPA</Label><input name="gpa" defaultValue={athlete?.gpa ?? ""} placeholder="3.8" className="ximo-input" /></label>
          <label className="block"><Label>SAT</Label><input name="sat_score" defaultValue={athlete?.sat_score ?? ""} placeholder="1340" className="ximo-input" /></label>
          <label className="block"><Label>TOEFL</Label><input name="toefl_score" defaultValue={athlete?.toefl_score ?? ""} placeholder="90" className="ximo-input" /></label>
        </div>
        <label className="mt-3 block"><Label>Meta académica</Label><input name="academic_goal" defaultValue={athlete?.academic_goal ?? ""} placeholder="Estudiar ingeniería o negocios" className="ximo-input" /></label>
      </div>

      {state?.ok && <p className="text-xs font-semibold" style={{ color: "var(--success)" }}>Perfil guardado.</p>}
      {state?.error && <p className="text-xs font-semibold" style={{ color: "var(--error)" }}>{state.error}</p>}

      <button type="submit" disabled={pending} className="ximo-glass-btn teal text-xs disabled:opacity-50">
        {pending ? "Guardando…" : "Guardar perfil"}
      </button>
    </form>
  );
}
