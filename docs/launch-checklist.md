# Ximo — Launch Checklist

Everything needed to take Ximo from "built" to "live for real users." Work top to
bottom. Items marked **(manual)** must be done by a human; the rest are already in code.

## 1. Environment variables

`.env.local` (local) and your host's env (production) must have:

| Variable | Where to get it | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API → anon / publishable key (`sb_publishable_…`) | public, protected by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API → service_role / secret key (`sb_secret_…`) | **server-only secret** — never expose. Used by the Stripe webhook + cross-user notifications. **(manual)** |
| `NEXT_PUBLIC_SITE_URL` | your production domain, e.g. `https://ximo.app` | OG/Twitter link previews + Stripe return URLs |
| `NEXT_PUBLIC_APP_URL` | same domain (defaults to `NEXT_PUBLIC_SITE_URL`) | Stripe success/cancel redirects |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys (`sk_test_…` / `sk_live_…`) | **server-only secret**. Optional — absent → checkout falls back to manual activation. **(manual)** |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen` locally, or Dashboard → Webhooks (`whsec_…`) | server-only **(manual)** |
| `STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_ANNUAL` | Stripe → Products → recurring Prices in MXN (`price_…`) | **(manual)** |

The app runs and `npm run build` passes even with these empty (Supabase features stay
disabled), so local dev never hard-crashes.

## 2. Database (run once, in order, in the Supabase SQL editor)

> Paste with correct UTF-8 (e.g. `[System.IO.File]::ReadAllText(path)` to clipboard),
> never `Get-Content -Raw`, to avoid mojibake on accented Spanish text.

1. `supabase/migrations/001_initial_ximo_schema.sql` — 24 tables, RLS, triggers, storage buckets.
2. `supabase/migrations/002_subscription_rpc.sql` — `activate_subscription()` RPC.
3. `supabase/migrations/003_fix_encoding.sql` — UTF-8 fixes for seeded content.
4. `supabase/migrations/004_ncaa_directory.sql` — NCAA directory tables.
5. `supabase/seed.sql` — courses, lessons, starter content.
6. `supabase/seed_ncaa_programs.sql` — 137 D1 programs.
7. `supabase/seed_ncaa_coaches.sql` — coach contacts (partial; safe to re-run).
8. `supabase/migrations/005_stripe_billing.sql` — webhook idempotency ledger + `unique(user_id)` on `subscriptions` (required for Stripe).

## 3. Make yourself an admin **(manual, required for moderation)**

Community posts/comments and brand ads are created as `pending` and only become public
once an admin approves them. Without an admin, the community feed stays empty.

Edit the email in `supabase/make_admin.sql`, run it, then visit `/app/admin/moderation`
(a "Moderación" link appears in the sidebar for admins only).

## 4. Auth configuration in Supabase **(manual)**

- **Authentication → URL Configuration:** set Site URL + redirect URLs to your domain
  (and `http://localhost:3000` for dev). The email-confirm flow returns to `/auth/confirm`.
- **Authentication → Email templates:** customize the confirmation / reset emails (optional).
- Decide whether to require email confirmation (recommended for production).

## 5. Storage

Buckets are created by migration 001: `avatars` (public), `documents`, `post-media`,
`lesson-videos`, `brand-ads` (private). No extra setup needed. Document and avatar uploads
already work from the app.

## 6. Build & deploy

```bash
npm install
npm run lint    # eslint
npm test        # vitest unit tests (pure logic: swim-time, moderation, Stripe mapping)
npm run build   # must be green
```

CI (`.github/workflows/ci.yml`) runs all three on every push/PR to `main`. It needs
no secrets — the app builds null-safe with every integration disabled.

Deploy to Vercel (or any Node host). Set all env vars from step 1 in the host. Point your
domain at it and set `NEXT_PUBLIC_SITE_URL` to that domain.

## 7. Smoke test (live)

1. Register → confirm email → log in.
2. Hit `/subscribe` → activate (manual activation via the RPC until a payment provider is wired).
3. Dashboard loads with your real name/sport.
4. Create a task, add a university (from the NCAA directory), add a coach, log a swim time.
5. Post in the community → approve it from `/app/admin/moderation` → confirm it appears in the feed.
6. Upload a document file and re-download it.

