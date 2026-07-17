import { afterEach, describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { paidFlowsAllowedForUser } from "./gate";

afterEach(() => {
  vi.unstubAllEnvs();
});

function fakeSupabase(row: { country_code?: string | null; country?: string | null } | null, fail = false) {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => {
            if (fail) throw new Error("column does not exist");
            return { data: row };
          },
        }),
      }),
    }),
  } as unknown as SupabaseClient;
}

describe("paidFlowsAllowedForUser", () => {
  it("allows everyone with switches off (default, fail-safe)", async () => {
    expect(await paidFlowsAllowedForUser(fakeSupabase({ country_code: "AR" }), "u1")).toBe(true);
    expect(await paidFlowsAllowedForUser(fakeSupabase(null), "u1")).toBe(true);
    expect(await paidFlowsAllowedForUser(fakeSupabase(null, true), "u1")).toBe(true);
  });

  it("switches on: blocks an expansion country, allows MX, falls back to legacy text", async () => {
    vi.stubEnv("INTL_EXPANSION_ENABLED", "true");
    vi.stubEnv("INTL_PAYMENTS_ENABLED", "true");
    expect(await paidFlowsAllowedForUser(fakeSupabase({ country_code: "AR" }), "u1")).toBe(false);
    expect(await paidFlowsAllowedForUser(fakeSupabase({ country_code: "MX" }), "u1")).toBe(true);
    // No code yet (pre-010) → mapped from legacy text.
    expect(await paidFlowsAllowedForUser(fakeSupabase({ country_code: null, country: "Argentina" }), "u1")).toBe(false);
    expect(await paidFlowsAllowedForUser(fakeSupabase({ country_code: null, country: "México" }), "u1")).toBe(true);
    // Unreadable profile (e.g. migration not applied) → legacy/unmapped → allowed.
    expect(await paidFlowsAllowedForUser(fakeSupabase(null, true), "u1")).toBe(true);
  });
});
