-- ════════════════════════════════════════════════════════════════════════
-- 010 — country ISO codes (Fase 4 de la expansión internacional)
--
-- Añade profiles.country_code (ISO 3166-1 alpha-2) EN PARALELO al campo
-- histórico de texto libre profiles.country. NO modifica ni elimina el campo
-- viejo: el texto sigue siendo lo que ve el usuario; el código es lo que usa
-- el servidor para decidir (kill switches, gating de pagos).
--
-- Regla del plan: elegibilidad SIEMPRE por país de residencia declarado,
-- nunca inferida. Texto no reconocible u "Otro" ⇒ country_code NULL (nunca
-- se inventa un código). Cuba (CU) y Venezuela (VE) están excluidos
-- permanentemente y la función de mapeo jamás los produce.
--
-- Probada primero en ximo-staging (ver docs/intl/ENVIRONMENTS.md).
-- ════════════════════════════════════════════════════════════════════════

-- 1. Columna paralela (nullable a propósito; check de formato).
alter table public.profiles
  add column if not exists country_code text
  check (country_code is null or country_code ~ '^[A-Z]{2}$');

create index if not exists profiles_country_code_idx on public.profiles(country_code);

-- 2. Mapeo texto libre → ISO. Mantener sincronizado con lib/intl/countries.ts.
--    Tolera mayúsculas/minúsculas y las variantes sin acento más comunes.
create or replace function public.country_code_from_text(country_text text)
returns text language sql immutable as $$
  select case lower(trim(coalesce(country_text, '')))
    when 'méxico' then 'MX'
    when 'mexico' then 'MX'
    when 'argentina' then 'AR'
    when 'bolivia' then 'BO'
    when 'chile' then 'CL'
    when 'colombia' then 'CO'
    when 'costa rica' then 'CR'
    when 'ecuador' then 'EC'
    when 'el salvador' then 'SV'
    when 'españa' then 'ES'
    when 'espana' then 'ES'
    when 'estados unidos' then 'US'
    when 'guatemala' then 'GT'
    when 'guinea ecuatorial' then 'GQ'
    when 'honduras' then 'HN'
    when 'nicaragua' then 'NI'
    when 'panamá' then 'PA'
    when 'panama' then 'PA'
    when 'paraguay' then 'PY'
    when 'perú' then 'PE'
    when 'peru' then 'PE'
    when 'república dominicana' then 'DO'
    when 'republica dominicana' then 'DO'
    when 'uruguay' then 'UY'
    else null
  end;
$$;

-- 3. Backfill de perfiles existentes (solo donde aún no hay código).
update public.profiles
set country_code = public.country_code_from_text(country)
where country_code is null
  and public.country_code_from_text(country) is not null;

-- 4. handle_new_user: además del texto, guarda el código ISO. Prefiere el
--    country_code explícito del metadata (lo manda signUpAction desde
--    lib/intl/countries.ts) y si no viene, lo deriva del texto. Solo acepta
--    formato AA válido — cualquier otra cosa queda NULL.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  meta_code text := upper(nullif(trim(new.raw_user_meta_data->>'country_code'), ''));
begin
  if meta_code is null or meta_code !~ '^[A-Z]{2}$' or meta_code in ('CU','VE') then
    meta_code := public.country_code_from_text(new.raw_user_meta_data->>'country');
  end if;

  insert into public.profiles (id, full_name, username, avatar_url, country, country_code, sport)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'country',
    meta_code,
    coalesce(new.raw_user_meta_data->>'sport', 'Natación')
  )
  on conflict (id) do nothing;

  insert into public.user_settings (user_id) values (new.id)
  on conflict (user_id) do nothing;

  return new;
end; $$;
