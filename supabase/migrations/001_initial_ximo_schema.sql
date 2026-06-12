-- ════════════════════════════════════════════════════════════════════════
-- Ximo — initial schema (Phase 1 foundation)
-- Paid subscription app for Mexican student-athletes (swimmers first).
--
-- Includes: profiles & athlete data, recruiting CRM, courses/lessons + progress,
-- community feed with media/comments/likes, content moderation pipeline,
-- brand ads, notifications, settings and subscriptions.
--
-- Security model:
--   * RLS enabled on every table.
--   * Users own their private data (recruiting, tasks, documents, progress…).
--   * Community: only APPROVED content is readable; new content is PENDING.
--   * Triggers stop users from self-approving content or escalating their own
--     role / subscription status. Privileged changes go through admins or the
--     service-role key (server-side only).
--   * Payments are NOT implemented; subscription state can be set manually
--     (status 'manual_active') for now.
-- ════════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- Defer function-body validation so helper functions (e.g. is_admin) can
-- reference tables that are created later in this same script.
set check_function_bodies = off;

-- ─────────────────────────────────────────────────────────────────────────
-- Utility functions
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end; $$;

-- True for platform admins AND for the service-role key (server/webhooks).
-- SECURITY DEFINER so it can read profiles from inside RLS policies without
-- recursion. Used by policies AND by the guard triggers below.
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select
    coalesce((auth.jwt() ->> 'role') = 'service_role', false)
    or coalesce((select p.role = 'admin' from public.profiles p where p.id = auth.uid()), false);
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- 1. profiles  (public user profile, 1:1 with auth.users)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  role text not null default 'athlete' check (role in ('athlete','brand','admin')),
  country text,
  sport text,
  graduation_year int,
  avatar_url text,
  bio text,
  subscription_status text not null default 'inactive'
    check (subscription_status in ('inactive','active','canceled','past_due','trialing','manual_active')),
  plan_type text check (plan_type in ('monthly','annual','none')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. athlete_profiles (deeper athlete data, 1:1 with profiles)
create table if not exists public.athlete_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  primary_event text,
  secondary_event text,
  best_times jsonb not null default '{}'::jsonb,
  target_division text,
  recruiting_goal text,
  academic_goal text,
  gpa text,
  sat_score text,
  toefl_score text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. universities (user university tracking)
create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  division text,
  location text,
  website text,
  fit_type text,
  priority text,
  recruiting_stage text,
  scholarship_clarity text,
  cost_notes text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists universities_user_idx on public.universities(user_id);

-- 4. coaches (coach CRM)
create table if not exists public.coaches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  university_id uuid references public.universities(id) on delete set null,
  name text not null,
  role text,
  email text,
  phone text,
  status text,
  last_contact_at timestamptz,
  next_follow_up_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists coaches_user_idx on public.coaches(user_id);
create index if not exists coaches_university_idx on public.coaches(university_id);

-- 5. recruiting_events (pipeline events / history)
create table if not exists public.recruiting_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  university_id uuid references public.universities(id) on delete set null,
  coach_id uuid references public.coaches(id) on delete set null,
  event_type text,
  title text,
  description text,
  status text,
  event_date timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists recruiting_events_user_idx on public.recruiting_events(user_id);

-- 6. emails (email tracking / templates)
create table if not exists public.emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  coach_id uuid references public.coaches(id) on delete set null,
  university_id uuid references public.universities(id) on delete set null,
  subject text,
  body text,
  status text,
  sent_at timestamptz,
  reply_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists emails_user_idx on public.emails(user_id);

-- 7. documents (document checklist / storage refs)
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  type text,
  status text,
  file_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists documents_user_idx on public.documents(user_id);

-- 8. tasks (daily tasks / action center)
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  module text,
  priority text,
  status text,
  due_date date,
  related_university_id uuid references public.universities(id) on delete set null,
  related_coach_id uuid references public.coaches(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tasks_user_idx on public.tasks(user_id);

-- 9. progress_entries (athletic progress)
create table if not exists public.progress_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  sport text,
  event text,
  result text,
  result_date date,
  notes text,
  media_url text,
  created_at timestamptz not null default now()
);
create index if not exists progress_entries_user_idx on public.progress_entries(user_id);

-- 10. courses (global course library)
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  category text,
  level text,
  thumbnail_url text,
  sort_order int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 11. lessons (video lessons inside courses)
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  video_url text,
  duration_seconds int,
  sort_order int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, slug)
);
create index if not exists lessons_course_idx on public.lessons(course_id);

