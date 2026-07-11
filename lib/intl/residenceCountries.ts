/**
 * Countries offered as "país de residencia" in registration/profile.
 *
 * This is the visible first step of the international expansion: the 18
 * Spanish-speaking countries from the expansion plan (Cuba and Venezuela are
 * permanently excluded by that plan) plus Estados Unidos (athletes already
 * living there) and "Otro". Stored as display text today; the Phase 4
 * country-config migrates storage to ISO codes with residence/nationality
 * separated — keep this list in sync with docs/intl/legal/STATUS.md.
 *
 * Registering from any country is allowed (the product is a free demo);
 * PAID features stay gated per-country server-side via lib/intl/killSwitch.
 */
export const RESIDENCE_COUNTRIES = [
  "México",
  "Argentina",
  "Bolivia",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Ecuador",
  "El Salvador",
  "España",
  "Estados Unidos",
  "Guatemala",
  "Guinea Ecuatorial",
  "Honduras",
  "Nicaragua",
  "Panamá",
  "Paraguay",
  "Perú",
  "República Dominicana",
  "Uruguay",
  "Otro",
] as const;
