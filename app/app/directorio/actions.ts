"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Find the user's university by name, or create it. Returns its id (or null). */
async function findOrCreateUniversity(
  supabase: SupabaseClient,
  userId: string,
  input: { name: string; division?: string | null; website?: string | null }
): Promise<string | null> {
  const { data: existing } = await supabase
    .from("universities")
    .select("id")
    .eq("user_id", userId)
    .eq("name", input.name)
    .maybeSingle();
  if (existing) return existing.id as string;

  const { data: created } = await supabase
    .from("universities")
    .insert({
      user_id: userId,
      name: input.name,
      division: input.division ?? null,
      website: input.website ?? null,
      recruiting_stage: "Investigando",
      priority: "Media",
    })
    .select("id")
    .single();
  return (created?.id as string) ?? null;
}

/**
 * Adds a directory program to the signed-in athlete's `universities` list
 * (deduped by name). Connects the shared NCAA directory to each athlete's tracker.
 */
export async function addToMyUniversitiesAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  if (!supabase) redirect("/app/directorio");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!name) redirect("/app/directorio");

  await findOrCreateUniversity(supabase, user.id, {
    name,
    division: String(formData.get("division") ?? "") || null,
    website: String(formData.get("website") ?? "") || null,
  });

  revalidatePath("/app/universidades");
  revalidatePath("/app/recruiting");
  redirect(`/app/directorio/${slug}?added=1`);
}

/**
 * Imports a directory coach into the athlete's CRM. Ensures the program is in
 * the athlete's universities list (creating it if needed) and links the coach
 * to it — so one click builds a connected recruiting record. Deduped by name.
 */
export async function addCoachToMyCrmAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  if (!supabase) redirect("/app/directorio");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const coachName = String(formData.get("coach_name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const programName = String(formData.get("program_name") ?? "").trim();
  if (!coachName || !slug) redirect("/app/directorio");

  const universityId = programName
    ? await findOrCreateUniversity(supabase, user.id, {
        name: programName,
        division: String(formData.get("division") ?? "") || null,
        website: String(formData.get("website") ?? "") || null,
      })
    : null;

  const { data: existing } = await supabase
    .from("coaches")
    .select("id")
    .eq("user_id", user.id)
    .eq("name", coachName)
    .maybeSingle();

  if (!existing) {
    await supabase.from("coaches").insert({
      user_id: user.id,
      university_id: universityId,
      name: coachName,
      role: String(formData.get("title") ?? "") || null,
      email: String(formData.get("email") ?? "") || null,
      status: "Sin contactar",
    });
  }

  revalidatePath("/app/coaches");
  revalidatePath("/app/universidades");
  revalidatePath("/app/recruiting");
  redirect(`/app/directorio/${slug}?coach=${existing ? "exists" : "added"}`);
}
