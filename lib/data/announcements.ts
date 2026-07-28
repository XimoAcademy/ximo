import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/getUser";

export type AnnouncementStatus = "draft" | "published" | "unpublished";

/**
 * Un anuncio es solo un momento programado: el texto del aviso es fijo y
 * vive en lib/announcements/text.ts (ver migración 016).
 */
export interface AnnouncementRow {
  id: string;
  starts_at: string;
  timezone: string;
  status: AnnouncementStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const COLUMNS = "id,starts_at,timezone,status,published_at,created_at,updated_at";

/** Upcoming (ascending) + recent past (descending, capped) published sessions — for /app/live-support. */
export async function getPublishedAnnouncements(): Promise<{
  upcoming: AnnouncementRow[];
  past: AnnouncementRow[];
}> {
  const supabase = await createClient();
  if (!supabase) return { upcoming: [], past: [] };
  const nowIso = new Date().toISOString();

  const [{ data: upcoming }, { data: past }] = await Promise.all([
    supabase
      .from("live_announcements")
      .select(COLUMNS)
      .eq("status", "published")
      .gte("starts_at", nowIso)
      .order("starts_at", { ascending: true }),
    supabase
      .from("live_announcements")
      .select(COLUMNS)
      .eq("status", "published")
      .lt("starts_at", nowIso)
      .order("starts_at", { ascending: false })
      .limit(10),
  ]);

  return { upcoming: (upcoming as AnnouncementRow[]) ?? [], past: (past as AnnouncementRow[]) ?? [] };
}

/** For the Support AI fallback: the single next upcoming published session, if any. */
export async function getNextUpcomingAnnouncement(): Promise<AnnouncementRow | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("live_announcements")
    .select(COLUMNS)
    .eq("status", "published")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return (data as AnnouncementRow) ?? null;
}

export interface AdminAnnouncements {
  isAdmin: boolean;
  items: AnnouncementRow[];
}

export async function getAllAnnouncementsForAdmin(): Promise<AdminAnnouncements> {
  const empty: AdminAnnouncements = { isAdmin: false, items: [] };
  const supabase = await createClient();
  if (!supabase) return empty;
  const profile = await getProfile();
  if (profile?.role !== "admin") return empty;

  const { data } = await supabase
    .from("live_announcements")
    .select(COLUMNS)
    .order("starts_at", { ascending: false })
    .limit(200);

  return { isAdmin: true, items: (data as AnnouncementRow[]) ?? [] };
}

export async function getAnnouncementById(id: string): Promise<AnnouncementRow | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const profile = await getProfile();
  if (profile?.role !== "admin") return null;

  const { data } = await supabase.from("live_announcements").select(COLUMNS).eq("id", id).maybeSingle();
  return (data as AnnouncementRow) ?? null;
}
