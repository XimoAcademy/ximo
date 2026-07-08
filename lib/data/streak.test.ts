import { describe, expect, it } from "vitest";
import { advanceStreak, dayGap, mxToday } from "./streak";

describe("dayGap", () => {
  it("is 0 for the same day", () => {
    expect(dayGap("2026-07-07", "2026-07-07")).toBe(0);
  });
  it("is 1 for consecutive days", () => {
    expect(dayGap("2026-07-06", "2026-07-07")).toBe(1);
  });
  it("crosses month and year boundaries", () => {
    expect(dayGap("2026-06-30", "2026-07-01")).toBe(1);
    expect(dayGap("2025-12-31", "2026-01-01")).toBe(1);
  });
  it("handles multi-day gaps", () => {
    expect(dayGap("2026-07-01", "2026-07-07")).toBe(6);
  });
});

describe("advanceStreak", () => {
  it("starts at 1 when there is no previous activation", () => {
    expect(advanceStreak(null, "2026-07-07", 0, 0)).toEqual({ current: 1, longest: 1, changed: true });
  });

  it("is idempotent when already activated today (no false increases)", () => {
    expect(advanceStreak("2026-07-07", "2026-07-07", 5, 9)).toEqual({ current: 5, longest: 9, changed: false });
  });

  it("increments by 1 when the last activation was yesterday", () => {
    expect(advanceStreak("2026-07-06", "2026-07-07", 5, 9)).toEqual({ current: 6, longest: 9, changed: true });
  });

  it("updates the longest streak when surpassed", () => {
    expect(advanceStreak("2026-07-06", "2026-07-07", 9, 9)).toEqual({ current: 10, longest: 10, changed: true });
  });

  it("resets to 1 after missing a full day", () => {
    expect(advanceStreak("2026-07-05", "2026-07-07", 5, 9)).toEqual({ current: 1, longest: 9, changed: true });
  });

  it("resets to 1 after a long absence", () => {
    expect(advanceStreak("2026-01-01", "2026-07-07", 30, 30)).toEqual({ current: 1, longest: 30, changed: true });
  });

  it("continues across a month boundary", () => {
    expect(advanceStreak("2026-06-30", "2026-07-01", 3, 3)).toEqual({ current: 4, longest: 4, changed: true });
  });
});

describe("mxToday", () => {
  it("formats as YYYY-MM-DD", () => {
    expect(mxToday(new Date("2026-07-07T18:00:00Z"))).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("uses the Mexico City calendar day (05:00 UTC is still the previous day)", () => {
    // 2026-07-07T05:59Z ≈ 2026-07-06 23:59 in America/Mexico_City (UTC-6).
    expect(mxToday(new Date("2026-07-07T05:59:00Z"))).toBe("2026-07-06");
    expect(mxToday(new Date("2026-07-07T06:01:00Z"))).toBe("2026-07-07");
  });
});
