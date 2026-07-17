import { describe, expect, it } from "vitest";
import {
  validateGradYear,
  validateDob,
  parseDateOnly,
  ageFromDob,
  gradYearMax,
} from "./fields";

const NOW = new Date("2026-07-12T12:00:00Z");

describe("validateGradYear (typed four-digit field)", () => {
  it("accepts exactly four digits in range", () => {
    expect(validateGradYear("2027", { now: NOW })).toEqual({ ok: true, value: 2027 });
  });
  it("rejects letters, spaces, decimals, signs, and >4 digits", () => {
    for (const bad of ["20a7", "202", "20277", "2027.0", "-2027", "20 7", " 2027 x", "abcd"]) {
      const r = validateGradYear(bad, { now: NOW });
      expect(r.ok, `"${bad}" should be invalid`).toBe(false);
    }
  });
  it("trims surrounding whitespace but still requires four digits", () => {
    expect(validateGradYear("  2027  ", { now: NOW })).toEqual({ ok: true, value: 2027 });
  });
  it("rejects out-of-range years (too old / too far future)", () => {
    expect(validateGradYear("1949", { now: NOW })).toEqual({ ok: false, error: "out_of_range" });
    expect(validateGradYear(String(gradYearMax(NOW) + 1), { now: NOW })).toEqual({
      ok: false,
      error: "out_of_range",
    });
  });
  it("treats empty as absent unless required", () => {
    expect(validateGradYear("", { now: NOW })).toEqual({ ok: true, value: null });
    expect(validateGradYear("", { required: true, now: NOW })).toEqual({
      ok: false,
      error: "required",
    });
  });
});

describe("parseDateOnly / DOB (timezone-safe)", () => {
  it("parses a valid date without timezone drift", () => {
    expect(parseDateOnly("2008-03-09")).toEqual({ year: 2008, month: 3, day: 9 });
  });
  it("rejects impossible calendar dates", () => {
    for (const bad of ["2008-02-30", "2008-13-01", "2008-00-10", "2008-06-31", "not-a-date", "2008/06/01"]) {
      expect(parseDateOnly(bad), bad).toBeNull();
    }
  });
  it("accepts a real leap day and rejects a fake one", () => {
    expect(parseDateOnly("2008-02-29")).toEqual({ year: 2008, month: 2, day: 29 });
    expect(parseDateOnly("2009-02-29")).toBeNull();
  });
});

describe("validateDob", () => {
  it("accepts a plausible past date and returns canonical string", () => {
    expect(validateDob("2008-03-09", { now: NOW })).toEqual({ ok: true, value: "2008-03-09" });
  });
  it("rejects future dates", () => {
    expect(validateDob("2027-01-01", { now: NOW })).toEqual({ ok: false, error: "future" });
  });
  it("rejects today+1 but accepts today", () => {
    expect(validateDob("2026-07-13", { now: NOW }).ok).toBe(false);
    expect(validateDob("2026-07-12", { now: NOW }).ok).toBe(true);
  });
  it("rejects invalid and absurdly old dates", () => {
    expect(validateDob("2008-02-30", { now: NOW })).toEqual({ ok: false, error: "invalid" });
    expect(validateDob("1800-01-01", { now: NOW })).toEqual({ ok: false, error: "too_old" });
  });
});

describe("ageFromDob", () => {
  it("computes age accounting for whether the birthday has passed", () => {
    expect(ageFromDob({ year: 2007, month: 1, day: 1 }, NOW)).toBe(19);
    expect(ageFromDob({ year: 2007, month: 12, day: 31 }, NOW)).toBe(18);
    expect(ageFromDob({ year: 2007, month: 7, day: 12 }, NOW)).toBe(19); // birthday today
  });
});
