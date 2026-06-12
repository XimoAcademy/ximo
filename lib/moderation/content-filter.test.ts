import { describe, it, expect } from "vitest";
import { classifyTextLocally, shouldSendToReview } from "./content-filter";

describe("classifyTextLocally", () => {
  it("always suggests pending (never auto-approves)", () => {
    expect(classifyTextLocally("hola, nuevo PB en 50 libre!").suggestedStatus).toBe("pending");
    expect(classifyTextLocally("").suggestedStatus).toBe("pending");
  });

  it("flags suspicious links", () => {
    const r = classifyTextLocally("mira esto https://spam.example.com gratis");
    expect(r.categories).toContain("suspicious_link");
    expect(r.score).toBeGreaterThan(0.1);
  });

  it("detects bare domains without a scheme", () => {
    const r = classifyTextLocally("visita tienda.com ahora");
    expect(r.categories).toContain("suspicious_link");
  });

  it("flags spammy content with many links", () => {
    const r = classifyTextLocally("a.com b.net c.org d.io");
    expect(r.categories).toContain("spam");
  });

  it("flags excessive caps as spam", () => {
    const r = classifyTextLocally("GANA DINERO RAPIDO AHORA MISMO GRATIS YA");
    expect(r.categories).toContain("spam");
  });

  it("leaves normal text without spam/link categories", () => {
    const r = classifyTextLocally("Hoy entrené mariposa y bajé mi tiempo. Vamos!");
    expect(r.categories).not.toContain("suspicious_link");
    expect(r.categories).not.toContain("spam");
  });

  it("clamps score to at most 1", () => {
    const r = classifyTextLocally("AAAA https://a.com https://b.com https://c.com https://d.com GRATIS GRATIS");
    expect(r.score).toBeLessThanOrEqual(1);
  });
});

describe("shouldSendToReview", () => {
  it("sends everything to review in phase 1", () => {
    expect(shouldSendToReview(classifyTextLocally("anything"))).toBe(true);
  });
});
