import { afterEach, describe, expect, it, vi } from "vitest";
import {
  COUNTRIES,
  EXCLUDED_COUNTRY_CODES,
  codeFromResidenceText,
  countryByCode,
  paidFlowsAllowedForCountry,
} from "./countries";
import { RESIDENCE_COUNTRIES } from "./residenceCountries";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("registry integrity", () => {
  it("has 19 countries, México first, unique ISO codes", () => {
    expect(COUNTRIES).toHaveLength(19);
    expect(COUNTRIES[0].code).toBe("MX");
    expect(new Set(COUNTRIES.map((c) => c.code)).size).toBe(19);
  });

  it("never contains the permanently excluded countries", () => {
    for (const code of EXCLUDED_COUNTRY_CODES) {
      expect(countryByCode(code)).toBeNull();
    }
  });

  it("drives the register <select> list (registry + Otro)", () => {
    expect(RESIDENCE_COUNTRIES).toHaveLength(20);
    expect(RESIDENCE_COUNTRIES[0]).toBe("México");
    expect(RESIDENCE_COUNTRIES[RESIDENCE_COUNTRIES.length - 1]).toBe("Otro");
  });

  it("only MX and US are operational; the rest await the expansion pipeline", () => {
    const operational = COUNTRIES.filter((c) => c.launchStatus === "operational").map((c) => c.code);
    expect(operational.sort()).toEqual(["MX", "US"]);
  });
});

describe("codeFromResidenceText (legacy free text → ISO)", () => {
  it("maps every registry display name to its code", () => {
    for (const c of COUNTRIES) {
      expect(codeFromResidenceText(c.name)).toBe(c.code);
    }
  });

  it("tolerates case, whitespace and missing accents", () => {
    expect(codeFromResidenceText("  méxico ")).toBe("MX");
    expect(codeFromResidenceText("Mexico")).toBe("MX");
    expect(codeFromResidenceText("ESPAÑA")).toBe("ES");
    expect(codeFromResidenceText("Espana")).toBe("ES");
    expect(codeFromResidenceText("peru")).toBe("PE");
    expect(codeFromResidenceText("Republica Dominicana")).toBe("DO");
  });

  it("returns null for Otro, unknown text, empty, and null — never invents", () => {
    expect(codeFromResidenceText("Otro")).toBeNull();
    expect(codeFromResidenceText("Narnia")).toBeNull();
    expect(codeFromResidenceText("")).toBeNull();
    expect(codeFromResidenceText(null)).toBeNull();
    expect(codeFromResidenceText(undefined)).toBeNull();
  });

  it("never maps anything to an excluded country", () => {
    expect(codeFromResidenceText("Cuba")).toBeNull();
    expect(codeFromResidenceText("Venezuela")).toBeNull();
  });
});

describe("paidFlowsAllowedForCountry (fail-safe gating)", () => {
  it("with the master switch OFF (default), nothing is gated — current behaviour", () => {
    expect(paidFlowsAllowedForCountry("MX")).toBe(true);
    expect(paidFlowsAllowedForCountry("AR")).toBe(true);
    expect(paidFlowsAllowedForCountry("US")).toBe(true);
    expect(paidFlowsAllowedForCountry(null)).toBe(true);
    expect(paidFlowsAllowedForCountry("ZZ")).toBe(true);
  });

  it("master ON: operational countries and legacy/unmapped users stay allowed", () => {
    vi.stubEnv("INTL_EXPANSION_ENABLED", "true");
    expect(paidFlowsAllowedForCountry("MX")).toBe(true);
    expect(paidFlowsAllowedForCountry("US")).toBe(true);
    expect(paidFlowsAllowedForCountry(null)).toBe(true); // "Otro"/legacy
  });

  it("master ON: expansion countries are blocked until paid_launch_enabled + payments switch", () => {
    vi.stubEnv("INTL_EXPANSION_ENABLED", "true");
    expect(paidFlowsAllowedForCountry("AR")).toBe(false);
    vi.stubEnv("INTL_PAYMENTS_ENABLED", "true");
    // Still research_required in the registry → still blocked.
    expect(paidFlowsAllowedForCountry("AR")).toBe(false);
  });

  it("emergency pause blocks an expansion country but never MX", () => {
    vi.stubEnv("INTL_EXPANSION_ENABLED", "true");
    vi.stubEnv("INTL_PAYMENTS_ENABLED", "true");
    vi.stubEnv("INTL_PAUSED_COUNTRIES", "US,MX");
    expect(paidFlowsAllowedForCountry("US")).toBe(false);
    expect(paidFlowsAllowedForCountry("MX")).toBe(true);
  });
});
