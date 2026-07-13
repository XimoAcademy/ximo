import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, normalizeLocale, type Locale } from "./config";

/**
 * Resolve the active locale on the server from the `ximo-lang` cookie, so the
 * FIRST server-rendered response is already in the right language (updates the
 * <html lang> attribute and any localized server content). Falls back to the
 * default locale when the cookie is missing or invalid.
 *
 * Next 16: `cookies()` is async.
 */
export async function getLocale(): Promise<Locale> {
  try {
    const store = await cookies();
    return normalizeLocale(store.get(LOCALE_COOKIE)?.value);
  } catch {
    return DEFAULT_LOCALE;
  }
}
