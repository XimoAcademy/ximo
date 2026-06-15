/**
 * E2E of the $0.00 DEMO flow through Stripe (test mode, no card, no money).
 * Proves: $0 subscription → signed checkout.session.completed with
 * payment_status "no_payment_required" → webhook activates the account.
 *
 * Uso: node scripts/test-demo-stripe.mjs   (requiere dev/prod server en :3000)
 */
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";

const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}
const SB = env.NEXT_PUBLIC_SUPABASE_URL, SRK = env.SUPABASE_SERVICE_ROLE_KEY, SK = env.STRIPE_SECRET_KEY;
const DEMO_PRICE = env.STRIPE_PRICE_DEMO, WH_SECRET = env.STRIPE_WEBHOOK_SECRET;
const WEBHOOK_URL = process.env.WEBHOOK_URL ?? "http://127.0.0.1:3000/api/webhooks/stripe";
for (const [k, v] of Object.entries({ SB, SRK, SK, DEMO_PRICE, WH_SECRET })) if (!v) { console.error("Falta", k); process.exit(1); }

const stripe = (p, b) => fetch(`https://api.stripe.com/v1/${p}`, { method: "POST", headers: { Authorization: `Basic ${Buffer.from(SK + ":").toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(b) }).then((r) => r.json());
const sbAdmin = (p, o = {}) => fetch(`${SB}${p}`, { ...o, headers: { apikey: SRK, Authorization: `Bearer ${SRK}`, "Content-Type": "application/json", ...(o.headers ?? {}) } });
let fails = 0; const check = (n, ok, x = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${n}${x ? " — " + String(x).slice(0, 100) : ""}`); if (!ok) fails++; };

const ts = Date.now(); let userId, customerId, subId;
try {
  const u = await sbAdmin("/auth/v1/admin/users", { method: "POST", body: JSON.stringify({ email: `demo-stripe-${ts}@test.ximo.local`, password: `Demo-${ts}!x`, email_confirm: true }) }).then((r) => r.json());
  userId = u.id ?? u.user?.id; check("usuario de prueba", Boolean(userId), userId);

  const cust = await stripe("customers", { email: `demo-stripe-${ts}@test.ximo.local`, "metadata[supabase_user_id]": userId });
  customerId = cust.id; check("customer Stripe", Boolean(customerId), customerId);

  // $0 subscription needs NO payment method
  const sub = await stripe("subscriptions", { customer: customerId, "items[0][price]": DEMO_PRICE, "metadata[supabase_user_id]": userId });
  subId = sub.id; check("suscripción $0 activa", sub.status === "active", `${subId} → ${sub.status}`);

  const event = { id: `evt_demo_${ts}`, object: "event", type: "checkout.session.completed", data: { object: { id: `cs_demo_${ts}`, object: "checkout.session", mode: "subscription", customer: customerId, subscription: subId, payment_status: "no_payment_required", client_reference_id: userId, metadata: { supabase_user_id: userId } } } };
  const payload = JSON.stringify(event);
  const t = Math.floor(Date.now() / 1000);
  const sig = createHmac("sha256", WH_SECRET).update(`${t}.${payload}`).digest("hex");
  const r = await fetch(WEBHOOK_URL, { method: "POST", headers: { "stripe-signature": `t=${t},v1=${sig}`, "Content-Type": "application/json" }, body: payload });
  check("webhook responde 200", r.status === 200, `HTTP ${r.status}: ${await r.text()}`);

  const row = await sbAdmin(`/rest/v1/subscriptions?user_id=eq.${userId}&select=status`).then((r) => r.json());
  check("cuenta ACTIVA tras demo $0 (no_payment_required)", row[0]?.status === "active", JSON.stringify(row[0] ?? null));
} finally {
  if (subId) await fetch(`https://api.stripe.com/v1/subscriptions/${subId}`, { method: "DELETE", headers: { Authorization: `Basic ${Buffer.from(SK + ":").toString("base64")}` } }).catch(() => {});
  if (customerId) await fetch(`https://api.stripe.com/v1/customers/${customerId}`, { method: "DELETE", headers: { Authorization: `Basic ${Buffer.from(SK + ":").toString("base64")}` } }).catch(() => {});
  if (userId) await sbAdmin(`/auth/v1/admin/users/${userId}`, { method: "DELETE" }).catch(() => {});
  console.log("limpieza hecha");
}
console.log(fails === 0 ? "\nDEMO $0 STRIPE: TODO PASÓ" : `\nDEMO $0 STRIPE: ${fails} fallo(s)`);
process.exit(fails === 0 ? 0 : 1);
