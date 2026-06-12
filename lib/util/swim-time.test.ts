import { describe, it, expect } from "vitest";
import { parseTime, fmtTime } from "./swim-time";

describe("parseTime", () => {
  it("parses seconds-only times", () => {
    expect(parseTime("26.04")).toBeCloseTo(26.04, 5);
    expect(parseTime("9.9")).toBeCloseTo(9.9, 5);
    expect(parseTime("59.99")).toBeCloseTo(59.99, 5);
    expect(parseTime("0.5")).toBeCloseTo(0.5, 5);
  });

  it("parses mm:ss.xx times", () => {
    expect(parseTime("1:02.45")).toBeCloseTo(62.45, 5);
    expect(parseTime("2:05.00")).toBeCloseTo(125, 5);
    expect(parseTime("10:00.00")).toBeCloseTo(600, 5);
  });

  it("trims surrounding whitespace", () => {
    expect(parseTime("  26.04  ")).toBeCloseTo(26.04, 5);
  });

  it("rejects invalid formats", () => {
    expect(parseTime("")).toBeNull();
    expect(parseTime("abc")).toBeNull();
    expect(parseTime("1:99.0")).toBeNull(); // seconds >= 60 in mm:ss
    expect(parseTime("26.045")).toBeNull(); // too many decimals
    expect(parseTime("1:2:3")).toBeNull();
    expect(parseTime("-5")).toBeNull();
  });
});

describe("fmtTime", () => {
  it("formats sub-minute as seconds", () => {
    expect(fmtTime(26.04)).toBe("26.04");
    expect(fmtTime(9.9)).toBe("9.90");
    expect(fmtTime(59.99)).toBe("59.99");
  });

  it("formats >= 60s as mm:ss.xx with zero-padding", () => {
    expect(fmtTime(62.45)).toBe("1:02.45");
    expect(fmtTime(125)).toBe("2:05.00");
    expect(fmtTime(600)).toBe("10:00.00");
  });

  it("round-trips with parseTime", () => {
    for (const s of ["26.04", "1:02.45", "2:05.00", "59.99"]) {
      expect(fmtTime(parseTime(s)!)).toBe(s);
    }
  });
});
