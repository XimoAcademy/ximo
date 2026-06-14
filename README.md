# Ximo

Plataforma de suscripción para atletas mexicanos (nadadores primero) que organiza su proceso de *recruiting* universitario en EE. UU.: universidades, coaches, correos, documentos, progreso deportivo, cursos, SAT/TOEFL, comunidad y promoción de marcas.

> **Estado:** pre-lanzamiento. La página pública (`/`) es una **waitlist**; la app (`/app/*`) está completa y funcional pero aún no se anuncia. Pagos integrados con Stripe en **modo test** (pendiente activar Live). Ver [docs/launch-checklist.md](docs/launch-checklist.md).

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | **Next.js 16.2.6** (App Router, Server Actions, Turbopack), **React 19** |
| Lenguaje | TypeScript (estricto) |
| Estilos | Tailwind (utilidades) + `app/globals.css` (design system propio, light/dark) |
| Backend / DB | **Supabase** (Postgres + Auth + Storage), `@supabase/ssr`. RLS en todas las tablas |
| Pagos | **Stripe** (suscripciones mensual/anual, webhook con idempotencia) |
| Correo | **Resend** (transaccional) |
| Hosting | **Vercel** (auto-deploy desde `main`). Prod: https://ximo-theta.vercel.app |
| Tests | **Vitest** (unitarios) + scripts de QA E2E en `scripts/` |

> ⚠️ **Importante:** esta versión de Next.js trae cambios respecto a lo conocido (p. ej. `middleware.ts` → **`proxy.ts`**). Lee `AGENTS.md` y, ante dudas de API, los docs en `node_modules/next/dist/docs/`.

---

## Estructura

```
app/
  page.tsx            Waitlist pública (pre-lanzamiento)
  _launch/page.tsx    Landing de lanzamiento (NO ruteada; mover a page.tsx el día del launch)
  login, register, subscribe, forgot-password, reset-password, verify-email, account-status
  terminos, privacidad   Legales (LFPDPPP / consumidor MX) vía components/LegalShell
  build-log           Página pública "cómo nace ximo"
  app/                LA APP (gated por suscripción) — dashboard, perfil, recruiting,
                      universidades, coaches, correos, documentos, progreso, cursos,
                      sat-toefl, comunidad, promocionar, billing, settings, notifications,
                      help, admin/(moderation|ads)
  api/                webhooks/stripe, cron/reminders, health
  sitemap.ts, robots.ts, manifest.ts
lib/
  supabase/           clientes server/client/proxy (SSR)
  data/               acceso a datos por dominio (dashboard, billing, streak, …)
  stripe/             server.ts (precios, prices), sync.ts (webhook → DB)
  auth/, email/, moderation/, subscription/, util/
supabase/
  migrations/         001–007 (esquema, RLS, RPC, NCAA, billing, streak)
  APLICAR_PENDIENTE.sql   (ya aplicado en prod; consolidado de 005 + buckets)
scripts/              qa-funcional.mjs, crawl-app.mjs, time-app-page.mjs, test-payments-e2e.mjs
docs/                 database-plan.md, launch-checklist.md
proxy.ts              (antes middleware) — refresca sesión Supabase
```

---

## Correr en local

```bash
npm install
cp .env.example .env.local     # y rellenar los valores (ver abajo)
npm run dev                    # http://localhost:3000
```

La app **degrada con gracia** sin credenciales (muestra preview estático), pero para auth/pagos reales necesitas `.env.local`. Variables (ver `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_ANNUAL`, `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`, `EMAIL_FROM`
- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL`, `CRON_SECRET`

> Las credenciales reales NO están en el repo (`.env.local` está en `.gitignore`). Pídeselas a Manuel.

## Comandos

```bash
npm run dev      # desarrollo
npm run build    # build de producción
npm run start    # servir build
npm run lint     # ESLint
npm run test     # Vitest (unitarios)

# QA E2E (requieren .env.local con service role key)
node scripts/qa-funcional.mjs          # 28 checks de cada formulario/upload/seguridad (crea y limpia un usuario QA)
node scripts/crawl-app.mjs <baseUrl>   # login real + crawl de todos los links buscando 404/500
node scripts/test-payments-e2e.mjs     # ciclo completo de pago contra Stripe test
```

## Base de datos

Migraciones SQL en `supabase/migrations/` (aplicarlas en el SQL Editor de Supabase, en orden). RLS activado en todas las tablas; los triggers impiden que un usuario se auto-asigne `admin` o se auto-active la suscripción.

## Deploy

Push a `main` → Vercel despliega producción automáticamente. Las variables de entorno viven en Vercel (Project → Settings → Environment Variables), no en el repo.

---

## Qué está pendiente (para el revisor)

1. **Stripe Live:** la cuenta se está activando; falta cambiar las llaves test → live cuando Stripe apruebe.
2. **Revisión legal:** `/terminos` y `/privacidad` están redactados pero muestran un aviso de "versión preliminar" hasta validación de un abogado en México.
3. **Lanzamiento:** mover `app/_launch/page.tsx` → `app/page.tsx` y re-agregar rutas de la app al `sitemap.ts`.

Contacto del proyecto: **ximoacademy@gmail.com**
