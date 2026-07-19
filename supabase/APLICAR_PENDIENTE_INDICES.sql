-- ════════════════════════════════════════════════════════════════════════
-- PENDIENTE en PRODUCCIÓN (auditoría 2026-07-18): 4 índices de la migración
-- 008 que nunca se aplicaron en prod (los otros 7 sí existen — verificado
-- vía pg_indexes). Idempotente: pegar completo en el SQL editor y Run.
--
-- tasks_due_idx es el importante: lo usa el cron diario de recordatorios.
-- posts_feed_idx / post_likes_post_idx son de la comunidad legacy (hoy
-- Discord) — baratos y inofensivos, se crean por consistencia con staging.
-- ════════════════════════════════════════════════════════════════════════
create index if not exists progress_user_idx on public.progress_entries(user_id);
create index if not exists tasks_due_idx on public.tasks(user_id, status, due_date);
create index if not exists posts_feed_idx on public.community_posts(moderation_status, created_at desc);
create index if not exists post_likes_post_idx on public.post_likes(post_id);
