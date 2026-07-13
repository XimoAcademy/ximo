-- ════════════════════════════════════════════════════════════════════════
-- 011 — International expansion Fase 5: date of birth + education/college
--        timeline + i18n preferences.
--
-- ADITIVA y compatible hacia atrás. Todos los campos nuevos son NULLABLE: los
-- perfiles existentes siguen funcionando sin tocar sus datos y con NULL en lo
-- desconocido (nunca se inventa un valor). Probar primero en ximo-staging.
--
-- PRIVACIDAD (LFPDPPP / posibles menores): profiles.profiles_read es
-- `using (true)` — cualquier usuario autenticado puede leer TODAS las columnas
-- de profiles. Por eso los datos privados nuevos (fecha de nacimiento,
-- nacionalidad, línea de tiempo educativa) viven en athlete_profiles, cuya RLS
-- es SOLO-DUEÑO. La fecha de nacimiento nunca es pública.
--
-- El año de graduación de prepa YA existe como profiles.graduation_year — NO se
-- duplica. La residencia YA existe como profiles.country / country_code (010).
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. Fecha de nacimiento + nacionalidad (privadas, en athlete_profiles) ──
alter table public.athlete_profiles
  add column if not exists date_of_birth date,
  -- ISO 3166-1 alpha-2. Nacionalidad/ciudadanía cuando aplica (nullable).
  add column if not exists nationality_code text
    check (nationality_code is null or nationality_code ~ '^[A-Z]{2}$'),
  -- País del sistema educativo (dónde cursa/cursó la prepa). ISO alpha-2.
  add column if not exists education_country_code text
    check (education_country_code is null or education_country_code ~ '^[A-Z]{2}$');

-- date_of_birth debe ser una fecha real y NO futura (defensa en profundidad;
-- la app valida en cliente y servidor, y esto lo respalda en la base).
alter table public.athlete_profiles
  drop constraint if exists athlete_profiles_dob_not_future;
alter table public.athlete_profiles
  add constraint athlete_profiles_dob_not_future
  check (date_of_birth is null or date_of_birth <= current_date);

-- ── 2. Línea de tiempo de preparatoria ──
-- Términos localizables en la app; guardamos claves estables en inglés.
alter table public.athlete_profiles
  add column if not exists hs_graduation_term text
    check (hs_graduation_term is null or hs_graduation_term in ('winter','spring','summer','fall','other')),
  add column if not exists hs_graduation_month int
    check (hs_graduation_month is null or hs_graduation_month between 1 and 12),
  add column if not exists hs_graduation_status text
    check (hs_graduation_status is null or hs_graduation_status in ('expected','completed'));

-- ── 3. Año sabático (gap year) ──
alter table public.athlete_profiles
  add column if not exists gap_year_status text
    check (gap_year_status is null or gap_year_status in ('no','planned','unsure','current','completed')),
  add column if not exists gap_year_count int
    check (gap_year_count is null or gap_year_count between 0 and 10),
  -- ¿Espera inscribirse tiempo completo en un college durante el gap?
  add column if not exists gap_full_time_enroll boolean,
  -- ¿Espera participar en competencia organizada durante el gap?
  add column if not exists gap_competition boolean;

-- ── 4. Ingreso a college previsto + inscripción previa ──
alter table public.athlete_profiles
  add column if not exists intended_college_year int
    check (intended_college_year is null or intended_college_year between 1900 and 2100),
  add column if not exists intended_college_term text
    check (intended_college_term is null or intended_college_term in ('winter','spring','summer','fall','other')),
  -- ¿Sería su primera inscripción de tiempo completo en CUALQUIER institución?
  add column if not exists first_full_time_enrollment boolean,
  -- Tipo de inscripción de tiempo completo PREVIA (si la hubo).
  add column if not exists prior_enrollment_type text
    check (prior_enrollment_type is null or prior_enrollment_type in
      ('us_college','international_university','junior_college','community_college','other')),
  add column if not exists first_enrollment_year int
    check (first_enrollment_year is null or first_enrollment_year between 1900 and 2100),
  add column if not exists first_enrollment_term text
    check (first_enrollment_term is null or first_enrollment_term in ('winter','spring','summer','fall','other')),
  -- Estatus de recruiting/college (amplía target_division, no lo reemplaza).
  add column if not exists recruiting_status text
    check (recruiting_status is null or recruiting_status in
      ('prospect','gap_year','committed','enrolled','transfer','other'));

-- ── 5. Preferencias i18n en user_settings (solo-dueño por RLS) ──
-- language YA existe. Añadimos locale (BCP-47) y zona horaria IANA.
alter table public.user_settings
  add column if not exists locale text,
  add column if not exists timezone text;

-- ── 6. Trigger de alta: además de profiles + user_settings, siembra
--       athlete_profiles con fecha de nacimiento cuando el registro la manda.
--       Mantiene todo lo de 010 (country_code) intacto.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  meta_code text := upper(nullif(trim(new.raw_user_meta_data->>'country_code'), ''));
  meta_dob  text := nullif(trim(new.raw_user_meta_data->>'date_of_birth'), '');
  dob_val   date := null;
begin
  if meta_code is null or meta_code !~ '^[A-Z]{2}$' or meta_code in ('CU','VE') then
    meta_code := public.country_code_from_text(new.raw_user_meta_data->>'country');
  end if;

  -- Parseo defensivo de la fecha (YYYY-MM-DD). Fecha inválida o futura ⇒ NULL.
  if meta_dob is not null then
    begin
      dob_val := meta_dob::date;
      if dob_val > current_date then dob_val := null; end if;
    exception when others then
      dob_val := null;
    end;
  end if;

  insert into public.profiles (id, full_name, username, avatar_url, country, country_code, sport, graduation_year)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'country',
    meta_code,
    coalesce(new.raw_user_meta_data->>'sport', 'Natación'),
    nullif(new.raw_user_meta_data->>'graduation_year','')::int
  )
  on conflict (id) do nothing;

  insert into public.user_settings (user_id) values (new.id)
  on conflict (user_id) do nothing;

  -- Siembra athlete_profiles solo si viene fecha de nacimiento (evita filas vacías
  -- para cuentas que no son de atleta). El perfil/onboarding la completan luego.
  if dob_val is not null then
    insert into public.athlete_profiles (user_id, date_of_birth)
    values (new.id, dob_val)
    on conflict (user_id) do nothing;
  end if;

  return new;
end; $$;
