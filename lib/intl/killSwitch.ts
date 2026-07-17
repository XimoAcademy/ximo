/**
 * International-expansion kill switches (Phase 2 of the expansion plan).
 *
 * SERVER-SIDE ONLY. These are read from environment variables so operations
 * can flip them in Vercel without a code change, and they FAIL SAFE: with no
 * env configured, every international feature is OFF and nothing about the
 * current Mexico-first operation changes.
 *
 * The final availability decision for any paid feature must ALWAYS be
 * re-checked server-side with these switches + the per-country launch status
 * (Phase 4 country config). Client-side flags are presentation only.
 *
 * Env contract (all optional):
 *   INTL_EXPANSION_ENABLED      "true" to enable ANY international behaviour (master switch)
 *   INTL_PAYMENTS_ENABLED       "true" to allow paid flows outside México
 *   INTL_ADS_ENABLED            "true" to allow advertiser flows outside México
 *   INTL_COMMUNITY_LINK_ENABLED "true" to show the community/Discord entry outside México
 *   INTL_PAUSED_COUNTRIES       CSV of ISO 3166-1 alpha-2 codes under emergency pause, e.g. "AR,CL"
 */

const on = (v: string | undefined): boolean => v === "true";

/** Master switch. False (default) = the app behaves exactly as today (MX-only). */
export function intlExpansionEnabled(): boolean {
  return on(process.env.INTL_EXPANSION_ENABLED);
}

export type IntlFeature = "payments" | "ads" | "community";

const FEATURE_ENV: Record<IntlFeature, string> = {
  payments: "INTL_PAYMENTS_ENABLED",
  ads: "INTL_ADS_ENABLED",
  community: "INTL_COMMUNITY_LINK_ENABLED",
};

/**
 * Feature switch, subordinate to the master switch: if the master is off,
 * every feature reports off regardless of its own flag.
 */
export function intlFeatureEnabled(feature: IntlFeature): boolean {
  if (!intlExpansionEnabled()) return false;
  return on(process.env[FEATURE_ENV[feature]]);
}

/** Emergency per-country pause. Codes are case-insensitive in the env var. */
export function isCountryPaused(isoCode: string): boolean {
  const raw = process.env.INTL_PAUSED_COUNTRIES ?? "";
  if (!raw.trim()) return false;
  const paused = raw.split(",").map((c) => c.trim().toUpperCase()).filter(Boolean);
  return paused.includes(isoCode.trim().toUpperCase());
}

/**
 * México is the currently live operation and is NOT gated by the expansion
 * switches — pausing MX would take down the existing product, which only a
 * deliberate production decision (not an env typo) should ever do. The
 * emergency pause list therefore ignores "MX".
 */
export function isServiceableToday(isoCode: string): boolean {
  const code = isoCode.trim().toUpperCase();
  if (code === "MX") return true;
  if (!intlExpansionEnabled()) return false;
  return !isCountryPaused(code);
}
