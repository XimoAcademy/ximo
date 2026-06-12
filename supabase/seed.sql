-- ════════════════════════════════════════════════════════════════════════
-- Ximo — seed data (safe sample content)
--
-- Run after the migration:  supabase db reset   (applies migration + seed)
-- or paste into the SQL editor.
--
-- Only GLOBAL content is seeded automatically (courses + lessons): these have
-- no user foreign key. User-owned sample rows (universities, posts, brand ads…)
-- need a real auth.users id, so they are provided as COMMENTED templates at the
-- bottom — fill in a real user id after creating a test account.
--
-- Slugs intentionally match the frontend (app/app/cursos/courseData.ts) so the
-- UI can switch from static data to these rows with no route changes.
-- No sensitive or harmful sample content is included.
-- ════════════════════════════════════════════════════════════════════════

-- ── Courses ──────────────────────────────────────────────────────────────
insert into public.courses (slug, title, description, category, level, sort_order, is_published)
values
  ('recruiting-basics', 'Recruiting universitario desde cero',
   'Reglas NCAA, divisiones, calendario y cómo iniciar tu proceso como atleta internacional.',
   'Recruiting', 'Fundamentos', 1, true),
  ('emails-to-coaches', 'Cómo escribirle a coaches',
   'Estructura, plantillas y personalización que genera respuestas reales de coaches.',
   'Correos a coaches', 'Práctico', 2, true),
  ('scholarships', 'Becas y costo real',
   'Entiende becas atléticas, need-based aid y cómo calcular el costo real de cada universidad.',
   'Becas', 'Intermedio', 3, true),
  ('sat-toefl', 'SAT / TOEFL para atletas',
   'Equilibra entrenamiento de élite con la preparación académica internacional que necesitas.',
   'SAT/TOEFL', 'Académico', 4, true),
  ('athlete-profile', 'Perfil y mentalidad del atleta',
   'Video, resume atlético, narrativa y la mentalidad que destaca ante coaches.',
   'Mentalidad', 'Esencial', 5, true),
  ('documents-ready', 'Documentos listos para recruiting',
   'Transcripts, traducciones, pasaporte y todo lo que un coach o universidad puede pedirte.',
   'Documentos', 'Práctico', 6, true)
on conflict (slug) do nothing;

