"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/getUser";
import { zonedTimeToUtc, formatInZone } from "@/lib/scheduling/timezone";
import { notifyAllUsers } from "@/lib/notify/broadcast";
import { avisoPublicado } from "@/lib/announcements/text";

/**
 * Segunda barrera de admin. La primera es app/app/admin/layout.tsx y la
 * tercera son las policies RLS (insert/update/delete exigen is_admin()), de
 * modo que ni saltándose la interfaz se puede tocar un anuncio.
 */
async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) return null;
  const profile = await getProfile();
  if (profile?.role !== "admin") return null;
  return supabase;
}

interface ParsedForm {
  date: string;
  time: string;
  timezone: string;
}

/** El admin solo elige cuándo: el texto del aviso es fijo. */
function parseForm(formData: FormData): ParsedForm {
  return {
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    timezone: String(formData.get("timezone") ?? "").trim(),
  };
}

function isValid(f: ParsedForm): boolean {
  return Boolean(f.date && f.time && f.timezone);
}

/** Aviso a todos los atletas en el momento de publicar. */
async function broadcastPublished(a: { starts_at: string; timezone: string }): Promise<void> {
  const texto = avisoPublicado(formatInZone(a.starts_at, a.timezone));
  await notifyAllUsers({ ...texto, type: "live_support" });
}

export async function createAction(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) return;

  const f = parseForm(formData);
  if (!isValid(f)) return;
  const publish = String(formData.get("intent") ?? "") === "publish";
  const startsAt = zonedTimeToUtc(f.date, f.time, f.timezone);
  const profile = await getProfile();

  const { data, error } = await supabase
    .from("live_announcements")
    .insert({
      starts_at: startsAt.toISOString(),
      timezone: f.timezone,
      status: publish ? "published" : "draft",
      published_at: publish ? new Date().toISOString() : null,
      created_by: profile?.id ?? null,
    })
    .select("starts_at,timezone")
    .maybeSingle();

  if (!error && data && publish) await broadcastPublished(data);

  revalidatePath("/app/admin/announcements");
  revalidatePath("/app/live-support");
  redirect("/app/admin/announcements");
}

export async function updateAction(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  const f = parseForm(formData);
  if (!id || !isValid(f)) return;
  const publish = String(formData.get("intent") ?? "") === "publish";
  const startsAt = zonedTimeToUtc(f.date, f.time, f.timezone);

  const updates: Record<string, unknown> = {
    starts_at: startsAt.toISOString(),
    timezone: f.timezone,
    updated_at: new Date().toISOString(),
  };
  if (publish) {
    updates.status = "published";
    updates.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("live_announcements")
    .update(updates)
    .eq("id", id)
    .select("starts_at,timezone")
    .maybeSingle();

  if (!error && data && publish) await broadcastPublished(data);

  revalidatePath("/app/admin/announcements");
  revalidatePath("/app/live-support");
  redirect("/app/admin/announcements");
}

/** Publica un borrador directamente desde el listado. */
export async function publishAction(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { data, error } = await supabase
    .from("live_announcements")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", id)
    .select("starts_at,timezone")
    .maybeSingle();

  if (!error && data) await broadcastPublished(data);

  revalidatePath("/app/admin/announcements");
  revalidatePath("/app/live-support");
}

export async function unpublishAction(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("live_announcements").update({ status: "unpublished" }).eq("id", id);

  revalidatePath("/app/admin/announcements");
  revalidatePath("/app/live-support");
}

export async function duplicateAction(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { data } = await supabase
    .from("live_announcements")
    .select("starts_at,timezone")
    .eq("id", id)
    .maybeSingle();
  if (!data) return;

  const profile = await getProfile();
  await supabase.from("live_announcements").insert({
    starts_at: data.starts_at,
    timezone: data.timezone,
    status: "draft",
    created_by: profile?.id ?? null,
  });

  revalidatePath("/app/admin/announcements");
}

export async function deleteAction(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("live_announcements").delete().eq("id", id);

  revalidatePath("/app/admin/announcements");
  revalidatePath("/app/live-support");
}