-- 12. lesson_progress (unlock-next-after-previous)
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status text not null default 'locked' check (status in ('locked','unlocked','in_progress','completed')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);
create index if not exists lesson_progress_user_idx on public.lesson_progress(user_id);

-- 13. community_posts (social feed)
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null default 'text'
    check (type in ('text','question','progress','achievement','recruiting','training','brand_ad')),
  title text,
  body text,
  topic text,
  visibility text not null default 'public',
  moderation_status text not null default 'pending'
    check (moderation_status in ('pending','approved','hidden','rejected','flagged')),
  sensitive_score numeric,
  sensitive_categories text[] not null default '{}',
  media_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists community_posts_status_idx on public.community_posts(moderation_status);
create index if not exists community_posts_user_idx on public.community_posts(user_id);
create index if not exists community_posts_topic_idx on public.community_posts(topic);

-- 14. post_media (images/videos attached to posts)
create table if not exists public.post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  media_type text not null check (media_type in ('image','video')),
  storage_path text,
  public_url text,
  moderation_status text not null default 'pending'
    check (moderation_status in ('pending','approved','hidden','rejected','flagged')),
  sensitive_categories text[] not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists post_media_post_idx on public.post_media(post_id);

-- 15. comments (comments & replies)
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  parent_comment_id uuid references public.comments(id) on delete cascade,
  body text not null,
  moderation_status text not null default 'pending'
    check (moderation_status in ('pending','approved','hidden','rejected','flagged')),
  sensitive_categories text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments(post_id);

-- 16. post_likes
create table if not exists public.post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

-- 17. reports (user reports of posts/comments/media)
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('post','comment','media','user','brand_ad')),
  target_id uuid not null,
  reason text,
  details text,
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
create index if not exists reports_status_idx on public.reports(status);