-- ── Lessons ──────────────────────────────────────────────────────────────
-- Inserted relative to their course via a sub-select on the course slug.
insert into public.lessons (course_id, slug, title, description, duration_seconds, sort_order, is_published)
select c.id, l.slug, l.title, l.description, l.duration_seconds, l.sort_order, true
from public.courses c
join (
  values
    ('recruiting-basics', 'lesson-1', 'Cómo funciona el recruiting', 'Visión general del proceso y por qué empezar temprano cambia todo.', 360, 1),
    ('recruiting-basics', 'lesson-2', 'Divisiones NCAA y NAIA', 'D1, D2, D3 y NAIA: nivel, becas y estilo de vida en cada una.', 480, 2),
    ('recruiting-basics', 'lesson-3', 'El calendario del recruiting', 'Cuándo contactar, cuándo competir y cuándo decidir.', 420, 3),
    ('recruiting-basics', 'lesson-4', 'Construye tu lista de universidades', 'Reach, target y safety: cómo equilibrar tu lista.', 540, 4),
    ('recruiting-basics', 'lesson-5', 'Tu primer plan de acción', 'Convierte todo lo aprendido en próximos pasos concretos.', 300, 5),
    ('emails-to-coaches', 'lesson-1', 'Anatomía de un buen correo', 'Las cinco partes de un primer mensaje efectivo.', 420, 1),
    ('emails-to-coaches', 'lesson-2', 'Personalización que importa', 'Cómo investigar al coach y al programa en minutos.', 360, 2),
    ('emails-to-coaches', 'lesson-3', 'Tu video y tus tiempos', 'Cómo presentar tus marcas para que un coach las entienda.', 480, 3),
    ('emails-to-coaches', 'lesson-4', 'El arte del follow-up', 'Cuándo y cómo dar seguimiento sin perder profesionalismo.', 360, 4),
    ('scholarships', 'lesson-1', 'Tipos de ayuda financiera', 'Atlética, académica y need-based explicadas con claridad.', 420, 1),
    ('scholarships', 'lesson-2', 'Calcular el costo neto', 'Más allá del precio de lista: cómo saber lo que pagarás.', 480, 2),
    ('scholarships', 'lesson-3', 'Preguntas sobre beca', 'Cómo preguntar por beca sin cerrar la conversación.', 360, 3),
    ('sat-toefl', 'lesson-1', 'SAT vs. TOEFL: qué necesitas', 'Para qué sirve cada examen y quién debe presentarlos.', 360, 1),
    ('sat-toefl', 'lesson-2', 'Metas de puntaje realistas', 'Cómo fijar metas según tus universidades objetivo.', 420, 2),
    ('sat-toefl', 'lesson-3', 'Plan de estudio de atleta', 'Estudiar en serio sin sacrificar el entrenamiento.', 480, 3),
    ('athlete-profile', 'lesson-1', 'Tu video deportivo', 'Qué grabar, cómo editarlo y dónde alojarlo.', 480, 1),
    ('athlete-profile', 'lesson-2', 'El resume atlético', 'La información que todo coach espera ver de un vistazo.', 420, 2),
    ('athlete-profile', 'lesson-3', 'Tu narrativa', 'Cómo contar tu historia sin sonar genérico.', 360, 3),
    ('athlete-profile', 'lesson-4', 'Mentalidad de proceso', 'Cómo sostener el esfuerzo cuando no hay respuestas todavía.', 300, 4),
    ('documents-ready', 'lesson-1', 'Tu checklist de documentos', 'Todo lo que necesitas reunido en un solo lugar.', 360, 1),
    ('documents-ready', 'lesson-2', 'Transcript y traducciones', 'Cómo preparar tu historial académico para EE. UU.', 420, 2),
    ('documents-ready', 'lesson-3', 'Organiza tu carpeta', 'Una estructura simple para encontrar todo al instante.', 300, 3)
) as l(course_slug, slug, title, description, duration_seconds, sort_order)
  on l.course_slug = c.slug
on conflict (course_id, slug) do nothing;

-- ── User-owned sample data (TEMPLATES) ───────────────────────────────────
-- These need a real profiles.id (= auth.users.id). After signing up a test
-- account, grab its id and uncomment, replacing <USER_ID>. Kept commented so
-- `supabase db reset` never fails on a missing user.
--
-- All sample community content is safe; moderation defaults to pending and one
-- row is pre-approved to show how an approved post looks.
--
-- insert into public.universities (user_id, name, division, location, fit_type, priority, recruiting_stage)
-- values ('<USER_ID>', 'Niagara University', 'NCAA D1', 'Niagara, NY', 'target', 'Alta', 'Interés');
--
-- insert into public.community_posts (user_id, type, body, topic, moderation_status)
-- values
--   ('<USER_ID>', 'achievement', 'Nuevo PB en 50 libre esta semana. El proceso funciona.', '50libre', 'approved'),
--   ('<USER_ID>', 'question', '¿Cómo organizan su lista de universidades?', 'Recruiting', 'pending');
--
-- insert into public.brand_profiles (user_id, brand_name, contact_email, category, verification_status)
-- values ('<USER_ID>', 'Marca Deportiva Demo', 'contacto@marca.example', 'Equipo deportivo', 'verified')
-- returning id;  -- use the returned brand id below
--
-- insert into public.brand_ads (brand_id, title, body, format, review_status)
-- values
--   ('<BRAND_ID>', 'Descuento para atletas', 'Oferta de muestra para la comunidad Ximo.', 'offer', 'approved'),
--   ('<BRAND_ID>', 'Anuncio en revisión',   'Anuncio de muestra pendiente de revisión.', 'product', 'pending'),
--   ('<BRAND_ID>', 'Anuncio rechazado',     'Anuncio de muestra no alineado con la comunidad.', 'text', 'rejected');
