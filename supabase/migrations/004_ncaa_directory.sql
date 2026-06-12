-- ════════════════════════════════════════════════════════════════════════
-- Ximo — NCAA program directory (global reference data)
--
-- A browseable directory of NCAA programs (starting with D1 men's swimming)
-- and their coaches. This is SHARED reference data: every signed-in athlete can
-- read it, and adds the programs they care about to their personal
-- `universities` list. Only admins / the service role write it.
-- ════════════════════════════════════════════════════════════════════════

create table if not exists public.ncaa_programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  division text not null default 'D1',
  sport text not null default 'mens-swimming',
  conference text,
  location text,
  website text,
  coaches_url text,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists ncaa_programs_division_idx on public.ncaa_programs(division);
create index if not exists ncaa_programs_sport_idx on public.ncaa_programs(sport);

create table if not exists public.ncaa_coaches (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.ncaa_programs(id) on delete cascade,
  name text not null,
  title text,
  email text,
  phone text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists ncaa_coaches_program_idx on public.ncaa_coaches(program_id);

drop trigger if exists set_updated_at on public.ncaa_programs;
create trigger set_updated_at before update on public.ncaa_programs
  for each row execute function public.set_updated_at();

-- RLS: readable by any signed-in user; writes are admin / service-role only.
alter table public.ncaa_programs enable row level security;
alter table public.ncaa_coaches enable row level security;

create policy "ncaa_programs_read" on public.ncaa_programs
  for select to authenticated using (true);
create policy "ncaa_programs_admin_write" on public.ncaa_programs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "ncaa_coaches_read" on public.ncaa_coaches
  for select to authenticated using (true);
create policy "ncaa_coaches_admin_write" on public.ncaa_coaches
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
