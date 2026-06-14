-- ════════════════════════════════════════════════════════════════════════
-- Ximo — performance indexes
--
-- Indexes for the app's real access patterns: owner-scoped lists/counts and
-- the community feed. Safe to run multiple times (IF NOT EXISTS). Apply in the
-- Supabase SQL Editor. See docs/data-flow-performance.md.
-- ════════════════════════════════════════════════════════════════════════

-- Owner-scoped tables (dashboard counts + per-user lists)
create index if not exists tasks_user_idx        on public.tasks(user_id);
create index if not exists universities_user_idx on public.universities(user_id);
create index if not exists coaches_user_idx      on public.coaches(user_id);
create index if not exists documents_user_idx    on public.documents(user_id);
create index if not exists emails_user_idx       on public.emails(user_id);
create index if not exists progress_user_idx     on public.progress_entries(user_id);
create index if not exists notifications_user_idx on public.notifications(user_id);

-- Pending tasks ordered by due date (dashboard "upcoming" query)
create index if not exists tasks_due_idx on public.tasks(user_id, status, due_date);

-- Community feed: approved posts, newest first
create index if not exists posts_feed_idx on public.community_posts(moderation_status, created_at desc);

-- Comments and likes by post
create index if not exists comments_post_idx   on public.comments(post_id);
create index if not exists post_likes_post_idx on public.post_likes(post_id);
