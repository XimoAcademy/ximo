# Expansión Internacional — Fase 1: Reporte Baseline

Fecha: 2026-07-10 · Rama: `international-expansion` · Commit base: `1bdb2bb`
(main y esta rama son idénticos en este punto; nada de la expansión se ha implementado aún)

## 1. Stack confirmado (inspección de package.json + código)

- **Next.js 16.2.6** (App Router, Turbopack) + **React 19.2.4** + TypeScript + Tailwind 4 (PostCSS).
- 3D: three + @react-three/fiber + @react-three/drei (dragón del landing — NO tocar en esta expansión).
- Datos/Auth: **Supabase** (@supabase/ssr + supabase-js; proyecto `pqmekjbqbyitkhsgizab`).
- Pagos: **Stripe** (cuenta LIVE `acct_1ThDWt3GTaLP4I7m`, MX/MXN; cuenta TEST separada en .env.local).
- Email: **Resend** (sandbox `onboarding@resend.dev`; dominio ximo.com.mx agregado, verificación DNS en curso — ver E1).
- Hosting: **Vercel** (proyecto `prj_YAQNr2r2lUFC5GXVw1fI0aDDDQr1`, team `ximo-academy`), deploy automático desde GitHub `XimoAcademy/ximo` main (repo PÚBLICO — nunca commitear secretos).
- Dominio: **ximo.com.mx** (IONOS; apex primario, www→apex 308).
- No monorepo. Scripts: dev/build/start/lint/test. Middleware: `proxy.ts` (convención Next 16).

## 2. Estado verificado hoy

- `npm test`: **50/50 pruebas pasan** (vitest 4.1.8, 6 archivos).
- `npm run build`: limpio (solo warning benigno DEP0205 de Node sobre `module.register()`).
- Producción activa y verificada hoy en ximo.com.mx (deploy `1bdb2bb`).

## 3. Base de datos (Supabase)

- Migraciones fuente (aplicadas en prod; 009 verificada 2026-07-08): `001_initial_ximo_schema` (esquema completo + RLS en todas las tablas + trigger anti-escalación de rol), `002_subscription_rpc`, `003_fix_encoding`, `004_ncaa_directory`, `005_stripe_billing` (processed_webhook_events), `006_brand_ads_public_bucket`, `007_daily_streak`, `008_perf_indexes` (opcional, ¿aplicada? verificar), `009_ad_review_flow`.
- Buckets storage: `avatars`, `brand-ads`, `documents`, `media`, `post-media` (públicos/privados según 001/006).
- RPC: `activate_subscription` (activación demo sin Stripe).
- Webhook Stripe LIVE → /api/webhooks/stripe (idempotente vía processed_webhook_events).
- ⚠️ **Backups: PENDIENTE DE CONFIRMAR.** Plan Supabase actual aparenta ser Free (sin PITR). ACCIÓN FUNDADOR: confirmar plan y respaldos antes de tocar esquema (el plan de expansión lo exige). `docs/launch-readiness-1000.md` ya recomendaba Supabase Pro.

## 4. Variables de entorno (SOLO nombres)

Local (.env.local): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_ANNUAL`, `STRIPE_PRICE_DEMO`, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_DISCORD_INVITE_URL`, `RESEND_API_KEY`, `EMAIL_FROM`.
Vercel (producción): mismo set con claves Stripe LIVE y URLs = https://ximo.com.mx. Env solo-servidor adicionales referenciadas en código: `XIMO_REVIEW_EMAIL`, `PAYMENT_LINK_PLACEHOLDER`, `DISCORD_ADS_WEBHOOK_URL`/`DISCORD_BOT_TOKEN`+`DISCORD_ADS_CHANNEL_ID`, `NEXT_PUBLIC_DEMO_MODE`.

## 5. Referencias hardcodeadas a México/MXN/es-MX (a parametrizar por país)

