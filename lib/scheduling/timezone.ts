/**
 * Timezone conversion without a date library (none is installed — see
 * lib/data/streak.ts's mxToday for the same Intl-based approach used
 * elsewhere in this codebase).
 */

/** Offset (minutes) of `timeZone`'s wall clock relative to UTC, at `date`. */
function offsetMinutes(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  const asUtcMs = Date.UTC(
    Number(get("year")),
    Number(get("month")) - 1,
    Number(get("day")),
    Number(get("hour")),
    Number(get("minute")),
    Number(get("second"))
  );
  return (asUtcMs - date.getTime()) / 60_000;
}

/**
 * Converts a local date + time entered in `timeZone` (e.g. an admin filling
 * out "2026-08-14" / "19:00" / "America/New_York") into the UTC instant it
 * represents. Single-pass approximation (matches the offset at the naive
 * instant); fine for scheduling a future session, not built for historical
 * DST-boundary precision.
 */
export function zonedTimeToUtc(dateStr: string, timeStr: string, timeZone: string): Date {
  const naiveUtc = new Date(`${dateStr}T${timeStr}:00Z`);
  const offset = offsetMinutes(naiveUtc, timeZone);
  return new Date(naiveUtc.getTime() - offset * 60_000);
}

/** Splits an instant into the `YYYY-MM-DD` / `HH:MM` (24h) it reads as in
 * `timeZone` — used to pre-fill the admin's date/time `<input>` fields when
 * editing an existing announcement. */
export function zonedDateTimeParts(instant: Date | string, timeZone: string): { date: string; time: string } {
  const d = typeof instant === "string" ? new Date(instant) : instant;
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(d);
  return { date, time };
}

/** Human-readable instant formatted in `timeZone`, Spanish locale. */
export function formatInZone(instant: Date | string, timeZone: string): string {
  const d = typeof instant === "string" ? new Date(instant) : instant;
  // Explicit fields (rather than dateStyle/timeStyle) so timeZoneName can be
  // combined reliably across ICU builds.
  return new Intl.DateTimeFormat("es-MX", {
    timeZone,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}
