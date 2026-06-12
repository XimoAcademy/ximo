-- ════════════════════════════════════════════════════════════════════════
-- Fix mojibake: a clipboard paste mis-encoded UTF-8 (e.g. "Natación" became
-- "NataciÃ³n") when the original migration/seed were applied. The source files
-- were always correct; this repairs the data in the database.
-- Apply this file (and re-run seed.sql) with a UTF-8-correct paste.
-- ════════════════════════════════════════════════════════════════════════

-- 1. Re-create the signup default with correct text.
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

-- 2. Repair any already-stored mojibake sport value.
update public.profiles
  set sport = 'Natación'
  where sport is not null and sport <> 'Natación' and sport like 'Nataci%n';

-- 3. Clear seeded course content so seed.sql can re-insert it cleanly.
--    (No real lesson progress exists yet; cascade is safe.)
delete from public.lessons;
delete from public.courses;
