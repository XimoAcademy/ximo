"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, userId: null } as const;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, userId: user?.id ?? null } as const;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function createTaskAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  if (!userId) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { ok: false, error: "Escribe un título para la tarea." };

  const description = String(formData.get("description") ?? "").trim() || null;
  const taskModule = String(formData.get("module") ?? "").trim() || null;
  const priority = String(formData.get("priority") ?? "media").trim() || "media";
  const due_date = String(formData.get("due_date") ?? "").trim() || null;

  const { error } = await supabase.from("tasks").insert({
    user_id: userId,
    title,
    description,
    module: taskModule,
    priority,
    status: "pendiente",
    due_date,
  });

  if (error) return { ok: false, error: "No se pudo crear la tarea." };
  revalidatePath("/app/tareas");
  revalidatePath("/app");
  return { ok: true };
}

export async function setTaskStatusAction(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return;
  if (!userId) redirect("/login");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;

  await supabase.from("tasks").update({ status }).eq("id", id).eq("user_id", userId);
  revalidatePath("/app/tareas");
  revalidatePath("/app");
}

export async function deleteTaskAction(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return;
  if (!userId) redirect("/login");

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("tasks").delete().eq("id", id).eq("user_id", userId);
  revalidatePath("/app/tareas");
  revalidatePath("/app");
}

export async function updateTaskAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  if (!userId) redirect("/login");

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!id || !title) return { ok: false, error: "Falta el título." };

  const description = String(formData.get("description") ?? "").trim() || null;
  const taskModule = String(formData.get("module") ?? "").trim() || null;
  const priority = String(formData.get("priority") ?? "media").trim() || "media";
  const status = String(formData.get("status") ?? "pendiente").trim() || "pendiente";
  const due_date = String(formData.get("due_date") ?? "").trim() || null;

  const { error } = await supabase
    .from("tasks")
    .update({ title, description, module: taskModule, priority, status, due_date })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return { ok: false, error: "No se pudo guardar." };
  revalidatePath("/app/tareas");
  revalidatePath(`/app/tareas/${id}`);
  revalidatePath("/app");
  return { ok: true };
}
