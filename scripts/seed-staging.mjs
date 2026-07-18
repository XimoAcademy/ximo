// ════════════════════════════════════════════════════════════════════════
// Ximo — seed de datos de PRUEBA para el entorno de staging (ximo-staging).
//
// NUNCA correr contra producción: el script se niega si la URL de conexión
// apunta al proyecto de producción.
//
// USO:
//   STAGING_DATABASE_URL="postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres" \
//     node scripts/seed-staging.mjs
//
//   (o define STAGING_DB_PASSWORD y se usa el host conocido de ximo-staging)
//
// Crea:
//   - 3 usuarios de prueba (contraseña: XimoStaging2026!):
//       admin@ximostaging.com   (rol admin — habilita /app/admin/*)
//       atleta@ximostaging.com  (atleta normal)
//       marca@ximostaging.com   (dueño del perfil de marca)
//     NOTA: el dominio DEBE tener un TLD válido (ej. .com). Supabase Auth
//     rechaza dominios de prueba como .test/.local y example.com al iniciar
//     sesión por la UI (aunque el insert directo en auth.users sí los acepta).
//     Verificado: login UI en un Preview de Vercel con admin@ximostaging.com
//     entra a staging (no producción). Cambia el dominio aquí si registras uno.
//   - 3 programas NCAA con coaches (directorio)
//   - 1 perfil de marca verificado + 1 anuncio aprobado + 1 pendiente
//   - El catálogo real de cursos (supabase/seed.sql: 6 cursos · 35 lecciones)
//
// Idempotente: puede correrse varias veces (upsert por claves naturales).
// ════════════════════════════════════════════════════════════════════════
import pg from "pg";

const PROD_REF = "pqmekjbqbyitkhsgizab";
const STAGING_REF = "wpzwdmsqrgpvrjoltqff";

const url =
  process.env.STAGING_DATABASE_URL ??
  (process.env.STAGING_DB_PASSWORD
    ? `postgresql://postgres:${encodeURIComponent(process.env.STAGING_DB_PASSWORD)}@db.${STAGING_REF}.supabase.co:5432/postgres`
    : null);

