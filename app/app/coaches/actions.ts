"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/getUser";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

function fields(formData: FormData) {
  const toTs = (v: string) => (v ? new Date(v + "T00:00:00").toISOString() : null);
  return {
    name: String(formData.get("name") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    status: String(formData.get("status") ?? "Sin contactar").trim() || "Sin contactar",
    university_id: String(formData.get("university_id") ?? "").trim() || null,
    last_contact_at: toTs(String(formData.get("last_contact_at") ?? "").trim()),
    next_follow_up_at: toTs(String(formData.get("next_follow_up_at") ?? "").trim()),
    notes: String(formData.get("notes") ?? "").trim() || null,
  };
}

export async function createCoachAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  if (!userId) redirect("/login");

  const f = fields(formData);
  if (!f.name) return { ok: false, error: "Escribe el nombre del coach." };

  const { error } = await supabase.from("coaches").insert({ user_id: userId, ...f });
  if (error) return { ok: false, error: "No se pudo agregar el coach." };
  revalidatePath("/app/coaches");
  revalidatePath("/app/recruiting");
  revalidatePath("/app");
  return { ok: true };
}

export async function updateCoachAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  if (!userId) redirect("/login");

  const id = String(formData.get("id") ?? "");
  const f = fields(formData);
  if (!id || !f.name) return { ok: false, error: "Falta el nombre." };

  const { error } = await supabase.from("coaches").update(f).eq("id", id).eq("user_id", userId);
  if (error) return { ok: false, error: "No se pudo guardar." };
  revalidatePath("/app/coaches");
  revalidatePath(`/app/coaches/${id}`);
  revalidatePath("/app/recruiting");
  return { ok: true };
}

export async function deleteCoachAction(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return;
  if (!userId) redirect("/login");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabase.from("coaches").delete().eq("id", id).eq("user_id", userId);
  revalidatePath("/app/coaches");
  revalidatePath("/app/recruiting");
  revalidatePath("/app");
  redirect("/app/coaches");
}
