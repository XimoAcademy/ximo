import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./env";

/**
 * Refreshes the Supabase auth session on each request and forwards the updated
 * auth cookies.
 *
 * SAFETY: when Supabase isn't configured this is a pure pass-through, so the
 * public site and static preview keep working with no env vars.
 *
 * NOTE: this intentionally does NOT enforce auth/subscription redirects yet.
 * Route protection (require login for /app, require active subscription for the
 * dashboard) is a later phase — see docs/database-plan.md. Adding redirects
 * before auth is wired end-to-end would risk redirect loops.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  if (!isSupabaseConfigured()) return supabaseResponse;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Touch the user to refresh the session cookie. Result is intentionally
  // unused for now (no redirect enforcement yet).
  await supabase.auth.getUser();

  return supabaseResponse;
}
