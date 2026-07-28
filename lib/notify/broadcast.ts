import { createServiceRoleClient } from "@/lib/supabase/server";

export interface BroadcastNotification {
  title: string;
  body: string;
  type: string;
  actionUrl?: string | null;
}

const BATCH_SIZE = 500;

/**
 * Inserts one `notifications` row per user, batched into chunked INSERTs
 * (not a per-user loop of HTTP calls) — used for "broadcast to everyone"
 * events (announcement publish, session reminders). SERVER-ONLY: uses the
 * service-role client to write other users' rows, the same pattern as
 * notifyAdOwner() in app/app/admin/ads/actions.ts and the daily reminders
 * cron, generalized from one recipient to all of them.
 */
export async function notifyAllUsers(n: BroadcastNotification): Promise<{ ok: boolean; count: number }> {
  const service = createServiceRoleClient();
  if (!service) return { ok: false, count: 0 };

  const { data: profiles, error: profErr } = await service.from("profiles").select("id");
  if (profErr || !profiles || profiles.length === 0) return { ok: false, count: 0 };

  const rows = (profiles as Array<{ id: string }>).map((p) => ({
    user_id: p.id,
    title: n.title,
    body: n.body,
    type: n.type,
    action_url: n.actionUrl ?? null,
  }));

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const chunk = rows.slice(i, i + BATCH_SIZE);
    const { error } = await service.from("notifications").insert(chunk);
    if (error) return { ok: false, count: i };
  }

  return { ok: true, count: rows.length };
}
