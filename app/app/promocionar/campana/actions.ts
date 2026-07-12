"use server";

import { createClient } from "@/lib/supabase/server";
import { getStripe, appUrl } from "@/lib/stripe/server";
import { paidFlowsAllowedForUser, PAID_FLOWS_BLOCKED_ERROR } from "@/lib/intl/gate";

export interface AdPayResult {
  url?: string;
  error?: string;
}

// Bounds mirror the campaign UI (daily budget × duration).
const MIN_DAILY = 30;
const MAX_DAILY = 500;
const MAX_DAYS = 30;

/**
 * One-time payment for a brand-ad campaign. Creates a Stripe Checkout session
 * (mode: payment) for total = dailyBudget × days. On success the webhook marks
 * the ad approved and creates an active brand_campaigns row (the ad goes live).
 */
export async function payCampaignAction(input: {
  adId: string;
  dailyBudget: number;
  days: number;
  reachMin: number;
  reachMax: number;
}): Promise<AdPayResult> {
  const stripe = getStripe();
  if (!stripe) return { error: "El pago no está configurado todavía." };

  const supabase = await createClient();
  if (!supabase) return { error: "Servicio no disponible." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Inicia sesión para continuar." };

  // Country gate (server-side, can't be bypassed from the client). Fail-safe:
  // with the expansion switches off this always allows — today's behaviour.
  if (!(await paidFlowsAllowedForUser(supabase, user.id))) {
    return { error: PAID_FLOWS_BLOCKED_ERROR };
  }

  const dailyBudget = Math.min(MAX_DAILY, Math.max(MIN_DAILY, Math.round(input.dailyBudget)));
  const days = Math.min(MAX_DAYS, Math.max(1, Math.round(input.days)));
  const total = dailyBudget * days; // MXN
  const reachMin = Math.max(0, Math.round(input.reachMin));
  const reachMax = Math.max(reachMin, Math.round(input.reachMax));

  // Verify the ad belongs to this user (via their brand profiles) and isn't rejected.
  const { data: brands } = await supabase.from("brand_profiles").select("id").eq("user_id", user.id);
  const brandIds = ((brands as Array<{ id: string }>) ?? []).map((b) => b.id);
  if (brandIds.length === 0) return { error: "No encontramos tu marca." };

  const { data: ad } = await supabase
    .from("brand_ads")
    .select("id,review_status,brand_id")
    .eq("id", input.adId)
    .maybeSingle();
  const adRow = ad as { id: string; review_status: string; brand_id: string } | null;
  if (!adRow || !brandIds.includes(adRow.brand_id)) return { error: "Anuncio no encontrado." };
  // Hard rule: no payment before manual review approval.
  if (adRow.review_status !== "approved_pending_payment") {
    return { error: "Este anuncio aún no está aprobado para pago. Espera el correo de aprobación del equipo Ximo." };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "mxn",
            unit_amount: total * 100,
            product_data: {
              name: `Campaña Ximo — ${days} ${days === 1 ? "día" : "días"}`,
              description: `Alcance estimado ${reachMin.toLocaleString("es-MX")}–${reachMax.toLocaleString("es-MX")} atletas · $${dailyBudget.toLocaleString("es-MX")} MXN/día`,
            },
          },
          quantity: 1,
        },
      ],
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      locale: "es",
      metadata: {
        type: "ad_payment",
        supabase_user_id: user.id,
        brand_ad_id: input.adId,
        budget_mxn: String(total),
        daily_mxn: String(dailyBudget),
        duration_days: String(days),
        reach_min: String(reachMin),
        reach_max: String(reachMax),
      },
      success_url: `${appUrl()}/app/promocionar/revision?ad=paid`,
      cancel_url: `${appUrl()}/app/promocionar/campana`,
    });
    if (!session.url) return { error: "No se pudo iniciar el pago." };
    return { url: session.url };
  } catch {
    return { error: "No se pudo iniciar el pago. Intenta de nuevo." };
  }
}
