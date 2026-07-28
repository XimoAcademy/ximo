-- ════════════════════════════════════════════════════════════════════════
-- 014 — Ximo Support AI: historial de conversación por atleta.
--
-- support_conversations: un hilo por usuario (unique user_id), creado la
-- primera vez que escribe (patrón get-or-create, sin UI de varios hilos).
-- support_messages: log inmutable de mensajes (rol user/assistant). RLS
-- solo-dueño, sin update/delete en los mensajes — mismo patrón que
-- quiz_attempts en 013 (historial que nunca se reescribe).
--
-- Idempotente. Probar primero en ximo-staging.
-- ════════════════════════════════════════════════════════════════════════

create table if not exists public.support_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.support_conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists support_messages_conversation_idx
  on public.support_messages (conversation_id, created_at);

alter table public.support_conversations enable row level security;
alter table public.support_messages enable row level security;

drop policy if exists support_conversations_select_own on public.support_conversations;
create policy support_conversations_select_own on public.support_conversations
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists support_conversations_insert_own on public.support_conversations;
create policy support_conversations_insert_own on public.support_conversations
  for insert with check (auth.uid() = user_id);

-- Update permitido solo para tocar updated_at al llegar un mensaje nuevo.
drop policy if exists support_conversations_update_own on public.support_conversations;
create policy support_conversations_update_own on public.support_conversations
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists support_messages_select_own on public.support_messages;
create policy support_messages_select_own on public.support_messages
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists support_messages_insert_own on public.support_messages;
create policy support_messages_insert_own on public.support_messages
  for insert with check (auth.uid() = user_id);

-- Sin update/delete en support_messages: log inmutable de la conversación.
