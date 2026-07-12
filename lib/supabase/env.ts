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

// SAFETY GUARD: a Vercel Preview deployment must never talk to the production
// database (real user data, including minors). Until the Preview environment
// variables point at the staging project, previews fail loudly here instead of
// silently reading/writing production. The project ref is public (it ships in
// NEXT_PUBLIC_SUPABASE_URL). Escape hatch: NEXT_PUBLIC_ALLOW_PROD_DB_IN_PREVIEW=1.
const PRODUCTION_PROJECT_REF = "pqmekjbqbyitkhsgizab";
const DEPLOY_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.VERCEL_ENV;
if (
  DEPLOY_ENV === "preview" &&
  SUPABASE_URL.includes(PRODUCTION_PROJECT_REF) &&
  process.env.NEXT_PUBLIC_ALLOW_PROD_DB_IN_PREVIEW !== "1"
) {
  throw new Error(
    "[ximo] Este deployment Preview está apuntando a la base de datos de PRODUCCIÓN. " +
      "Configura las variables de entorno de Preview en Vercel (Supabase staging + Stripe TEST) " +
      "o, solo si es intencional, define NEXT_PUBLIC_ALLOW_PROD_DB_IN_PREVIEW=1."
  );
}

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
