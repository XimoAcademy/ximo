/**
 * Cronometra páginas autenticadas pidiendo el HTML completo con cookies de
 * sesión reales de Supabase SSR (mismas que pone el navegador tras login).
 * Uso: node scripts/time-app-page.mjs [baseUrl]
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

// login
const login = await fetch(`${SB}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: { apikey: ANON, "Content-Type": "application/json" },
  body: JSON.stringify({ email: "qa-ximo@ximo-qa.test", password: "QA-Ximo-2026-Delfin!" }),
}).then((r) => r.json());
if (!login.access_token) { console.error("login falló", login); process.exit(1); }

// cookie @supabase/ssr: sb-<ref>-auth-token = base64-<b64url(JSON sesión)>, chunked si es larga
const sessionJson = JSON.stringify(login);
const b64 = Buffer.from(sessionJson, "utf8").toString("base64url");
const full = `base64-${b64}`;
const CHUNK = 3180;
const cookies = [];
if (full.length <= CHUNK) cookies.push(`sb-${REF}-auth-token=${full}`);
else for (let i = 0; i * CHUNK < full.length; i++) cookies.push(`sb-${REF}-auth-token.${i}=${full.slice(i * CHUNK, (i + 1) * CHUNK)}`);
const cookieHeader = cookies.join("; ");

const time = async (path) => {
  const t0 = Date.now();
  const r = await fetch(`${BASE}${path}`, { headers: { Cookie: cookieHeader }, redirect: "manual" });
  const ttfb = Date.now() - t0;
  const html = await r.text();
  const total = Date.now() - t0;
  const loadingStuck = html.includes("Cargando Ximo") && !html.includes("</html>") ? "INCOMPLETO" : "";
  // ¿el HTML final contiene contenido real o solo el loader?
  const lastChunkHasContent = html.slice(-30000);
  const hasReal = /QA Delfín|Racha|Universidades|Bienvenido|Hola/.test(lastChunkHasContent) || /QA Delfín/.test(html);
  console.log(`${path.padEnd(26)} HTTP ${r.status}  ttfb ${String(ttfb).padStart(5)}ms  total ${String(total).padStart(6)}ms  bytes ${html.length}  contenidoReal=${hasReal} ${loadingStuck}`);
  return { total, html };
};

console.log(`Base: ${BASE} | cookies: ${cookies.length} chunk(s)`);
await time("/app");
await time("/app");           // segunda vez (caches calientes)
await time("/app/tareas");
await time("/app/universidades");
await time("/app/perfil");
await time("/app/comunidad");
