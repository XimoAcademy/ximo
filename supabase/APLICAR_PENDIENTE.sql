-- ════════════════════════════════════════════════════════════════════════
-- Ximo — SQL pendiente de aplicar (pegar COMPLETO en Supabase SQL Editor)
-- Fecha: 2026-06-11
--
-- Incluye:
--   1. Migración 005 (Stripe billing) — CRÍTICA para que los pagos activen
--      la cuenta: tabla de idempotencia del webhook + constraint de upsert.
--   2. Buckets de almacenamiento de la migración 001 que no se crearon
--      (avatars, post-media, documents, lesson-videos, brand-ads) + el
--      cambio de la 006 (brand-ads público).
--   3. Políticas de storage. NOTA: si esta sección falla con
--      "must be owner of table objects", las políticas se crean desde el
--      dashboard: Storage → Policies. El resto del script habrá quedado.
--
-- Es seguro correrlo más de una vez (todo lleva guardas if-not-exists).
-- ════════════════════════════════════════════════════════════════════════

-- ─── 1. MIGRACIÓN 005 — Stripe billing ─────────────────────────────────
create table if not exists public.processed_webhook_events (
  event_id   text primary key,
  type       text,
  created_at timestamptz not null default now()
);

alter table public.processed_webhook_events enable row level security;
-- Sin políticas a propósito: solo el service role (que ignora RLS) escribe aquí.

-- Una fila de suscripción por usuario (objetivo del upsert idempotente).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'subscriptions_user_id_key'
  ) then
    delete from public.subscriptions s
    using public.subscriptions s2
    where s.user_id = s2.user_id
      and s.ctid < s2.ctid;

    alter table public.subscriptions
      add constraint subscriptions_user_id_key unique (user_id);
  end if;
end $$;

-- ─── 2. BUCKETS (001 + 006) ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('post-media', 'post-media', false),
  ('documents', 'documents', false),
  ('lesson-videos', 'lesson-videos', false),
  ('brand-ads', 'brand-ads', true)   -- public=true ya incluye la migración 006
on conflict (id) do update set public = excluded.public;

-- ─── 3. POLÍTICAS DE STORAGE (001) ──────────────────────────────────────
-- avatars: lectura pública; cada quien gestiona lo suyo.
drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');
drop policy if exists "avatars_owner_write" on storage.objects;
create policy "avatars_owner_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'avatars' and owner = auth.uid());
drop policy if exists "avatars_owner_update" on storage.objects;
create policy "avatars_owner_update" on storage.objects
  for update to authenticated using (bucket_id = 'avatars' and owner = auth.uid());
drop policy if exists "avatars_owner_delete" on storage.objects;
create policy "avatars_owner_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'avatars' and owner = auth.uid());

-- post-media: dueño o admin siempre; otros solo si el media está aprobado.
drop policy if exists "post_media_read" on storage.objects;
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
drop policy if exists "post_media_owner_write" on storage.objects;
create policy "post_media_owner_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'post-media' and owner = auth.uid());
drop policy if exists "post_media_owner_delete" on storage.objects;
create policy "post_media_owner_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'post-media' and (owner = auth.uid() or public.is_admin()));

-- documents: totalmente privado del dueño.
drop policy if exists "documents_owner_all" on storage.objects;
create policy "documents_owner_all" on storage.objects
  for all to authenticated
  using (bucket_id = 'documents' and owner = auth.uid())
  with check (bucket_id = 'documents' and owner = auth.uid());

-- lesson-videos: gestionado por admins.
drop policy if exists "lesson_videos_read" on storage.objects;
create policy "lesson_videos_read" on storage.objects
  for select to authenticated using (bucket_id = 'lesson-videos' and public.is_admin());
drop policy if exists "lesson_videos_admin_write" on storage.objects;
create policy "lesson_videos_admin_write" on storage.objects
  for all to authenticated
  using (bucket_id = 'lesson-videos' and public.is_admin())
  with check (bucket_id = 'lesson-videos' and public.is_admin());

-- brand-ads: el dueño de la marca gestiona sus archivos; admins leen todo.
drop policy if exists "brand_ads_owner_read" on storage.objects;
create policy "brand_ads_owner_read" on storage.objects
  for select to authenticated using (bucket_id = 'brand-ads' and (owner = auth.uid() or public.is_admin()));
drop policy if exists "brand_ads_owner_write" on storage.objects;
create policy "brand_ads_owner_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'brand-ads' and owner = auth.uid());
drop policy if exists "brand_ads_owner_delete" on storage.objects;
create policy "brand_ads_owner_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'brand-ads' and (owner = auth.uid() or public.is_admin()));

-- ─── Verificación final (debe devolver 2 filas: tabla y constraint) ────
select 'processed_webhook_events existe' as check_ok
  from information_schema.tables
  where table_name = 'processed_webhook_events'
union all
select 'subscriptions unique constraint existe'
  from pg_constraint where conname = 'subscriptions_user_id_key';
