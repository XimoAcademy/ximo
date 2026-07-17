import { describe, expect, it } from "vitest";
import {
  ncaaAgeTriggerFallYear,
  enrollmentFallYear,
  estimateEligibilityWindow,
  delayedEnrollmentReducesTime,
} from "./eligibility";

describe("ncaaAgeTriggerFallYear", () => {
  it("turns 19 before Sep 1 → clock starts that same fall", () => {
    // Born 2008-03-09 → turns 19 on 2027-03-09 (before Sep 1) → fall 2027.
    expect(ncaaAgeTriggerFallYear({ year: 2008, month: 3, day: 9 })).toBe(2027);
  });
  it("turns 19 on/after Sep 1 → clock starts the next fall", () => {
    // Born 2008-11-20 → turns 19 on 2027-11-20 (after Sep 1) → fall 2028.
    expect(ncaaAgeTriggerFallYear({ year: 2008, month: 11, day: 20 })).toBe(2028);
  });
  it("Sep 1 birthday counts as on/after → next fall", () => {
    expect(ncaaAgeTriggerFallYear({ year: 2008, month: 9, day: 1 })).toBe(2028);
  });
  it("Aug 31 birthday counts as before → same fall", () => {
    expect(ncaaAgeTriggerFallYear({ year: 2008, month: 8, day: 31 })).toBe(2027);
  });
});

describe("enrollmentFallYear", () => {
  it("fall term maps to its own year", () => {
    expect(enrollmentFallYear("fall", 2027)).toBe(2027);
  });
  it("winter/spring/summer map to the prior fall's academic year", () => {
    expect(enrollmentFallYear("spring", 2027)).toBe(2026);
    expect(enrollmentFallYear("winter", 2027)).toBe(2026);
    expect(enrollmentFallYear("summer", 2027)).toBe(2026);
  });
});

describe("estimateEligibilityWindow", () => {
  it("immediate fall enrollment after HS drives the clock", () => {
    // Enroll fall 2027; age trigger later → enrollment is earlier.
    const w = estimateEligibilityWindow({
      dob: "2009-06-01", // turns 19 in 2028 → age trigger fall 2028
      firstEnrollmentTerm: "fall",
      firstEnrollmentYear: 2027,
    })!;
    expect(w.startFallYear).toBe(2027);
    expect(w.endFallYear).toBe(2031); // five academic years 2027..2031
    expect(w.driver).toBe("enrollment");
  });

  it("delayed enrollment past age 19 → age trigger drives and reduces time", () => {
    // Born 2006-03-01 → turns 19 in 2025 (before Sep 1) → age trigger fall 2025.
    // But first enrolls fall 2027 → age started 2 years earlier.
    const input = {
      dob: "2006-03-01",
      firstEnrollmentTerm: "fall" as const,
      firstEnrollmentYear: 2027,
    };
    const w = estimateEligibilityWindow(input)!;
    expect(w.startFallYear).toBe(2025);
    expect(w.driver).toBe("age");
    expect(delayedEnrollmentReducesTime(input)).toBe(true);
  });

  it("international first enrollment counts like any college", () => {
    const w = estimateEligibilityWindow({
      dob: "2009-01-01",
      firstEnrollmentTerm: "fall",
      firstEnrollmentYear: 2027, // e.g. a university abroad
    })!;
    expect(w.startFallYear).toBe(2027);
    expect(w.driver).toBe("enrollment");
  });

  it("winter/spring/summer HS grad → spring college start maps correctly", () => {
    const w = estimateEligibilityWindow({
      dob: "2010-05-01",
      firstEnrollmentTerm: "spring",
      firstEnrollmentYear: 2028, // spring 2028 = academic year starting fall 2027
    })!;
    expect(w.enrollmentFallYear).toBe(2027);
  });

  it("returns null when neither DOB nor enrollment is known", () => {
    expect(estimateEligibilityWindow({})).toBeNull();
  });

  it("age-only estimate when enrollment is unknown", () => {
    const w = estimateEligibilityWindow({ dob: "2008-03-09" })!;
    expect(w.startFallYear).toBe(2027);
    expect(w.driver).toBe("age");
    expect(w.enrollmentFallYear).toBeNull();
  });
});
