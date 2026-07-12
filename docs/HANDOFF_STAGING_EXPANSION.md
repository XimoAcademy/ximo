# Handoff — Staging + Expansión Internacional

Documento generado: 2026-07-11 · **Actualizado: 2026-07-12** · Ramas: `main` y `international-expansion` (reconciliada, ahora = main + trabajo intl)

Este documento reemplaza el contexto de la sesión anterior. Está escrito para que una sesión nueva de Claude pueda **empezar a ejecutar de inmediato**, sin releer ni auditar el repo completo.

---

## ⚡ ACTUALIZACIÓN 2026-07-12 — qué cambió desde que se escribió este documento

**Completado en esta sesión (verificado con build+tests, no asumido):**

- ✅ **P0-1** — `international-expansion` reconciliada con `main` (merge limpio, 0 conflictos). La rama ahora es main + los archivos intl. Sentry/PostHog/selector/tema intactos. Se le siguen mergeando los commits nuevos de main.
- ✅ **P0-2** — Las **10** migraciones (001-009 + la nueva 010) aplicadas y verificadas en `ximo-staging` por conexión directa a Postgres: 27 tablas, RLS en todas, 5 buckets, backfill de `country_code` correcto.
- ✅ **P0-3 — HECHO Y VERIFICADO E2E** (yo lo hice en los dashboards, con el Chrome del usuario ya conectado). En Vercel, las env de **Preview** ahora apuntan a staging: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable de staging) creadas solo-Preview; y quité **Preview** de la `SUPABASE_SERVICE_ROLE_KEY` de producción y de la `STRIPE_SECRET_KEY` **LIVE** (antes un Preview podía tocar la BD real o generar un cargo LIVE). En Supabase `ximo-staging` → Auth → URL Configuration agregué `https://ximo-*-ximo-academy.vercel.app/**` (P1-2). **Prueba definitiva**: un deploy Preview nuevo (`cbd88ed`) **compiló bien** (los Previews anteriores TODOS fallaban el build por el guard anti-producción) y al **iniciar sesión** en ese Preview con `admin@ximostaging.com` (usuario que solo existe en staging) entró a `/account-status` "Cuenta encontrada / Suscripción pendiente" → el Preview usa la BD de **staging**, aislada de producción. Los secretos que faltan para flujos completos (service-role de staging + Stripe TEST) los agrega Manuel cuando quiera probar pagos/admin server-side en staging; sin ellos, esas features simplemente quedan deshabilitadas en Preview (null-safe), no rompen.
  - **Hallazgo**: Supabase Auth rechaza dominios de prueba (`.test`, `example.com`) al registrarse/iniciar sesión por la UI (el insert directo de SQL sí los acepta). Por eso los usuarios seed ahora usan `@ximostaging.com` (TLD válido); ya actualicé el script y los 3 usuarios en staging.
- ✅ **P1-1** — Decisión documentada en `docs/intl/ENVIRONMENTS.md`: sin subdominio fijo, se usan URLs de Preview.
- ✅ **P1-2** — Redirect URL `https://ximo-*-ximo-academy.vercel.app/**` agregada en Auth de `ximo-staging` (parte de P0-3, verificada con el login E2E).
- ✅ **P1-3 + P1-4** — `scripts/seed-staging.mjs` creado Y ejecutado contra staging: 3 usuarios (`admin@ximostaging.com` es admin, password `XimoStaging2026!`), directorio NCAA, marca + anuncios, cursos. Login E2E confirmado en un Preview.
- ✅ **P1-5** — PostHog etiqueta `environment` en TODOS los eventos (cliente vía `posthog.register`, servidor envolviendo `capture`/`identify`).
- ✅ **P2-1** — Expedientes legales de **España, Colombia y Argentina** (`docs/intl/legal/{ES,CO,AR}.md`) con fuentes oficiales verificadas 2026-07-12; STATUS.md actualizado a `legal_research_complete (1ª pasada)`. Aprobación de abogado sigue PENDIENTE (no fabricada).
- ✅ **P2-2** — `lib/intl/countries.ts` (registro tipado ISO), `residenceCountries.ts` ahora deriva de él, signUp manda `country_code`, y migración `010_country_iso_codes.sql` (columna paralela + backfill + `handle_new_user` actualizado) **probada en staging**. **En producción la 010 AÚN NO se corre** — correrla al mergear la rama (es segura: solo añade columna/función; el código de main funciona sin ella).
- ✅ **P2-3** — Gating server-side con `lib/intl/gate.ts` en `createCheckoutSession` y `payCampaignAction`. FAIL-SAFE: con switches apagados (hoy) nada cambia para nadie.
- ✅ **Hardening extra (revisión interna completa, ya en producción):** el webhook de Stripe ahora detecta errores de BD (supabase-js no lanza excepciones — antes un fallo de BD perdía la activación de un pago SIN retry de Stripe) y reporta a Sentry; el cron aísla fallos por usuario; `appUrl()`/`siteUrl()` usan `VERCEL_URL` como fallback (los links/redirects de Preview ya no apuntan a localhost); `X-Robots-Tag: noindex` en deployments no-production; CI corre también en pushes a `international-expansion`.
- ✅ **Regresión de producción verificada** tras los deploys: landing 200 sin errores de consola, /register con los 20 países, `/ingest` 200, `/api/health` ok.

**Secretos de staging AGREGADOS por Manuel (2026-07-12, vía portapapeles solo-Preview):** ya están en Vercel, solo-Preview: `SUPABASE_SERVICE_ROLE_KEY` (secret key de `ximo-staging`, copiada directo del botón del dashboard de Supabase → nunca la vi en texto), `STRIPE_SECRET_KEY` (TEST), `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_ANNUAL`, `STRIPE_PRICE_DEMO` (TEST, desde `.env.local`). Método: por cada var que ya existía en producción, se editó la existente para quitarle **Preview** y luego se creó una entrada nueva solo-Preview con el valor de staging (Vercel no permite dos valores del mismo key solapando ambientes). Se disparó un redeploy (`87e0df8`) para tomarlos. **NO se agregó `STRIPE_WEBHOOK_SECRET`**: el de `.env.local` es de un webhook local y no coincidiría con un webhook apuntado a la URL de Preview; el checkout de Stripe TEST puede *iniciarse* en Preview, pero la *activación* de la suscripción vía webhook necesita crear un webhook nuevo en Stripe TEST → la URL de Preview (pendiente, ver más abajo). **Falta verificar** (no lo pude hacer: el clasificador de acciones del navegador se cayó temporalmente al final de la sesión) que el build `87e0df8` quedó Ready y que un checkout en Preview llega a `cs_test_...` — es una comprobación rápida que se puede hacer entrando a un Preview logueado como `admin@ximostaging.com` → /subscribe → elegir plan.

**Decisión del usuario 2026-07-12: NO comprar Supabase Pro** — se sigue sin backups automáticos; el snapshot manual de producción (`D:\XIMO\backups\prod-data-2026-07-10.json`) es la red de emergencia. Evitar migraciones de esquema destructivas en producción sin un respaldo fresco.

**Pendientes que siguen igual:** webhook Stripe TEST (esperar a decidir URL estable o probar manual), tunnel `/monitoring` con adblocker real (P1-6), migración 010 en producción tras merge, resto de países legales, decisión de Manuel sobre mergear `international-expansion` → main.

---

## 1. Estado actual del proyecto

**Qué es Ximo:** app Next.js 16 (App Router, Turbopack) + Supabase + Stripe que ayuda a atletas mexicanos (y ahora en expansión a 17 países hispanohablantes más) a organizar su proceso de recruiting deportivo hacia universidades de EE. UU.: dashboard, directorio NCAA, universidades objetivo, coaches, correos, documentos, progreso de tiempos, tareas, cursos, comunidad (Discord), anuncios de marcas, suscripción/pagos.

**Producción:** https://ximo.com.mx — Vercel (proyecto `ximo`, team `ximo-academy`, `prj_YAQNr2r2lUFC5GXVw1fI0aDDDQr1`, `team_Cmq9Cu1JmwjrcuvzG9hV7rBU`), deploy automático desde GitHub `XimoAcademy/ximo` rama `main`. Repo **público** — nunca commitear secretos reales (solo tokens públicos/write-only como el DSN de Sentry o el token de PostHog, que son seguros porque viajan en el navegador de cada visitante por diseño).

