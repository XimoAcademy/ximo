# Ximo — Readiness for 1,000 users (public demo launch)

Assessment for opening the demo publicly to ~1,000 users. The app is
architecturally ready (serverless + Postgres + RLS, all features QA-verified:
28/28 data-flow checks, 193-page crawl, payments + ad-payment E2E green). The
items below are **infrastructure/plan actions only you can do** (billing, DDL).

## Verdict
Code is ready. Before a real public push, do the **P0** items — they're about
plan limits and one SQL migration, not code.

## P0 — do before/at launch
| Item | Why | Action (yours) |
|---|---|---|
| **Apply `supabase/migrations/008_perf_indexes.sql`** | Owner-scoped lists/counts and the community feed get slow without indexes at 1k users. | Paste it in Supabase → SQL Editor → Run. (I can't run DDL via the API.) |
| **Supabase Pro ($25/mo)** | Free tier: 500 MB DB, 1 GB storage, pauses on inactivity, limited connections. 1k users + avatar/doc/ad uploads will hit storage and concurrency. Pro = 8 GB DB, 100 GB storage, no pausing, daily backups + PITR. | Upgrade the project to Pro. |
| **Vercel Pro ($20/mo)** | Hobby is for non-commercial use and has tighter function/bandwidth limits. A public, paid-ads product should be on Pro. | Upgrade the team to Pro. |

## P1 — soon after launch
| Item | Why | Action |
|---|---|---|
| **Rate limiting** (Upstash Redis + @upstash/ratelimit) | Public signup/login/forms invite abuse. Supabase Auth has built-in auth limits, but app endpoints don't. | Add a limiter on auth + form actions (see security-plan.md). |
| **Resend volume** | Free Resend ≈ 100 emails/day. Launch-day confirmations + resets + reminders for 1k users can exceed it. | Move to a Resend paid tier or monitor; throttle reminders. |
| **Stripe Live** (only when charging) | Demo runs at $0 in test mode; ads charge in test mode. Real charges need Live keys + the $0 demo price recreated in Live. | Swap to `sk_live_…`, recreate prices, update webhook + Vercel env. |

## Already handled (no action)
- Serverless scales horizontally on Vercel; no servers to size.
- RLS isolates every user's data; guard triggers prevent privilege/sub escalation.
- Stripe webhook is idempotent (dedupe ledger) — safe under retries/concurrency.
- Security headers live; secrets only in env, never in the repo.
- Demo access is free and instant (DEMO_MODE on by default).

## Capacity sanity check
- **Auth:** Supabase free supports 50k MAU — 1k is comfortable.
- **DB rows:** thousands of rows per table at 1k users — trivial for Postgres *with the indexes*.
- **Concurrency:** supabase-js goes through PostgREST (pooled) — fine for 1k; Pro raises limits for spikes.
- **Bandwidth:** the 3D landing lazy-loads three.js (code-split, `/` only) and falls back to CSS on low-end/mobile/reduced-motion.
