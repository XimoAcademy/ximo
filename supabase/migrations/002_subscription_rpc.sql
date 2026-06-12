-- ════════════════════════════════════════════════════════════════════════
-- Ximo — mock subscription activation RPC (no real billing yet)
--
-- Lets an authenticated user activate THEIR OWN subscription without the
-- service-role key and without loosening RLS on `subscriptions`.
--
-- SECURITY DEFINER → runs as the function owner, which can write the
-- `subscriptions` table (the source of truth for access checks). The
-- `subscriptions` row is what lib/subscription reads; profiles.subscription_status
-- stays a cache updated only by admin / real-billing flows later.
-- ════════════════════════════════════════════════════════════════════════

create or replace function public.activate_subscription(p_plan text default 'monthly')
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  if p_plan is null or p_plan not in ('monthly', 'annual') then
    p_plan := 'monthly';
  end if;

  if exists (select 1 from public.subscriptions where user_id = v_uid) then
    update public.subscriptions
      set status = 'manual_active',
          plan_type = p_plan,
          provider = 'manual',
          current_period_start = now(),
          current_period_end = now() + interval '30 days'
      where user_id = v_uid;
  else
    insert into public.subscriptions
      (user_id, status, plan_type, provider, current_period_start, current_period_end)
    values
      (v_uid, 'manual_active', p_plan, 'manual', now(), now() + interval '30 days');
  end if;
end;
$$;

revoke all on function public.activate_subscription(text) from public;
grant execute on function public.activate_subscription(text) to authenticated;
