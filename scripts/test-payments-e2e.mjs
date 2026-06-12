/**
 * E2E de pagos (modo TEST de Stripe, sin dinero real ni datos de tarjeta).
 *
 * Simula el ciclo completo que ocurre en producción:
 *   1. Crea un usuario de prueba en Supabase Auth (service role).
 *   2. Crea customer + suscripción REAL en Stripe test mode con el
 *      payment method de prueba documentado (pm_card_visa).
 *   3. Construye el evento checkout.session.completed, lo firma con
 *      STRIPE_WEBHOOK_SECRET (igual que Stripe) y lo manda al webhook local.
 *   4. Verifica: 200 ok · fila en subscriptions activa · profiles espejado
 *      · idempotencia (el mismo evento dos veces → duplicate).
 *   5. Limpia: cancela la suscripción y borra el usuario de prueba.
 *
 * Uso:  node scripts/test-payments-e2e.mjs   (requiere dev server en :3000)
 * Lee .env.local — necesita SUPABASE_SERVICE_ROLE_KEY y STRIPE_*.
 */
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";

// ── env ──────────────────────────────────────────────────────────────────
const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}
const need = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "STRIPE_SECRET_KEY", "STRIPE_PRICE_MONTHLY", "STRIPE_WEBHOOK_SECRET"];
const missing = need.filter((k) => !env[k]);
if (missing.length) { console.error("FALTAN en .env.local:", missing.join(", ")); process.exit(1); }

const SB = env.NEXT_PUBLIC_SUPABASE_URL;
const SRK = env.SUPABASE_SERVICE_ROLE_KEY;
const SK = env.STRIPE_SECRET_KEY;
const WEBHOOK_URL = process.env.WEBHOOK_URL ?? "http://127.0.0.1:3000/api/webhooks/stripe";

const stripe = (path, body) =>
  fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(SK + ":").toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
  }).then((r) => r.json());

const sbAdmin = (path, opts = {}) =>
  fetch(`${SB}${path}`, {
    ...opts,
    headers: { apikey: SRK, Authorization: `Bearer ${SRK}`, "Content-Type": "application/json", ...(opts.headers ?? {}) },
  });

let fails = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "✅" : "❌"} ${name}${extra ? " — " + extra : ""}`);
  if (!ok) fails++;
};

// ── main ─────────────────────────────────────────────────────────────────
const ts = Date.now();
let userId, customerId, subId;
try {
  // 1. usuario de prueba
  const ures = await sbAdmin("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({ email: `e2e-pago-${ts}@test.ximo.local`, password: `Test-${ts}!x`, email_confirm: true }),
  }).then((r) => r.json());
  userId = ures.id ?? ures.user?.id;
  check("usuario de prueba creado", Boolean(userId), userId);
  if (!userId) throw new Error("sin usuario");

  // 2. customer + suscripción real en Stripe (test mode, pm de prueba documentado)
  const cust = await stripe("customers", { email: `e2e-pago-${ts}@test.ximo.local`, "metadata[supabase_user_id]": userId });
  customerId = cust.id;
  check("customer Stripe creado", Boolean(customerId), customerId);

  const pm = await stripe(`payment_methods/pm_card_visa/attach`, { customer: customerId });
  check("payment method de prueba adjuntado", !pm.error, pm.error?.message ?? pm.id);

  const sub = await stripe("subscriptions", {
    customer: customerId,
    "items[0][price]": env.STRIPE_PRICE_MONTHLY,
    default_payment_method: pm.id,
    "metadata[supabase_user_id]": userId,
  });
  subId = sub.id;
  check("suscripción test creada y activa", sub.status === "active", `${subId} → ${sub.status}`);

  // 3. evento firmado como lo haría Stripe
  const event = {
    id: `evt_e2e_${ts}`,
    object: "event",
    type: "checkout.session.completed",
    data: { object: {
      id: `cs_e2e_${ts}`, object: "checkout.session", mode: "subscription",
      customer: customerId, subscription: subId, payment_status: "paid",
      client_reference_id: userId, metadata: { supabase_user_id: userId },
    } },
  };
  const payload = JSON.stringify(event);
  const t = Math.floor(Date.now() / 1000);
  const sig = createHmac("sha256", env.STRIPE_WEBHOOK_SECRET).update(`${t}.${payload}`).digest("hex");
  const post = () => fetch(WEBHOOK_URL, { method: "POST", headers: { "stripe-signature": `t=${t},v1=${sig}`, "Content-Type": "application/json" }, body: payload });

  const r1 = await post();
  check("webhook responde 200", r1.status === 200, `HTTP ${r1.status}: ${await r1.text()}`);

  // 4. verificación en la base
  const subRow = await sbAdmin(`/rest/v1/subscriptions?user_id=eq.${userId}&select=status,plan_type,provider_subscription_id`).then((r) => r.json());
  check("fila subscriptions activa", subRow[0]?.status === "active", JSON.stringify(subRow[0] ?? null));
  check("plan_type = monthly", subRow[0]?.plan_type === "monthly", subRow[0]?.plan_type);

  const prof = await sbAdmin(`/rest/v1/profiles?id=eq.${userId}&select=subscription_status,plan_type`).then((r) => r.json());
  check("profiles espejado (trigger)", ["active"].includes(prof[0]?.subscription_status), JSON.stringify(prof[0] ?? null));

  const ledger = await sbAdmin(`/rest/v1/processed_webhook_events?event_id=eq.${event.id}&select=event_id`).then((r) => r.json());
  check("evento en ledger idempotencia", ledger.length === 1);

  const r2 = await post();
  const r2text = await r2.text();
  check("idempotencia: duplicado ignorado", r2.status === 200 && r2text.includes("duplicate"), `HTTP ${r2.status}: ${r2text}`);

  // firma inválida → 400
  const bad = await fetch(WEBHOOK_URL, { method: "POST", headers: { "stripe-signature": `t=${t},v1=deadbeef`, "Content-Type": "application/json" }, body: payload });
  check("firma inválida rechazada (400)", bad.status === 400, `HTTP ${bad.status}`);
} finally {
  // 5. limpieza
  if (subId) await stripe(`subscriptions/${subId}`, { cancel_at_period_end: "false" }).catch(() => {});
  if (subId) await fetch(`https://api.stripe.com/v1/subscriptions/${subId}`, { method: "DELETE", headers: { Authorization: `Basic ${Buffer.from(SK + ":").toString("base64")}` } }).catch(() => {});
  if (customerId) await fetch(`https://api.stripe.com/v1/customers/${customerId}`, { method: "DELETE", headers: { Authorization: `Basic ${Buffer.from(SK + ":").toString("base64")}` } }).catch(() => {});
  if (userId) await sbAdmin(`/auth/v1/admin/users/${userId}`, { method: "DELETE" }).catch(() => {});
  console.log("🧹 limpieza hecha (suscripción cancelada, customer y usuario de prueba borrados)");
}

console.log(fails === 0 ? "\n🎉 E2E DE PAGOS: TODO PASÓ" : `\n💥 E2E DE PAGOS: ${fails} fallo(s)`);
process.exit(fails === 0 ? 0 : 1);
