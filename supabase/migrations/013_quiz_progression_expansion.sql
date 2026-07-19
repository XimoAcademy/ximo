-- ════════════════════════════════════════════════════════════════════════
-- 013 — Progresión con quiz + expansión de la academia.
--
-- (1) quiz_attempts: registro permanente de intentos de quiz (puntaje,
--     aprobado, respuestas). RLS solo-dueño. La aprobación del quiz es lo
--     que completa una lección (ver app/app/cursos/actions.ts).
-- (2) Expansión: curso 7 "Estrategia y gestión del proceso" + 3 lecciones
--     nuevas en cursos existentes (solo APPEND: los slugs existentes no se
--     mueven, el progreso registrado no se toca).
--
-- Idempotente. Probar primero en ximo-staging.
-- Mantener en sync con app/app/cursos/courseData.ts y supabase/seed.sql.
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. quiz_attempts ─────────────────────────────────────────────────────
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  quiz_id text not null,
  score int not null check (score between 0 and 100),
  passed boolean not null,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists quiz_attempts_user_lesson_idx
  on public.quiz_attempts (user_id, lesson_id, created_at desc);

alter table public.quiz_attempts enable row level security;

drop policy if exists quiz_attempts_select_own on public.quiz_attempts;
create policy quiz_attempts_select_own on public.quiz_attempts
  for select using (auth.uid() = user_id);

drop policy if exists quiz_attempts_insert_own on public.quiz_attempts;
create policy quiz_attempts_insert_own on public.quiz_attempts
  for insert with check (auth.uid() = user_id);

-- Sin update/delete: los intentos son un historial inmutable del alumno.

-- ── 2. Curso nuevo: Estrategia y gestión del proceso ─────────────────────
insert into public.courses (slug, title, description, category, level, sort_order, is_published)
values
  ('recruiting-strategy', 'Estrategia y gestión del proceso',
   'Convierte lo aprendido en un sistema: pipeline, seguimiento, calendario de comunicación y decisiones con varias ofertas.',
   'Estrategia', 'Avanzado', 7, true)
on conflict (slug) do update
  set title = excluded.title,
      description = excluded.description,
      category = excluded.category,
      level = excluded.level,
      sort_order = excluded.sort_order;

-- ── 3. Lecciones nuevas (append; slugs existentes intactos) ──────────────
insert into public.lessons (course_id, slug, title, description, duration_seconds, sort_order, is_published)
select c.id, l.slug, l.title, l.description, l.duration_seconds, l.sort_order, true
from public.courses c
join (
  values
    ('recruiting-basics', 'lesson-10', 'Mitos del recruiting y el efecto de los transfers', 'Los mitos que descartan atletas sin razón y cómo los transfers cambian las necesidades de un roster cada año.', 420, 10),
    ('athlete-profile', 'lesson-6', 'Marca personal y redes sociales del atleta', 'Lo que un coach encuentra cuando te busca en internet: cómo cuidar tu presencia pública y convertirla en evidencia a tu favor.', 420, 6),
    ('athlete-profile', 'lesson-7', 'Rechazo, paciencia y constancia', 'Cómo sostener el proceso cuando llegan los ''no'', el silencio y las semanas sin avances.', 420, 7),
    ('recruiting-strategy', 'lesson-1', 'Tu pipeline de recruiting: de lista a sistema', 'Convierte tu lista de universidades en un pipeline vivo con etapas, prioridades y próximos pasos claros.', 420, 1),
    ('recruiting-strategy', 'lesson-2', 'Seguimiento de coaches y universidades', 'Qué registrar de cada conversación, qué actualizaciones le importan a un coach y cuándo enviarlas.', 420, 2),
    ('recruiting-strategy', 'lesson-3', 'Tu calendario de comunicación', 'Un calendario realista que alinea tus contactos con la temporada, tus resultados y las fechas del recruiting.', 420, 3),
    ('recruiting-strategy', 'lesson-4', 'Varias conversaciones y ofertas a la vez', 'Cómo avanzar con varios programas en paralelo con honestidad, sin quemar puentes y sin perder ninguna oportunidad.', 420, 4),
    ('recruiting-strategy', 'lesson-5', 'Después del sí: compromiso y plan a cuatro años', 'Qué sigue después de elegir: cerrar el proceso con profesionalismo y llegar a tu primer año con un plan.', 420, 5)
) as l(course_slug, slug, title, description, duration_seconds, sort_order)
  on l.course_slug = c.slug
on conflict (course_id, slug) do update
  set title = excluded.title,
      description = excluded.description,
      duration_seconds = excluded.duration_seconds,
      sort_order = excluded.sort_order,
      updated_at = now();
