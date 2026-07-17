"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { validateDob } from "@/lib/education/fields";
import {
  TERMS,
  GRAD_STATUSES,
  GAP_STATUSES,
  PRIOR_ENROLLMENT_TYPES,
  RECRUITING_STATUSES,
} from "@/lib/education/fields";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

/** Return value if it's an allowed key, else null (never store junk). */
function oneOf(raw: FormDataEntryValue | null, allowed: readonly string[]): string | null {
  const v = String(raw ?? "").trim();
  return v && allowed.includes(v) ? v : null;
}

/** Parse a bounded integer year, else null. */
function yearOrNull(raw: FormDataEntryValue | null, min = 1900, max = 2100): number | null {
  const s = String(raw ?? "").trim();
  if (!/^\d{4}$/.test(s)) return null;
  const n = Number(s);
  return n >= min && n <= max ? n : null;
}

/** Parse a small bounded integer, else null. */
function intOrNull(raw: FormDataEntryValue | null, min: number, max: number): number | null {
  const s = String(raw ?? "").trim();
  if (!/^\d+$/.test(s)) return null;
  const n = Number(s);
  return n >= min && n <= max ? n : null;
}

/** Tri-state boolean from a form value: "yes"/"no"/"" → true/false/null. */
function triBool(raw: FormDataEntryValue | null): boolean | null {
  const v = String(raw ?? "").trim();
  if (v === "yes" || v === "true") return true;
  if (v === "no" || v === "false") return false;
  return null;
}

/** Uppercase ISO alpha-2 or null. */
function isoOrNull(raw: FormDataEntryValue | null): string | null {
  const v = String(raw ?? "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(v) ? v : null;
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

  // Date of birth: date-only, timezone-safe, no future dates. Empty is allowed
  // (existing accounts complete it later — never invent a value).
  const dobResult = validateDob(String(formData.get("date_of_birth") ?? ""));
  if (!dobResult.ok) {
    return { ok: false, error: "La fecha de nacimiento no es válida." };
  }

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
      // ── International + education timeline (migration 011) ──
      date_of_birth: dobResult.value, // string | null
      nationality_code: isoOrNull(formData.get("nationality_code")),
      education_country_code: isoOrNull(formData.get("education_country_code")),
      hs_graduation_term: oneOf(formData.get("hs_graduation_term"), TERMS),
      hs_graduation_month: intOrNull(formData.get("hs_graduation_month"), 1, 12),
      hs_graduation_status: oneOf(formData.get("hs_graduation_status"), GRAD_STATUSES),
      gap_year_status: oneOf(formData.get("gap_year_status"), GAP_STATUSES),
      gap_year_count: intOrNull(formData.get("gap_year_count"), 0, 10),
      gap_full_time_enroll: triBool(formData.get("gap_full_time_enroll")),
      gap_competition: triBool(formData.get("gap_competition")),
      intended_college_year: yearOrNull(formData.get("intended_college_year")),
      intended_college_term: oneOf(formData.get("intended_college_term"), TERMS),
      first_full_time_enrollment: triBool(formData.get("first_full_time_enrollment")),
      prior_enrollment_type: oneOf(formData.get("prior_enrollment_type"), PRIOR_ENROLLMENT_TYPES),
      first_enrollment_year: yearOrNull(formData.get("first_enrollment_year")),
      first_enrollment_term: oneOf(formData.get("first_enrollment_term"), TERMS),
      recruiting_status: oneOf(formData.get("recruiting_status"), RECRUITING_STATUSES),
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
