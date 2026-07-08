-- ════════════════════════════════════════════════════════════════════════
-- Ximo — advertising review flow (manual approval before payment/publication)
--
-- 1. Adds the campaign/CTA columns the app already reads (they were referenced
--    by lib/data/ads.ts but never created, so the admin queue query failed).
-- 2. Adds advertiser-supplied fields captured by the submission wizard.
-- 3. Widens review_status to the full manual flow:
--       pending                   → submitted, waiting for manual review
--       approved_pending_payment  → approved by admin; advertiser may now pay
--       paid_ready_to_publish     → payment confirmed; publication still manual
--       approved                  → published (visible to athletes via RLS)
--       rejected                  → not approved; no payment required
--    RLS is unchanged: only 'approved' ads are visible to other users.
-- ════════════════════════════════════════════════════════════════════════

alter table public.brand_ads
  add column if not exists cta_label        text,
  add column if not exists cta_url          text,     -- destination link of the ad
  add column if not exists budget           numeric,  -- MXN, set at payment time
  add column if not exists platform         text,
  add column if not exists budget_range     text,     -- advertiser's selected range (wizard)
  add column if not exists preferred_dates  text,     -- advertiser's preferred window (free text)
  add column if not exists rights_confirmed_at timestamptz;  -- when the advertiser checked the rights/veracity box

alter table public.brand_profiles
  add column if not exists contact_name  text,
  add column if not exists contact_phone text;

-- Widen the review_status check to the manual-approval flow.
alter table public.brand_ads drop constraint if exists brand_ads_review_status_check;
alter table public.brand_ads add constraint brand_ads_review_status_check
  check (review_status in (
    'pending',
    'approved_pending_payment',
    'paid_ready_to_publish',
    'approved',
    'rejected'
  ));
