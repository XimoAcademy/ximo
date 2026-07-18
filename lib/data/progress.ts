import { createClient } from "@/lib/supabase/server";
import { parseTime } from "@/lib/util/swim-time";
import { getCurrentUser } from "@/lib/auth/getUser";

export { parseTime } from "@/lib/util/swim-time";

export type Course = "SCY" | "LCM" | "SCM";

export interface Swim {
  id: string;
  event: string;
  course: Course;
  sec: number;
  date: string; // yyyy-mm-dd
  meet: string;
}

/**
 * Read the athlete's swim marks from `progress_entries`.
 * Storage mapping (no schema change needed):
 *   event      → event name
 *   result     → time string ("26.04")
 *   result_date→ yyyy-mm-dd
 *   notes      → meet name
 *   media_url  → course code (SCY | LCM | SCM)
 */
export async function getProgressEntries(): Promise<{ swims: Swim[]; configured: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { swims: [], configured: false };
  const user = await getCurrentUser();
  if (!user) return { swims: [], configured: true };

  const { data } = await supabase
    .from("progress_entries")
    .select("id,event,result,result_date,notes,media_url")
    .eq("user_id", user.id)
    .order("result_date", { ascending: true });

  const swims: Swim[] = [];
  for (const r of (data as Array<{ id: string; event: string | null; result: string | null; result_date: string | null; notes: string | null; media_url: string | null }>) ?? []) {
    if (!r.event || !r.result || !r.result_date) continue;
    const sec = parseTime(r.result);
    if (sec === null) continue;
    const course = (r.media_url === "LCM" || r.media_url === "SCM" ? r.media_url : "SCY") as Course;
    swims.push({
      id: r.id,
      event: r.event,
      course,
      sec,
      date: r.result_date,
      meet: r.notes || "Competencia",
    });
  }
  return { swims, configured: true };
}
