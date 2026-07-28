/**
 * Pure reminder-window logic for live-support session announcements.
 *
 * The cron endpoint (app/api/cron/session-reminders/route.ts) is pinged by an
 * external scheduler (Vercel Hobby only allows a daily cron — see
 * docs/DECISIONS.md). Those schedulers are NOT punctual: GitHub Actions cron
 * routinely fires 5-20 minutes late.
 *
 * So this does not ask "did the event cross a threshold in the last N
 * minutes?" — a late run would step over the window and the reminder would be
 * silently lost forever. Instead it asks "what is the most urgent reminder we
 * still owe for this event?", and the caller records every window it covers.
 * A late run still delivers, just late; it never goes silent.
 */

export type ReminderWindow = "24h" | "1h" | "10m";

/** Ordered most-distant → most-urgent. */
export const REMINDER_WINDOWS: ReminderWindow[] = ["24h", "1h", "10m"];

const WINDOW_MINUTES: Record<ReminderWindow, number> = {
  "24h": 24 * 60,
  "1h": 60,
  "10m": 10,
};

export interface DueReminder {
  /** The window whose message should be sent (the most urgent one still owed). */
  window: ReminderWindow;
  /**
   * Every window this send covers, including `window` itself. Recorded
   * together so an announcement published late (e.g. 20 minutes before it
   * starts) never sends a nonsensical "starts in 24 hours" afterwards.
   */
  covers: ReminderWindow[];
  /** Human label built from the ACTUAL time left, so a late run stays honest. */
  label: string;
}

/** Spanish label for the real remaining time — never a stale window name. */
export function describeTimeUntil(minutesUntil: number): string {
  if (minutesUntil >= 90) return `en ${Math.round(minutesUntil / 60)} horas`;
  if (minutesUntil >= 50) return "en 1 hora";
  if (minutesUntil >= 2) return `en ${Math.round(minutesUntil)} minutos`;
  return "en unos momentos";
}

/**
 * The reminder still owed for `startsAt`, or null when nothing is due (event
 * already started, too far away, or every relevant window already sent).
 */
export function nextDueReminder(
  startsAt: Date,
  now: Date,
  alreadySent: ReminderWindow[] = []
): DueReminder | null {
  const minutesUntil = (startsAt.getTime() - now.getTime()) / 60_000;
  // Already started (or starting this instant): reminders are pointless.
  if (minutesUntil <= 0) return null;

  const pending = REMINDER_WINDOWS.filter(
    (w) => minutesUntil <= WINDOW_MINUTES[w] && !alreadySent.includes(w)
  );
  if (pending.length === 0) return null;

  // Most urgent pending window = the last one in the ordered list.
  const window = pending[pending.length - 1];
  return { window, covers: pending, label: describeTimeUntil(minutesUntil) };
}
