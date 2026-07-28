-- ════════════════════════════════════════════════════════════════════════
-- 015 — Anuncios de soporte en vivo (Discord) + recordatorios automáticos.
--
-- (1) live_announcements: sesiones de soporte en vivo por Discord, creadas
--     y publicadas solo por admin. Los atletas solo ven status='published'.
--     starts_at (timestamptz) es la única fuente de verdad para ordenar y
--     calcular recordatorios; timezone se guarda solo para mostrar la hora
--     local ("7:00 PM ET") sin volver a pedirle la zona al admin.
-- (2) announcement_reminders_sent: qué ventana de recordatorio (24h/1h/10m)
--     ya se envió por anuncio, para que el cron externo
--     (/api/cron/session-reminders) sea idempotente aunque el pinger externo
--     lo llame más de una vez dentro de la misma ventana de 5 minutos.
-- (3) notifications.action_url: columna nueva y opcional para el botón
--     "Unirse" de las notificaciones de soporte en vivo — aditiva, no
--     rompe ninguna fila ni consulta existente sobre notifications.
--
-- Idempotente. Probar primero en ximo-staging.
-- ════════════════════════════════════════════════════════════════════════

create table if not exists public.live_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  starts_at timestamptz not null,
  timezone text not null,
  discord_link text not null,
  status text not null default 'draft' check (status in ('draft','published','unpublished')),
  created_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists live_announcements_starts_at_idx
  on public.live_announcements (starts_at);

-- "window" es palabra reservada en SQL (cláusula WINDOW) — se usa
-- reminder_window para evitar cualquier ambigüedad de parseo.
create table if not exists public.announcement_reminders_sent (
  announcement_id uuid not null references public.live_announcements(id) on delete cascade,
  reminder_window text not null check (reminder_window in ('24h','1h','10m')),
  sent_at timestamptz not null default now(),
  primary key (announcement_id, reminder_window)
);

alter table public.live_announcements enable row level security;
alter table public.announcement_reminders_sent enable row level security;

drop policy if exists live_announcements_select on public.live_announcements;
create policy live_announcements_select on public.live_announcements
  for select using (status = 'published' or public.is_admin());

drop policy if exists live_announcements_insert_admin on public.live_announcements;
create policy live_announcements_insert_admin on public.live_announcements
  for insert with check (public.is_admin());

drop policy if exists live_announcements_update_admin on public.live_announcements;
create policy live_announcements_update_admin on public.live_announcements
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists live_announcements_delete_admin on public.live_announcements;
create policy live_announcements_delete_admin on public.live_announcements
  for delete using (public.is_admin());

-- Sin policy de insert/update: el cron escribe con el service-role client,
-- que salta RLS por completo (mismo patrón que notifications en 001).
drop policy if exists announcement_reminders_sent_admin_read on public.announcement_reminders_sent;
create policy announcement_reminders_sent_admin_read on public.announcement_reminders_sent
  for select using (public.is_admin());

-- Botón "Unirse" en notificaciones de soporte en vivo.
alter table public.notifications add column if not exists action_url text;
