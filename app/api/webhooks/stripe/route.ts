import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { upsertSubscription, payloadFromSubscription } from "@/lib/stripe/sync";

// Stripe SDK needs Node (not Edge); webhooks are always dynamic.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function resolveUserId(
  svc: SupabaseClient,
  opts: { metadataUserId?: string | null; subscriptionId?: string | null; customerId?: string | null }
): Promise<string | null> {
  if (opts.metadataUserId) return opts.metadataUserId;
  if (opts.subscriptionId) {
    const { data } = await svc.from("subscriptions").select("user_id").eq("provider_subscription_id", opts.subscriptionId).maybeSingle();
    if (data?.user_id) return data.user_id as string;
  }
  if (opts.customerId) {
    const { data } = await svc.from("subscriptions").select("user_id").eq("provider_customer_id", opts.customerId).maybeSingle();
    if (data?.user_id) return data.user_id as string;
  }
  return null;
}

async function handleEvent(event: Stripe.Event, svc: SupabaseClient, stripe: Stripe): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // One-time ad-campaign payment → publish the ad.
      if (session.mode === "payment" && session.metadata?.type === "ad_payment") {
        const adId = session.metadata.brand_ad_id;
        if (!adId) return;
        const days = Number(session.metadata.duration_days) || 1;
        const now = new Date();
        const ends = new Date(now.getTime() + days * 86_400_000);
        await svc.from("brand_campaigns").insert({
          ad_id: adId,
          budget_mxn: Number(session.metadata.budget_mxn) || null,
          duration_days: days,
          estimated_reach_min: Number(session.metadata.reach_min) || null,
          estimated_reach_max: Number(session.metadata.reach_max) || null,
          status: "active",
          starts_at: now.toISOString(),
          ends_at: ends.toISOString(),
        });
        // Pay → publish: approve the ad so it shows in the feed (service role
        // bypasses the review guard). In a stricter flow, approval precedes payment.
        await svc.from("brand_ads").update({ review_status: "approved" }).eq("id", adId);
        return;
      }

      const userId = session.metadata?.supabase_user_id ?? session.client_reference_id ?? null;
      const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;
      if (!userId || !subscriptionId) return;

      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      const payload = payloadFromSubscription(userId, sub);
      // For OXXO/SPEI the session can complete before the voucher is paid.
      // "no_payment_required" is the $0 demo plan — that IS fully active.
      if (session.payment_status && session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
        payload.status = "inactive";
      }
      payload.customerId = typeof session.customer === "string" ? session.customer : payload.customerId;
      await upsertSubscription(svc, payload);
      return;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = await resolveUserId(svc, {
        metadataUserId: sub.metadata?.supabase_user_id,
        subscriptionId: sub.id,
        customerId: typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
      });
      if (!userId) return;
      const payload = payloadFromSubscription(userId, sub);
      if (event.type === "customer.subscription.deleted") payload.status = "canceled";
      await upsertSubscription(svc, payload);
      return;
    }

    case "invoice.paid":
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const inv = invoice as unknown as { subscription?: string; customer?: string; parent?: { subscription_details?: { subscription?: string } } };
      const subscriptionId = inv.subscription ?? inv.parent?.subscription_details?.subscription ?? null;
      const customerId = inv.customer ?? null;
      const userId = await resolveUserId(svc, { subscriptionId, customerId });
      if (!userId) return;

      if (subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const payload = payloadFromSubscription(userId, sub);
        if (event.type === "invoice.payment_failed") payload.status = "past_due";
        else payload.status = "active";
        await upsertSubscription(svc, payload);
      } else {
        await upsertSubscription(svc, { userId, status: event.type === "invoice.paid" ? "active" : "past_due", customerId });
      }
      return;
    }

    default:
      return;
  }
}

export async function POST(req: Request): Promise<Response> {
  const stripe = getStripe();
  const svc = createServiceRoleClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !svc || !webhookSecret) {
    return new Response("Billing not configured", { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const raw = await req.text(); // RAW body — required for signature verification
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  // Idempotency: insert-first dedupe. A unique violation = already processed.
  const { error: dupeErr } = await svc
    .from("processed_webhook_events")
    .insert({ event_id: event.id, type: event.type });
  if (dupeErr) {
    // 23505 = unique_violation → we've already handled this event.
    if ((dupeErr as { code?: string }).code === "23505") return new Response("ok (duplicate)", { status: 200 });
    // Any other insert error: let Stripe retry.
    return new Response("ledger error", { status: 500 });
  }

  try {
    await handleEvent(event, svc, stripe);
  } catch {
    // We've recorded the event; surface a 500 so Stripe retries the handler.
    await svc.from("processed_webhook_events").delete().eq("event_id", event.id);
    return new Response("handler error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
