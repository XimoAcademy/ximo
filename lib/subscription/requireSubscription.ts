import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/getUser";

/**
 * Subscription helpers. Payments are NOT implemented yet — these read the
 * subscription state stored in the DB (which may be set manually for now).
 *
 * Everything is null/false-safe when Supabase isn't configured.
 */

/** Statuses that count as "has access". `manual_active` lets us grant access
 * by hand while real billing is mocked. */
export const ACTIVE_STATUSES = ["active", "trialing", "manual_active"] as const;

export type SubscriptionStatus =
  | "inactive"
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "manual_active"
  // allow forward-compatible values from the DB without losing the literals above
  | (string & Record<never, never>);

/**
 * Returns the current user's subscription status string, or null if not
 * configured / not signed in.
 *
 * Reads the `subscriptions` table directly (source of truth). We do NOT rely on
 * `profiles.subscription_status` here because a guard trigger blocks self-serve
 * writes to that cached column — only admins / real billing update it. The
 * `activate_subscription` RPC writes `subscriptions`, which this reads.
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return null;
  return ((data?.status as SubscriptionStatus) ?? "inactive");
}

/** True only when the user has an access-granting subscription status. */
export async function isSubscriptionActive(): Promise<boolean> {
  const status = await getSubscriptionStatus();
  if (!status) return false;
  return (ACTIVE_STATUSES as readonly string[]).includes(status);
}

/**
 * Resolve routing access in ONE place, distinguishing a transient lookup
 * failure from a genuinely-inactive subscription. Used by the root route and
 * the login/register redirects (requirements #2/#3):
 *
 *  - "unauthenticated" → no valid session (or Supabase unconfigured).
 *  - "active"          → signed in with an access-granting status.
 *  - "inactive"        → signed in, but no access-granting status.
 *  - "error"           → signed in, but the subscription lookup FAILED. We must
 *                        NOT sign the user out and NOT grant premium access —
 *                        the caller shows a recoverable/retry screen instead.
 *
 * The session itself is never destroyed here; a failed subscription read only
 * affects access, not authentication.
 */
export type AccessResolution = "unauthenticated" | "active" | "inactive" | "error";

export async function resolveAccess(): Promise<AccessResolution> {
  const supabase = await createClient();
  if (!supabase) return "unauthenticated"; // unconfigured: behave as logged-out for routing

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "unauthenticated";

  const { data, error } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Transient DB/network error — keep the session, don't grant access.
  if (error) return "error";

  const status = (data?.status as string) ?? "inactive";
  return (ACTIVE_STATUSES as readonly string[]).includes(status) ? "active" : "inactive";
}

/**
 * Guard for protected (dashboard) routes. NOT wired into any page yet — call it
 * from a Server Component / layout once auth is fully connected.
 *
 * Behaviour:
 * - Supabase not configured  → no-op (keeps static preview working).
 * - Not signed in            → redirect to /login.
 * - Signed in but inactive   → redirect to /subscribe.
 * - Signed in + active        → returns normally.
 */
export async function requireSubscription(): Promise<void> {
  const supabase = await createClient();
  if (!supabase) return; // unconfigured: don't block anything

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const active = await isSubscriptionActive();
  if (!active) redirect("/subscribe");
}
