import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  isSupabaseConfigured,
  hasServiceRole,
} from "./env";

/**
 * Server-side Supabase client (Server Components, Route Handlers, Server
 * Actions). Reads/writes the auth cookies so sessions persist.
 *
 * Returns `null` when Supabase isn't configured. In Next 16, `cookies()` is
 * async, so this helper is async too.
 *
 *   const supabase = await createClient();
 *   if (!supabase) return; // not configured yet
 */
export async function createClient() {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component where cookies are read-only.
          // Safe to ignore: session refresh is handled by middleware.
        }
      },
    },
  });
}

/**
 * Service-role client — bypasses RLS. SERVER-ONLY, for trusted operations
 * (webhooks, admin tasks, moderation actions). Never expose to the browser.
 * Returns `null` if the service role key isn't set.
 */
export function createServiceRoleClient() {
  if (!hasServiceRole()) return null;

  return createServerClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        /* no-op: service role client is stateless */
      },
    },
  });
}
