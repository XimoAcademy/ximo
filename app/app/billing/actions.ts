"use server";

import { createClient } from "@/lib/supabase/server";
import { getStripe, stripePrices, appUrl, type CheckoutPlan } from "@/lib/stripe/server";

export interface CheckoutResult {
  url?: string;
  error?: string;
}

/**
 * Create a Stripe Checkout session (subscription mode) and return its hosted URL.
 * The client redirects to it. Activation happens via the webhook, never here.
 */
export async function createCheckoutSession(plan: CheckoutPlan): Promise<CheckoutResult> {
  const stripe = getStripe();
  if (!stripe) return { error: "El pago no está configurado todavía." };

  const supabase = await createClient();
  if (!supabase) return { error: "Servicio no disponible." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Inicia sesión para continuar." };

  const prices = stripePrices();
  const price = prices[plan];
  if (!price) return { error: "El plan seleccionado no está disponible." };

  // Reuse an existing Stripe customer if we already have one (RLS lets users
  // read their own subscription row); otherwise let Stripe create one from email.
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("provider_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();
  const customerId = existing?.provider_customer_id ?? null;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      client_reference_id: user.id,
      ...(customerId ? { customer: customerId } : { customer_email: user.email ?? undefined }),
      subscription_data: { metadata: { supabase_user_id: user.id } },
      metadata: { supabase_user_id: user.id },
      locale: "es",
      // For the $0 demo plan, Stripe shouldn't ask for a card.
      ...(plan === "demo" ? { payment_method_collection: "if_required" as const } : { allow_promotion_codes: true }),
      // Activation is async (webhook), so land on /subscribe — which is OUTSIDE
      // the subscription gate — and poll for access there before entering /app.
      // (Bouncing a just-paid user off the gated /app/billing would be a bad UX.)
      success_url: `${appUrl()}/subscribe?checkout=success`,
      cancel_url: `${appUrl()}/subscribe?checkout=cancel`,
    });
    if (!session.url) return { error: "No se pudo iniciar el pago." };
    return { url: session.url };
  } catch {
    return { error: "No se pudo iniciar el pago. Intenta de nuevo." };
  }
}

/**
 * Create a Stripe Billing Portal session so the user can update their card,
 * change plan, or cancel. Requires a stored Stripe customer id.
 */
export async function createPortalSession(): Promise<CheckoutResult> {
  const stripe = getStripe();
  if (!stripe) return { error: "El pago no está configurado todavía." };

  const supabase = await createClient();
  if (!supabase) return { error: "Servicio no disponible." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Inicia sesión para continuar." };

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("provider_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();
  const customerId = sub?.provider_customer_id;
  if (!customerId) return { error: "No encontramos tu información de pago." };

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl()}/app/billing`,
    });
    return { url: session.url };
  } catch {
    return { error: "El portal de facturación no está disponible. Escríbenos desde Ayuda." };
  }
}
