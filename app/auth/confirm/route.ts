import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles links from Supabase auth emails:
 *  - email confirmation / magic link  → `token_hash` + `type` (verifyOtp)
 *  - password recovery                → `token_hash` + `type=recovery`
 *  - OAuth / PKCE                      → `code` (exchangeCodeForSession)
 *
 * On success it establishes the session cookie and redirects to `next`
 * (defaults to /account-status). `next` is forced to a same-origin path.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  const rawNext = searchParams.get("next") ?? "/account-status";
  const next = rawNext.startsWith("/") ? rawNext : "/account-status";

  const supabase = await createClient();

  if (supabase) {
    if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash });
      if (!error) {
        // Password recovery must always land on the reset form, not the app.
        const dest = type === "recovery" ? "/reset-password" : next;
        return NextResponse.redirect(new URL(dest, request.url));
      }
    } else if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // PKCE recovery codes should also land on the reset form.
        const dest = next === "/account-status" && request.url.includes("recovery") ? "/reset-password" : next;
        return NextResponse.redirect(new URL(dest, request.url));
      }
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth", request.url));
}
