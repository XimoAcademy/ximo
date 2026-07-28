"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
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

/**
 * Un directo en el pasado no tiene sentido, y publicarlo avisaría a TODOS los
 * atletas de una fecha ya vencida (basta con equivocarse de año al teclear).
 * El input tiene `min` en el navegador; esto es la red de seguridad real.
 */
function esFutura(startsAt: Date): boolean {
  return startsAt.getTime() > Date.now();
}

/**
 * Los recordatorios ya enviados se registran por (anuncio, ventana). Si el
 * admin mueve la fecha, esas marcas dejan de tener sentido: sin borrarlas, un
 * directo movido de mañana a la semana que viene nunca volvería a avisar con
 * 24 h de anticipación. Requiere service-role: la tabla no tiene policy de
 * escritura para nadie (solo la lee el admin).
 */
async function limpiarRecordatorios(announcementId: string): Promise<void> {
  const svc = createServiceRoleClient();
  if (!svc) return;
  await svc.from("announcement_reminders_sent").delete().eq("announcement_id", announcementId);
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
  if (!esFutura(startsAt)) redirect("/app/admin/announcements/new?error=pasado");
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
  if (!esFutura(startsAt)) redirect(`/app/admin/announcements/${id}/edit?error=pasado`);

  const { data: previo } = await supabase
    .from("live_announcements")
    .select("starts_at")
    .eq("id", id)
    .maybeSingle();
  const cambioLaFecha = Boolean(previo) && previo!.starts_at !== startsAt.toISOString();

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

  if (!error && cambioLaFecha) await limpiarRecordatorios(id);
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

  // No publicar un directo ya vencido: avisaría a todos de una fecha pasada.
  const { data: previo } = await supabase
    .from("live_announcements")
    .select("starts_at")
    .eq("id", id)
    .maybeSingle();
  if (!previo || !esFutura(new Date(previo.starts_at))) {
    redirect("/app/admin/announcements?error=pasado");
  }

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
