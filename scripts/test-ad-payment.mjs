/**
 * E2E of the paid-ad flow (Stripe test mode). Proves: a one-time ad_payment
 * checkout.session.completed (signed) → webhook creates an ACTIVE brand_campaign
 * and approves the ad (it gets "uploaded" to the feed).
 *
 * Uso: node scripts/test-ad-payment.mjs   (requiere server en :3000)
 */
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";

const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}
const SB = env.NEXT_PUBLIC_SUPABASE_URL, SRK = env.SUPABASE_SERVICE_ROLE_KEY, WH = env.STRIPE_WEBHOOK_SECRET;
const WEBHOOK_URL = process.env.WEBHOOK_URL ?? "http://127.0.0.1:3000/api/webhooks/stripe";
for (const [k, v] of Object.entries({ SB, SRK, WH })) if (!v) { console.error("Falta", k); process.exit(1); }

const sb = (p, o = {}) => fetch(`${SB}${p}`, { ...o, headers: { apikey: SRK, Authorization: `Bearer ${SRK}`, "Content-Type": "application/json", Prefer: "return=representation", ...(o.headers ?? {}) } });
let fails = 0; const check = (n, ok, x = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${n}${x ? " — " + String(x).slice(0, 110) : ""}`); if (!ok) fails++; };

const ts = Date.now(); let userId, adId;
try {
  const u = await sb("/auth/v1/admin/users", { method: "POST", body: JSON.stringify({ email: `ad-pay-${ts}@test.ximo.local`, password: `Ad-${ts}!x`, email_confirm: true }) }).then((r) => r.json());
  userId = u.id ?? u.user?.id; check("usuario de prueba", Boolean(userId), userId);

  const brand = await sb("/rest/v1/brand_profiles", { method: "POST", body: JSON.stringify({ user_id: userId, brand_name: "Marca QA", category: "Equipo deportivo" }) }).then((r) => r.json());
  const brandId = brand[0]?.id; check("brand_profile creado", Boolean(brandId));

  const ad = await sb("/rest/v1/brand_ads", { method: "POST", body: JSON.stringify({ brand_id: brandId, title: "Anuncio QA", body: "Promo de prueba", format: "text", review_status: "pending" }) }).then((r) => r.json());
  adId = ad[0]?.id; check("brand_ad creado (pending)", ad[0]?.review_status === "pending", adId);

  // Signed one-time ad_payment event
  const event = { id: `evt_adpay_${ts}`, object: "event", type: "checkout.session.completed", data: { object: {
    id: `cs_adpay_${ts}`, object: "checkout.session", mode: "payment", payment_status: "paid",
    client_reference_id: userId,
    metadata: { type: "ad_payment", supabase_user_id: userId, brand_ad_id: adId, budget_mxn: "700", daily_mxn: "100", duration_days: "7", reach_min: "1680", reach_max: "2520" },
  } } };
  const payload = JSON.stringify(event);
  const t = Math.floor(Date.now() / 1000);
  const sig = createHmac("sha256", WH).update(`${t}.${payload}`).digest("hex");
  const r = await fetch(WEBHOOK_URL, { method: "POST", headers: { "stripe-signature": `t=${t},v1=${sig}`, "Content-Type": "application/json" }, body: payload });
  check("webhook responde 200", r.status === 200, `HTTP ${r.status}: ${await r.text()}`);

  const camp = await sb(`/rest/v1/brand_campaigns?ad_id=eq.${adId}&select=status,budget_mxn,duration_days,estimated_reach_max`).then((r) => r.json());
  check("brand_campaign ACTIVO creado", camp[0]?.status === "active", JSON.stringify(camp[0] ?? null));
  check("presupuesto/duración guardados", Number(camp[0]?.budget_mxn) === 700 && camp[0]?.duration_days === 7, JSON.stringify(camp[0] ?? null));

  const adNow = await sb(`/rest/v1/brand_ads?id=eq.${adId}&select=review_status`).then((r) => r.json());
  check("anuncio PUBLICADO (review_status=approved)", adNow[0]?.review_status === "approved", JSON.stringify(adNow[0] ?? null));
} finally {
  if (userId) await sb(`/auth/v1/admin/users/${userId}`, { method: "DELETE" }).catch(() => {}); // cascade limpia brand/ad/campaign
  console.log("limpieza hecha");
}
console.log(fails === 0 ? "\nPAGO DE ANUNCIO: TODO PASÓ" : `\nPAGO DE ANUNCIO: ${fails} fallo(s)`);
process.exit(fails === 0 ? 0 : 1);
