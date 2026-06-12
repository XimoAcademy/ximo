# Ximo — Database & Backend Plan

Foundation for moving Ximo from static/mock UI to a real, Supabase-backed app.
This phase ships the **schema, security, and safe client wiring** only. No real
payments, and the existing UI keeps working with or without Supabase configured.

---

## 1. Overview

- **Backend:** Supabase (Postgres + Auth + RLS + Storage).
- **Framework:** Next.js 16 App Router (React 19).
- **Auth model:** Supabase Auth (`auth.users`) ↔ a public `profiles` row (1:1).
- **Access tiers:** `athlete` (default), `brand`, `admin` (`profiles.role`).
- **Payments:** not implemented. Subscription state is stored and can be set
  manually (`subscription_status = 'manual_active'`) until billing is added.
- **Safety:** the community feed has a moderation pipeline; new content is
  `pending` and only `approved` content is publicly readable.

The app is built so that **missing env vars never crash it** — Supabase helpers
return `null` and the UI falls back to the current static/mock behaviour.

---

## 2. Schema summary (24 tables)

| Area | Tables |
| --- | --- |
| Identity | `profiles`, `athlete_profiles`, `user_settings` |
| Recruiting | `universities`, `coaches`, `recruiting_events`, `emails`, `documents`, `tasks` |
| Progress | `progress_entries` |
| Learning | `courses`, `lessons`, `lesson_progress` |
| Community | `community_posts`, `post_media`, `comments`, `post_likes` |
| Moderation | `reports`, `moderation_queue` |
| Brands | `brand_profiles`, `brand_ads`, `brand_campaigns` |
| Platform | `notifications`, `subscriptions` |

Migration: [`supabase/migrations/001_initial_ximo_schema.sql`](../supabase/migrations/001_initial_ximo_schema.sql)
Seed: [`supabase/seed.sql`](../supabase/seed.sql)

Conventions: UUID PKs (`gen_random_uuid()`), `timestamptz` timestamps,
`updated_at` auto-maintained by a trigger, `on delete cascade` from `profiles`.

---

## 3. RLS strategy

RLS is enabled on **every** table. Patterns:

- **Owner-only data** (recruiting, coaches, tasks, documents, progress, emails,
  athlete profile, settings, notifications, lesson progress): a user can only
  `select/insert/update/delete` rows where `user_id = auth.uid()`. Admins can read.
- **Profiles:** readable by any signed-in user (social app), but a user can only
  update their **own** row, and a trigger blocks changes to `role`,
  `subscription_status`, `plan_type` (anti-escalation).
- **Courses / lessons:** published rows readable by signed-in users; only admins
  write.
- **Community (`posts`, `comments`, `post_media`):** readable when
  `moderation_status = 'approved'` (or you own it, or you're admin). New rows can
  only be inserted as `pending`. A trigger makes `moderation_status` /
  `sensitive_categories` immutable to non-admins, so users **cannot self-approve**.
- **Reports:** any signed-in user can file; reporter + admins can read; admins resolve.
- **Moderation queue:** insertable by the app; **admin-only** read/update.
- **Brands:** brand owners manage their own `brand_profiles` / `brand_ads`;
  triggers stop brands self-approving ads or self-verifying; approved ads are
  readable by everyone signed in.
- **Subscriptions:** owner can **read**; there are **no client write policies**, so
  only the **service role** (server / future webhook) can change subscription state.

`public.is_admin()` (SECURITY DEFINER) returns true for platform admins **and**
for the service-role key, and is used by both policies and the guard triggers.

> If we later move admin checks to JWT custom claims, replace `is_admin()`'s body
> and the policies keep working.

---

## 4. Storage buckets

| Bucket | Public | Policy summary |
| --- | --- | --- |
| `avatars` | yes | Public read; users manage their own files. |
| `post-media` | no | Owner/admin read always; others only when the linked `post_media` row is `approved`. Owner upload. |
| `documents` | no | Fully private to the owner. |
| `lesson-videos` | no | Admin-managed; **LATER:** read gated to active subscribers. |
| `brand-ads` | no | Brand owner manages own files; admin reads. **LATER:** public/approved read via stable `storage_path`. |

Buckets + policies are created in the migration's STORAGE section.

---

## 5. Auth & subscription flow

Intended product flow (unchanged): **Intro → Loading → Login/Register →
Subscription validation → Subscribe if inactive → Dashboard if active.**

Helpers (all null/false-safe when unconfigured):

- `lib/auth/getUser.ts` — `getCurrentUser()`, `getProfile()`, `isAuthenticated()`.
- `lib/subscription/requireSubscription.ts` — `getSubscriptionStatus()`,
  `isSubscriptionActive()`, `requireSubscription()` (redirects to `/login` or
  `/subscribe`; **not wired into any page yet**).

Active statuses: `active`, `trialing`, `manual_active`.

`middleware.ts` only **refreshes the session** right now (no redirects) so the
static preview can't break. Route protection lands in a later phase:

- Public: `/`, `/intro`, `/loading`, `/login`, `/register`, `/forgot-password`,
  `/reset-password`, `/verify-email`, `/subscribe`, `/build-log`.
- `/app/**`: requires auth (later).
- Dashboard: requires active subscription (later) via `requireSubscription()`.

---

## 6. Content moderation flow

1. User creates a post / comment / media → inserted as `moderation_status = 'pending'`.
2. `lib/moderation/content-filter.ts#classifyTextLocally()` runs a **safe, non-AI**
   pass (detects only links + basic spam shape; no harmful examples embedded) and
   returns a priority `score` + `categories`. `shouldSendToReview()` is `true` for
   everything in Phase 1.
3. Item enters `moderation_queue`; users can also `report` content.
4. An admin reviews and sets `approved` / `hidden` / `rejected` / `flagged`
   (only admins/service role can change `moderation_status`).
5. Public/community feed queries select `moderation_status = 'approved'` only.

Types live in `lib/moderation/types.ts`; the admin prototype is at
`app/app/admin/moderation/page.tsx` (visual only, not yet protected).

Sensitive categories tracked: harassment, hate, sexual, self_harm, violence,
dangerous_behavior, spam, scam, personal_information, suspicious_link.

---

## 7. Environment variables

Copy `.env.example` → `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`NEXT_PUBLIC_*` are browser-safe (guarded by RLS). The service role key is
**server-only** and bypasses RLS — never expose it to the client.

---

## 8. Next implementation steps

1. **Create a Supabase project**, paste keys into `.env.local`.
2. **Apply the migration** (`supabase db push`, or run the SQL in the dashboard),
   then optionally run `supabase/seed.sql`.
3. **Wire auth:** turn login/register into real Supabase `signInWithPassword` /
   `signUp` Server Actions (UI is already comment-marked as ready).
4. **Enforce guards:** call `requireSubscription()` in the `/app` layout once auth
   works; add redirect logic to `middleware.ts`.
5. **Connect reads:** community feed → approved `community_posts`; courses →
   `courses`/`lessons`/`lesson_progress`; settings → `user_settings`.
6. **Media uploads:** upload to the `post-media` / `documents` buckets and create
   `post_media` rows as `pending`.
7. **Moderation:** protect the admin page to `role = 'admin'`, make the buttons
   call the service role to update `moderation_status`, and (later) swap the local
   filter for a real classifier (Supabase Edge Function / moderation API).
8. **Subscriptions/billing:** keep manual for now; add a provider + webhook later
   that writes `subscriptions` (the sync trigger updates `profiles`).