- **Moneda MXN** (7 archivos): `lib/stripe/server.ts` (precios/checkout), `app/subscribe/page.tsx`, `app/app/billing/*` (indirecto), `app/app/promocionar/campana/{actions.ts,CampanaClient.tsx}` (pago de campañas `price_data` MXN), `app/app/promocionar/BrandAdForm.tsx`, `app/app/admin/ads/page.tsx`, `app/terminos/page.tsx`.
- **Locale es-MX / zona America/Mexico_City** (17 archivos): formatos de fecha `toLocaleDateString("es-MX")` dispersos (billing, coaches, correos, notificaciones, progreso, recruiting, tareas, revision, certificado, admin/ads) + `lib/data/streak.ts` (día calendario CDMX — decisión de producto por país pendiente) + `app/manifest.ts` (`lang: es-MX`).
- **Copy "México/mexicano"** (18 archivos, ~30 menciones): mayor densidad en `app/_launch/page.tsx` (7), `app/privacidad/page.tsx` (4); también layout metadata/keywords, landing, register, settings, courseData, LegalShell, build-log, email-templates.
- **Jurisdicción/legal MX**: `app/terminos/page.tsx` (CFDI, leyes mexicanas), `app/privacidad/page.tsx` (LFPDPPP 2025, Secretaría Anticorrupción), `app/components/LegalShell.tsx`, `lib/auth/actions.ts` (privacy_accepted_at + versión), `lib/settings/actions.ts`, teléfono `+52` en `BrandAdForm`.
- **Campo país del registro**: `app/register/RegisterForm.tsx:7` → `const COUNTRIES = ["México", "Estados Unidos", "Colombia", "Argentina", "Otro"]` — texto libre en español, SIN códigos ISO, guardado en `profiles.country`. ⚠️ El plan exige ISO 3166-1 alpha-2 + separar residencia de nacionalidad → requerirá migración de datos.

## 6. Rutas/flujos críticos (creación de cuenta → cobro)

- Registro: `app/register` + `lib/auth/actions.ts#signUpAction` (checkbox LFPDPPP obligatorio, marketing opt-in opcional, SIN teléfono).
- Onboarding: `app/app/onboarding/actions.ts` (crea plan + notificación + email bienvenida).
- Demo/checkout: `app/subscribe` → Stripe Checkout $0 MXN (`payment_method_collection: if_required`) o fallback RPC `activate_subscription`; suscripciones pagadas: `app/app/billing/{actions.ts,CheckoutButtons.tsx,PlanCheckoutButton.tsx}`.
- Pago de campañas de anuncios: `app/app/promocionar/campana/actions.ts#payCampaignAction` (Checkout mode=payment, price_data dinámico MXN).
- Webhook: `app/api/webhooks/stripe` (suscripciones + ad_payment; NO auto-publica anuncios).
- Gate de suscripción: `lib/subscription/requireSubscription.ts`.
- Server actions totales: 18 archivos "use server" (inventario en §5/§6; lista completa: admin/ads, admin/moderation, billing, coaches, correos, cursos, directorio, documentos, notifications, onboarding, perfil, progreso, promocionar, promocionar/campana, tareas, universidades, lib/auth, lib/settings).
- Waitlist: restos de Tally en `app/page.tsx` y `app/_launch/page.tsx` (verificar si sigue enlazada).

## 7. Documentos legales (todos base ley mexicana, renderizados estáticos)

`app/terminos`, `app/privacidad`, `app/cookies`, `app/politica-de-anuncios`, `app/terminos-anunciantes`, `app/reglas-comunidad` — envueltos por `app/components/LegalShell.tsx` (incluye aviso "revisión por abogado antes del lanzamiento comercial" — PRESERVAR durante la migración, como exige el plan). Aceptación registrada en auth metadata (`privacy_accepted_at` + versión) — NO borrar registros existentes.

## 8. Analytics / observabilidad

**No hay analytics ni error-reporting instalados** (sin PostHog/Sentry/GA; los hits del grep son falsos positivos — "stats" de natación). Cookies: solo las de sesión Supabase (`sb-*`); localStorage: tema (`ximo-theme`). Gap ya conocido del master prompt (Fase 1 de aquel spec).

## 9. Riesgos/decisiones clave detectados para las siguientes fases

1. `profiles.country` texto libre → migración a ISO + campo residencia separado de nacionalidad (el plan prohíbe inferir nacionalidad por IP/idioma/teléfono/tarjeta).
2. Cuenta Stripe es MEXICANA: no asumir que presenta/liquida ARS, BOB, CLP… (el plan lo advierte); requiere matriz moneda×proveedor antes de habilitar cobro por país.
3. Todo el copy legal es MX; el plan exige suplementos por país con aprobación de abogado humano ANTES de `paid_launch_enabled`.
4. Sin analytics/Sentry: agregar gating de país sin telemetría dificulta detectar bloqueos indebidos.
5. Backups de BD sin confirmar (bloqueante para migraciones de la Fase 3+).
6. Repo público: la country-config no debe contener notas legales sensibles.

## 10. Capturas baseline

Estado visual de hoy verificado en sesión (home con entrada del dragón, register con select de país limitado y aviso "Versión demo", panel admin de anuncios, preview de anuncio). Páginas públicas todas 200 en prod. Las capturas autenticadas (dashboard/billing/perfil) se validaron en sesión; no se versionan en el repo público por contener datos del usuario.

---
Próximo paso (Fase 2 del plan): estrategia de entornos (local/test/staging/prod con credenciales separadas donde sea posible) — hoy solo existen local + producción, sin staging separado ni credenciales de prueba en Vercel Preview.
