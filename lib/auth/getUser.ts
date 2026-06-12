import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Auth helpers. All return `null` when Supabase isn't configured or there's no
 * session, so callers (Server Components, layouts) can branch safely without
 * crashing during the static/preview phase.
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

/** The currently authenticated auth user, or null. */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

/** The current user's public profile row, or null. */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return null;
  return (data as Profile) ?? null;
}

/** Convenience: is anyone signed in right now? */
export async function isAuthenticated(): Promise<boolean> {
  return (await getCurrentUser()) !== null;
}
