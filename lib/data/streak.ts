import { createClient } from "@/lib/supabase/server";

/**
 * Daily login streak — Duolingo-style.
 *
 * The streak is activated automatically when the athlete opens the app, once
 * per day. It counts consecutive days: if the previous activation was
 * yesterday it grows by one, if a full day was missed it resets to 1, and if
 * it was already activated today it's a no-op. The day boundary is the Mexico
 * City calendar day ("México primero").
 *
 * Null-safe: returns a zeroed streak when Supabase isn't configured or nobody
 * is signed in, so the static preview keeps working.
 */

export interface StreakState {
  current: number;
  longest: number;
  activatedToday: boolean;
}

const ZERO: StreakState = { current: 0, longest: 0, activatedToday: false };

/** Today as YYYY-MM-DD in America/Mexico_City — the streak's day boundary. */
function mxToday(date = new Date()): string {
  // en-CA formats as ISO-like YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Whole-day difference (b - a) between two YYYY-MM-DD strings. */
function dayGap(a: string, b: string): number {
  const da = Date.parse(`${a}T00:00:00Z`);
  const db = Date.parse(`${b}T00:00:00Z`);
  return Math.round((db - da) / 86_400_000);
}

export async function touchDailyStreak(): Promise<StreakState> {
  const supabase = await createClient();
  if (!supabase) return ZERO;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return ZERO;

  const { data: row } = await supabase
    .from("profiles")
    .select("current_streak, longest_streak, last_streak_date")
    .eq("id", user.id)
    .maybeSingle();

  const today = mxToday();
  const last = (row?.last_streak_date as string | null) ?? null;
  const prevCurrent = (row?.current_streak as number | null) ?? 0;
  const prevLongest = (row?.longest_streak as number | null) ?? 0;

  // Already activated today — keep it idempotent, don't write.
  if (last === today) {
    return { current: prevCurrent, longest: prevLongest, activatedToday: true };
  }

  // Continued from yesterday → +1; otherwise (missed a day, or first ever) → 1.
  const gap = last ? dayGap(last, today) : Number.POSITIVE_INFINITY;
  const current = gap === 1 ? prevCurrent + 1 : 1;
  const longest = Math.max(prevLongest, current);

  const { error } = await supabase
    .from("profiles")
    .update({ current_streak: current, longest_streak: longest, last_streak_date: today })
    .eq("id", user.id);

  // If the write fails (e.g. columns not migrated yet), fall back to the read
  // values so the UI still renders rather than crashing the whole layout.
  if (error) return { current: prevCurrent, longest: prevLongest, activatedToday: false };

  return { current, longest, activatedToday: true };
}
