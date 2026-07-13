/**
 * i18n configuration (isomorphic — safe on client and server).
 *
 * Ximo is Spanish-first (the live product language). English is the second
 * promised locale. This module is the single source of truth for the supported
 * locales and the cookie the app uses to apply a locale on the FIRST
 * server-rendered response (no flash / no client-only switch).
 *
 * Scope note: this foundation localizes the surfaces added in the international
 * expansion (education timeline, NCAA notice + resource page) plus Settings.
 * It deliberately does not claim full-app English coverage — untranslated core
 * screens fall back to Spanish source text via `t()`'s fallback.
 */

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

/** Cookie that carries the visitor's locale into the first SSR pass. */
export const LOCALE_COOKIE = "ximo-lang";
/** 1 year, in seconds. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function normalizeLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** BCP-47 / Intl locale used for date, number, and currency formatting. */
export function intlLocale(locale: Locale): string {
  return locale === "en" ? "en-US" : "es-MX";
}
