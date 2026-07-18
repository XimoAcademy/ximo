import { createServiceRoleClient } from "@/lib/supabase/server";
import { emailUserViaService } from "@/lib/email/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Daily reminder job. Finds coach follow-ups and tasks due TODAY across all
 * users and sends each affected user one in-app notification + one email digest.
 *
 * Schedule via Vercel Cron (see vercel.json) which calls this with
 * `Authorization: Bearer ${CRON_SECRET}`. Requires the service-role key (reads
 * across users, writes notifications). No-ops safely if either is missing.
 */
export async function GET(req: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret) return new Response("Cron not configured", { status: 503 });

  // Header-only auth: query-string secrets end up in request logs, so the
  // `?secret=` fallback was removed. Vercel Cron always sends the Bearer header.
  const auth = req.headers.get("authorization");
  const provided = auth?.replace(/^Bearer\s+/i, "") ?? "";
  if (provided !== secret) return new Response("Unauthorized", { status: 401 });

  const svc = createServiceRoleClient();
  if (!svc) return new Response("Service role not configured", { status: 503 });

  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  const todayDate = start.toISOString().slice(0, 10); // YYYY-MM-DD

  // Coach follow-ups due today.
  const { data: coaches } = await svc
    .from("coaches")
    .select("user_id,name")
    .gte("next_follow_up_at", start.toISOString())
    .lt("next_follow_up_at", end.toISOString());

  // Tasks due today (not completed).
  const { data: tasks } = await svc
    .from("tasks")
    .select("user_id,title")
    .eq("due_date", todayDate)
    .neq("status", "completada");

  type Bucket = { coaches: string[]; tasks: string[] };
  const byUser = new Map<string, Bucket>();
  const add = (userId: string, key: keyof Bucket, value: string) => {
    const b = byUser.get(userId) ?? { coaches: [], tasks: [] };
    b[key].push(value);
    byUser.set(userId, b);
  };
  for (const c of (coaches as { user_id: string; name: string }[]) ?? []) add(c.user_id, "coaches", c.name);
  for (const t of (tasks as { user_id: string; title: string }[]) ?? []) add(t.user_id, "tasks", t.title);

  let notified = 0;
  let failed = 0;
  for (const [userId, b] of byUser) {
    try {
      const parts: string[] = [];
      if (b.coaches.length) parts.push(`${b.coaches.length} follow-up${b.coaches.length > 1 ? "s" : ""} con coaches`);
      if (b.tasks.length) parts.push(`${b.tasks.length} tarea${b.tasks.length > 1 ? "s" : ""}`);
      if (parts.length === 0) continue;
      const summary = parts.join(" y ") + " para hoy.";

      // Avoid duplicate reminder notifications if the job runs twice in a day.
      const { data: existing } = await svc
        .from("notifications")
        .select("id")
        .eq("user_id", userId)
        .eq("type", "reminder")
        .gte("created_at", start.toISOString())
        .limit(1);
      if (existing && existing.length > 0) continue;

      await svc.from("notifications").insert({
        user_id: userId,
        title: "Tus pendientes de hoy",
        body: summary,
        type: "reminder",
      });

      const lines: string[] = [`Tienes ${summary}`];
      if (b.coaches.length) lines.push("Coaches por contactar: " + b.coaches.slice(0, 5).join(", ") + (b.coaches.length > 5 ? "…" : ""));
      if (b.tasks.length) lines.push("Tareas: " + b.tasks.slice(0, 5).join(", ") + (b.tasks.length > 5 ? "…" : ""));
      lines.push("Dale seguimiento hoy para no perder ninguna oportunidad.");

      await emailUserViaService(svc, userId, {
        subject: "Tus pendientes de hoy en Ximo",
        heading: "Pendientes para hoy",
        body: lines,
        ctaLabel: "Abrir Ximo",
        ctaPath: "/app/tareas",
      });
      notified++;
    } catch {
      // One user failing must not abort reminders for everyone else.
      failed++;
    }
  }

  return Response.json({ ok: true, usersNotified: notified, usersFailed: failed });
}
