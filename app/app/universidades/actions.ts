"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

async function requireUser() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, userId: null } as const;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, userId: user?.id ?? null } as const;
}

export async function createUniversityAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  if (!userId) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Escribe el nombre de la universidad." };

  const { error } = await supabase.from("universities").insert({
    user_id: userId,
    name,
    division: String(formData.get("division") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
    website: String(formData.get("website") ?? "").trim() || null,
    fit_type: String(formData.get("fit_type") ?? "").trim() || null,
    priority: String(formData.get("priority") ?? "Media").trim() || "Media",
    recruiting_stage: String(formData.get("recruiting_stage") ?? "Investigando").trim() || "Investigando",
    scholarship_clarity: String(formData.get("scholarship_clarity") ?? "").trim() || null,
  });

  if (error) return { ok: false, error: "No se pudo agregar la universidad." };
  revalidatePath("/app/universidades");
  revalidatePath("/app/recruiting");
  revalidatePath("/app");
  return { ok: true };
}

export async function updateUniversityAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  if (!userId) redirect("/login");

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return { ok: false, error: "Falta el nombre." };

  const { error } = await supabase
    .from("universities")
    .update({
      name,
      division: String(formData.get("division") ?? "").trim() || null,
      location: String(formData.get("location") ?? "").trim() || null,
      website: String(formData.get("website") ?? "").trim() || null,
      fit_type: String(formData.get("fit_type") ?? "").trim() || null,
      priority: String(formData.get("priority") ?? "Media").trim() || "Media",
      recruiting_stage: String(formData.get("recruiting_stage") ?? "Investigando").trim() || "Investigando",
      scholarship_clarity: String(formData.get("scholarship_clarity") ?? "").trim() || null,
      cost_notes: String(formData.get("cost_notes") ?? "").trim() || null,
      notes: String(formData.get("notes") ?? "").trim() || null,
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return { ok: false, error: "No se pudo guardar." };
  revalidatePath("/app/universidades");
  revalidatePath(`/app/universidades/${id}`);
  revalidatePath("/app/recruiting");
  return { ok: true };
}

export async function deleteUniversityAction(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return;
  if (!userId) redirect("/login");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabase.from("universities").delete().eq("id", id).eq("user_id", userId);
  revalidatePath("/app/universidades");
  revalidatePath("/app/recruiting");
  revalidatePath("/app");
  redirect("/app/universidades");
}
