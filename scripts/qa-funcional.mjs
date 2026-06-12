/**
 * QA funcional — ejercita TODAS las funciones de datos como un usuario real.
 * Usa la llave anónima + JWT del usuario (RLS aplicado exactamente como en la
 * app) para cada operación que hacen los formularios, y la service key solo
 * para crear/activar/limpiar al usuario de prueba.
 *
 * Uso:
 *   node scripts/qa-funcional.mjs            → corre todo y DEJA el usuario QA
 *   node scripts/qa-funcional.mjs --cleanup  → borra el usuario QA y sus datos
 */
import { readFileSync } from "node:fs";

const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}
const SB = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SRK = env.SUPABASE_SERVICE_ROLE_KEY;

const QA_EMAIL = "qa-ximo@ximo-qa.test";
const QA_PASS = "QA-Ximo-2026-Delfin!";

const admin = (path, opts = {}) =>
  fetch(`${SB}${path}`, { ...opts, headers: { apikey: SRK, Authorization: `Bearer ${SRK}`, "Content-Type": "application/json", ...(opts.headers ?? {}) } });

let fails = 0, total = 0;
const check = (name, ok, extra = "") => {
  total++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? " — " + String(extra).slice(0, 110) : ""}`);
  if (!ok) fails++;
};

// ── cleanup mode ─────────────────────────────────────────────────────────
const existing = await admin(`/auth/v1/admin/users?page=1&per_page=100`).then((r) => r.json());
const prior = (existing.users ?? []).find((u) => u.email === QA_EMAIL);
if (process.argv.includes("--cleanup")) {
  if (prior) {
    // Borrar archivos de storage del usuario QA (no caen en el cascade de la BD).
    for (const bucket of ["avatars", "documents"]) {
      const list = await admin(`/storage/v1/object/list/${bucket}`, { method: "POST", body: JSON.stringify({ prefix: `${prior.id}/`, limit: 100 }) }).then((r) => r.json()).catch(() => []);
      for (const obj of Array.isArray(list) ? list : []) {
        await admin(`/storage/v1/object/${bucket}/${prior.id}/${obj.name}`, { method: "DELETE" }).catch(() => {});
      }
    }
    const ads = await admin(`/storage/v1/object/list/brand-ads`, { method: "POST", body: JSON.stringify({ prefix: "qa-", limit: 100 }) }).then((r) => r.json()).catch(() => []);
    for (const obj of Array.isArray(ads) ? ads : []) {
      await admin(`/storage/v1/object/brand-ads/${obj.name}`, { method: "DELETE" }).catch(() => {});
    }
    await admin(`/auth/v1/admin/users/${prior.id}`, { method: "DELETE" });
    console.log("Usuario QA + archivos de storage borrados (cascade limpia sus filas).");
  } else console.log("No había usuario QA.");
  process.exit(0);
}

// ── 1. usuario QA con suscripción activa ────────────────────────────────
let userId = prior?.id;
if (!userId) {
  const u = await admin("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({ email: QA_EMAIL, password: QA_PASS, email_confirm: true, user_metadata: { full_name: "QA Delfín" } }),
  }).then((r) => r.json());
  userId = u.id ?? u.user?.id;
}
check("usuario QA existe", Boolean(userId), userId);

// suscripción manual_active (admin comp — el webhook nunca la pisa)
const subUp = await admin(`/rest/v1/subscriptions?on_conflict=user_id`, {
  method: "POST",
  headers: { Prefer: "resolution=merge-duplicates,return=representation" },
  body: JSON.stringify({ user_id: userId, status: "manual_active", plan_type: "monthly", provider: "manual" }),
}).then((r) => r.json());
check("suscripción manual_active", subUp[0]?.status === "manual_active", JSON.stringify(subUp[0] ?? subUp).slice(0, 80));

// ── 2. login real (password grant, igual que el formulario) ─────────────
const login = await fetch(`${SB}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: { apikey: ANON, "Content-Type": "application/json" },
  body: JSON.stringify({ email: QA_EMAIL, password: QA_PASS }),
}).then((r) => r.json());
const JWT = login.access_token;
check("login con email+password", Boolean(JWT), JWT ? "token recibido" : JSON.stringify(login).slice(0, 100));
if (!JWT) process.exit(1);

const user = (path, opts = {}) =>
  fetch(`${SB}${path}`, { ...opts, headers: { apikey: ANON, Authorization: `Bearer ${JWT}`, "Content-Type": "application/json", Prefer: "return=representation", ...(opts.headers ?? {}) } });
const j = (r) => r.json().catch(() => null);

