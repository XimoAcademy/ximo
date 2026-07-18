import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Auth helpers. All return `null` when Supabase isn't configured or there's no
 * session, so callers (Server Components, layouts) can branch safely without
 * crashing during the static/preview phase.
 *
 * Both helpers are wrapped in React's `cache()` so a single request renders
 * with ONE `auth.getUser()` round-trip and ONE profile query, no matter how
 * many layouts/pages/data helpers ask for them. (`auth.getUser()` is a network
 * call to Supabase Auth — before this, a dashboard render repeated it 6-8×.)
 */

/** Minimal shape of a `profiles` row (mirrors the migration). */
export interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  role: "athlete" | "brand" | "admin" | string;
  country: string | null;
  sport: string | null;
  graduation_year: number | null;
  avatar_url: string | null;
  bio: string | null;
  subscription_status: string;
  plan_type: string | null;
  created_at: string;
  updated_at: string;
}

/** The currently authenticated auth user, or null. Request-memoized. */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
});

/**
 * Shared guard for server actions: resolves the Supabase client + the signed-in
 * user's id in one call (previously copy-pasted into every actions.ts).
 * `supabase: null` → Supabase unconfigured; `userId: null` → not signed in.
 */
export async function requireUser() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, userId: null } as const;
  const user = await getCurrentUser();
  return { supabase, userId: user?.id ?? null } as const;
}

/** The current user's public profile row, or null. Request-memoized. */
export const getProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  if (!supabase) return null;

  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return null;
  return (data as Profile) ?? null;
});
