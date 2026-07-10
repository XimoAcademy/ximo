# Ximo — Environment Variables (names only; never commit values)

Canonical template: `.env.example`. Deployed values live only in Vercel project env.
Local `.env.local` (gitignored) intentionally keeps Stripe TEST keys; LIVE keys exist
only in Vercel production/preview.

| Variable | Scope | Purpose |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | public | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | public | Anon key (RLS-protected) |
| SUPABASE_SERVICE_ROLE_KEY | server | Webhooks, admin ops. Never client-side |
| NEXT_PUBLIC_DEMO_MODE | public | Demo gate (default ON unless "false") |
| NEXT_PUBLIC_SITE_URL / NEXT_PUBLIC_APP_URL | public | https://ximo.com.mx (OG, Stripe redirects) |
| STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET | server | LIVE in Vercel; TEST locally |
| STRIPE_PRICE_MONTHLY / _ANNUAL / _DEMO | server | Live price ids ($49/$514.50/$0 USD) |
| RESEND_API_KEY / EMAIL_FROM | server | Transactional email (sender: onboarding@resend.dev until a domain is verified in Resend) |
| XIMO_REVIEW_EMAIL | server | Ad-review inbox (default ximoacademy@gmail.com) |
| PAYMENT_LINK_PLACEHOLDER | server | Fallback ad-payment link when Stripe absent |
| NEXT_PUBLIC_DISCORD_INVITE_URL | public | Community invite (code fallback exists) |
| DISCORD_ADS_WEBHOOK_URL | server | Admin ad posting (optional) |
| DISCORD_BOT_TOKEN / DISCORD_ADS_CHANNEL_ID | server | Bot alternative (optional) |
| CRON_SECRET | server | Vercel cron auth for /api/cron/reminders |

Planned (Phase 1 close-out): `SENTRY_DSN`, `NEXT_PUBLIC_POSTHOG_KEY` — code will
no-op when absent.

Rotation: rotate any leaked key at its provider dashboard, update Vercel env,
redeploy; local dev unaffected (separate keys).
