/**
 * Countries offered as "país de residencia" in registration/profile.
 *
 * Derived from the typed registry in lib/intl/countries.ts (single source of
 * truth) plus the "Otro" escape hatch. Stored as display text today; the
 * parallel `profiles.country_code` column (migration 010) carries the ISO
 * code going forward. Keep the registry in sync with docs/intl/legal/STATUS.md.
 *
 * Registering from any country is allowed (the product is a free demo);
 * PAID features stay gated per-country server-side via lib/intl/killSwitch.
 */
import { COUNTRIES } from "./countries";

export const RESIDENCE_COUNTRIES: readonly string[] = [
  ...COUNTRIES.map((c) => c.name),
  "Otro",
];
