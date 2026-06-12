import { describe, it, expect } from "vitest";
import { computeInitials } from "./initials";

describe("computeInitials", () => {
  it("uses first + last initial for multi-word names", () => {
    expect(computeInitials("Manuel Zúñiga")).toBe("MZ");
    expect(computeInitials("Ana María López")).toBe("AL");
  });

  it("uses the first two letters for a single name", () => {
    expect(computeInitials("Fer")).toBe("FE");
    expect(computeInitials("Jo")).toBe("JO");
  });

  it("falls back to XI for empty/whitespace", () => {
    expect(computeInitials("")).toBe("XI");
    expect(computeInitials("   ")).toBe("XI");
  });

  it("collapses extra whitespace and uppercases", () => {
    expect(computeInitials("  manuel   zuniga  ")).toBe("MZ");
  });
});
