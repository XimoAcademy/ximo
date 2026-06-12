"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function saveProfileAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const full_name = String(formData.get("full_name") ?? "").trim();
  if (!full_name) return { ok: false, error: "Escribe tu nombre." };

  const gradYearRaw = String(formData.get("graduation_year") ?? "").trim();
  const graduation_year = gradYearRaw ? parseInt(gradYearRaw, 10) : null;

  const { error: pErr } = await supabase
    .from("profiles")
    .update({
      full_name,
      username: String(formData.get("username") ?? "").trim() || null,
      country: String(formData.get("country") ?? "").trim() || null,
      sport: String(formData.get("sport") ?? "").trim() || "Natación",
      graduation_year: Number.isFinite(graduation_year) ? graduation_year : null,
      bio: String(formData.get("bio") ?? "").trim() || null,
    })
    .eq("id", user.id);
  if (pErr) return { ok: false, error: "No se pudo guardar el perfil." };

  const { error: aErr } = await supabase.from("athlete_profiles").upsert(
    {
      user_id: user.id,
      primary_event: String(formData.get("primary_event") ?? "").trim() || null,
      secondary_event: String(formData.get("secondary_event") ?? "").trim() || null,
      target_division: String(formData.get("target_division") ?? "").trim() || null,
      recruiting_goal: String(formData.get("recruiting_goal") ?? "").trim() || null,
      academic_goal: String(formData.get("academic_goal") ?? "").trim() || null,
      gpa: String(formData.get("gpa") ?? "").trim() || null,
      sat_score: String(formData.get("sat_score") ?? "").trim() || null,
      toefl_score: String(formData.get("toefl_score") ?? "").trim() || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (aErr) return { ok: false, error: "No se pudieron guardar los datos atléticos." };

  revalidatePath("/app/perfil");
  revalidatePath("/app");
  return { ok: true };
}

export async function saveAvatarAction(avatarUrl: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesión expirada." };

  const { error } = await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", user.id);
  if (error) return { ok: false, error: "No se pudo guardar el avatar." };
  revalidatePath("/app/perfil");
  revalidatePath("/app");
  return { ok: true };
}
