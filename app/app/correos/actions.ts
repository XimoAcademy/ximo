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

export async function createEmailAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  if (!userId) redirect("/login");

  const subject = String(formData.get("subject") ?? "").trim();
  if (!subject) return { ok: false, error: "Escribe un asunto." };

  const coach_id = String(formData.get("coach_id") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "Borrador").trim() || "Borrador";

  // Resolve the coach's university so the email links to both.
  let university_id: string | null = null;
  if (coach_id) {
    const { data: coach } = await supabase
      .from("coaches")
      .select("university_id")
      .eq("id", coach_id)
      .eq("user_id", userId)
      .maybeSingle();
    university_id = coach?.university_id ?? null;
  }

  const { error } = await supabase.from("emails").insert({
    user_id: userId,
    coach_id,
    university_id,
    subject,
    body: String(formData.get("body") ?? "").trim() || null,
    status,
    sent_at: status === "Enviado" ? new Date().toISOString() : null,
  });

  if (error) return { ok: false, error: "No se pudo guardar el correo." };
  revalidatePath("/app/correos");
  revalidatePath("/app/recruiting");
  return { ok: true };
}

export async function setEmailStatusAction(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return;
  if (!userId) redirect("/login");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;
  await supabase
    .from("emails")
    .update({ status, sent_at: status === "Enviado" ? new Date().toISOString() : undefined })
    .eq("id", id)
    .eq("user_id", userId);
  revalidatePath("/app/correos");
}

export async function deleteEmailAction(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return;
  if (!userId) redirect("/login");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabase.from("emails").delete().eq("id", id).eq("user_id", userId);
  revalidatePath("/app/correos");
}
