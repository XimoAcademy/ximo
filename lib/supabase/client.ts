"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./env";

/**
 * Browser-side Supabase client (for Client Components).
 *
 * Returns `null` when Supabase isn't configured, so UI can render a graceful
 * fallback instead of crashing. Usage:
 *
 *   const supabase = createClient();
 *   if (!supabase) return; // not configured yet
 */
export function createClient() {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[ximo] Supabase not configured — browser client unavailable.");
    }
    return null;
  }
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