// ── 3. perfil (form de /app/perfil) ──────────────────────────────────────
let r = await j(await user(`/rest/v1/profiles?id=eq.${userId}`, { method: "PATCH", body: JSON.stringify({ full_name: "QA Delfín Pruebas", country: "México", sport: "Natación", graduation_year: 2027, bio: "Cuenta QA automatizada." }) }));
check("perfil: guardar datos", r?.[0]?.full_name === "QA Delfín Pruebas");

r = await j(await user(`/rest/v1/athlete_profiles?on_conflict=user_id`, { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=representation" }, body: JSON.stringify({ user_id: userId, primary_event: "100 libre", gpa: "3.8", sat_score: "1300", target_division: "D1" }) }));
check("perfil: datos atléticos (upsert)", r?.[0]?.primary_event === "100 libre");

// guard: intentar auto-escalar rol → el trigger debe revertirlo
r = await j(await user(`/rest/v1/profiles?id=eq.${userId}&select=role`, { method: "PATCH", body: JSON.stringify({ role: "admin" }) }));
check("seguridad: no puede hacerse admin", r?.[0]?.role === "athlete", `role=${r?.[0]?.role}`);
r = await j(await user(`/rest/v1/profiles?id=eq.${userId}&select=subscription_status`, { method: "PATCH", body: JSON.stringify({ subscription_status: "active" }) }));
check("seguridad: no puede auto-activarse", r?.[0]?.subscription_status === "manual_active", `status=${r?.[0]?.subscription_status}`);

// ── 4. racha (touchDailyStreak) ──────────────────────────────────────────
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
r = await j(await user(`/rest/v1/profiles?id=eq.${userId}&select=current_streak,longest_streak,last_streak_date`, { method: "PATCH", body: JSON.stringify({ current_streak: 1, longest_streak: 1, last_streak_date: today }) }));
check("racha: activación diaria escribe", r?.[0]?.current_streak === 1 && r?.[0]?.last_streak_date === today);

// ── 5. universidades (form + edición + borrado) ──────────────────────────
r = await j(await user(`/rest/v1/universities`, { method: "POST", body: JSON.stringify({ user_id: userId, name: "QA University", division: "D1", location: "Texas", website: "https://example.edu", fit_type: "Match" }) }));
const uniId = r?.[0]?.id;
check("universidades: agregar", Boolean(uniId));
r = await j(await user(`/rest/v1/universities?id=eq.${uniId}`, { method: "PATCH", body: JSON.stringify({ division: "D2" }) }));
check("universidades: editar", r?.[0]?.division === "D2");

// ── 6. coaches (vinculado a universidad) + correo ────────────────────────
r = await j(await user(`/rest/v1/coaches`, { method: "POST", body: JSON.stringify({ user_id: userId, name: "Coach QA", university_id: uniId, email: "coach@example.edu" }) }));
const coachId = r?.[0]?.id;
check("coaches: agregar", Boolean(coachId));
r = await j(await user(`/rest/v1/emails`, { method: "POST", body: JSON.stringify({ user_id: userId, coach_id: coachId, subject: "Intro QA", body: "Hola coach", status: "borrador" }) }));
check("correos: crear borrador", Boolean(r?.[0]?.id), JSON.stringify(r?.[0] ?? r).slice(0, 90));

// ── 7. tareas (crear + completar) ────────────────────────────────────────
r = await j(await user(`/rest/v1/tasks`, { method: "POST", body: JSON.stringify({ user_id: userId, title: "Tarea QA", description: "auto", module: "General", priority: "media", status: "pendiente" }) }));
const taskId = r?.[0]?.id;
check("tareas: crear", Boolean(taskId));
r = await j(await user(`/rest/v1/tasks?id=eq.${taskId}`, { method: "PATCH", body: JSON.stringify({ status: "completada" }) }));
check("tareas: completar", r?.[0]?.status === "completada", JSON.stringify(r?.[0] ?? r).slice(0, 80));

// ── 8. documentos ────────────────────────────────────────────────────────
r = await j(await user(`/rest/v1/documents`, { method: "POST", body: JSON.stringify({ user_id: userId, title: "Doc QA", type: "media", status: "pendiente", notes: "auto" }) }));
const docId = r?.[0]?.id;
check("documentos: crear", Boolean(docId), JSON.stringify(r?.[0] ?? r).slice(0, 90));

// ── 9. progreso (marca de tiempo) ────────────────────────────────────────
r = await j(await user(`/rest/v1/progress_entries`, { method: "POST", body: JSON.stringify({ user_id: userId, sport: "Natación", event: "100 libre", result: "58.32", result_date: today, notes: "QA Meet", media_url: "SCY" }) }));
check("progreso: registrar marca", Boolean(r?.[0]?.id), JSON.stringify(r?.[0] ?? r).slice(0, 90));

// ── 10. comunidad (post pending + comentario + like) ─────────────────────
r = await j(await user(`/rest/v1/community_posts`, { method: "POST", body: JSON.stringify({ user_id: userId, type: "text", title: null, body: "Post QA automatizado", topic: "Meta", moderation_status: "pending" }) }));
const postId = r?.[0]?.id;
check("comunidad: publicar (queda pendiente)", Boolean(postId) && r?.[0]?.moderation_status === "pending", `status=${r?.[0]?.moderation_status}`);
r = await j(await user(`/rest/v1/comments`, { method: "POST", body: JSON.stringify({ user_id: userId, post_id: postId, body: "Comentario QA" }) }));
check("comunidad: comentar", Boolean(r?.[0]?.id), JSON.stringify(r?.[0] ?? r).slice(0, 90));
r = await user(`/rest/v1/post_likes`, { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ user_id: userId, post_id: postId }) });
check("comunidad: like", r.status === 201, `HTTP ${r.status}`);

// ── 11. settings ─────────────────────────────────────────────────────────
r = await j(await user(`/rest/v1/user_settings?on_conflict=user_id`, { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=representation" }, body: JSON.stringify({ user_id: userId, language: "es", email_notifications: true, community_notifications: false }) }));
check("settings: guardar preferencias", r?.[0]?.community_notifications === false, JSON.stringify(r?.[0] ?? r).slice(0, 80));

// ── 12. STORAGE: subir archivos (avatar público, documento privado) ──────
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
let up = await fetch(`${SB}/storage/v1/object/avatars/${userId}/qa-avatar.png`, { method: "POST", headers: { apikey: ANON, Authorization: `Bearer ${JWT}`, "Content-Type": "image/png", "x-upsert": "true" }, body: png });
check("upload: avatar al bucket avatars", up.ok, `HTTP ${up.status} ${!up.ok ? await up.text() : ""}`);
let pub = await fetch(`${SB}/storage/v1/object/public/avatars/${userId}/qa-avatar.png`);
check("upload: avatar accesible públicamente", pub.ok && pub.headers.get("content-type")?.includes("image"), `HTTP ${pub.status}`);

up = await fetch(`${SB}/storage/v1/object/documents/${userId}/qa-doc.txt`, { method: "POST", headers: { apikey: ANON, Authorization: `Bearer ${JWT}`, "Content-Type": "text/plain", "x-upsert": "true" }, body: "QA doc" });
check("upload: documento al bucket privado", up.ok, `HTTP ${up.status} ${!up.ok ? await up.text() : ""}`);
pub = await fetch(`${SB}/storage/v1/object/public/documents/${userId}/qa-doc.txt`);
check("seguridad: documento privado NO es público", !pub.ok, `HTTP ${pub.status}`);
pub = await fetch(`${SB}/storage/v1/object/authenticated/documents/${userId}/qa-doc.txt`, { headers: { apikey: ANON, Authorization: `Bearer ${JWT}` } });
check("upload: dueño sí puede leer su documento", pub.ok, `HTTP ${pub.status}`);

up = await fetch(`${SB}/storage/v1/object/brand-ads/qa-${Date.now()}.png`, { method: "POST", headers: { apikey: ANON, Authorization: `Bearer ${JWT}`, "Content-Type": "image/png" }, body: png });
check("upload: media de anuncio (brand-ads)", up.ok, `HTTP ${up.status} ${!up.ok ? await up.text() : ""}`);

// ── 13. aislamiento entre usuarios (RLS) ─────────────────────────────────
const anonRead = await fetch(`${SB}/rest/v1/tasks?select=id&limit=1`, { headers: { apikey: ANON } }).then(j);
check("seguridad: anónimo no ve tareas", Array.isArray(anonRead) && anonRead.length === 0, JSON.stringify(anonRead).slice(0, 60));

// ── 14. notificaciones (lectura propia) ──────────────────────────────────
r = await j(await user(`/rest/v1/notifications?select=id&limit=5`));
check("notificaciones: lectura propia OK", Array.isArray(r));

console.log(`\n${"=".repeat(50)}\nRESULTADO: ${total - fails}/${total} pasaron${fails ? ` — ${fails} FALLARON` : " — TODO OK 🎉"}`);
console.log(`Usuario QA conservado para pruebas de navegador: ${QA_EMAIL}`);
process.exit(fails === 0 ? 0 : 1);
