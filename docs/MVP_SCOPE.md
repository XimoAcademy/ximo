# Ximo — MVP Scope & Feature Map (Phase 0 audit vs master spec)

Audited 2026-07-10 against `XIMO_MASTER_PROMPT_FOR_CLAUDE_EN.md`. Production:
https://ximo.com.mx (Vercel, commit `9b83c14`, all checks green, E2E-verified).

Legend: ✅ built & verified in production · 🟡 partial · ❌ not built (planned phase)

## Spec §5 features

| Spec area | Status | Where / notes |
|---|---|---|
| 5.1 Registration, verification, sign-in, recovery, sessions | ✅ | Supabase Auth; consent checkbox (versioned in metadata); minors notice; marketing opt-in separate |
| 5.1 Progressive onboarding + completion % | 🟡 | Onboarding page exists; no explicit completion % widget |
| 5.1 Export & deletion | ✅ | Settings → export JSON (ARCO) + type-to-confirm delete |
| 5.2 Athlete sports profile (events, times, SC/LC, goals) | ✅ | perfil + progreso (times per event/style, dates) |
| 5.2 Extensible sports architecture | 🟡 | Schema has `sports`-style fields; UI is swimming-only by design |
| 5.3 Academic profile (GPA, tests, budget, prefs) | 🟡 | GPA/tests fields exist; budget ranges & lifestyle prefs not modeled |
| 5.4 University database | ✅ | NCAA directory: 137 D1 programs, coaches w/ emails, sources; universidades CRUD per athlete |
| 5.5 Verification & freshness system | 🟡 | Source URLs + seed provenance; no verification_records/change-proposal queue (Phase 3) |
| 5.6 Explainable matching | ❌ | Phase 4 — rules-first engine; no fake scores shown today |
| 5.7 Recruiting CRM (pipeline, statuses, follow-ups) | ✅/🟡 | recruiting pipeline + coaches CRM + correos (drafts→mailto) + tasks; offers/visits/comparison not modeled (Phase 5) |
| 5.8 Email/communication generator | 🟡 | Templates + drafts + mailto (user confirms); no AI generation yet (Phase 6) |
| 5.9 Tasks, reminders, digest | ✅ | tareas + daily cron reminders (email+in-app) + streak |
| 5.10 Ximo Academy (courses) | ✅ | 6 courses/24 lessons, sequential unlock, progress, certificates; video/quiz registry ready (placeholders honest) |
| 5.11 Documents & templates | ✅ | Private uploads (validated, signed URLs); no passports/IDs guidance in privacy notice |
| 5.12 Payments & subscriptions | ✅ | Stripe LIVE: $0 demo checkout (no card), monthly/annual prices ready, idempotent webhook, billing page; no coupons/portal yet |
| 5.13 Admin dashboard | 🟡 | Moderation + ad review queues, audit-ish trails; no full ops console (Phase 9) |
| 5.14 Support | 🟡 | Help center + FAQ + mailto support; no ticketing system (Phase 9) |
| 5.15 Community (no social network) | ✅ | External Discord entry page + rules; complies with "no minor DMs" |
| Advertising (extra, not in spec) | ✅ | Manual-review ad flow: wizard → email → approve/pay/publish; Discord posting admin-only |

## Spec §6 assistant / agents

❌ Not built. Requires Anthropic API key + budget (founder decision). Phase 6.
No fake "AI" UI exists — complies with "no fake functionality".

NOTE: "Ximo Support AI" (Gemini, free tier) shipped as a separate, narrower
feature — platform/usage troubleshooting chat only, not RAG over verified
recruiting data. It does not close this Phase 6 item.

## Spec §7 architecture (as found)

Next.js 16.2.6 (App Router, Turbopack) · TypeScript · Tailwind · Supabase
(Postgres+Auth+Storage+RLS, 9 migrations) · Stripe LIVE · Resend · Vercel ·
GitHub CI (lint+test+build) · Vitest (50 tests). Single app (no monorepo — spec-permitted).

**Phase 1 gaps:** Sentry (error monitoring) ❌ · analytics (PostHog) ❌ · feature
flags 🟡 (env-based demo flag only) · CSP header ❌ (baseline headers ✅, CSP tracked
in docs/security-plan.md) · Playwright E2E ❌ (browser E2E done manually+scripts).

## Spec §9 security/privacy (as found)

HTTPS/HSTS ✅ · RLS everywhere ✅ · server-side authz ✅ · security headers ✅ ·
signed URLs ✅ · upload validation ✅ · secrets in env only ✅ · 6 legal drafts
(marked "pending professional review") ✅ · minors: 13+ gate 🟡 (consent text yes,
DOB check no) · MFA for admin ❌ (Supabase dashboard-level pending) · audit logs 🟡.

## Non-goals confirmed (spec §15)

No native apps, no social network, no medical features, no genetics, no
sponsorship marketplace, no scraping beyond documented public sources.
