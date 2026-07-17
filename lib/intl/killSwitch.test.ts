import { afterEach, describe, expect, it, vi } from "vitest";
import { intlExpansionEnabled, intlFeatureEnabled, isCountryPaused, isServiceableToday } from "./killSwitch";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("intlExpansionEnabled (master switch)", () => {
  it("defaults OFF with no env (fail-safe)", () => {
    expect(intlExpansionEnabled()).toBe(false);
  });

  it("only the literal 'true' enables it", () => {
    vi.stubEnv("INTL_EXPANSION_ENABLED", "1");
    expect(intlExpansionEnabled()).toBe(false);
    vi.stubEnv("INTL_EXPANSION_ENABLED", "TRUE");
    expect(intlExpansionEnabled()).toBe(false);
    vi.stubEnv("INTL_EXPANSION_ENABLED", "true");
    expect(intlExpansionEnabled()).toBe(true);
  });
});

describe("intlFeatureEnabled", () => {
  it("is OFF when the master switch is off, even if the feature flag is on", () => {
    vi.stubEnv("INTL_PAYMENTS_ENABLED", "true");
    expect(intlFeatureEnabled("payments")).toBe(false);
  });

  it("requires master + feature flag", () => {
    vi.stubEnv("INTL_EXPANSION_ENABLED", "true");
    expect(intlFeatureEnabled("payments")).toBe(false);
    vi.stubEnv("INTL_PAYMENTS_ENABLED", "true");
    expect(intlFeatureEnabled("payments")).toBe(true);
    expect(intlFeatureEnabled("ads")).toBe(false);
    expect(intlFeatureEnabled("community")).toBe(false);
  });
});

describe("isCountryPaused", () => {
  it("empty/missing list pauses nobody", () => {
    expect(isCountryPaused("AR")).toBe(false);
    vi.stubEnv("INTL_PAUSED_COUNTRIES", "  ");
    expect(isCountryPaused("AR")).toBe(false);
  });

  it("matches case-insensitively and trims entries", () => {
    vi.stubEnv("INTL_PAUSED_COUNTRIES", " ar, CL ,pe");
    expect(isCountryPaused("AR")).toBe(true);
    expect(isCountryPaused("cl")).toBe(true);
    expect(isCountryPaused("PE")).toBe(true);
    expect(isCountryPaused("CO")).toBe(false);
  });
});

describe("isServiceableToday", () => {
  it("MX is always serviceable (current live operation, never env-pausable)", () => {
    expect(isServiceableToday("MX")).toBe(true);
    vi.stubEnv("INTL_PAUSED_COUNTRIES", "MX");
    expect(isServiceableToday("mx")).toBe(true);
  });

  it("every other country is OFF until the master switch is on", () => {
    expect(isServiceableToday("AR")).toBe(false);
    vi.stubEnv("INTL_EXPANSION_ENABLED", "true");
    expect(isServiceableToday("AR")).toBe(true);
  });

  it("emergency pause wins over the master switch", () => {
    vi.stubEnv("INTL_EXPANSION_ENABLED", "true");
    vi.stubEnv("INTL_PAUSED_COUNTRIES", "AR");
    expect(isServiceableToday("AR")).toBe(false);
    expect(isServiceableToday("CL")).toBe(true);
  });
});
