import type Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { upsertSubscription, payloadFromSubscription } from "@/lib/stripe/sync";
import { getPostHogClient } from "@/lib/posthog-server";

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
        // supabase-js reports failures via `error`, it never throws — check and
        // throw explicitly so the outer catch returns 500 and Stripe retries.
        // The idempotent update runs FIRST so a retry after a partial failure
        // can't create a duplicate campaign row.
        const { error: adErr } = await svc
          .from("brand_ads")
          .update({ review_status: "paid_ready_to_publish", budget: Number(session.metadata.budget_mxn) || null })
          .eq("id", adId);
        if (adErr) throw new Error(`brand_ads update failed: ${adErr.message}`);
        // Payment confirmed → paid_ready_to_publish. Publication stays manual:
        // an admin presses "Publicar anuncio" in /app/admin/ads, which is what
        // sets review_status='approved' (the only publicly visible status).
        const { error: campErr } = await svc.from("brand_campaigns").insert({
          ad_id: adId,
          budget_mxn: Number(session.metadata.budget_mxn) || null,
          duration_days: days,
          estimated_reach_min: Number(session.metadata.reach_min) || null,
          estimated_reach_max: Number(session.metadata.reach_max) || null,
          status: "scheduled",
          starts_at: now.toISOString(),
          ends_at: ends.toISOString(),
        });
        if (campErr) throw new Error(`brand_campaigns insert failed: ${campErr.message}`);
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

      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: userId,
        event: "subscription_activated",
        properties: {
          payment_status: session.payment_status,
          subscription_status: payload.status,
        },
      });
      await posthog.flush();
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
  } catch (err) {
    // Report — a webhook failure can mean a paid user without activation.
    Sentry.captureException(err, { tags: { webhook_event: event.type }, extra: { event_id: event.id } });
    // We've recorded the event; un-record it and surface a 500 so Stripe
    // retries. If the un-record itself fails, the retry would dedupe to 200
    // and the event would be lost — that combination is also reported.
    const { error: delErr } = await svc.from("processed_webhook_events").delete().eq("event_id", event.id);
    if (delErr) {
      Sentry.captureException(
        new Error(`webhook ledger rollback failed for ${event.id}: ${delErr.message} — event may be lost`)
      );
    }
    return new Response("handler error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
