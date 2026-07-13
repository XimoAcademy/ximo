/**
 * NCAA Division I age-based eligibility — ESTIMATE helpers.
 *
 * These implement the age-based trigger for the continuous five-year
 * eligibility period adopted by NCAA Division I (adopted 2026-06-23; fully
 * applicable to prospects first enrolling full time in fall 2027 or later).
 *
 * IMPORTANT: this is an educational ESTIMATE only. Ximo does not certify
 * eligibility — the NCAA Eligibility Center and the university's compliance
 * office make official determinations. Other academic and athletics rules also
 * apply, and transition rules may apply to 2026-27 enrollees.
 *
 * The clock starts with the EARLIER of:
 *   1. the academic term of first full-time enrollment (and class attendance)
 *      at ANY college or university (US, international, junior, community…), or
 *   2. the age-based trigger tied to the 19th birthday:
 *        - turns 19 BEFORE Sep 1  → academic year immediately following (that fall)
 *        - turns 19 ON/AFTER Sep 1 → the SUBSEQUENT academic year (next fall),
 *          unless full-time enrollment happens earlier.
 */

import type { DateParts } from "@/lib/education/fields";
import { parseDateOnly, type Term } from "@/lib/education/fields";

/** Number of academic years covered by the continuous period (5 for 5). */
export const ELIGIBILITY_YEARS = 5;

/**
 * The fall calendar year at which the age-based clock would start for a given
 * date of birth. An "academic year" is identified by the year of its fall term.
 */
export function ncaaAgeTriggerFallYear(dob: DateParts): number {
  const birthday19Year = dob.year + 19;
  // Turns 19 before September 1 → clock starts that same fall.
  // Turns 19 on/after September 1 → clock starts the next fall.
  const beforeSep1 = dob.month < 9 || (dob.month === 9 && dob.day < 1); // day<1 never true
  return beforeSep1 ? birthday19Year : birthday19Year + 1;
}

/**
 * Map an enrollment term+year to the fall year that identifies its academic
 * year. Fall enrollment in year Y is academic year Y; winter/spring/summer of
 * year Y fall within the academic year that started the previous fall (Y-1).
 * "other"/unknown is treated as fall (best-effort estimate).
 */
export function enrollmentFallYear(term: Term | null | undefined, year: number): number {
  if (term === "winter" || term === "spring" || term === "summer") return year - 1;
  return year; // fall / other
}

export interface EligibilityInput {
  dob?: DateParts | string | null;
  /** First full-time enrollment term + year, if known/planned. */
  firstEnrollmentTerm?: Term | null;
  firstEnrollmentYear?: number | null;
}

export interface EligibilityWindow {
  /** Fall year the five-year period begins (start of that academic year). */
  startFallYear: number;
  /** Fall year of the final academic year in the period (start + 4). */
  endFallYear: number;
  /** Which input drove the start (the earlier of the two). */
  driver: "age" | "enrollment" | "tie";
  /** The age-based trigger fall year, when a DOB was provided. */
  ageTriggerFallYear: number | null;
  /** The enrollment fall year, when enrollment was provided. */
  enrollmentFallYear: number | null;
}

function toParts(dob: EligibilityInput["dob"]): DateParts | null {
  if (!dob) return null;
  if (typeof dob === "string") return parseDateOnly(dob);
  return dob;
}

/**
 * Estimate the continuous five-year eligibility window from a date of birth
 * and/or a first full-time enrollment. Returns null when neither input is
 * available (nothing to estimate). ESTIMATE ONLY — label it as such in the UI.
 */
export function estimateEligibilityWindow(input: EligibilityInput): EligibilityWindow | null {
  const parts = toParts(input.dob);
  const ageTrigger = parts ? ncaaAgeTriggerFallYear(parts) : null;

  const enroll =
    input.firstEnrollmentYear && input.firstEnrollmentYear > 0
      ? enrollmentFallYear(input.firstEnrollmentTerm ?? "fall", input.firstEnrollmentYear)
      : null;

  if (ageTrigger === null && enroll === null) return null;

  let startFallYear: number;
  let driver: EligibilityWindow["driver"];
  if (ageTrigger !== null && enroll !== null) {
    if (enroll < ageTrigger) {
      startFallYear = enroll;
      driver = "enrollment";
    } else if (ageTrigger < enroll) {
      startFallYear = ageTrigger;
      driver = "age";
    } else {
      startFallYear = ageTrigger;
      driver = "tie";
    }
  } else if (ageTrigger !== null) {
    startFallYear = ageTrigger;
    driver = "age";
  } else {
    startFallYear = enroll as number;
    driver = "enrollment";
  }

  return {
    startFallYear,
    endFallYear: startFallYear + (ELIGIBILITY_YEARS - 1),
    driver,
    ageTriggerFallYear: ageTrigger,
    enrollmentFallYear: enroll,
  };
}

/**
 * True when delayed enrollment likely reduces available time: the athlete's
 * age-based clock starts strictly before their first enrollment, so some of the
 * five-year window elapses before they ever compete. Used to surface a gentle
 * warning (never a definitive ruling).
 */
export function delayedEnrollmentReducesTime(input: EligibilityInput): boolean {
  const w = estimateEligibilityWindow(input);
  if (!w || w.ageTriggerFallYear === null || w.enrollmentFallYear === null) return false;
  return w.ageTriggerFallYear < w.enrollmentFallYear;
}