-- 18. moderation_queue (admin review queue)
create table if not exists public.moderation_queue (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_id uuid not null,
  user_id uuid references public.profiles(id) on delete set null,
  reason text,
  status text not null default 'pending' check (status in ('pending','approved','hidden','rejected','flagged','dismissed')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists moderation_queue_status_idx on public.moderation_queue(status);

-- 19. brand_profiles
create table if not exists public.brand_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  brand_name text not null,
  contact_email text,
  website text,
  category text,
  verification_status text not null default 'pending' check (verification_status in ('pending','verified','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists brand_profiles_user_idx on public.brand_profiles(user_id);

-- 20. brand_ads
create table if not exists public.brand_ads (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brand_profiles(id) on delete cascade,
  title text,
  body text,
  media_url text,
  format text check (format in ('photo','video','text','offer','product')),
  target_audience text,
  review_status text not null default 'pending' check (review_status in ('pending','approved','rejected')),
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists brand_ads_brand_idx on public.brand_ads(brand_id);
create index if not exists brand_ads_review_idx on public.brand_ads(review_status);

-- 21. brand_campaigns
create table if not exists public.brand_campaigns (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.brand_ads(id) on delete cascade,
  budget_mxn numeric,
  duration_days int,
  estimated_reach_min int,
  estimated_reach_max int,
  status text not null default 'draft' check (status in ('draft','scheduled','active','paused','ended')),
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists brand_campaigns_ad_idx on public.brand_campaigns(ad_id);

-- 22. notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  body text,
  type text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications(user_id);

-- 23. user_settings
create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  theme text not null default 'dark' check (theme in ('dark','light','system')),
  language text not null default 'es',
  email_notifications boolean not null default true,
  community_notifications boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 24. subscriptions (state only; no real payment logic yet)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'inactive'
    check (status in ('inactive','active','canceled','past_due','trialing','manual_active')),
  plan_type text check (plan_type in ('monthly','annual','none')),
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists subscriptions_user_idx on public.subscriptions(user_id);

-- ─────────────────────────────────────────────────────────────────────────
-- updated_at triggers
-- ─────────────────────────────────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','athlete_profiles','universities','coaches','emails','documents',
    'tasks','courses','lessons','lesson_progress','community_posts','comments',
    'brand_profiles','brand_ads','brand_campaigns','user_settings','subscriptions'
  ]
  loop
    execute format(
      'drop trigger if exists set_updated_at on public.%I; '
      'create trigger set_updated_at before update on public.%I '
      'for each row execute function public.set_updated_at();', t, t);
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────────────────
-- New-user bootstrap: create a profile + settings row when an auth user signs up
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, username, avatar_url, country, sport)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'country',
    coalesce(new.raw_user_meta_data->>'sport', 'Natación')
  )
  on conflict (id) do nothing;

  insert into public.user_settings (user_id) values (new.id)
  on conflict (user_id) do nothing;

  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────
-- Guard triggers — block privilege/moderation tampering by non-admins
-- (Service role passes is_admin(); regular users do not.)
-- ─────────────────────────────────────────────────────────────────────────

-- Users may edit their profile (name, bio, avatar…) but NOT their own role,
-- subscription status or plan. Those move only via admin / service role.
create or replace function public.guard_profile_columns()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    new.role := old.role;
    new.subscription_status := old.subscription_status;
    new.plan_type := old.plan_type;
  end if;
  return new;
end; $$;
drop trigger if exists guard_profile_columns on public.profiles;
create trigger guard_profile_columns before update on public.profiles
  for each row execute function public.guard_profile_columns();

-- Users cannot self-approve content. moderation_status + sensitive_categories
-- are immutable except to admins / service role.
create or replace function public.guard_moderation_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    new.moderation_status := old.moderation_status;
    new.sensitive_categories := old.sensitive_categories;
  end if;
  return new;
end; $$;
drop trigger if exists guard_moderation_fields on public.community_posts;
create trigger guard_moderation_fields before update on public.community_posts
  for each row execute function public.guard_moderation_fields();
drop trigger if exists guard_moderation_fields on public.comments;
create trigger guard_moderation_fields before update on public.comments
  for each row execute function public.guard_moderation_fields();
drop trigger if exists guard_moderation_fields on public.post_media;
create trigger guard_moderation_fields before update on public.post_media
  for each row execute function public.guard_moderation_fields();

-- Brands cannot self-approve their ads.
create or replace function public.guard_brand_ad_review()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    new.review_status := old.review_status;
    new.rejection_reason := old.rejection_reason;
  end if;
  return new;
end; $$;
drop trigger if exists guard_brand_ad_review on public.brand_ads;
create trigger guard_brand_ad_review before update on public.brand_ads
  for each row execute function public.guard_brand_ad_review();

-- Brands cannot self-verify.
create or replace function public.guard_brand_verification()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    new.verification_status := old.verification_status;
  end if;
  return new;
end; $$;
drop trigger if exists guard_brand_verification on public.brand_profiles;
create trigger guard_brand_verification before update on public.brand_profiles
  for each row execute function public.guard_brand_verification();

-- Keep profiles.subscription_status in sync when subscriptions change
-- (writes happen via service role / admin only).
create or replace function public.sync_subscription_to_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.profiles
    set subscription_status = new.status,
        plan_type = coalesce(new.plan_type, plan_type)
  where id = new.user_id;
  return new;
end; $$;
drop trigger if exists sync_subscription_to_profile on public.subscriptions;
create trigger sync_subscription_to_profile
  after insert or update on public.subscriptions
  for each row execute function public.sync_subscription_to_profile();

-- ─────────────────────────────────────────────────────────────────────────
-- Enable Row Level Security on everything
-- ─────────────────────────────────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','athlete_profiles','universities','coaches','recruiting_events',
    'emails','documents','tasks','progress_entries','courses','lessons',
    'lesson_progress','community_posts','post_media','comments','post_likes',
    'reports','moderation_queue','brand_profiles','brand_ads','brand_campaigns',
    'notifications','user_settings','subscriptions'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────────────────
-- Policies
-- ─────────────────────────────────────────────────────────────────────────

-- profiles: public-ish read (it's a social app), self-update only.
-- NOTE: subscription_status is visible to other signed-in users here; if that
-- becomes a concern, expose public fields via a dedicated view instead.
create policy "profiles_read" on public.profiles
  for select to authenticated using (true);
create policy "profiles_insert_self" on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy "profiles_update_self" on public.profiles
  for update to authenticated using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Generic owner-only tables (private recruiting / academic data).
do $$
declare t text;
begin
  foreach t in array array[
    'athlete_profiles','universities','coaches','recruiting_events','emails',
    'documents','tasks','progress_entries','lesson_progress','notifications','user_settings'
  ]
  loop
    execute format($f$
      create policy "%1$s_select_own" on public.%1$I
        for select to authenticated using (user_id = auth.uid() or public.is_admin());
      create policy "%1$s_insert_own" on public.%1$I
        for insert to authenticated with check (user_id = auth.uid());
      create policy "%1$s_update_own" on public.%1$I
        for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
      create policy "%1$s_delete_own" on public.%1$I
        for delete to authenticated using (user_id = auth.uid());
    $f$, t);
  end loop;
end $$;

-- courses / lessons: published content readable by signed-in users; admins manage.
create policy "courses_read_published" on public.courses
  for select to authenticated using (is_published or public.is_admin());
create policy "courses_admin_write" on public.courses
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "lessons_read_published" on public.lessons
  for select to authenticated using (is_published or public.is_admin());
create policy "lessons_admin_write" on public.lessons
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- community_posts: read approved (or own, or admin); create as pending only.
create policy "community_posts_read" on public.community_posts
  for select to authenticated
  using (moderation_status = 'approved' or user_id = auth.uid() or public.is_admin());
create policy "community_posts_insert_own" on public.community_posts
  for insert to authenticated
  with check (user_id = auth.uid() and moderation_status = 'pending');
create policy "community_posts_update_own" on public.community_posts
  for update to authenticated using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy "community_posts_delete_own" on public.community_posts
  for delete to authenticated using (user_id = auth.uid() or public.is_admin());

-- post_media: visible when its post is readable; create as pending only.
create policy "post_media_read" on public.post_media
  for select to authenticated using (
    user_id = auth.uid() or public.is_admin()
    or exists (
      select 1 from public.community_posts p
      where p.id = post_media.post_id and p.moderation_status = 'approved'
    )
  );
create policy "post_media_insert_own" on public.post_media
  for insert to authenticated
  with check (user_id = auth.uid() and moderation_status = 'pending');
create policy "post_media_update_own" on public.post_media
  for update to authenticated using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy "post_media_delete_own" on public.post_media
  for delete to authenticated using (user_id = auth.uid() or public.is_admin());

-- comments: read approved (or own, or admin); create as pending only.
create policy "comments_read" on public.comments
  for select to authenticated
  using (moderation_status = 'approved' or user_id = auth.uid() or public.is_admin());
create policy "comments_insert_own" on public.comments
  for insert to authenticated
  with check (user_id = auth.uid() and moderation_status = 'pending');
create policy "comments_update_own" on public.comments
  for update to authenticated using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy "comments_delete_own" on public.comments
  for delete to authenticated using (user_id = auth.uid() or public.is_admin());

-- post_likes: signed-in read; like/unlike your own.
create policy "post_likes_read" on public.post_likes
  for select to authenticated using (true);
create policy "post_likes_insert_own" on public.post_likes
  for insert to authenticated with check (user_id = auth.uid());
create policy "post_likes_delete_own" on public.post_likes
  for delete to authenticated using (user_id = auth.uid());

-- reports: anyone signed in can file; see your own; admins see all.
create policy "reports_insert_own" on public.reports
  for insert to authenticated with check (reporter_id = auth.uid());
create policy "reports_read" on public.reports
  for select to authenticated using (reporter_id = auth.uid() or public.is_admin());
create policy "reports_admin_update" on public.reports
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- moderation_queue: app may enqueue; only admins review/read.
create policy "moderation_queue_insert" on public.moderation_queue
  for insert to authenticated with check (auth.uid() is not null);
create policy "moderation_queue_admin_read" on public.moderation_queue
  for select to authenticated using (public.is_admin());
create policy "moderation_queue_admin_update" on public.moderation_queue
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- brand_profiles: owner manages; admins can read all (for verification).
create policy "brand_profiles_select" on public.brand_profiles
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "brand_profiles_insert_own" on public.brand_profiles
  for insert to authenticated with check (user_id = auth.uid());
create policy "brand_profiles_update_own" on public.brand_profiles
  for update to authenticated using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy "brand_profiles_delete_own" on public.brand_profiles
  for delete to authenticated using (user_id = auth.uid() or public.is_admin());

-- brand_ads: brand owner manages; approved ads readable by everyone signed in.
create policy "brand_ads_select" on public.brand_ads
  for select to authenticated using (
    review_status = 'approved'
    or public.is_admin()
    or exists (
      select 1 from public.brand_profiles b
      where b.id = brand_ads.brand_id and b.user_id = auth.uid()
    )
  );
create policy "brand_ads_insert_own" on public.brand_ads
  for insert to authenticated with check (
    exists (
      select 1 from public.brand_profiles b
      where b.id = brand_ads.brand_id and b.user_id = auth.uid()
    )
  );
create policy "brand_ads_update_own" on public.brand_ads
  for update to authenticated using (
    public.is_admin()
    or exists (select 1 from public.brand_profiles b where b.id = brand_ads.brand_id and b.user_id = auth.uid())
  ) with check (
    public.is_admin()
    or exists (select 1 from public.brand_profiles b where b.id = brand_ads.brand_id and b.user_id = auth.uid())
  );

-- brand_campaigns: managed by the owning brand (via its ad) or admins.
create policy "brand_campaigns_select" on public.brand_campaigns
  for select to authenticated using (
    public.is_admin()
    or exists (
      select 1 from public.brand_ads a
      join public.brand_profiles b on b.id = a.brand_id
      where a.id = brand_campaigns.ad_id and b.user_id = auth.uid()
    )
  );
create policy "brand_campaigns_write" on public.brand_campaigns
  for all to authenticated using (
    public.is_admin()
    or exists (
      select 1 from public.brand_ads a
      join public.brand_profiles b on b.id = a.brand_id
      where a.id = brand_campaigns.ad_id and b.user_id = auth.uid()
    )
  ) with check (
    public.is_admin()
    or exists (
      select 1 from public.brand_ads a
      join public.brand_profiles b on b.id = a.brand_id
      where a.id = brand_campaigns.ad_id and b.user_id = auth.uid()
    )
  );

-- subscriptions: owner can READ; writes are service-role/admin only.
-- (No insert/update/delete policy for regular users → only the service role,
--  which bypasses RLS, can change subscription state. Real billing webhooks
--  land here later.)
create policy "subscriptions_select_own" on public.subscriptions
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- ════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKETS + POLICIES
--   avatars        public read; users manage own
--   post-media     private bucket; readable when its post/media is approved
--   documents      fully private to owner
--   lesson-videos  private; (later) readable by active subscribers
--   brand-ads      brand owner manages; approved ads served via signed/public URL
-- ════════════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('post-media', 'post-media', false),
  ('documents', 'documents', false),
  ('lesson-videos', 'lesson-videos', false),
  ('brand-ads', 'brand-ads', false)
on conflict (id) do nothing;

-- avatars
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "avatars_owner_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'avatars' and owner = auth.uid());
create policy "avatars_owner_update" on storage.objects
  for update to authenticated using (bucket_id = 'avatars' and owner = auth.uid());
create policy "avatars_owner_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'avatars' and owner = auth.uid());

-- post-media: owner or admin always; others only if the linked media is approved.
create policy "post_media_read" on storage.objects
  for select to authenticated using (
    bucket_id = 'post-media' and (
      owner = auth.uid()
      or public.is_admin()
      or exists (
        select 1 from public.post_media pm
        where pm.storage_path = storage.objects.name and pm.moderation_status = 'approved'
      )
    )
  );
create policy "post_media_owner_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'post-media' and owner = auth.uid());
create policy "post_media_owner_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'post-media' and (owner = auth.uid() or public.is_admin()));

-- documents: fully private to owner.
create policy "documents_owner_all" on storage.objects
  for all to authenticated
  using (bucket_id = 'documents' and owner = auth.uid())
  with check (bucket_id = 'documents' and owner = auth.uid());

-- lesson-videos: admins manage; reads gated to admins for now.
-- LATER: replace the read check with an active-subscription test.
create policy "lesson_videos_read" on storage.objects
  for select to authenticated using (bucket_id = 'lesson-videos' and public.is_admin());
create policy "lesson_videos_admin_write" on storage.objects
  for all to authenticated
  using (bucket_id = 'lesson-videos' and public.is_admin())
  with check (bucket_id = 'lesson-videos' and public.is_admin());

-- brand-ads: brand owner manages own files; admins read all.
-- LATER: public/approved read once ad media stores a stable storage_path.
create policy "brand_ads_owner_read" on storage.objects
  for select to authenticated using (bucket_id = 'brand-ads' and (owner = auth.uid() or public.is_admin()));
create policy "brand_ads_owner_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'brand-ads' and owner = auth.uid());
create policy "brand_ads_owner_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'brand-ads' and (owner = auth.uid() or public.is_admin()));
