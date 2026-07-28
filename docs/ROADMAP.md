# Ximo — Roadmap (master-spec phases mapped to current reality)

Updated 2026-07-10. Phases from `XIMO_MASTER_PROMPT_FOR_CLAUDE_EN.md` §16.
Production baseline: https://ximo.com.mx, commit `9b83c14`, fully verified.

| Spec phase | Status | Remaining work |
|---|---|---|
| 0 Discovery/audit | ✅ done 2026-07-10 | This doc set (DECISIONS, MVP_SCOPE, ROADMAP) |
| 1 Foundation | 🟡 ~85% | **Sentry** error monitoring; **PostHog** (privacy-conscious) analytics; proper feature-flag helper; CSP header (needs per-vendor testing: Stripe/Supabase/Tally); env validation at startup |
| 2 Onboarding & profile | 🟡 ~80% | Completion-% indicator; budget-range + lifestyle preference fields; guardian/parent linking + consent flow (needs design + legal review) |
| 3 University DB & verification | 🟡 ~60% | verification_records + data_change_proposals tables; freshness status + review queue in admin; correction/dispute channel |
| 4 Matching | ❌ | Rules-first explainable engine (athletic/academic/financial fit, confidence, missing-data category); versioned logic + fixtures; NO probability claims |
| 5 CRM completion | 🟡 ~70% | Offers/visits/scholarship entities; offer-comparison table; timeline view; export |
| 6 Claude assistant | ❌ blocked | Needs Anthropic API key + budget (founder). Then: RAG over verified data, citations, guardrails, evals, cost controls. (Separately, "Ximo Support AI" — Gemini, free tier, narrow platform-troubleshooting chat — shipped; see lib/ai/gemini.ts. Not this Phase 6 RAG assistant.) |
| 7 Academy content | 🟡 | Manuel records videos → paste into courseData registry; quizzes into quizData |
| 8 Billing | ✅ live | Later: coupons, Stripe customer portal, trials, dunning polish |
| 9 Ops & automation | 🟡 | Weekly founder report (automate current manual digest), ticket system, backup-restore drill, runbooks |
| 10 Hardening & beta | 🟡 | Playwright E2E suite; accessibility scan; load test; legal professional review; beta cohort of real swimmers/parents (spec §21 validation gate) |
| 11 Scale | — | Gated on retention/margin/support metrics per spec §15 |

## Next three highest-priority steps

1. **Phase 1 close-out:** integrate Sentry + PostHog behind env-guarded no-ops
   (works locally without keys; founder creates the two free accounts → paste DSN/key).
2. **Phase 3 verification queue:** migration for `verification_records` +
   `data_change_proposals`, admin review UI — prerequisite for trustworthy matching.
3. **Phase 4 matching v1 (rules-first):** explainable fit categories using existing
   times + directory data, with test fixtures; behind a feature flag until reviewed.

## Standing blockers requiring the founder

- Anthropic API key + monthly AI budget (Phase 6).
- Sentry + PostHog account creation (free tiers) — code can land first.
- Professional legal review of the 6 legal drafts; real RFC/domicilio in privacy notice.
- Video recordings for Academy lessons.
- Beta cohort recruitment (DELFINMANNY audience).