**Qué se hizo en esta sesión (todo en `main`, ya desplegado y verificado en producción):**
1. Cadena de correo completa: dominio `ximo.com.mx` verificado en Resend, `EMAIL_FROM` real, SMTP de Supabase, plantillas de auth en español, probado E2E.
2. Flujo de anuncios: preview real (no mock-up), guard de admin central (`app/app/admin/layout.tsx`), correos de aprobación/publicación al usuario dueño.
3. Copy de marca: "México primero" → "Live the Dream" en globos dorados + citas motivacionales selectivas; favicons de Ximo; entrada cinematográfica del dragón (one-time, tras "Entra al viaje", nunca reversible).
4. **Sentry** integrado (errores + tracing + replay solo-en-error con privacidad) — verificado con eventos reales en prod, source maps subiendo (`SENTRY_AUTH_TOKEN` en Vercel).
5. **PostHog** integrado (analytics) — el wizard automático de PostHog agregó el código vía PR pero **no puso el token en Vercel**; se corrigió cableando el token como fallback en código (igual patrón que el DSN de Sentry) + se hizo el cliente de servidor null-safe (antes usaba `token!` y habría tronado onboarding/registro/billing sin token) + se endureció privacidad (sin session recording, `person_profiles: "identified_only"`, sin captura de excepciones duplicada con Sentry).
6. Selector de país del registro expandido de 5 a 20 opciones (los 18 países del plan de expansión + EE. UU. + Otro) — arregla el bug reportado "el selector de país no despliega nada" (causa real: `appearance-none` ocultaba la flecha nativa, agravado en el tema claro nuevo).
7. Tema claro (durazno `#fbd1a2`) del usuario, hecho en paralelo en otra sesión, preservado y subido — confirmado que no toca el tema oscuro.
8. Snapshot de datos de producción (27 tablas) tomado como respaldo manual en `D:\XIMO\backups\prod-data-2026-07-10.json` (LOCAL, fuera del repo) porque el plan Free de Supabase no incluye backups.
9. Proyecto Supabase de staging **creado** (`ximo-staging`, ref `wpzwdmsqrgpvrjoltqff`) pero **sin migraciones aplicadas todavía** — es la tarea P0 de esta sesión.
10. Rama `international-expansion` con Fases 1-3 del plan de expansión (auditoría, kill switches, scaffolding legal) — **pero quedó desactualizada**: se ramificó en `1bdb2bb` y **le faltan los 8 commits posteriores de `main`** (Sentry, PostHog, selector de país, tema claro). Ver sección 11 para el plan de reconciliación.

**Qué funciona hoy en producción (verificado, no asumido):**
- Registro, login, onboarding, demo gratuita, pagos Stripe LIVE (checkout $0 y de pago), webhook de Stripe.
- Correo transaccional completo (bienvenida, confirmación, recuperación, notificaciones de anuncios) vía Resend + SMTP de Supabase.
- Sentry capturando errores de navegador/servidor/edge con source maps.
- PostHog capturando eventos (confirmado a nivel API con `200 {"status":"Ok"}`; falta confirmación visual en el dashboard porque Chrome se desconectó a media sesión — el usuario dijo "replay is done" así que ya revisó el dashboard él mismo).
- Build de producción limpio, 50/50 tests pasando.
- Panel de admin de anuncios y moderación protegido por rol.
- Dragón 3D del landing con entrada cinematográfica y movimiento serpenteante.

**Qué NO está terminado:**
- Staging sin migraciones aplicadas (proyecto existe, base vacía).
- `international-expansion` desactualizada respecto a `main` (falta reconciliar antes de seguir).
- Fase 3 del plan de expansión (investigación legal) solo tiene México sembrado; faltan 17 países.
- Fase 4 (country-config tipada + gating server-side + migración de `profiles.country` a ISO) no ha empezado.
- Videos de lecciones: el registro de datos ya soporta `videoUrl` por lección pero el usuario aún no ha mandado los videos.
- Backups reales de Supabase (plan Pro) — decisión de compra pendiente del usuario.
- Endpoint tunnel `/monitoring` de Sentry devolvió 404 en una prueba sintética local con POST vacío — no verificado con tráfico real de navegador (baja prioridad, los eventos igual llegan por la vía directa).

**Autenticación:** Supabase Auth (email+password), sin OAuth de terceros configurado. Cookies de sesión `sb-*`. RLS en todas las tablas.

**Pagos:** Stripe cuenta LIVE (`acct_1ThDWt3GTaLP4I7m`, MX/MXN) para producción; cuenta TEST (`acct_1ThDX7QKM5mBxbyb`) para desarrollo local, credenciales en `.env.local`.

**Email:** Resend, dominio `ximo.com.mx` verificado, remitente `Ximo <avisos@ximo.com.mx>`, SMTP también conectado a Supabase Auth para las plantillas de sistema.

**Storage:** Supabase Storage, buckets `avatars`, `brand-ads`, `documents`, `media`, `post-media`.

**Analytics/Monitoring:** Sentry (org `ximo`, proyecto `javascript-nextjs`) + PostHog (host `https://us.i.posthog.com`, proxied vía `/ingest`). Ambos con tokens públicos hardcodeados como fallback en el código — ver sección 8.

---

## 2. Objetivo de la próxima sesión

**Objetivo principal:** dejar el entorno de **staging** completamente operativo, aislado de producción, con datos de prueba propios, y **continuar la expansión internacional** (Fases 3 y 4 del plan) sin romper nada de lo que ya funciona en producción.

**"Terminado" para esta fase significa:**
1. El proyecto `ximo-staging` en Supabase tiene el esquema completo (migraciones 001-009 + `make_admin.sql` para un admin de prueba) y puede recibirse tráfico de un deploy de Vercel Preview sin tocar datos de producción.
2. Vercel tiene las variables de entorno de **Preview** apuntando a `ximo-staging` + Stripe TEST (hoy Preview hereda las credenciales de producción, lo cual es el riesgo más serio pendiente).
3. La rama `international-expansion` está reconciliada con `main` (sin perder ni el trabajo de Sentry/PostHog/país ni el trabajo de expansión).
4. Al menos 2-3 países adicionales tienen su expediente legal (`docs/intl/legal/<ISO>.md`) con research de fuentes oficiales, siguiendo el patrón ya sembrado en `MX.md`.
5. Un smoke test manual (registro, login, demo, checkout test) pasa en el deploy de staging sin afectar la base de producción ni las métricas de PostHog/Sentry de producción.
6. Nada de esto rompe producción: cada cambio se verifica con `npm run build` + `npm test` antes de commitear, y los despliegues a `main` siguen siendo deliberados.

---

## 3. Trabajo completado (checklist)

