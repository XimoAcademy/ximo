/**
 * Shared, framework-agnostic helpers for the international education timeline:
 * date-of-birth (date-only, timezone-safe) and the four-digit high-school
 * graduation year. Pure functions so the SAME logic runs on the client (instant
 * feedback) and the server (authoritative validation) — see requirements #6/#7.
 *
 * Localizable option KEYS live here as stable strings; the UI maps them to
 * translated labels. Never store a translated label in the database.
 */

// ── Stable option keys (mirror the DB CHECK constraints in migration 011) ──
export const TERMS = ["winter", "spring", "summer", "fall", "other"] as const;
export type Term = (typeof TERMS)[number];

export const GRAD_STATUSES = ["expected", "completed"] as const;
export type GradStatus = (typeof GRAD_STATUSES)[number];

export const GAP_STATUSES = ["no", "planned", "unsure", "current", "completed"] as const;
export type GapStatus = (typeof GAP_STATUSES)[number];

export const PRIOR_ENROLLMENT_TYPES = [
  "us_college",
  "international_university",
  "junior_college",
  "community_college",
  "other",
] as const;
export type PriorEnrollmentType = (typeof PRIOR_ENROLLMENT_TYPES)[number];

export const RECRUITING_STATUSES = [
  "prospect",
  "gap_year",
  "committed",
  "enrolled",
  "transfer",
  "other",
] as const;
export type RecruitingStatus = (typeof RECRUITING_STATUSES)[number];

// ── Graduation year (typed four-digit field) ──────────────────────────────

/** Acceptable four-digit graduation years. Deliberately wide (never a short,
 * quickly-outdated dropdown), but bounded so typos like 9999 are rejected. */
export const GRAD_YEAR_MIN = 1950;
export function gradYearMax(now: Date = new Date()): number {
  // Allow planning a decade+ ahead (younger athletes / long timelines).
  return now.getFullYear() + 12;
}

export type FieldError = "required" | "not_four_digits" | "out_of_range" | "invalid";

export type GradYearResult =
  | { ok: true; value: number }
  | { ok: false; error: FieldError };

/**
 * Validate a typed high-school graduation year. Accepts EXACTLY four digits:
 * no letters, spaces, decimals, signs, or >4 digits. Returns a stable error
 * code the UI localizes. `required=false` treats empty as valid-but-absent.
 */
export function validateGradYear(
  raw: string | number | null | undefined,
  opts: { required?: boolean; now?: Date } = {}
): GradYearResult | { ok: true; value: null } {
  const s = String(raw ?? "").trim();
  if (!s) return opts.required ? { ok: false, error: "required" } : { ok: true, value: null };
  if (!/^\d{4}$/.test(s)) return { ok: false, error: "not_four_digits" };
  const year = Number(s);
  if (year < GRAD_YEAR_MIN || year > gradYearMax(opts.now)) {
    return { ok: false, error: "out_of_range" };
  }
  return { ok: true, value: year };
}

// ── Date of birth (date-only, timezone-safe) ──────────────────────────────

export interface DateParts {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

/** Parse a strict `YYYY-MM-DD` string into parts WITHOUT constructing a Date
 * (which would apply the local/UTC timezone and can shift the day). Returns
 * null for anything not a real calendar date. */
export function parseDateOnly(value: string | null | undefined): DateParts | null {
  const s = String(value ?? "").trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12) return null;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day < 1 || day > daysInMonth) return null;
  return { year, month, day };
}

/** Serialize parts back to the canonical `YYYY-MM-DD` (what the DB stores). */
export function formatDateOnly(p: DateParts): string {
  const mm = String(p.month).padStart(2, "0");
  const dd = String(p.day).padStart(2, "0");
  return `${p.year}-${mm}-${dd}`;
}

/** Compare a date-only value to "today" without timezone drift. */
function compareToToday(p: DateParts, now: Date): number {
  const ty = now.getFullYear();
  const tm = now.getMonth() + 1;
  const td = now.getDate();
  if (p.year !== ty) return p.year - ty;
  if (p.month !== tm) return p.month - tm;
  return p.day - td;
}

/** Whole years between a birth date and `now` (age), timezone-safe. */
export function ageFromDob(p: DateParts, now: Date = new Date()): number {
  let age = now.getFullYear() - p.year;
  const beforeBirthday =
    now.getMonth() + 1 < p.month ||
    (now.getMonth() + 1 === p.month && now.getDate() < p.day);
  if (beforeBirthday) age -= 1;
  return age;
}

export type DobResult =
  | { ok: true; value: string | null }
  | { ok: false; error: FieldError | "future" | "too_old" };

/**
 * Validate a date-of-birth string. Rejects impossible dates, future dates, and
 * implausibly old ones (>120y). Returns the canonical `YYYY-MM-DD` on success.
 * Does NOT enforce any minimum-age/legal rule — that's a product decision.
 */
export function validateDob(
  raw: string | null | undefined,
  opts: { required?: boolean; now?: Date } = {}
): DobResult {
  const s = String(raw ?? "").trim();
  if (!s) return opts.required ? { ok: false, error: "required" } : { ok: true, value: null };
  const parts = parseDateOnly(s);
  if (!parts) return { ok: false, error: "invalid" };
  const now = opts.now ?? new Date();
  if (compareToToday(parts, now) > 0) return { ok: false, error: "future" };
  if (ageFromDob(parts, now) > 120) return { ok: false, error: "too_old" };
  return { ok: true, value: formatDateOnly(parts) };
}
