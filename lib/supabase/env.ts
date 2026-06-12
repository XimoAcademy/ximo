/**
 * Centralised Supabase env access.
 *
 * Everything here is intentionally defensive: if the project hasn't been
 * configured with Supabase keys yet, `isSupabaseConfigured()` is false and the
 * client helpers return `null`. Callers must handle the null case so the app
 * (and `npm run build`) keeps working with no env vars set.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Server-only. Never import this into client components. */
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** True only when the public URL + anon key are both present. */
export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}

/** True when the server-side service role key is also available. */
export function hasServiceRole(): boolean {
  return isSupabaseConfigured() && SUPABASE_SERVICE_ROLE_KEY.length > 0;
}