## 7b. Stripe billing (when ready to charge real users)

Billing is fully implemented with Stripe Checkout (hosted) + a signature-verified,
idempotent webhook that is the **sole writer** of the `subscriptions` table. It's
null-safe: with no Stripe env vars, checkout falls back to the manual activation RPC,
so dev/preview keeps working.

1. **Stripe Dashboard:** create two **recurring Prices in MXN** (monthly + annual) under a
   "Ximo" product. Copy the `price_…` ids into `STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_ANNUAL`.
2. Set `STRIPE_SECRET_KEY` (test first: `sk_test_…`).
3. **Webhook endpoint:** point Stripe at `https://YOUR_DOMAIN/api/webhooks/stripe`
   (events: `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`). Copy the
   signing secret into `STRIPE_WEBHOOK_SECRET`.
   - Local: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
4. **Payment methods:** enable card (and OXXO/SPEI for first/annual payments) in
   Dashboard → Settings → Payment methods. Checkout uses your account's automatic methods.
5. **Test loop (no live business entity needed):** test keys + `stripe trigger
   checkout.session.completed` / `invoice.payment_failed` exercise every branch. Use Stripe's
   MXN test cards and the OXXO test voucher.
6. **Go live:** swap to `sk_live_…`, live Prices, and a live webhook secret.

> The webhook is the only thing that activates a subscription — the post-checkout redirect
> shows "estamos confirmando tu pago" and never grants access by itself. `activate_subscription()`
> is retained strictly as an **admin comp tool** (`status='manual_active'`), which Stripe events
> never clobber.

## 7c. Transactional email (Resend) — optional

Branded transactional email is implemented and null-safe (no key → in-app
notifications still work, emails just aren't sent). It respects each user's
`email_notifications` preference.

1. Create a Resend account, **verify a sending domain**, create an API key.
2. Set `RESEND_API_KEY` and `EMAIL_FROM="Ximo <hola@yourdomain.com>"`.
3. Emails currently fire on: **onboarding welcome** (to the new user) and **community
   content approved** (to the author, via service role). Add more touchpoints by calling
   `emailCurrentUser()` / `emailUserViaService()` from `lib/email/notify.ts`.

> Supabase Auth still sends its own auth emails (confirm / reset). For production
> deliverability, also set a custom SMTP in Supabase → Authentication → SMTP (can be Resend).

## 7d. Daily reminders (Vercel Cron) — optional

A daily job emails + in-app-notifies each athlete about coach follow-ups and tasks
**due today**, so nothing slips. It's already scheduled in `vercel.json`
(`/api/cron/reminders`, 14:00 UTC ≈ 08:00 CDMX) and is null-safe.

1. Set `CRON_SECRET` to a random string. Vercel automatically sends it as
   `Authorization: Bearer ${CRON_SECRET}` to the cron route.
2. Requires `SUPABASE_SERVICE_ROLE_KEY` (reads across users, writes notifications) and,
   for the email part, the Resend vars from 7c.
3. Test manually: `curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://<host>/api/cron/reminders` (header-only — the old `?secret=` query param was removed so the secret never lands in request logs).

## 7e. Privacy rights (ARCO / LFPDPPP)

Implemented in Settings:
- **Descargar mis datos** — exports all of the user's data as JSON (right of access).
- **Eliminar mi cuenta** — type-to-confirm; permanently deletes the auth user, which
  cascades to `profiles` and every owned table. **Requires `SUPABASE_SERVICE_ROLE_KEY`**;
  without it, the UI tells the user to email support. Private storage files become
  inaccessible immediately (RLS owner check); purge them with a retention job if desired.

## 8. Known gaps to wire later (need external providers / decisions)

- **Customer portal (optional):** add a Stripe Billing Portal session action so users can
  update card / cancel from `/app/billing` (currently directed to support).
- **Push delivery:** in-app notifications + transactional email are implemented (see 7c).
  Add web/mobile push later if desired.
- **AI moderation:** `lib/moderation/content-filter.ts` is a conservative local filter; plug a
  real classifier (Supabase Edge Function / moderation API) behind `classifyTextLocally`.
- **Lesson videos:** course/lesson structure and progress are live; upload real videos to the
  `lesson-videos` bucket and set `lessons.video_url`.
