import Stripe from "stripe";

/**
 * Null-safe Stripe accessor (mirrors the Supabase pattern). Returns `null` when
 * STRIPE_SECRET_KEY isn't set, so `next build` and unrelated pages keep working
 * with billing simply disabled. Never import this into a client component.
 */
// Memoize on a const holder (mutating a property, not reassigning a module
// binding) so we don't trip @next/next/no-assign-module-variable.
const cache: { client: Stripe | null } = { client: null };

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!cache.client) {
    // Omit apiVersion → use the SDK's pinned default (avoids version-string drift).
    cache.client = new Stripe(key);
  }
  return cache.client;
}

export type Plan = "monthly" | "annual";

/** True when Stripe is fully configured (secret key + monthly price id). */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_MONTHLY);
}

/** True when the optional annual plan is also configured. */
export function isAnnualConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ANNUAL);
}

export function stripePrices(): { monthly: string | null; annual: string | null } {
  return {
    monthly: process.env.STRIPE_PRICE_MONTHLY ?? null,
    annual: process.env.STRIPE_PRICE_ANNUAL ?? null,
  };
}

/** Map a Stripe Price id back to our plan_type enum. */
export function planTypeForPrice(priceId: string | null | undefined): Plan | null {
  if (!priceId) return null;
  const { monthly, annual } = stripePrices();
  if (priceId === monthly) return "monthly";
  if (priceId === annual) return "annual";
  return null;
}

export interface DisplayPrice {
  /** e.g. "$50 USD" or "$899 MXN" — formatted amount + currency code. */
  label: string;
  amount: number;
  currency: string;
}

// Live prices fetched from Stripe so the UI always matches the real charge.
// Cached for an hour; prices rarely change and this avoids a Stripe call per view.
const priceCache: { value: Partial<Record<Plan, DisplayPrice>> | null; at: number } = { value: null, at: 0 };
const PRICE_TTL_MS = 60 * 60 * 1000;

export async function getDisplayPrices(): Promise<Partial<Record<Plan, DisplayPrice>>> {
  const stripe = getStripe();
  if (!stripe) return {};
  if (priceCache.value && Date.now() - priceCache.at < PRICE_TTL_MS) return priceCache.value;

  const ids = stripePrices();
  const out: Partial<Record<Plan, DisplayPrice>> = {};
  for (const plan of ["monthly", "annual"] as const) {
    const id = ids[plan];
    if (!id) continue;
    try {
      const price = await stripe.prices.retrieve(id);
      if (price.unit_amount == null) continue;
      const amount = price.unit_amount / 100;
      const currency = price.currency.toUpperCase();
      const formatted = new Intl.NumberFormat("es-MX", {
        minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      }).format(amount);
      out[plan] = { label: `$${formatted} ${currency}`, amount, currency };
    } catch {
      // Price unavailable — UI falls back to generic copy.
    }
  }
  priceCache.value = out;
  priceCache.at = Date.now();
  return out;
}

export function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
