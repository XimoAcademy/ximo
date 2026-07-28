import { describe, expect, it } from "vitest";
import { formatInZone, zonedDateTimeParts, zonedTimeToUtc } from "./timezone";

describe("zonedTimeToUtc", () => {
  it("converts a UTC-zone local time straight through", () => {
    const d = zonedTimeToUtc("2026-08-14", "19:00", "UTC");
    expect(d.toISOString()).toBe("2026-08-14T19:00:00.000Z");
  });

  it("converts America/New_York (EDT, UTC-4) in summer", () => {
    const d = zonedTimeToUtc("2026-08-14", "19:00", "America/New_York");
    expect(d.toISOString()).toBe("2026-08-14T23:00:00.000Z");
  });

  it("converts America/New_York (EST, UTC-5) in winter", () => {
    const d = zonedTimeToUtc("2026-01-14", "19:00", "America/New_York");
    expect(d.toISOString()).toBe("2026-01-15T00:00:00.000Z");
  });

  it("converts America/Mexico_City (UTC-6, no DST)", () => {
    const d = zonedTimeToUtc("2026-08-14", "19:00", "America/Mexico_City");
    expect(d.toISOString()).toBe("2026-08-15T01:00:00.000Z");
  });

  it("round-trips through formatInZone back to the same wall-clock time", () => {
    const d = zonedTimeToUtc("2026-08-14", "19:00", "America/New_York");
    const formatted = formatInZone(d, "America/New_York");
    expect(formatted).toContain("7:00");
  });
});

describe("formatInZone", () => {
  it("accepts an ISO string as well as a Date", () => {
    expect(formatInZone("2026-08-14T23:00:00.000Z", "America/New_York")).toContain("7:00");
  });
});

describe("zonedDateTimeParts", () => {
  it("round-trips zonedTimeToUtc back to the original date/time", () => {
    const utc = zonedTimeToUtc("2026-08-14", "19:00", "America/New_York");
    expect(zonedDateTimeParts(utc, "America/New_York")).toEqual({ date: "2026-08-14", time: "19:00" });
  });

  it("shows a different calendar day when the zone crosses midnight vs. UTC", () => {
    const utc = zonedTimeToUtc("2026-01-14", "19:00", "America/New_York");
    expect(zonedDateTimeParts(utc, "UTC")).toEqual({ date: "2026-01-15", time: "00:00" });
  });
});
