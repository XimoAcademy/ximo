-- ════════════════════════════════════════════════════════════════════════
-- Ximo — daily streak (Duolingo-style)
--
-- Tracks a per-user daily login streak. Activated automatically once per day
-- when the athlete opens the app. Continues while activations are on
-- consecutive days (Mexico City calendar days); resets to 1 after a missed day.
--
-- These columns are user-owned: the existing "profiles_update_self" policy and
-- the guard_profile_columns trigger already allow editing everything on one's
-- own profile EXCEPT role / subscription_status, so no new policy is needed.
-- ════════════════════════════════════════════════════════════════════════

alter table public.profiles
  add column if not exists current_streak  int  not null default 0,
  add column if not exists longest_streak  int  not null default 0,
  add column if not exists last_streak_date date;
