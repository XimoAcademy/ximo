# Ximo — Decision Log

Format per master spec: date, decision, alternatives, reason, risks, reversal plan.
Older decisions (pre-log) are recorded in git history and docs/launch-checklist.md.

## 2026-07-10 — Master spec adopted over an already-built product

- **Decision:** Treat `XIMO_MASTER_PROMPT_FOR_CLAUDE_EN.md` as the forward specification, but
  preserve the existing shipped product as the Phase 1/2 foundation instead of re-initializing.
- **Alternatives:** (a) greenfield rebuild per spec's "no repository" path; (b) ignore spec.
- **Reason:** The repo already implements a deployed, verified product on https://ximo.com.mx:
  auth+RLS, athlete profile/times/academics, NCAA directory (137 D1 programs), coach CRM,
  tasks, courses, Discord community, Stripe LIVE billing ($0 demo), Resend email, admin
  panels, 6 MX legal pages, CI, unit tests, security headers. Rebuilding would violate the
  spec's own "preserve useful existing work" rule and destroy a working production system.
- **Risks:** Existing structure (single Next.js app, not monorepo) diverges from the spec's
  suggested `apps/*` layout. Accepted — the spec says "do not add monorepo complexity unless
  it provides real value in the first phase."
- **Reversal:** Tag `backup-before-ximo-com-mx` and full git history allow rollback.

## 2026-07-10 — Spec-vs-reality divergences accepted for now

- **Spanish-first UI, English code:** already true. ✔
- **PWA/web-first, no native apps:** already true (manifest.webmanifest present). ✔
- **No internal social network / no minor DMs:** already true (community = external Discord). ✔
- **Coach outreach = drafts + mailto, never auto-send:** already true (correos section). ✔
- **Assistant (Anthropic API), RAG, agents (spec §6):** NOT built. Deferred to Phase 6 —
  requires an Anthropic API key (billing decision → founder blocker). Separately, "Ximo
  Support AI" (Gemini, free tier) shipped as a narrower platform-troubleshooting chatbot
  (lib/ai/gemini.ts) — not this Phase 6 assistant, does not close this item.
- **Explainable matching engine (spec §5.6):** NOT built. Directory + manual pipeline exist.
  Phase 4 work; rules-first design documented in docs/ROADMAP.md.
- **Verification/freshness system (spec §5.5):** partial (ncaa directory has source URLs and
  seed provenance; no verification_records table). Phase 3 work.
- **Parent/guardian role (spec §4):** NOT built. MVP is athlete-only with a minors notice at
  registration. Guardian linking is Phase 2 work and needs consent-flow design.
- **Ops roles (ops manager, verifier, support):** NOT built; roles today are athlete/admin.
  Acceptable at current scale (pre-beta); revisit at 100 paying users per spec §10.
- **Error monitoring + analytics:** NOT present (no Sentry/PostHog). Identified as the top
  Phase 1 gaps. Adding them requires accounts (founder blocker for tokens); code-side
  scaffolding can proceed with env-guarded no-ops.

## 2026-07-10 — Production domain

- **Decision:** `https://ximo.com.mx` (IONOS-registered) is the primary production domain;
  `www` 308-redirects to apex; `ximo-theta.vercel.app` retained as deployment alias and
  Stripe webhook target.
- **Reason:** Founder decision (purchased domain). Apex-primary per founder instruction.
- **Risks:** Earlier `ximoacademy.mx` rows in Vercel/Resend are stale (domain was never
  registered). Cleanup pending; harmless while "Invalid Configuration".
- **Reversal:** Remove domain rows in Vercel; DNS is only two records at IONOS.

## 2026-07-10 — Supabase auth Site URL corrected

- **Decision:** Site URL `http://localhost:3000` → `https://ximo.com.mx`; redirect allow-list
  now `localhost:3000/**`, `ximo.com.mx/**`, `ximo-theta.vercel.app/**`.
- **Reason:** Pre-existing production bug — confirmation/recovery emails could fall back to a
  localhost redirect for real users.
- **Reversal:** Dashboard setting; previous value recorded here.

## 2026-07-09 — Stripe LIVE wiring (recorded retroactively)

- Live account `acct_1ThDWt3GTaLP4I7m` (charges+payouts enabled, MX/mxn). Product
  `prod_Uqr2evSCCJokoG`; prices: monthly $49 USD, annual $514.50 USD, demo $0.00 USD.
  Live webhook `we_1Tr9Ku3GTaLP4I7mFeo8xWmE` → /api/webhooks/stripe. Demo mode stays ON:
  users get a $0 live checkout (no card). Local `.env.local` intentionally keeps TEST keys.
- **Risk:** old test-mode subscriptions no longer receive webhook events (signature mismatch);
  accepted at $0 value.
