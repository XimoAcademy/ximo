import { createServiceRoleClient } from "@/lib/supabase/server";
import { notifyAllUsers } from "@/lib/notify/broadcast";
import { formatInZone } from "@/lib/scheduling/timezone";
import { nextDueReminder, type ReminderWindow } from "@/lib/scheduling/reminders";
import { avisoRecordatorio } from "@/lib/announcements/text";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface AnnouncementForReminder {
  id: string;
  starts_at: string;
  timezone: string;
}

/**
 * Session-reminder job for live-support announcements (24h / 1h / 10min
 * before `starts_at`). NOT a Vercel Cron entry — Vercel Hobby only allows a
 * daily cron (see the existing /api/cron/reminders), which can't hit the
 * precision this needs. An external scheduler calls this route every ~5
 * minutes with `Authorization: Bearer ${CRON_SECRET}` — the same secret used
 * by the daily cron. See .github/workflows/session-reminders.yml.
 *
 * Exactly-once per window: the (announcement_id, reminder_window) rows are
 * claimed in announcement_reminders_sent BEFORE broadcasting, so a duplicate
 * or overlapping run can never double-notify. Late runs still deliver — see
 * lib/scheduling/reminders.ts.
 */
export async function GET(req: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret) return new Response("Cron not configured", { status: 503 });

  const auth = req.headers.get("authorization");
  const provided = auth?.replace(/^Bearer\s+/i, "") ?? "";
  if (provided !== secret) return new Response("Unauthorized", { status: 401 });

  const svc = createServiceRoleClient();
  if (!svc) return new Response("Service role not configured", { status: 503 });

  const now = new Date();
  // 25h horizon covers the 24h window with margin for a late run.
  const horizon = new Date(now.getTime() + 25 * 60 * 60_000);

  const { data: announcements } = await svc
    .from("live_announcements")
    .select("id,starts_at,timezone")
    .eq("status", "published")
    .gte("starts_at", now.toISOString())
    .lte("starts_at", horizon.toISOString());

  const rows = (announcements as AnnouncementForReminder[]) ?? [];
  if (rows.length === 0) {
    return Response.json({ ok: true, remindersSent: 0, skippedDuplicates: 0, failed: 0 });
  }

  // One query for every ledger row in play, rather than one per announcement.
  const { data: sentRows } = await svc
    .from("announcement_reminders_sent")
    .select("announcement_id,reminder_window")
    .in(
      "announcement_id",
      rows.map((r) => r.id)
    );

  const sentByAnnouncement = new Map<string, ReminderWindow[]>();
  for (const s of (sentRows as Array<{ announcement_id: string; reminder_window: ReminderWindow }>) ?? []) {
    const list = sentByAnnouncement.get(s.announcement_id) ?? [];
    list.push(s.reminder_window);
    sentByAnnouncement.set(s.announcement_id, list);
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const a of rows) {
    const due = nextDueReminder(new Date(a.starts_at), now, sentByAnnouncement.get(a.id) ?? []);
    if (!due) continue;

    // Claim every covered window in a single atomic insert. A unique violation
    // means a concurrent run already took it — skip rather than double-send.
    const { error: claimErr } = await svc
      .from("announcement_reminders_sent")
      .insert(due.covers.map((w) => ({ announcement_id: a.id, reminder_window: w })));

    if (claimErr) {
      if ((claimErr as { code?: string }).code === "23505") skipped++;
      else failed++;
      continue;
    }

    const texto = avisoRecordatorio(due.label, formatInZone(a.starts_at, a.timezone));
    const result = await notifyAllUsers({ ...texto, type: "live_support" });

    if (result.ok) sent++;
    else failed++;
  }

  return Response.json({ ok: true, remindersSent: sent, skippedDuplicates: skipped, failed });
}
