-- ════════════════════════════════════════════════════════════════════════
-- Ximo — Stripe billing support
--
--   * processed_webhook_events: idempotency ledger for the Stripe webhook.
--     Insert-first dedupe (a unique-violation on event_id = already handled).
--     Written ONLY by the service role; no policies (RLS on, deny by default).
--   * subscriptions.user_id gets a UNIQUE constraint so the webhook can upsert
--     one row per user with on_conflict = user_id.
-- ════════════════════════════════════════════════════════════════════════

create table if not exists public.processed_webhook_events (
  event_id   text primary key,
  type       text,
  created_at timestamptz not null default now()
);

alter table public.processed_webhook_events enable row level security;
-- No policies on purpose: only the service-role key (which bypasses RLS) writes here.

-- One subscription row per user (idempotent upsert target).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'subscriptions_user_id_key'
  ) then
    -- De-dupe any pre-existing rows first (keep the most recently updated).
    delete from public.subscriptions s
    using public.subscriptions s2
    where s.user_id = s2.user_id
      and s.ctid < s2.ctid;

    alter table public.subscriptions
      add constraint subscriptions_user_id_key unique (user_id);
  end if;
end $$;