- [x] **Cadena de correo completa** — dominio verificado, SMTP, plantillas. Archivos: `lib/email/*`, `supabase/email-templates/*.html`. Commits en `main`: (sesión anterior, no en el rango mostrado arriba pero ya en `main`). No romper: el remitente `avisos@ximo.com.mx` y el SMTP de Supabase Auth ya están configurados en el dashboard de Supabase (Auth → Emails → SMTP Settings) — **no está en código**, solo confírmalo si algo de correo falla.
- [x] **Flujo de anuncios reforzado** — `app/app/admin/layout.tsx` (guard central), `lib/email/advertiser.ts`, `app/app/promocionar/preview/page.tsx`, `app/app/components/BrandAdCard.tsx`. Commit `86a27d4`.
- [x] **Copy de marca "Live the Dream"** — múltiples archivos de UI + `supabase/email-templates/*.html`. Commits `822f1c0`, `21c5e2c`.
- [x] **Favicons + entrada del dragón** — `app/favicon.ico`, `public/icons/*`, `app/components/journey/{SnakeCanvas,JourneyBackground}.tsx`. Commits `8fce690`, `1bdb2bb`. **No tocar** la lógica del estado `heroPassed`/`hasDragonEntranceTriggered` sin releer esos dos archivos — es un estado latched intencional (nunca se revierte durante la visita).
- [x] **Sentry** — `instrumentation.ts`, `instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `app/global-error.tsx`, `next.config.ts` (envuelto con `withSentryConfig`), `proxy.ts` (matcher excluye `/monitoring`). Commits `f814e52`, `e509035` (limpieza de endpoint de prueba), `ce664a4` (redeploy con `SENTRY_AUTH_TOKEN`). **Decisión de privacidad no negociable:** replay SOLO en errores (`replaysSessionSampleRate: 0`), `maskAllText: true`, `blockAllMedia: true` — por LFPDPPP y menores de edad. No cambiar sin discutirlo explícitamente.
- [x] **PostHog** — `instrumentation-client.ts` (mismo archivo que Sentry, coexisten), `lib/posthog-server.ts`, `next.config.ts` (rewrites `/ingest/*`). Commits `a5e6ec7` (PR automático del wizard), `fbee270` (null-safety), `6b3edcc` (token real + hardening de privacidad). **Decisión de privacidad no negociable:** `disable_session_recording: true`, `person_profiles: "identified_only"`, `capture_exceptions: false` (los errores van solo por Sentry, para no duplicar). Verificado en dashboard por el usuario ("replay is done").
- [x] **Selector de país (register)** — `lib/intl/residenceCountries.ts` (nuevo, solo en `main`, NO en `international-expansion`), `app/register/RegisterForm.tsx`. Commit `6a88957`. 20 opciones, México default, flecha visible en ambos selects.
- [x] **Tema claro durazno** — `app/globals.css`, scoped a `.theme-light`. Commit `6b0ab1c`. Cambio del usuario en otra sesión, preservado tal cual, NO modificar los valores de color sin pedir confirmación (es una decisión de diseño del usuario, no técnica).
- [x] **Snapshot de datos de producción** — `D:\XIMO\backups\prod-data-2026-07-10.json` (27 tablas, JSON crudo vía service-role). Es un respaldo manual, NO versionado en git, NO se actualiza automáticamente. Sirve como punto de restauración de emergencia, no como backup real.
- [x] **Proyecto Supabase `ximo-staging` creado** — ref `wpzwdmsqrgpvrjoltqff`, org Ximo (plan Free), región Americas. Contraseña de la base guardada en `D:\XIMO\backups\ximo-staging-db-password.txt` (local). **Sin migraciones aplicadas todavía** — esto es la tarea P0.
- [x] **Rama `international-expansion` — Fases 1-3 parciales:**
  - Fase 1: `docs/intl/BASELINE.md` — auditoría de stack, DB, env vars, referencias hardcodeadas a México/MXN, rutas críticas, riesgos. Commit `e658254`.
  - Fase 2: `lib/intl/killSwitch.ts` + `lib/intl/killSwitch.test.ts` (9 tests, fail-safe: sin env configurada = comportamiento actual sin cambios) + `docs/intl/ENVIRONMENTS.md` (estrategia de entornos, política de migraciones, runbook de rollback). Commit `977d267`.
  - Fase 3 (inicio): `docs/intl/legal/STATUS.md` (tracker de 18 países, todos `research_required`), `docs/intl/legal/_TEMPLATE.md` (ficha con 38 temas legales), `docs/intl/legal/MX.md` (único país sembrado, solo con hechos verificables en el código, sin inventar conclusiones legales). Commit `9167530`.
  - Actualización de docs tras confirmar que Supabase Free no tiene backups + crear el proyecto staging. Commit `111a42a`.
  - **IMPORTANTE:** esta rama está en el commit base `1bdb2bb` y le faltan 8 commits de `main` (todo lo de Sentry, PostHog, selector de país, tema claro). Ver sección 11, tarea P0-2.

---

## 4. Tareas pendientes (priorizadas)

### P0 — Bloqueante/crítico

**P0-1. Reconciliar `international-expansion` con `main`**
- **Objetivo exacto:** que la rama tenga todo el historial de `main` (incluido `6b3edcc`) MÁS los 7 archivos exclusivos de la rama (`docs/intl/*`, `lib/intl/killSwitch*`).
- **Por qué importa:** si se sigue trabajando sobre la rama desactualizada, cualquier merge futuro a `main` traerá conflictos grandes o — peor — un merge automático podría revertir silenciosamente Sentry/PostHog/el selector de país si no se resuelve con cuidado.
- **Archivos/servicios:** todo el repo; especialmente `next.config.ts`, `instrumentation-client.ts`, `lib/posthog-server.ts` (estos archivos existen en ambas ramas con contenido diferente — main los tiene con Sentry+PostHog, la rama no los tiene en absoluto).
- **Enfoque recomendado (el más simple y seguro):** NO usar `git merge` a ciegas. En su lugar:
  1. `git checkout international-expansion`
  2. `git merge main` — esto traerá todos los commits de main. Como los archivos de Sentry/PostHog NO EXISTEN en la rama (fueron creados después del punto de ramificación), el merge los añadirá sin conflicto real en la mayoría de los casos (git los ve como "archivos nuevos que main tiene y la rama no").
  3. Los únicos posibles conflictos reales serían en archivos que AMBAS ramas modificaron después del punto de ramificación — pero según el diff, la rama `international-expansion` no modificó ningún archivo compartido con los commits nuevos de main (todo su trabajo son archivos nuevos bajo `docs/intl/` y `lib/intl/`). **Se espera merge limpio sin conflictos.**
  4. Verificar con `git diff main international-expansion --stat` después del merge: debería mostrar CERO diferencias fuera de que la rama ahora es idéntica a main + sus 7 archivos propios.
- **Verificación:** `npm run build` y `npm test` en la rama después del merge. Confirmar que `docs/intl/*` y `lib/intl/killSwitch.ts` siguen presentes.
- **Definición de terminado:** `git log international-expansion` muestra `6b3edcc` en su historial; build y tests pasan; los 7 archivos de expansión siguen ahí.
- **Riesgo conocido:** si por algún motivo SÍ hay conflictos, revisar con cuidado — nunca resolver un conflicto descartando el lado de `main` en archivos como `instrumentation-client.ts` o `next.config.ts`, eso borraría Sentry/PostHog de producción cuando esta rama eventualmente se mergee de vuelta.

**P0-2. Aplicar migraciones en `ximo-staging`**
- **Objetivo exacto:** correr `supabase/migrations/001_initial_ximo_schema.sql` hasta `009_ad_review_flow.sql` (en orden, 9 archivos) + `supabase/make_admin.sql` (editado con un correo de prueba, no el del usuario real) en el proyecto `ximo-staging` (ref `wpzwdmsqrgpvrjoltqff`).
- **Por qué importa:** hoy el proyecto de staging existe pero tiene una base vacía — nada funciona ahí todavía. Es el prerequisito de TODO lo demás de esta sesión.
- **Archivos:** `supabase/migrations/*.sql` (leer, no modificar — son historial inmutable), `supabase/make_admin.sql` (plantilla, sí se edita el correo antes de correrlo).
- **Dependencias:** ninguna, puede hacerse en paralelo a P0-1.
- **Enfoque recomendado:** Dashboard de Supabase (`ximo-staging`) → SQL Editor → pegar y correr cada migración en orden ascendente (001 primero). Si el usuario tiene el dashboard abierto en Chrome, se puede automatizar con las herramientas de navegador (ya se hizo así con la migración 009 en producción en una sesión anterior — clipboard + paste en el editor Monaco funciona, el `eval` de JS está bloqueado en el dashboard).
- **Verificación:** en el SQL Editor, `select count(*) from public.profiles;` debe devolver 0 sin error (tabla existe, vacía). `select * from pg_tables where schemaname='public';` debe listar ~26-27 tablas (ver lista completa en la sección 7, "Base de datos").
- **Definición de terminado:** las 9 migraciones corrieron sin error, las tablas existen, RLS está activo (heredado de la migración 001).
- **Riesgo conocido:** la migración 001 crea funciones/triggers que dependen de `auth.users` — si el proyecto de Supabase no tiene Auth habilitado por defecto puede fallar; Supabase lo habilita por defecto así que no debería ser problema, pero verificar el mensaje de error si algo falla ahí.

**P0-3. Configurar variables de entorno de Vercel Preview apuntando a staging**
- **Objetivo exacto:** en Vercel → proyecto `ximo` → Settings → Environment Variables, para CADA variable de Supabase/Stripe, agregar un valor específico para el ambiente **Preview** que sea diferente del de Production (hoy Preview hereda las credenciales de producción, que es el riesgo de seguridad/datos más serio de todo este trabajo).
- **Por qué importa:** ahora mismo, cualquier Pull Request que Vercel despliegue como Preview usa la BASE DE DATOS DE PRODUCCIÓN REAL y las claves de Stripe LIVE. Un bug en un PR podría escribir datos de prueba en la base real de usuarios, o peor, hacer un cargo real con Stripe LIVE.
- **Variables a diferenciar** (ver tabla completa en sección 8): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` → valores del proyecto `ximo-staging`. `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*` → valores de la cuenta TEST de Stripe (`acct_1ThDX7QKM5mBxbyb`, ya usada en `.env.local` para dev local, mismos valores sirven para Preview). `NEXT_PUBLIC_SITE_URL`/`NEXT_PUBLIC_APP_URL` → la URL de preview de Vercel (Vercel provee `VERCEL_URL` automáticamente; se puede usar eso o dejarlo fijo a un dominio de staging si se crea uno).
- **Enfoque recomendado:** en el dashboard de Vercel, cada variable existente tiene un desplegable de "Environments" (Production / Preview / Development) — hoy probablemente están marcadas con las tres casillas usando el mismo valor. Hay que **editar cada una**, desmarcar Preview del valor de producción, y crear una entrada nueva solo-Preview con el valor de staging. Es trabajo manual de dashboard, no de código.
- **Verificación:** abrir cualquier Preview deployment reciente de Vercel y en sus logs de build/runtime confirmar (sin exponer secretos) que apunta al host de `ximo-staging` y no al de producción.
- **Definición de terminado:** un registro de prueba hecho en un Preview deployment aparece en la tabla `profiles` de `ximo-staging`, NO en la de producción.
- **Riesgo conocido:** si se edita mal y se deja Preview sin ninguna variable de Supabase, los Preview deployments simplemente fallarán en build o runtime — no es destructivo, pero rompe la validación de PRs hasta corregirlo.

### P1 — Requerido antes de que staging esté listo

**P1-1. Dominio o subdominio de staging (opcional pero recomendado)**
- **Objetivo:** decidir si staging usa solo las URLs automáticas de Vercel Preview (`ximo-git-<branch>-ximo-academy.vercel.app`) o si se crea un subdominio fijo tipo `staging.ximo.com.mx`.
- **Por qué importa:** un subdominio fijo facilita pruebas repetibles (URLs de callback de Stripe/Auth estables) pero requiere otro registro DNS en IONOS.
- **Recomendación:** empezar SIN subdominio fijo (usar las URLs de Preview de Vercel, que ya son únicas por rama) — es cero configuración adicional y cubre el caso de uso actual. Revisar de nuevo si el equipo crece y se necesita compartir un link estable de staging con QA externo.
- **Definición de terminado:** decisión documentada en `docs/intl/ENVIRONMENTS.md` (agregar una línea).

**P1-2. Redirect URLs de Supabase Auth para staging**
- **Objetivo exacto:** en Supabase (proyecto `ximo-staging`) → Authentication → URL Configuration, agregar la(s) URL(s) de Preview de Vercel (o el patrón `https://ximo-git-*-ximo-academy.vercel.app/**`) a la lista de Redirect URLs permitidas.
- **Por qué importa:** sin esto, el login/registro en staging redirige mal o falla tras la confirmación de email.
- **Verificación:** completar un registro de prueba en un Preview deployment y confirmar que el correo de confirmación lleva de vuelta a la URL correcta.
- **Definición de terminado:** login/registro completo funciona en staging sin errores de redirect.

**P1-3. Seed de datos de prueba para staging**
- **Objetivo exacto:** crear un script simple (`scripts/seed-staging.mjs`, no existe todavía) que inserte 2-3 usuarios de prueba, algunas universidades NCAA de ejemplo, y un anuncio de marca de ejemplo — usando la service-role key de `ximo-staging`.
- **Por qué importa:** probar flujos como "directorio NCAA" o "marcas y oportunidades" necesita datos; no se debe copiar información real de usuarios de producción (ya está prohibido explícitamente en `docs/intl/ENVIRONMENTS.md`).
- **Referencia:** ya existen scripts similares de una sesión anterior (`scripts/test-payments-e2e.mjs`, `scripts/test-demo-stripe.mjs`, `scripts/qa-funcional.mjs` si existen — confirmar con `ls scripts/` antes de escribir uno nuevo desde cero).
- **Definición de terminado:** correr el script contra `ximo-staging` puebla datos ficticios visibles en la app.

**P1-4. Admin de prueba en staging**
- **Objetivo:** correr `supabase/make_admin.sql` (editado con el correo del usuario de prueba del seed) contra `ximo-staging` para poder probar `/app/admin/ads` y `/app/admin/moderation` en staging.
- **Prerequisito:** P0-2 y P1-3 completos.
- **Definición de terminado:** login como ese usuario de prueba muestra los links de Admin en el sidebar.

**P1-5. Verificar que Sentry/PostHog no mezclan datos de staging con producción**
- **Objetivo exacto:** decidir si staging manda sus eventos al MISMO proyecto de Sentry/PostHog (con `environment: "preview"` etiquetado, que Sentry ya hace automáticamente vía `VERCEL_ENV`) o a proyectos separados.
- **Por qué importa:** contaminar las métricas de producción con tráfico de pruebas distorsiona los dashboards reales.
- **Estado actual:** Sentry ya etiqueta `environment` con `process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV` (ver `instrumentation-client.ts` línea ~20) — en un Preview deployment esto será `"preview"` automáticamente, así que Sentry YA distingue. Se puede filtrar en el dashboard de Sentry por ese campo.
- **PostHog NO tiene esta distinción todavía** — todos los eventos van al mismo proyecto sin importar el ambiente.
- **Recomendación:** agregar una property `environment` a los eventos de PostHog (tanto en `instrumentation-client.ts` como en `lib/posthog-server.ts`) leyendo `process.env.NEXT_PUBLIC_VERCEL_ENV`, para poder filtrar en el dashboard. Es un cambio pequeño y de bajo riesgo.
- **Definición de terminado:** un evento de prueba disparado desde un Preview deployment aparece en PostHog con `environment: "preview"` visible en sus propiedades.

**P1-6. Confirmar comportamiento del tunnel `/monitoring` de Sentry con tráfico real**
- **Objetivo:** la prueba sintética local (POST vacío) devolvió 404; confirmar con un error real disparado desde el navegador (no curl) que el tunnel funciona y ayuda contra ad-blockers.
- **Por qué importa:** si el tunnel no funciona, los usuarios con ad-blockers no reportarán errores a Sentry (Sentry seguirá funcionando para el resto, solo es una capa de resiliencia extra).
- **Verificación:** en un navegador con una extensión de ad-blocking activa, provocar un error real en la app y confirmar en la pestaña Network que la petición sale por `/monitoring` y en el dashboard de Sentry que el evento llegó.
- **Prioridad real:** baja, pero se marca P1 porque es rápido de verificar y cierra una duda abierta.

### P2 — Trabajo de expansión importante

**P2-1. Investigación legal de 3-5 países adicionales**
- **Objetivo exacto:** usando `docs/intl/legal/_TEMPLATE.md` como plantilla y las anclas normativas ya listadas en `docs/intl/legal/STATUS.md`, crear `docs/intl/legal/ES.md`, `docs/intl/legal/CO.md`, `docs/intl/legal/AR.md` (España, Colombia, Argentina son los mercados de mayor prioridad por tamaño de comunidad hispanohablante) con investigación real de fuentes oficiales.
- **Por qué importa:** ningún país puede llegar a `paid_launch_enabled` sin este research + aprobación de abogado humano — es el ritmo de avance de todo el programa de expansión.
- **Reglas estrictas (ya documentadas en el plan, repetidas aquí porque son las que más se rompen):** solo fuentes oficiales (gacetas, autoridades de datos/consumo/fiscales; para España específicamente EUR-Lex, BOE, AEPD). Nunca tratar un proyecto de ley como vigente. Nunca fabricar una aprobación de abogado — si no hay abogado real revisando, el campo de aprobación queda vacío/pendiente.
- **Verificación:** cada conclusión legal en el archivo debe tener fuente oficial citada con URL.
- **Definición de terminado:** cada país tiene su archivo con al menos los temas de protección de datos, menores de edad, y regulación de pagos/impuestos cubiertos (no necesariamente los 38 temas completos en la primera pasada).

**P2-2. Country-config tipada (Fase 4 del plan, NO empezada)**
- **Objetivo exacto:** crear `lib/intl/countries.ts` con un registro tipado por país (ISO 3166-1 alpha-2, locale, zona horaria, moneda, metadata de edad/tutores, versión de documentos legales aplicables, estado de lanzamiento) reemplazando el `lib/intl/residenceCountries.ts` actual (que es solo una lista de strings para el `<select>`).
- **Por qué importa:** es el corazón técnico de la expansión — sin esto, no se puede gatear pagos/anuncios por país de forma confiable.
- **Prerequisito duro:** P0-2 (staging con migraciones) debe estar listo ANTES de tocar el esquema de `profiles.country`, porque este trabajo probablemente requiere una migración de datos (de texto libre a código ISO).
- **Riesgo mayor de todo el programa:** `profiles.country` hoy es texto libre en español ("México", "Otro") sin códigos ISO. Migrar esto en producción sin cuidado puede romper perfiles existentes. **Probar la migración en `ximo-staging` primero, nunca directo en producción.**
- **Enfoque recomendado:** no romper el campo existente — añadir una columna nueva `country_code` (ISO) en paralelo, poblarla con un mapeo desde el texto libre actual, y solo después de verificar que el mapeo es correcto para el 100% de los usuarios existentes, decidir si se deprecia el campo viejo.
- **Definición de terminado:** existe `lib/intl/countries.ts`, existe una migración `010_country_iso_codes.sql` probada en staging, y el registro/perfil usan el código ISO internamente aunque sigan mostrando el nombre en español al usuario.

**P2-3. Gating server-side de pagos/anuncios por país**
- **Objetivo:** usar `lib/intl/killSwitch.ts` (ya existe y está probado) en los puntos de entrada de pago (`app/app/billing/actions.ts`, `app/app/promocionar/campana/actions.ts`) para que un país sin `paid_launch_enabled` no pueda completar un checkout, verificado en el servidor (nunca solo ocultando un botón en el cliente).
- **Prerequisito:** P2-2 (country-config) debe existir primero, porque el kill switch necesita saber el país del usuario para decidir.
- **Definición de terminado:** un usuario con país "Argentina" (sin gates aprobados) no puede completar un checkout de Stripe aunque manipule el DOM del cliente — la validación server-side lo rechaza.

### P3 — Mejoras opcionales

**P3-1.** Subdominio fijo de staging si el equipo lo pide más adelante (ver P1-1).
**P3-2.** Dashboard interno simple para ver el estado de `docs/intl/legal/STATUS.md` sin abrir el markdown (nice-to-have, no crítico).
**P3-3.** Automatizar el snapshot de datos de producción (hoy es manual) con un cron script, una vez que Supabase Pro esté activo y haya backups reales (esto se vuelve redundante).

---

## 5. Checklist del entorno de staging

| Ítem | Estado |
|---|---|
| Proyecto Supabase separado | ✅ Creado (`ximo-staging`, ref `wpzwdmsqrgpvrjoltqff`) |
| Migraciones aplicadas en staging | ❌ Falta — P0-2 |
| Dominio/subdominio de staging | ⚠️ No decidido — recomendación en P1-1 es usar URLs de Preview de Vercel directamente |
| Estrategia de rama/deploy | ⚠️ Parcial — Vercel ya despliega Preview automático por PR/rama; falta que esas Previews usen credenciales de staging (P0-3) |
| Preview vs staging permanente | Se recomienda usar Preview deployments de Vercel (ya existen sin configuración extra) en vez de un deploy staging permanente separado |
| Variables de entorno (Preview) | ❌ Hoy Preview hereda producción — P0-3 es la tarea crítica |
| Variables públicas vs privadas | ✅ Ya diferenciadas correctamente en el código (`NEXT_PUBLIC_*` vs el resto) — solo falta diferenciar los VALORES por ambiente en Vercel |
| Base de datos aislada | ✅ Proyecto separado creado, ❌ sin poblar |
| Datos seed/de prueba | ❌ Falta — P1-3, no existe script todavía |
| Redirect URLs de auth | ❌ Falta configurar en el proyecto `ximo-staging` — P1-2 |
| OAuth | N/A — la app no usa OAuth de terceros, solo email+password |
| Cookies/sesión | ✅ Sin cambios necesarios, Supabase SSR maneja esto automáticamente por dominio |
| Pagos en modo test | ⚠️ Las credenciales TEST de Stripe ya existen en `.env.local`; falta ponerlas en Vercel Preview (parte de P0-3) |
| Webhooks | ⚠️ El webhook de Stripe (`app/api/webhooks/stripe/route.ts`) necesita su propio endpoint+secret configurado en el dashboard de Stripe TEST apuntando a la URL de Preview — no se ha hecho, pendiente dentro de P0-3 |
| Configuración de email de prueba | ⚠️ Resend/SMTP de producción seguirían usándose salvo que se cree un remitente de staging — recomendación: dejarlo igual por ahora (bajo riesgo, son pocos correos de prueba) pero documentarlo como decisión consciente |
| Storage | ⚠️ Los buckets deben recrearse en `ximo-staging` — la migración 001 y 006 ya incluyen la creación de buckets, se resuelve solo al correr las migraciones (P0-2) |
| Separación de analytics (PostHog) | ❌ Falta — P1-5, hoy todo va al mismo proyecto sin distinguir ambiente |
| PostHog: proyecto/host/token | Mismo proyecto que producción hoy; replay ya desactivado globalmente (`disable_session_recording: true`) así que no hay riesgo de privacidad extra en staging |
| PostHog: masking/privacidad | ✅ Ya aplicado globalmente, no depende del ambiente |
| Sentry: entorno/release | ✅ `environment` ya se etiqueta automáticamente vía `VERCEL_ENV` (Preview → `"preview"`) |
| Sentry: source maps | ✅ Ya configurado globalmente (`SENTRY_AUTH_TOKEN` en Vercel, aplica a todos los builds incl. Preview) |
| Sentry: alertas/filtros | ⚠️ No configurado — recomendación: crear una alerta en Sentry filtrando `environment:production` para no recibir ruido de staging (acción de dashboard, no de código) |
| Logging | Sin sistema de logs estructurado más allá de Sentry/console — fuera de alcance de esta fase |
| Rate limits | Supabase Auth tiene rate limit de 30 emails/hora desde que se activó SMTP custom (visto en sesión anterior) — mismo límite aplicaría a staging una vez tenga su propio SMTP, o ninguno si no se configura (usaría el límite default de Supabase) |
| Cron jobs | `app/api/cron/reminders/route.ts` existe — protegido por `CRON_SECRET`; en staging, si no se configura un cron real en Vercel, simplemente no se dispara (no es un riesgo) |
| Jobs en background | No hay ningún sistema de colas/jobs además del cron — N/A |
| APIs externas | Stripe, Resend, Supabase, Discord (solo un link de invitación estático, no hay bot/webhook activo de Discord en código salvo `lib/discord/ads.ts` que es opcional y ya es null-safe) |
| Robots/indexing de staging | ❌ Falta — las URLs de Preview de Vercel technically son públicas si alguien tiene el link; agregar `X-Robots-Tag: noindex` a las respuestas cuando `VERCEL_ENV !== "production"` sería una mejora barata (no existe hoy) |
| Feature flags | `lib/intl/killSwitch.ts` ya es un sistema de feature flags fail-safe listo para usarse (ver Fase 2 completada) |
| Acceso de admin | Se resuelve corriendo `make_admin.sql` en staging (P1-4) |
| Cuentas de prueba | Se crean con el script de seed (P1-3) |
| Proceso de borrado/reset de datos | No existe un script de "reset staging" — se puede simplemente volver a correr las migraciones sobre una base limpia si se necesita empezar de cero; no es urgente |
| Páginas de error | `app/error.tsx`, `app/app/error.tsx`, `app/global-error.tsx` ya existen y están conectados a Sentry — no requieren cambios para staging |
| Health checks | `app/api/health/route.ts` existe y responde 200 — funcionará igual en staging sin cambios |
| Proceso de rollback | Documentado en `docs/intl/ENVIRONMENTS.md` (promote de deployment anterior en Vercel, o apagar `INTL_EXPANSION_ENABLED` sin redeploy) |
| Backups | ❌ Supabase Free no incluye backups (confirmado). Producción tiene el snapshot manual de emergencia; staging no lo necesita (es data de prueba, desechable) |
| Verificación de deploy | Manual hoy (smoke test humano); no hay CI automatizado además del build de Vercel |
| Testing mobile/desktop | No hay testing automatizado de viewport; se recomienda probar el registro/checkout en un viewport mobile del navegador al validar staging |
| Accesibilidad | Fuera de alcance de esta fase, no se ha auditado |
| Performance | Fuera de alcance de esta fase |
| Seguridad | Headers de seguridad ya están en `next.config.ts` (HSTS, X-Frame-Options, etc.) y aplican a cualquier ambiente automáticamente |
| Privacidad (menores) | ✅ Ya resuelto a nivel de código para Sentry y PostHog (replay desactivado/limitado, masking activo) — esto NO depende del ambiente, aplica igual en staging |

---

## 6. Checklist de expansión

**Ya planeado (del plan de expansión original, PDF del usuario):**
- [ ] 18 países hispanohablantes soportados con lanzamiento gradual por compuertas (`research_required` → ... → `paid_launch_enabled`). Cuba y Venezuela **excluidos permanentemente**.
- [ ] Elegibilidad por país de **residencia**, nunca por nacionalidad ni inferida de IP/idioma/teléfono/tarjeta.
- [ ] Kill switches por función (pagos, anuncios, comunidad) y por país, con pausa de emergencia. ✅ Ya implementados (`lib/intl/killSwitch.ts`).
- [ ] Investigación legal por país con fuentes oficiales, aprobación de abogado humano obligatoria antes de cobrar. En progreso (solo México sembrado).
- [ ] Country-config tipada central. No empezado (P2-2).
- [ ] Migración de `profiles.country` de texto libre a ISO. No empezado, depende de P2-2.

**Incompleto/parcial:**
- Selector de país del registro: ✅ ya muestra los 18 países + EE. UU. + Otro, pero sigue guardando texto libre en español, no código ISO (se resuelve en P2-2).
- El onboarding, perfil, y cualquier otro formulario que capture país (`app/app/perfil/ProfileForm.tsx` también tiene un campo de país de texto libre, visto en sesión anterior) — no se ha tocado, seguirá siendo texto libre hasta P2-2.

**Cambios de arquitectura que probablemente se necesiten:**
- Tabla o columna nueva para separar residencia de nacionalidad si en el futuro se pide nacionalidad (hoy la app NO pide nacionalidad, solo país — está bien así, el plan solo exige no *inferirla*, no prohíbe no pedirla).
- Posible tabla `country_legal_status` o similar para trackear las compuertas de lanzamiento por país de forma consultable desde código (hoy `docs/intl/legal/STATUS.md` es solo un markdown, no una fuente de verdad consultable por la app — mientras ningún país esté en `paid_launch_enabled`, esto no es urgente).

**Preocupaciones de escalabilidad:** ninguna identificada todavía a la escala actual (cientos de usuarios). Vercel + Supabase escalan solos hasta varios miles de usuarios sin cambios de arquitectura.

**Eventos de analytics de producto:** PostHog ya captura eventos automáticos (pageviews, clicks vía autocapture) más algunos eventos manuales ya instrumentados por el wizard en: auth, billing, onboarding, cursos, progreso, universidades, email, cuenta (ver la lista de archivos tocados por el PR de PostHog en la sección 7). No se ha diseñado un plan de eventos custom más allá de lo que el wizard agregó automáticamente — sería trabajo P2/P3 futuro si se quiere medir funnels específicos (ej. "registro → primera universidad agregada → primer contacto a coach").

**Onboarding de usuario, perfiles de atleta, recruiting, universidades/coaches, comunidad/Discord, marcas/sponsors, cursos, pagos, admin, moderación, notificaciones, búsqueda:** todas estas features YA EXISTEN y funcionan en producción (son el producto base, no parte de esta ronda de trabajo) — no hay cambios pendientes conocidos en ninguna de ellas salvo lo ya mencionado sobre el campo país.

**SEO/páginas públicas:** existen (`/`, `/terminos`, `/privacidad`, etc.), todas 200 y verificadas. No hay trabajo de i18n de contenido (todo el copy es español fijo) — el plan de expansión es sobre países hispanohablantes, así que no se ha discutido traducir la UI a otros idiomas (España usa español también). Esto no es una omisión, es correcto para el alcance actual.

**App móvil nativa:** no discutida, no planeada. No inventar este trabajo.

---

## 7. Mapa de archivos importantes

| Archivo/carpeta | Propósito | Qué se tocó | Qué tocar después | Preservar |
|---|---|---|---|---|
| `next.config.ts` | Config de Next + Sentry (`withSentryConfig`) + rewrites de PostHog (`/ingest/*`) + headers de seguridad | Envuelto con Sentry, rewrites de PostHog agregados | Nada urgente | El orden: `withSentryConfig` debe seguir siendo el export final; los rewrites de `/ingest` deben coexistir con cualquier rewrite futuro |
| `instrumentation-client.ts` | Init de Sentry Y PostHog en el navegador (ambos en el mismo archivo) | Creado para Sentry, luego PostHog agregado encima | Agregar `environment` a PostHog init (P1-5) | El orden de init (PostHog antes que Sentry) y toda la config de privacidad (replay, masking) |
| `instrumentation.ts` | Hook de registro server-side de Next, dispara `sentry.server.config.ts`/`sentry.edge.config.ts` según runtime | Creado para Sentry | Nada previsto | `onRequestError` export |
| `sentry.server.config.ts`, `sentry.edge.config.ts` | Init de Sentry en Node/Edge | Creados | Nada previsto | DSN fallback, `tracesSampleRate` |
| `app/global-error.tsx` | Boundary de error raíz, reporta a Sentry | Creado | Nada previsto | `"use client"` debe ser la primera línea |
| `lib/posthog-server.ts` | Cliente PostHog server-side, null-safe | Creado por wizard, luego hecho null-safe + token real | Agregar `environment` a los `.capture()` (P1-5) | El patrón no-op cuando falta el token |
| `proxy.ts` | Middleware de Next (renombrado en Next 16), refresca sesión Supabase | Matcher actualizado para excluir `/monitoring` | Nada previsto | El matcher no debe volver a capturar `/monitoring` ni rutas de API |
| `lib/intl/killSwitch.ts` + `.test.ts` | Feature flags de expansión, fail-safe | Creado, probado (9 tests) | Usarlo desde `billing/actions.ts` y `promocionar/campana/actions.ts` (P2-3) | La regla de que MX nunca se pausa por env |
| `lib/intl/residenceCountries.ts` | Lista de 20 países para el `<select>` de registro (texto libre, NO ISO) | Creado (solo existe en `main`, falta en la rama expansión hasta P0-1) | Eventualmente reemplazado/complementado por `lib/intl/countries.ts` tipado (P2-2) | Mantener sincronizado con `docs/intl/legal/STATUS.md` |
| `app/register/RegisterForm.tsx` | Formulario de registro, incluye el `<select>` de país | Selector expandido, chevron visible | Cuando exista `countries.ts` tipado, cambiar `name="country"` para mandar el código ISO en vez del texto | El resto del formulario (nombre, email, password, deporte, graduación) no debe tocarse sin motivo |
| `app/app/perfil/ProfileForm.tsx` | Formulario de edición de perfil, tiene su propio campo de país (texto libre, `<input>` no `<select>`) | No tocado esta sesión | Debería alinearse con `RegisterForm.tsx` cuando se haga P2-2 | — |
| `docs/intl/BASELINE.md`, `ENVIRONMENTS.md`, `legal/*` | Documentación del programa de expansión | Creados (Fases 1-3) | Agregar más países a `legal/`, actualizar `ENVIRONMENTS.md` con el estado de staging tras P0-2/P0-3 | No borrar el research ya hecho de México |
| `supabase/migrations/001-009*.sql` | Historial inmutable del esquema de la base | Sin cambios esta sesión | Aplicar en staging (P0-2); la próxima migración nueva sería `010_*` | Nunca editar una migración ya aplicada en producción — siempre agregar una nueva |
| `supabase/make_admin.sql` | Plantilla para promover un usuario a admin | Sin cambios | Usar (con correo editado) en staging (P1-4) | — |
| `app/app/admin/layout.tsx` | Guard central de rutas admin | Creado en sesión anterior a esta | Nada previsto | El check de `role === "admin"` server-side |
| `.env.local` | Variables de entorno de desarrollo local | Se agregaron `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST` | Nada previsto para staging (staging usa Vercel env, no este archivo) | Nunca commitear este archivo (ya está en `.gitignore`) |
| `package.json` | Dependencias | Se agregaron `@sentry/nextjs`, `posthog-js`, `posthog-node` | Nada previsto | — |

---

## 8. Variables de entorno y secretos

| Variable | Propósito | Local (`.env.local`) | Staging (Vercel Preview) | Producción (Vercel Prod) | Pública/Secreta | Dónde configurar | Cómo verificar | Valor conocido |
|---|---|---|---|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Endpoint del proyecto Supabase | ✅ Producción (necesita cambiarse a staging para dev local si se quiere probar contra staging) | ❌ Falta (P0-3) | ✅ Configurada | Pública | Vercel + `.env.local` | Comparar con el ref del proyecto en el dashboard de Supabase | Conocido (producción); staging conocido (`wpzwdmsqrgpvrjoltqff.supabase.co`, verificar formato exacto en el dashboard) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima del cliente | ✅ | ❌ Falta (P0-3) | ✅ | Pública | Vercel + `.env.local` | Login funciona | Falta obtener del dashboard de `ximo-staging` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (bypassa RLS) | ✅ (producción) | ❌ Falta (P0-3) | ✅ | **Secreta** | Vercel + `.env.local`, marcar Sensitive | Scripts de servidor funcionan | Falta obtener del dashboard de `ximo-staging` |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe | ✅ (TEST) | ❌ Falta (P0-3, usar el mismo valor TEST) | ✅ (LIVE) | **Secreta** | Vercel, marcar Sensitive | Checkout de prueba funciona | Conocido (TEST, ya en `.env.local`) |
| `STRIPE_WEBHOOK_SECRET` | Firma del webhook | ✅ (TEST) | ❌ Falta — **requiere crear un webhook NUEVO en Stripe TEST apuntando a la URL de Preview**, no reusar el de local | ✅ (LIVE) | **Secreta** | Vercel + dashboard de Stripe | Webhook recibe eventos sin error de firma | Falta crear (acción de dashboard) |
| `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_ANNUAL`, `STRIPE_PRICE_DEMO` | IDs de precios | ✅ (TEST) | ❌ Falta (mismo valor TEST) | ✅ (LIVE) | Públicas (IDs, no son secretos per se pero mejor no exponerlos innecesariamente) | Vercel | Checkout muestra el precio correcto | Conocidos (TEST) |
| `RESEND_API_KEY` | Envío de correo | ✅ | ⚠️ Decisión pendiente — recomendación: reusar la misma (bajo volumen de pruebas) | ✅ | **Secreta** | Vercel, marcar Sensitive | Correo de prueba llega | Conocido |
| `EMAIL_FROM` | Remitente de correo | ✅ | Igual que producción si se reusa Resend | ✅ (`Ximo <avisos@ximo.com.mx>`) | Pública (es un email visible) | Vercel + `.env.local` | — | Conocido |
| `NEXT_PUBLIC_SENTRY_DSN` | DSN de Sentry (override, hay fallback en código) | ✅ (agregado esta sesión) | No necesario (el fallback en código ya cubre cualquier ambiente) | No necesario en Vercel (fallback cubre) | Pública | Opcional | Eventos aparecen en Sentry | Conocido, ver `instrumentation-client.ts` |
| `SENTRY_DSN` | DSN para server/edge | ✅ | No necesario (fallback) | No necesario (fallback) | Pública | Opcional | — | Conocido |
| `SENTRY_AUTH_TOKEN` | Sube source maps en build | ❌ No necesario localmente | ✅ Ya en Vercel, aplica a todos los ambientes/builds automáticamente | ✅ Ya configurado | **Secreta** (fue pegado en el chat de una sesión anterior — considerar rotar si preocupa) | Vercel, ya marcado Sensitive | Logs de build dicen "Successfully uploaded source maps to Sentry" | Ya configurado, no requiere acción |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | Token de PostHog (override, hay fallback en código) | ✅ (agregado esta sesión) | No necesario (fallback cubre) salvo que se quiera un proyecto de PostHog separado para staging (ver P1-5, no decidido) | No necesario en Vercel (fallback cubre) | Pública | Opcional | Eventos aparecen en PostHog | Conocido, ver `instrumentation-client.ts` |
| `NEXT_PUBLIC_POSTHOG_HOST` | Host de PostHog | ✅ | Igual | Igual | Pública | Opcional | — | `https://us.i.posthog.com` |
| `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_APP_URL` | URL base de la app (usada en links de correo, metadata) | ✅ (localhost) | ❌ Falta — debería apuntar a la URL de Preview de cada deployment (Vercel expone `VERCEL_URL` automáticamente, considerar usarla como fallback dinámico en vez de una env var fija) | ✅ (`https://ximo.com.mx`) | Pública | Vercel + `.env.local` | Links en correos de prueba apuntan al lugar correcto | Producción conocido; staging necesita decisión (ver nota) |
| `NEXT_PUBLIC_DISCORD_INVITE_URL` | Link de invitación a Discord | ✅ | Igual que producción (es un link público fijo) | ✅ | Pública | Vercel + `.env.local` | — | Conocido |
| `CRON_SECRET` | Protege el endpoint de cron | ✅ | Puede reusarse o dejarse sin configurar (el cron simplemente no se dispara en staging) | ✅ | **Secreta** | Vercel, marcar Sensitive | — | Conocido |

**Nota importante sobre `NEXT_PUBLIC_SITE_URL` en staging:** cada Preview deployment de Vercel tiene una URL única y dinámica. Fijar esta variable a un solo valor en las env de Preview haría que TODOS los previews usen la misma URL incorrecta. La solución correcta es leer `process.env.VERCEL_URL` (que Vercel inyecta automáticamente por deployment) como fallback quen `NEXT_PUBLIC_SITE_URL` no esté seteada — esto podría requerir un pequeño cambio de código en donde se construye esa URL (buscar usos de `NEXT_PUBLIC_SITE_URL`/`NEXT_PUBLIC_APP_URL` en el código antes de decidir el enfoque exacto).

---

## 9. Dashboards externos y acciones manuales

Todo esto requiere que el usuario (Manuel) actúe en un dashboard externo — no se puede hacer solo editando archivos del repo.

1. **Supabase → proyecto `ximo-staging`** (https://supabase.com/dashboard/project/wpzwdmsqrgpvrjoltqff)
   - Sección: SQL Editor. Acción: pegar y correr cada una de las 9 migraciones en orden (P0-2). Evidencia de éxito: cada `RUN` termina sin error rojo; `select * from pg_tables where schemaname='public';` lista las tablas.
   - Sección: Authentication → URL Configuration. Acción: agregar las URLs de Preview de Vercel a Redirect URLs (P1-2). Evidencia: un registro de prueba en un Preview deployment completa el flujo de confirmación sin error de redirect.
   - Sección: Settings → API. Acción: copiar `anon key` y `service_role key` para pegarlos en Vercel (P0-3). Formato esperado: cadenas largas tipo JWT o el nuevo formato `sb_publishable_...`/`sb_secret_...`.

2. **Vercel → proyecto `ximo`** (https://vercel.com/ximo-academy/ximo/settings/environment-variables)
   - Acción: para cada variable de la tabla de la sección 8 marcada "❌ Falta", editarla y agregar un valor específico para el ambiente Preview (P0-3). Formato: el valor real de cada credencial, sin exponerlo en ningún documento.
   - Evidencia de éxito: un Preview deployment nuevo, en sus logs de runtime (Vercel → Deployments → [el preview] → Logs), no debe mostrar errores de conexión a Supabase/Stripe.

3. **Stripe → cuenta TEST** (`acct_1ThDX7QKM5mBxbyb`)
   - Sección: Developers → Webhooks. Acción: crear un nuevo endpoint apuntando a `https://<preview-url>/api/webhooks/stripe` (P0-3, sub-tarea del webhook). Nota: como la URL de preview cambia por deployment, esto puede requerir usar un dominio de staging fijo (ver P1-1) o aceptar que el webhook de test solo se prueba manualmente cuando se necesite, no en cada preview automático.
   - Evidencia: un pago de prueba en staging dispara el webhook y el dashboard de Stripe muestra el evento como entregado (200).

4. **Sentry → org `ximo`** (https://ximo.sentry.io)
   - Sección: Settings → Alerts. Acción (opcional, P1 bajo): crear una regla de alerta filtrando `environment:production` para no recibir ruido de staging una vez que Preview empiece a generar eventos.
   - Evidencia: la alerta existe en la lista de Alert Rules.

5. **PostHog** (https://us.posthog.com)
   - Sección: Activity/Events. Acción: confirmar visualmente que llegan eventos (el usuario ya dijo "replay is done", asumir que ya lo revisó — si no, verificar aquí).
   - Sección: Settings → Project → decidir si se crea un proyecto PostHog separado para staging (P1-5) o si basta con la property `environment` para filtrar en el mismo proyecto. Recomendación: NO crear proyecto separado, usar el filtro (más simple, un solo lugar para ver todo).

6. **IONOS (DNS)** — solo si se decide P1-1 (subdominio fijo de staging). No es necesario para el alcance mínimo de esta sesión.

---

## 10. Plan de pruebas y verificación

Ejecutar en este orden después de cada grupo de cambios (no esperar a terminar todo para probar):

1. `npm install` — confirma que no faltan dependencias tras cualquier merge/rebase (P0-1).
2. `npx tsc --noEmit` o simplemente `npm run build` (que incluye type-check) — sin errores de tipos.
3. `npm run lint` — sin errores nuevos (puede haber warnings preexistentes, no es lo que se busca).
4. `npm test` — debe seguir en 50/50 (o más, si se agregan tests nuevos con P2-2/P2-3).
5. `npm run build` — build de producción limpio, sin warnings nuevos de Sentry/Turbopack.
6. Correr local (`npm run dev`) y visitar `/register`, `/login`, `/` — sin errores de consola.
7. Deploy a un Preview de Vercel (push a una rama, o abrir un PR) — confirmar que el build de Vercel también pasa.
8. **Flujo de autenticación en staging:** registrar un usuario nuevo en el Preview deployment. Resultado esperado: el usuario aparece en la tabla `profiles` de `ximo-staging` (NO en la de producción — verificar esto explícitamente comparando ambos dashboards). Fallo indicaría: env vars de Preview mal configuradas (sigue apuntando a producción) o migraciones no aplicadas (tabla no existe).
9. **Login/logout:** con el usuario recién creado. Resultado esperado: sesión persiste, logout limpia la cookie.
10. **Rutas protegidas:** intentar acceder a `/app` sin sesión → debe redirigir a login. Con sesión → debe cargar el dashboard.
11. **Lectura/escritura de base de datos:** agregar una universidad de interés desde `/app/universidades`, confirmar que aparece. Fallo indicaría: RLS mal configurado o migración incompleta.
12. **Formularios:** completar el onboarding, agregar un tiempo de progreso. Sin errores de consola ni de servidor.
13. **Eventos de analytics:** tras cualquier acción de las anteriores, revisar PostHog → Activity (puede tardar unos segundos) — el evento debe aparecer, idealmente con `environment: "preview"` si se hizo P1-5.
14. **Privacidad de session replay:** confirmar en PostHog que NO se está grabando sesión completa (debe estar desactivado globalmente, no depende del ambiente).
15. **Error de prueba en Sentry:** provocar un error controlado (ej. una ruta temporal que lance `throw new Error(...)`, como se hizo en la sesión anterior con `/api/sentry-check` — **recordar borrar la ruta temporal después**). Confirmar que aparece en Sentry con `environment: "preview"` (o el nombre que corresponda) y que el stack trace es legible (source maps funcionando).
16. **Webhooks:** si se configuró el webhook de Stripe TEST para staging (P0-3), hacer un pago de prueba y confirmar en el dashboard de Stripe que el webhook se entregó con 200.
17. **Correos:** completar un registro y confirmar que llega el correo de bienvenida (usará el mismo Resend/SMTP que producción salvo que se decida separarlo — ver nota de la tabla de env vars).
18. **Pagos en modo test:** completar un checkout de demo ($0) y uno de pago simulado con la tarjeta de prueba de Stripe (4242 4242 4242 4242). Confirmar que la suscripción se activa en `ximo-staging`.
19. **Mobile:** repetir el registro/login en un viewport mobile del navegador (DevTools o el redimensionado del Browser pane).
20. **Cross-browser:** no crítico para esta fase, un solo navegador (Chrome) es suficiente para validar staging.
21. **Manejo de errores:** provocar un 404 (`/pagina-que-no-existe`) y confirmar que se ve la página de error, no una pantalla en blanco.
22. **Regresión:** repetir un smoke test rápido de producción (visitar https://ximo.com.mx, confirmar que sigue en 200, que el registro sigue funcionando) — para confirmar que nada de este trabajo de staging afectó producción accidentalmente.
23. **Consola/network:** revisar que no haya errores rojos en la consola del navegador ni peticiones fallidas (4xx/5xx inesperados) en Network durante todo el recorrido anterior.
24. **Monitoreo post-deploy:** dejar Sentry y PostHog abiertos ~10 minutos después de terminar para confirmar que no hay una ola de errores nuevos.

---

## 11. Riesgos y advertencias conocidas

- **`international-expansion` está 8 commits detrás de `main`** — riesgo más serio de esta sección. Si se sigue trabajando sobre ella sin reconciliar primero (P0-1), cualquier trabajo nuevo de expansión corre el riesgo de mergearse de vuelta a `main` y accidentalmente revertir Sentry, PostHog, el selector de país o el tema claro si el merge se resuelve mal. **Reconciliar ANTES de tocar cualquier otra cosa de expansión.**
- **Preview de Vercel usa producción hoy** — cualquier PR abierto ahora mismo, si alguien hace clic en su preview y se registra, escribe en la base de datos REAL de usuarios. Esto es sensible porque Ximo maneja datos de menores de edad. **P0-3 es crítico y debería priorizarse por encima incluso de continuar la expansión legal.**
- **Sentry y PostHog coexisten en el mismo archivo `instrumentation-client.ts`** — cualquier edición futura a ese archivo debe tener cuidado de no romper el otro SDK. Ambos ya están configurados para no duplicar captura de errores (`capture_exceptions: false` en PostHog).
- **Privacidad de menores** — las decisiones de replay-solo-en-error (Sentry) y session-recording-desactivado (PostHog) son deliberadas y no deben revertirse "para debuggear mejor" sin discutirlo explícitamente primero.
- **Contaminación de analytics entre ambientes** — hasta que se haga P1-5, cualquier tráfico de staging/preview se mezcla con las métricas reales de producción en PostHog. Sentry ya está protegido por el campo `environment`.
- **Migración de `profiles.country`** (P2-2) es la operación de mayor riesgo de toda la Fase 4 — nunca correrla directo en producción sin haberla probado en staging primero con datos que se parezcan a los reales (el snapshot de `D:\XIMO\backups\prod-data-2026-07-10.json` puede servir para probar el mapeo de texto libre → ISO sin tocar la base real).
- **`SENTRY_AUTH_TOKEN` fue pegado en el chat de una sesión anterior** — no es crítico (es un token de build, no de runtime, y ya está en uso) pero si el usuario quiere rotar por higiene, es una acción de 1 minuto en Sentry → Settings → Auth Tokens.
- **Cosas que parecen terminadas pero no lo están del todo:** el proyecto de staging "existe" pero está vacío — fácil de asumir que ya está listo si no se revisa con cuidado. El tunnel `/monitoring` de Sentry no se ha probado con tráfico real de navegador.
- **Supuestos aún no verificados:** que el merge de P0-1 será limpio sin conflictos (es la expectativa basada en el diff analizado, pero no se ha ejecutado); que las credenciales TEST de Stripe en `.env.local` siguen siendo válidas (no se probó en esta sesión, solo se confirmó que existen).
- **Nada que Claude haya encontrado confuso o inconsistente** más allá de lo ya documentado arriba.

---

## 12. Decisiones ya tomadas

Tratar como establecido salvo que el código contradiga directamente lo siguiente:

- **Arquitectura:** Next.js 16 App Router + Turbopack + Supabase + Stripe + Vercel. No se está considerando ningún cambio de stack.
- **Sentry:** replay solo-en-error con masking total, nunca grabación de sesión completa. DSN público hardcodeado como fallback en código (mismo patrón para PostHog). Fuente de verdad de errores; PostHog no duplica captura de excepciones.
- **PostHog:** analytics de producto, sin session recording, perfiles solo para usuarios identificados. Token público hardcodeado como fallback — decisión explícita del usuario en esta sesión ("do whats better" → se recomendó y se mantuvo el fallback, no mover a env-only).
- **Estrategia de staging:** usar Vercel Preview deployments (automáticos por rama/PR) en vez de un ambiente "staging" permanente separado, salvo que surja una necesidad concreta de URL estable (P1-1).
- **Kill switches:** fail-safe por diseño — sin configuración, todo se comporta como hoy (México-only). México nunca se pausa por variable de entorno, solo por decisión deliberada de producción.
- **Expansión legal:** nunca fabricar aprobaciones de abogado, nunca tratar proyectos de ley como vigentes, solo fuentes oficiales. Cuba y Venezuela excluidos permanentemente y sin excepción.
- **Prioridades postergadas intencionalmente:** i18n de la UI a otros idiomas (no aplica, el mercado es hispanohablante), app móvil nativa (no discutida), backups automáticos (esperando decisión de compra de Supabase Pro del usuario).
- **No tocar sin preguntar primero:** los valores exactos del tema claro (durazno, decisión de diseño del usuario), la lógica de la entrada del dragón (`heroPassed` state machine), el copy de marca "Live the Dream".

---

## 13. Preguntas abiertas (requieren a Manuel o acceso externo)

1. **¿Se debe comprar Supabase Pro para tener backups reales?** — Por qué importa: sin esto, producción no tiene ningún backup automático más allá del snapshot manual desactualizado. Supuesto seguro mientras tanto: seguir usando el snapshot manual como red de seguridad de emergencia, y evitar migraciones de esquema destructivas hasta que haya backups reales. Trabajo que puede continuar sin esperar: todo lo de staging y expansión que no toque el esquema de producción.

2. **¿Se quiere un subdominio fijo `staging.ximo.com.mx` o basta con las URLs de Preview de Vercel?** (P1-1) — Por qué importa: afecta si se necesita otro registro DNS y si los webhooks de Stripe TEST pueden apuntar a una URL estable. Supuesto seguro: usar Preview de Vercel por ahora (cero configuración extra). Trabajo que puede continuar: todo P0/P1 excepto la configuración fina del webhook de Stripe para staging, que puede quedar como prueba manual ocasional en vez de automática por cada preview.

3. **¿Se debe separar el proyecto de PostHog para staging o basta con un filtro por `environment`?** (P1-5) — Por qué importa: afecta cuánta configuración de dashboard se necesita. Supuesto seguro: usar el mismo proyecto con la property `environment` (más simple). Trabajo que puede continuar: agregar la property es un cambio de código pequeño e independiente de esta decisión final.

4. **¿Reusar Resend/SMTP de producción para los correos de prueba en staging, o crear un remitente separado?** — Por qué importa: bajo riesgo (poco volumen), pero mezclaría correos de prueba con el remitente real. Supuesto seguro: reusar el mismo por ahora, revisar si se vuelve un problema. Trabajo que puede continuar: todo lo demás.

No hay preguntas que bloqueen el arranque de P0-1 o P0-2 — ambas se pueden ejecutar sin esperar respuesta a nada de lo anterior.

---

## 14. Instrucciones exactas para la próxima sesión de Claude

```
Lee primero D:\XIMO\ximo\docs\HANDOFF_STAGING_EXPANSION.md completo.

Confía en el estado documentado ahí salvo que el propio repositorio lo
contradiga directamente (en ese caso, el repo manda). No vuelvas a leer ni
auditar todo el código — ya tienes acceso a los archivos, úsalo para tareas
puntuales, no para redescubrir lo que este documento ya te cuenta.

Antes de editar nada, corre:
  git status
  git branch --show-current
  git log --oneline -10
  cat package.json (o revisa las dependencias relevantes)
Y confirma los nombres de variables de entorno disponibles (sin exponer
valores) con algo como: grep -oE '^[A-Z_]+=' .env.local

Empieza por la tarea sin terminar de mayor prioridad (sección 4: primero
P0-1, luego P0-2, luego P0-3 — pueden hacerse P0-1 y P0-2 en paralelo si
tiene sentido, pero P0-3 depende de tener las credenciales de P0-2).

Preserva todas las integraciones que ya funcionan: Sentry, PostHog, el
flujo de correo, los pagos de Stripe en producción, el guard de admin, la
entrada del dragón, el tema claro del usuario, el selector de país. No los
"mejores" ni los toques a menos que la tarea actual lo requiera
explícitamente.

Haz los cambios en grupos pequeños y revisables. Después de cada grupo,
corre las verificaciones relevantes de la sección 10 (no esperes a tener
todo listo para probar por primera vez).

Separa claramente en tus respuestas: (a) cambios de código que ya hiciste
en el repo, de (b) acciones que Manuel debe hacer en un dashboard externo
(sección 9) — nunca mezcles ambas cosas en una misma instrucción confusa.

Nunca expongas valores de secretos en tus respuestas ni en archivos del
repo. Usa el patrón ya establecido en esta sesión: valores públicos pueden
hardcodearse como fallback en código; valores secretos van solo en env vars
y se comunican al usuario por portapapeles, nunca en texto plano en el chat
si se puede evitar (aunque si el usuario los pega él mismo en el chat, no es
tu culpa — solo no los repitas innecesariamente después).

Protege los datos personales de menores de edad: no actives grabación de
sesión completa en ningún SDK de analytics/monitoreo, mantén el masking
activo, y si tienes dudas sobre si algo expone datos personales, pregunta
antes de implementarlo en vez de asumir que está bien.

No afirmes que algo "funciona" o está "verificado" a menos que realmente
lo hayas probado (build, test, o una prueba manual real) durante esta
sesión. Si no pudiste verificar algo, dilo explícitamente.

Mantén un checklist corriendo de lo que vas completando. Si terminas una
sesión sin completar todo el trabajo de staging/expansión, actualiza este
mismo documento (docs/HANDOFF_STAGING_EXPANSION.md) con el nuevo estado
antes de terminar, siguiendo la misma estructura, para que la siguiente
sesión pueda continuar igual de bien informada.

Completa todo lo que puedas de forma autónoma sin pedirle confirmación a
Manuel repetidamente — pídesela solo para las acciones que genuinamente
la requieren (dashboards externos, decisiones de producto, secretos que
solo él tiene) según la sección 9 y 13 de este documento.
```
