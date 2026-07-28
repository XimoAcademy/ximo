"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/getUser";
import { zonedTimeToUtc, formatInZone } from "@/lib/scheduling/timezone";
import { notifyAllUsers } from "@/lib/notify/broadcast";

async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) return null;
  const profile = await getProfile();
  if (profile?.role !== "admin") return null;
  return supabase;
}

interface ParsedForm {
  title: string;
  description: string;
  date: string;
  time: string;
  timezone: string;
  discordLink: string;
}

function parseForm(formData: FormData): ParsedForm {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    timezone: String(formData.get("timezone") ?? "").trim(),
    discordLink: String(formData.get("discord_link") ?? "").trim(),
  };
}

function isValid(f: ParsedForm): boolean {
  return Boolean(f.title && f.description && f.date && f.time && f.timezone && f.discordLink);
}

interface PublishedRow {
  title: string;
  starts_at: string;
  timezone: string;
  discord_link: string;
}

/** In-app broadcast sent to every user the moment an announcement goes live. */
async function broadcastPublished(a: PublishedRow): Promise<void> {
  const whenLabel = formatInZone(a.starts_at, a.timezone);
  await notifyAllUsers({
    title: `🔴 Próxima sesión en vivo: ${a.title}`,
    body: `${whenLabel} · Únete por Discord cuando comience.`,
    type: "live_support",
    actionUrl: a.discord_link,
  });
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
      title: f.title,
      description: f.description,
      starts_at: startsAt.toISOString(),
      timezone: f.timezone,
      discord_link: f.discordLink,
      status: publish ? "published" : "draft",
      published_at: publish ? new Date().toISOString() : null,
      created_by: profile?.id ?? null,
    })
    .select("title,starts_at,timezone,discord_link")
    .maybeSingle();

  if (!error && data && publish) {
    await broadcastPublished(data as PublishedRow);
  }

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
    title: f.title,
    description: f.description,
    starts_at: startsAt.toISOString(),
    timezone: f.timezone,
    discord_link: f.discordLink,
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
    .select("title,starts_at,timezone,discord_link")
    .maybeSingle();

  if (!error && data && publish) {
    await broadcastPublished(data as PublishedRow);
  }

  revalidatePath("/app/admin/announcements");
  revalidatePath("/app/live-support");
  redirect("/app/admin/announcements");
}

/** Publishes an existing draft/unpublished row straight from the list view. */
export async function publishAction(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { data, error } = await supabase
    .from("live_announcements")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", id)
    .select("title,starts_at,timezone,discord_link")
    .maybeSingle();

  if (!error && data) {
    await broadcastPublished(data as PublishedRow);
  }

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
    .select("title,description,starts_at,timezone,discord_link")
    .eq("id", id)
    .maybeSingle();
  if (!data) return;

  const profile = await getProfile();
  await supabase.from("live_announcements").insert({
    title: `${data.title} (copia)`,
    description: data.description,
    starts_at: data.starts_at,
    timezone: data.timezone,
    discord_link: data.discord_link,
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
