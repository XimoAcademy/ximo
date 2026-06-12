/**
 * Crawler autenticado: visita todas las páginas, junta todos los <a href>
 * internos y verifica que cada uno responda sin 404. Reporta tiempos.
 * Uso: node scripts/crawl-app.mjs [baseUrl]
 */
import { readFileSync } from "node:fs";

const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}
const SB = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BASE = process.argv[2] ?? "http://127.0.0.1:3000";
const REF = new URL(SB).hostname.split(".")[0];

const login = await fetch(`${SB}/auth/v1/token?grant_type=password`, {
  method: "POST", headers: { apikey: ANON, "Content-Type": "application/json" },
  body: JSON.stringify({ email: "qa-ximo@ximo-qa.test", password: "QA-Ximo-2026-Delfin!" }),
}).then((r) => r.json());
const full = `base64-${Buffer.from(JSON.stringify(login)).toString("base64url")}`;
const CHUNK = 3180;
const cookies = full.length <= CHUNK ? [`sb-${REF}-auth-token=${full}`]
  : Array.from({ length: Math.ceil(full.length / CHUNK) }, (_, i) => `sb-${REF}-auth-token.${i}=${full.slice(i * CHUNK, (i + 1) * CHUNK)}`);
const COOKIE = cookies.join("; ");

const seeds = ["/", "/login", "/register", "/subscribe", "/terminos", "/privacidad", "/build-log", "/forgot-password",
  "/app", "/app/comunidad", "/app/tareas", "/app/recruiting", "/app/directorio", "/app/universidades", "/app/coaches",
  "/app/correos", "/app/documentos", "/app/progreso", "/app/cursos", "/app/sat-toefl", "/app/promocionar",
  "/app/promocionar/campana", "/app/promocionar/revision", "/app/promocionar/preview", "/app/settings", "/app/billing",
  "/app/notifications", "/app/help", "/app/perfil", "/app/onboarding", "/app/marcas", "/app/comunidad/nuevo"];

const seen = new Map(); // path -> {status, ms, from}
const queue = [...seeds.map((p) => ({ p, from: "(seed)" }))];
const errorMarkers = /(Application error|Unhandled Runtime|Internal Server Error|500: |404: This page)/;

let pagesWithErrors = [];
while (queue.length) {
  const { p, from } = queue.shift();
  if (seen.has(p)) continue;
  const t0 = Date.now();
  let r, html = "";
  try {
    r = await fetch(`${BASE}${p}`, { headers: { Cookie: COOKIE } }); // sigue redirects
    html = await r.text();
  } catch (e) { seen.set(p, { status: "ERR " + e.message, ms: 0, from }); continue; }
  const ms = Date.now() - t0;
  const marker = errorMarkers.exec(html)?.[1] ?? "";
  seen.set(p, { status: r.status, ms, from, marker });
  if (marker) pagesWithErrors.push({ p, marker });

  // extraer hrefs internos (solo de páginas que renderizaron)
  if (r.ok && html.includes("<html")) {
    const hrefs = [...html.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]);
    for (const h of new Set(hrefs)) {
      if (h.startsWith("/_next") || h.startsWith("/brand") || h.match(/\.(png|ico|svg|css|js|webmanifest|xml|txt)$/)) continue;
      if (!seen.has(h)) queue.push({ p: h, from: p });
    }
  }
}

let bad = 0, slow = 0;
console.log(`\n${"PÁGINA".padEnd(46)} STATUS  ms`);
for (const [p, info] of [...seen.entries()].sort()) {
  const isBad = info.status === 404 || String(info.status).startsWith("ERR") || info.status >= 500 || info.marker;
  const isSlow = info.ms > 3000;
  if (isBad) bad++;
  if (isSlow) slow++;
  if (isBad || isSlow) console.log(`${p.padEnd(46)} ${String(info.status).padEnd(7)} ${info.ms}ms ${info.marker ?? ""}  <- desde ${info.from} ${isBad ? "❌" : "🐢"}`);
}
console.log(`\nTotal páginas visitadas: ${seen.size}`);
console.log(`Con 404/500/error: ${bad}`);
console.log(`Lentas (>3s): ${slow}`);
if (bad === 0) console.log("✅ NINGÚN LINK ROTO — todas las páginas responden");
const times = [...seen.values()].map((i) => i.ms).filter(Boolean).sort((a, b) => a - b);
console.log(`Tiempos: mediana ${times[Math.floor(times.length / 2)]}ms · p95 ${times[Math.floor(times.length * 0.95)]}ms · max ${times[times.length - 1]}ms`);
process.exit(bad === 0 ? 0 : 1);
