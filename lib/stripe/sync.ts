import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { planTypeForPrice } from "./server";

/** Map a Stripe subscription status to our `subscriptions.status` enum. */
export function mapStripeStatus(s: Stripe.Subscription.Status | string): string {
  switch (s) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "canceled":
      return "canceled";
    case "unpaid":
    case "incomplete":
    case "incomplete_expired":
    case "paused":
    default:
      return "inactive";
  }
}

function toIso(unixSeconds: number | null | undefined): string | null {
  if (!unixSeconds) return null;
  return new Date(unixSeconds * 1000).toISOString();
}

/**
 * Read the current period window from a Stripe Subscription. In recent API
 * versions these moved from the top-level subscription onto its items, so we
 * read the item first and fall back to the legacy top-level fields.
 */
function periodFromSubscription(sub: Stripe.Subscription): { start: string | null; end: string | null } {
  const item = sub.items?.data?.[0] as unknown as { current_period_start?: number; current_period_end?: number } | undefined;
  const legacy = sub as unknown as { current_period_start?: number; current_period_end?: number };
  return {
    start: toIso(item?.current_period_start ?? legacy.current_period_start),
    end: toIso(item?.current_period_end ?? legacy.current_period_end),
  };
}

export interface SubPayload {
  userId: string;
  status: string;
  planType?: "monthly" | "annual" | null;
  customerId?: string | null;
  subscriptionId?: string | null;
  periodStart?: string | null;
  periodEnd?: string | null;
}

/**
 * Upsert the `subscriptions` row for a user from a normalized payload.
 * Guards:
 *  - Skips users whose row is `manual_active` (admin comp) so Stripe never
 *    clobbers a hand-granted subscription.
 *  - Monotonic period: never regress `current_period_end` to an older value.
 * The `sync_subscription_to_profile` trigger mirrors status/plan into profiles.
 */
export async function upsertSubscription(
  svc: SupabaseClient,
  p: SubPayload
): Promise<void> {
  const { data: existing } = await svc
    .from("subscriptions")
    .select("status,current_period_end")
    .eq("user_id", p.userId)
    .maybeSingle();

  if (existing?.status === "manual_active") return; // admin comp — leave it alone

  const row: Record<string, unknown> = {
    user_id: p.userId,
    status: p.status,
    provider: "stripe",
    updated_at: new Date().toISOString(),
  };
  if (p.planType) row.plan_type = p.planType;
  if (p.customerId) row.provider_customer_id = p.customerId;
  if (p.subscriptionId) row.provider_subscription_id = p.subscriptionId;
  if (p.periodStart) row.current_period_start = p.periodStart;

  // Monotonic guard: only advance the period end, never regress it.
  if (p.periodEnd) {
    const existingEnd = existing?.current_period_end ? new Date(existing.current_period_end).getTime() : 0;
    const incomingEnd = new Date(p.periodEnd).getTime();
    if (incomingEnd >= existingEnd) row.current_period_end = p.periodEnd;
  }

  // supabase-js reports failures via `error` and never throws; the webhook
  // relies on a thrown error here to return 500 so Stripe retries. Without
  // this, a transient DB failure would silently lose a paid activation.
  const { error } = await svc.from("subscriptions").upsert(row, { onConflict: "user_id" });
  if (error) throw new Error(`subscriptions upsert failed: ${error.message}`);
}

/** Build a payload from a Stripe Subscription object. */
export function payloadFromSubscription(userId: string, sub: Stripe.Subscription): SubPayload {
  const priceId = sub.items?.data?.[0]?.price?.id ?? null;
  const period = periodFromSubscription(sub);
  return {
    userId,
    status: mapStripeStatus(sub.status),
    planType: planTypeForPrice(priceId),
    customerId: typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null,
    subscriptionId: sub.id,
    periodStart: period.start,
    periodEnd: period.end,
  };
}
