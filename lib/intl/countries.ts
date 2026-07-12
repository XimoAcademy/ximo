/**
 * Typed per-country registry (Phase 4 of the international expansion plan).
 *
 * Single source of truth for every country the product can talk about:
 * ISO 3166-1 alpha-2 code, display name (Spanish, what users see and what
 * `profiles.country` has historically stored as free text), locale, candidate
 * PRESENTATION currency (never assume the Stripe MX account can settle it —
 * see docs/intl/legal/STATUS.md), and launch status.
 *
 * Launch status semantics:
 *  - "operational":        served today (México = the live operation; Estados
 *                          Unidos = athletes already living there — both
 *                          predate the expansion program and are NOT gated).
 *  - "research_required" … "paid_launch_enabled": the expansion pipeline from
 *                          docs/intl/legal/STATUS.md. Only paid_launch_enabled
 *                          allows charging, and only with the kill switches on.
 *
 * Cuba and Venezuela are PERMANENTLY EXCLUDED by the plan: they are not in
 * this registry and must never be added to selectors or payment flows.
 */
import { intlExpansionEnabled, intlFeatureEnabled, isCountryPaused } from "./killSwitch";

export type LaunchStatus =
  | "operational"
  | "research_required"
  | "legal_research_complete"
  | "legal_draft_complete"
  | "local_counsel_review_required"
  | "local_counsel_approved"
  | "privacy_approved"
  | "minors_flow_approved"
  | "tax_review_required"
  | "tax_approved"
  | "payments_tested"
  | "provider_approved"
  | "content_localized"
  | "support_ready"
  | "security_approved"
  | "free_beta_enabled"
  | "paid_launch_enabled"
  | "paused"
  | "unavailable";

export interface CountryConfig {
  /** ISO 3166-1 alpha-2, uppercase. */
  code: string;
  /** Spanish display name — exactly the free text historically stored in profiles.country. */
  name: string;
  locale: string;
  /** Candidate presentation currency (ISO 4217) — NOT a settlement guarantee. */
  currency: string;
  launchStatus: LaunchStatus;
}

/** Order matters: México first (default), then alphabetical — mirrors the register <select>. */
export const COUNTRIES: readonly CountryConfig[] = [
  { code: "MX", name: "México", locale: "es-MX", currency: "MXN", launchStatus: "operational" },
  { code: "AR", name: "Argentina", locale: "es-AR", currency: "ARS", launchStatus: "research_required" },
  { code: "BO", name: "Bolivia", locale: "es-BO", currency: "BOB", launchStatus: "research_required" },
  { code: "CL", name: "Chile", locale: "es-CL", currency: "CLP", launchStatus: "research_required" },
  { code: "CO", name: "Colombia", locale: "es-CO", currency: "COP", launchStatus: "research_required" },
  { code: "CR", name: "Costa Rica", locale: "es-CR", currency: "CRC", launchStatus: "research_required" },
  { code: "EC", name: "Ecuador", locale: "es-EC", currency: "USD", launchStatus: "research_required" },
  { code: "SV", name: "El Salvador", locale: "es-SV", currency: "USD", launchStatus: "research_required" },
  { code: "ES", name: "España", locale: "es-ES", currency: "EUR", launchStatus: "research_required" },
  { code: "US", name: "Estados Unidos", locale: "es-US", currency: "USD", launchStatus: "operational" },
  { code: "GT", name: "Guatemala", locale: "es-GT", currency: "GTQ", launchStatus: "research_required" },
  { code: "GQ", name: "Guinea Ecuatorial", locale: "es-GQ", currency: "XAF", launchStatus: "research_required" },
  { code: "HN", name: "Honduras", locale: "es-HN", currency: "HNL", launchStatus: "research_required" },
  { code: "NI", name: "Nicaragua", locale: "es-NI", currency: "NIO", launchStatus: "research_required" },
  { code: "PA", name: "Panamá", locale: "es-PA", currency: "PAB", launchStatus: "research_required" },
  { code: "PY", name: "Paraguay", locale: "es-PY", currency: "PYG", launchStatus: "research_required" },
  { code: "PE", name: "Perú", locale: "es-PE", currency: "PEN", launchStatus: "research_required" },
  { code: "DO", name: "República Dominicana", locale: "es-DO", currency: "DOP", launchStatus: "research_required" },
  { code: "UY", name: "Uruguay", locale: "es-UY", currency: "UYU", launchStatus: "research_required" },
] as const;

/** Permanently excluded — never add to selectors, payments, or marketing. */
export const EXCLUDED_COUNTRY_CODES = ["CU", "VE"] as const;

const byCode = new Map(COUNTRIES.map((c) => [c.code, c]));
const byName = new Map(COUNTRIES.map((c) => [c.name.toLowerCase(), c]));

export function countryByCode(code: string | null | undefined): CountryConfig | null {
  if (!code) return null;
  return byCode.get(code.trim().toUpperCase()) ?? null;
}

/**
 * Map the legacy free-text `profiles.country` value ("México", "Otro", user
 * typos…) to an ISO code. Returns null for "Otro", unknown text, or empty —
 * legacy rows keep a null country_code until reviewed.
 */
export function codeFromResidenceText(text: string | null | undefined): string | null {
  if (!text) return null;
  const norm = text.trim().toLowerCase();
  if (!norm || norm === "otro") return null;
  const hit = byName.get(norm);
  if (hit) return hit.code;
  // Tolerate common unaccented variants of the legacy free text.
  const unaccented = norm.normalize("NFD").replace(/[̀-ͯ]/g, "");
  for (const c of COUNTRIES) {
    if (c.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "") === unaccented) {
      return c.code;
    }
  }
  return null;
}

/**
 * Server-side answer to "can this user complete a PAID flow?" given their
 * country code (null = "Otro"/legacy free text not yet mapped).
 *
 * FAIL-SAFE contract (mirrors lib/intl/killSwitch.ts):
 *  - Expansion master switch OFF (default) → behave exactly as today: paid
 *    flows are NOT gated by country at all. Nothing changes for anyone.
 *  - Master switch ON → "operational" countries (MX, US) and unmapped/legacy
 *    users stay allowed; expansion countries require paid_launch_enabled AND
 *    the payments feature switch AND no emergency pause.
 */
export function paidFlowsAllowedForCountry(code: string | null | undefined): boolean {
  if (!intlExpansionEnabled()) return true; // current behaviour, unchanged

  const country = countryByCode(code);
  if (!country) return true; // legacy/unmapped ("Otro") — never lock out existing users
  if (country.launchStatus === "operational") return !isCountryPaused(country.code) || country.code === "MX";
  if (!intlFeatureEnabled("payments")) return false;
  if (isCountryPaused(country.code)) return false;
  return country.launchStatus === "paid_launch_enabled";
}