if (!url) {
  console.error("Define STAGING_DATABASE_URL o STAGING_DB_PASSWORD. Abortando.");
  process.exit(1);
}
if (url.includes(PROD_REF)) {
  console.error("⛔ La URL apunta a PRODUCCIÓN. Este script es solo para staging. Abortando.");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();

const PASSWORD = "XimoStaging2026!";

async function createAuthUser(email, meta) {
  // Inserta directamente en auth.users + auth.identities (equivalente a un
  // signup confirmado). El trigger on_auth_user_created crea profile+settings.
  const { rows } = await client.query(
    `
    with new_user as (
      insert into auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token, recovery_token,
        email_change, email_change_token_new
      )
      select
        '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
        'authenticated', 'authenticated', $1::text, extensions.crypt($2::text, extensions.gen_salt('bf')),
        now(), '{"provider":"email","providers":["email"]}'::jsonb, $3::jsonb,
        now(), now(), '', '', '', ''
      where not exists (select 1 from auth.users where email = $1::text)
      returning id, email
    )
    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    )
    select gen_random_uuid(), id, id::text,
           jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true),
           'email', now(), now(), now()
    from new_user
    returning user_id
    `,
    [email, PASSWORD, JSON.stringify(meta)]
  );
  if (rows.length) return rows[0].user_id;
  const existing = await client.query("select id from auth.users where email=$1", [email]);
  return existing.rows[0].id;
}

console.log("Creando usuarios de prueba…");
const adminId = await createAuthUser("admin@ximostaging.com", {
  full_name: "Admin Staging", country: "México", sport: "Natación",
});
const athleteId = await createAuthUser("atleta@ximostaging.com", {
  full_name: "Atleta Prueba", country: "México", sport: "Natación",
});
const brandUserId = await createAuthUser("marca@ximostaging.com", {
  full_name: "Marca Prueba", country: "México", sport: "Natación",
});

// El trigger guard_profile_columns revierte cambios de rol hechos por
// conexiones que no pasan is_admin(); como conexión directa de postgres,
// se salta triggers solo para esta promoción (staging, datos de prueba).
await client.query("set session_replication_role = replica");
await client.query("update public.profiles set role='admin' where id=$1", [adminId]);
await client.query("set session_replication_role = default");
console.log("  admin:", adminId, "| atleta:", athleteId, "| marca:", brandUserId);

console.log("Sembrando directorio NCAA…");
const programs = [
  ["stanford-university", "Stanford University", "D1", "mens-swimming", "ACC", "Stanford, CA", "https://gostanford.com"],
  ["university-of-texas", "University of Texas", "D1", "mens-swimming", "SEC", "Austin, TX", "https://texassports.com"],
  ["kenyon-college", "Kenyon College", "D3", "mens-swimming", "NCAC", "Gambier, OH", "https://kenyonlords.com"],
];
for (const [slug, name, division, sport, conference, location, website] of programs) {
  const { rows } = await client.query(
    `insert into public.ncaa_programs (slug, name, division, sport, conference, location, website)
     values ($1,$2,$3,$4,$5,$6,$7)
     on conflict (slug) do update set name = excluded.name
     returning id`,
    [slug, name, division, sport, conference, location, website]
  );
  await client.query(
    `insert into public.ncaa_coaches (program_id, name, title, email, sort_order)
     select $1, 'Coach de Prueba ' || $2, 'Head Coach', 'coach+' || $2 || '@ximostaging.com', 0
     where not exists (select 1 from public.ncaa_coaches where program_id = $1)`,
    [rows[0].id, slug]
  );
}

console.log("Sembrando marca + anuncios…");
const { rows: brandRows } = await client.query(
  `insert into public.brand_profiles (user_id, brand_name, contact_email, website, category, verification_status)
   select $1, 'Marca Staging', 'marca@ximostaging.com', 'https://example.com', 'Deportes', 'verified'
   where not exists (select 1 from public.brand_profiles where user_id = $1)
   returning id`,
  [brandUserId]
);
const brandId =
  brandRows[0]?.id ??
  (await client.query("select id from public.brand_profiles where user_id=$1", [brandUserId])).rows[0].id;
await client.query(
  `insert into public.brand_ads (brand_id, title, body, format, review_status)
   select $1, 'Anuncio aprobado de prueba', 'Contenido de prueba para staging.', 'text', 'approved'
   where not exists (select 1 from public.brand_ads where brand_id = $1 and review_status = 'approved')`,
  [brandId]
);
await client.query(
  `insert into public.brand_ads (brand_id, title, body, format, review_status)
   select $1, 'Anuncio pendiente de prueba', 'Para probar la cola de moderación.', 'text', 'pending'
   where not exists (select 1 from public.brand_ads where brand_id = $1 and review_status = 'pending')`,
  [brandId]
);

console.log("Sembrando cursos…");
// El catálogo real (6 cursos · 35 lecciones) vive en supabase/seed.sql y sus
// slugs deben coincidir con app/app/cursos/courseData.ts (el registro de
// progreso resuelve por slug). Ejecutamos ese seed tal cual para que staging
// nunca vuelva a divergir del frontend con cursos de juguete.
const { readFileSync } = await import("node:fs");
const seedSql = readFileSync(new URL("../supabase/seed.sql", import.meta.url), "utf8");
await client.query(seedSql);

const counts = await client.query(`
  select
    (select count(*) from auth.users) as users,
    (select count(*) from public.profiles) as profiles,
    (select count(*) from public.profiles where role='admin') as admins,
    (select count(*) from public.ncaa_programs) as programs,
    (select count(*) from public.brand_ads) as ads,
    (select count(*) from public.courses) as courses
`);
console.log("Resumen staging:", counts.rows[0]);
await client.end();
console.log("✅ Seed completado. Password de los usuarios de prueba: " + PASSWORD);
