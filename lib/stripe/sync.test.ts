import { describe, it, expect, beforeEach } from "vitest";
import type Stripe from "stripe";
import { mapStripeStatus, payloadFromSubscription } from "./sync";
import { planTypeForPrice } from "./server";

describe("mapStripeStatus", () => {
  it("maps active statuses straight through", () => {
    expect(mapStripeStatus("active")).toBe("active");
    expect(mapStripeStatus("trialing")).toBe("trialing");
    expect(mapStripeStatus("past_due")).toBe("past_due");
    expect(mapStripeStatus("canceled")).toBe("canceled");
  });

  it("maps incomplete/unpaid/paused to inactive", () => {
    expect(mapStripeStatus("unpaid")).toBe("inactive");
    expect(mapStripeStatus("incomplete")).toBe("inactive");
    expect(mapStripeStatus("incomplete_expired")).toBe("inactive");
    expect(mapStripeStatus("paused")).toBe("inactive");
  });

  it("falls back to inactive for unknown values", () => {
    expect(mapStripeStatus("something_new" as never)).toBe("inactive");
  });
});

describe("planTypeForPrice", () => {
  beforeEach(() => {
    process.env.STRIPE_PRICE_MONTHLY = "price_monthly_123";
    process.env.STRIPE_PRICE_ANNUAL = "price_annual_456";
  });

  it("resolves known prices to plan types", () => {
    expect(planTypeForPrice("price_monthly_123")).toBe("monthly");
    expect(planTypeForPrice("price_annual_456")).toBe("annual");
  });

  it("returns null for unknown / missing prices", () => {
    expect(planTypeForPrice("price_unknown")).toBeNull();
    expect(planTypeForPrice(null)).toBeNull();
    expect(planTypeForPrice(undefined)).toBeNull();
  });
});

describe("payloadFromSubscription", () => {
  beforeEach(() => {
    process.env.STRIPE_PRICE_MONTHLY = "price_monthly_123";
    process.env.STRIPE_PRICE_ANNUAL = "price_annual_456";
  });

  it("extracts status, plan, ids and the item period window", () => {
    const start = 1_700_000_000;
    const end = 1_702_592_000;
    const sub = {
      id: "sub_abc",
      status: "active",
      customer: "cus_abc",
      items: { data: [{ price: { id: "price_annual_456" }, current_period_start: start, current_period_end: end }] },
    } as unknown as Stripe.Subscription;

    const p = payloadFromSubscription("user-1", sub);
    expect(p.userId).toBe("user-1");
    expect(p.status).toBe("active");
    expect(p.planType).toBe("annual");
    expect(p.customerId).toBe("cus_abc");
    expect(p.subscriptionId).toBe("sub_abc");
    expect(p.periodStart).toBe(new Date(start * 1000).toISOString());
    expect(p.periodEnd).toBe(new Date(end * 1000).toISOString());
  });

  it("handles an expanded customer object and missing price", () => {
    const sub = {
      id: "sub_x",
      status: "past_due",
      customer: { id: "cus_x" },
      items: { data: [{ price: { id: "price_unknown" } }] },
    } as unknown as Stripe.Subscription;

    const p = payloadFromSubscription("user-2", sub);
    expect(p.status).toBe("past_due");
    expect(p.planType).toBeNull();
    expect(p.customerId).toBe("cus_x");
    expect(p.periodEnd).toBeNull();
  });
});
