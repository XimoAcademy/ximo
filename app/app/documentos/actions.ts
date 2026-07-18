"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/getUser";
import { STANDARD_DOCS } from "@/lib/data/documents";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function createDocumentAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  if (!userId) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { ok: false, error: "Escribe el nombre del documento." };

  const { error } = await supabase.from("documents").insert({
    user_id: userId,
    title,
    type: String(formData.get("type") ?? "media").trim() || "media",
    status: String(formData.get("status") ?? "pendiente").trim() || "pendiente",
    notes: String(formData.get("notes") ?? "").trim() || null,
  });
  if (error) return { ok: false, error: "No se pudo crear el documento." };
  revalidatePath("/app/documentos");
  revalidatePath("/app");
  return { ok: true };
}

export async function updateDocumentAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  if (!userId) redirect("/login");

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!id || !title) return { ok: false, error: "Falta el nombre." };

  const { error } = await supabase
    .from("documents")
    .update({
      title,
      type: String(formData.get("type") ?? "media").trim() || "media",
      status: String(formData.get("status") ?? "pendiente").trim() || "pendiente",
      notes: String(formData.get("notes") ?? "").trim() || null,
    })
    .eq("id", id)
    .eq("user_id", userId);
  if (error) return { ok: false, error: "No se pudo guardar." };
  revalidatePath("/app/documentos");
  revalidatePath(`/app/documentos/${id}`);
  revalidatePath("/app");
  return { ok: true };
}

export async function setDocumentStatusAction(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return;
  if (!userId) redirect("/login");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;
  await supabase.from("documents").update({ status }).eq("id", id).eq("user_id", userId);
  revalidatePath("/app/documentos");
  revalidatePath("/app");
}

export async function deleteDocumentAction(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return;
  if (!userId) redirect("/login");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  // Remove the stored file too, if any.
  const { data: doc } = await supabase
    .from("documents")
    .select("file_url")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (doc?.file_url) {
    await supabase.storage.from("documents").remove([doc.file_url]);
  }

  await supabase.from("documents").delete().eq("id", id).eq("user_id", userId);
  revalidatePath("/app/documentos");
  revalidatePath("/app");
}

/** Save the storage path after a successful client-side upload. */
export async function attachDocumentFileAction(id: string, storagePath: string): Promise<ActionResult> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  if (!userId) return { ok: false, error: "Sesión expirada." };

  const { error } = await supabase
    .from("documents")
    .update({ file_url: storagePath, status: "listo" })
    .eq("id", id)
    .eq("user_id", userId);
  if (error) return { ok: false, error: "No se pudo guardar el archivo." };
  revalidatePath(`/app/documentos/${id}`);
  revalidatePath("/app/documentos");
  revalidatePath("/app");
  return { ok: true };
}

/** Create a short-lived signed URL to view/download a private document file. */
export async function getDocumentDownloadUrl(id: string): Promise<string | null> {
  const { supabase, userId } = await requireUser();
  if (!supabase || !userId) return null;
  const { data: doc } = await supabase
    .from("documents")
    .select("file_url")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (!doc?.file_url) return null;
  const { data } = await supabase.storage.from("documents").createSignedUrl(doc.file_url, 60 * 10);
  return data?.signedUrl ?? null;
}

/** Seed the standard recruiting document checklist for a fresh athlete. */
export async function seedDocumentChecklistAction(): Promise<void> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return;
  if (!userId) redirect("/login");

  const { count } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  if ((count ?? 0) > 0) {
    revalidatePath("/app/documentos");
    return;
  }

  await supabase.from("documents").insert(
    STANDARD_DOCS.map((d) => ({
      user_id: userId,
      title: d.title,
      type: d.type,
      status: "pendiente",
      notes: d.notes,
    }))
  );
  revalidatePath("/app/documentos");
  revalidatePath("/app");
}
