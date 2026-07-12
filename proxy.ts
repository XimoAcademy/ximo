import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Root proxy (Next 16 rename of middleware). Currently only refreshes the
 * Supabase session (safe no-op when Supabase isn't configured). Auth and
 * subscription route guards live in the app layout — see
 * lib/supabase/middleware.ts and docs/database-plan.md.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on all routes except Next internals and static assets:
     * - _next/static, _next/image
     * - favicon and common image/asset file extensions
     */
    "/((?!monitoring|_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
