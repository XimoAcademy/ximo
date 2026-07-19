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
   'La base estratégica: cómo decide un coach, dónde existen oportunidades y cómo construir un proceso con orden.',
   'Recruiting', 'Fundamentos', 1, true),
  ('emails-to-coaches', 'Cómo escribirle a coaches',
   'Comunicación que abre conversaciones, demuestra preparación y mantiene una reputación profesional.',
   'Correos a coaches', 'Práctico', 2, true),
  ('scholarships', 'Becas y costo neto',
   'Entiende el presupuesto del programa, combina fuentes de ayuda y compara el costo real antes de decidir.',
   'Becas', 'Intermedio', 3, true),
  ('sat-toefl', 'SAT / TOEFL para atletas',
   'Planifica exámenes académicos e idioma sin sacrificar entrenamiento, escuela ni fechas de admisión.',
   'SAT/TOEFL', 'Académico', 4, true),
  ('athlete-profile', 'Perfil y mentalidad del atleta',
   'Construye una presentación honesta, profesional y memorable, respaldada por evidencia y hábitos.',
   'Mentalidad', 'Esencial', 5, true),
  ('documents-ready', 'Documentos listos para recruiting',
   'Prepara, traduce, ordena y envía documentos oficiales sin retrasar oportunidades.',
   'Documentos', 'Práctico', 6, true),
  ('recruiting-strategy', 'Estrategia y gestión del proceso',
   'Convierte lo aprendido en un sistema: pipeline, seguimiento, calendario de comunicación y decisiones con varias ofertas.',
   'Estrategia', 'Avanzado', 7, true)
on conflict (slug) do nothing;

-- ── Lessons ──────────────────────────────────────────────────────────────
-- Inserted relative to their course via a sub-select on the course slug.
insert into public.lessons (course_id, slug, title, description, duration_seconds, sort_order, is_published)
select c.id, l.slug, l.title, l.description, l.duration_seconds, l.sort_order, true
from public.courses c
join (
  values
    ('recruiting-basics', 'lesson-1', 'Cómo funciona realmente el recruiting', 'El recruiting no es una lista de tiempos: cada decisión depende del encaje entre atleta y programa.', 480, 1),
    ('recruiting-basics', 'lesson-2', 'Los coaches construyen un roster, no un ranking', 'Cómo cambian los equipos cada temporada y cómo esos cambios determinan el recruiting.', 420, 2),
    ('recruiting-basics', 'lesson-3', 'Cómo analizar un roster, una conferencia y los relevos', 'Convierte páginas públicas de resultados en información estratégica, sin conclusiones falsas.', 420, 3),
    ('recruiting-basics', 'lesson-4', 'Tu competencia real y el encaje con el programa', 'Deja la comparación masiva: identifica al grupo de atletas que compite por tu mismo espacio.', 420, 4),
    ('recruiting-basics', 'lesson-5', 'Potencial, progresión y proyección a cuatro años', 'Cómo documentar tu desarrollo y presentarlo sin exageraciones.', 420, 5),
    ('recruiting-basics', 'lesson-6', 'Divisiones y rutas: NCAA I, II y III', 'Diferencias reales de experiencia, competencia y ayuda financiera, sin jerarquías de valor personal.', 420, 6),
    ('recruiting-basics', 'lesson-7', 'El calendario completo del recruiting', 'Recruiting, admisión, exámenes y documentos avanzan en paralelo: planifícalos con anticipación.', 420, 7),
    ('recruiting-basics', 'lesson-8', 'Eligibility Center y proceso para atletas internacionales', 'Cuentas, documentos y certificaciones explicadas de manera clara y segura.', 420, 8),
    ('recruiting-basics', 'lesson-9', 'Construye tu lista estratégica y tu plan de acción', 'Une nivel deportivo, carrera, costo y probabilidad de encaje en una estrategia medible.', 420, 9),
    ('recruiting-basics', 'lesson-10', 'Mitos del recruiting y el efecto de los transfers', 'Los mitos que descartan atletas sin razón y cómo los transfers cambian las necesidades de un roster cada año.', 420, 10),
    ('emails-to-coaches', 'lesson-1', 'Anatomía de un buen correo', 'Una estructura breve, útil y fácil de responder.', 420, 1),
    ('emails-to-coaches', 'lesson-2', 'Personalización que importa', 'Diferencia la investigación real de los cumplidos genéricos.', 360, 2),
    ('emails-to-coaches', 'lesson-3', 'Tu video y tus tiempos', 'Evidencia deportiva clara, verificable y fácil de abrir.', 420, 3),
    ('emails-to-coaches', 'lesson-4', 'El arte del follow-up', 'Cuándo, por qué y cómo volver a contactar aportando valor.', 360, 4),
    ('emails-to-coaches', 'lesson-5', 'Profesionalismo, rapidez y reputación', 'Cada interacción es evidencia de tu comportamiento futuro como atleta.', 420, 5),
    ('emails-to-coaches', 'lesson-6', 'Cómo interpretar el silencio y los niveles de interés', 'Lee las acciones de un coach sin confundir señales con garantías.', 420, 6),
    ('emails-to-coaches', 'lesson-7', 'Llamadas, Zoom y conversaciones con coaches', 'Responde con autenticidad y evalúa también al programa.', 420, 7),
    ('scholarships', 'lesson-1', 'Cómo piensa un coach sobre el presupuesto', 'El dinero deportivo es limitado y se distribuye estratégicamente.', 420, 1),
    ('scholarships', 'lesson-2', 'Becas deportivas: completas, parciales y mitos', 'Qué puede cubrir una ayuda y por qué la mayoría no debe asumir un full ride.', 420, 2),
    ('scholarships', 'lesson-3', 'El paquete financiero completo', 'Todas las fuentes de ayuda y cuáles aplican a estudiantes internacionales.', 420, 3),
    ('scholarships', 'lesson-4', 'Cómo calcular el costo neto real', 'Construye una comparación financiera completa junto con tu familia.', 420, 4),
    ('scholarships', 'lesson-5', 'Visitas, ofertas y preguntas antes de decidir', 'Evalúa cada campus en lo humano, lo deportivo y lo financiero.', 420, 5),
    ('scholarships', 'lesson-6', 'Comparar opciones, negociar con honestidad y cerrar el proceso', 'Toma una decisión integral y comunícala profesionalmente.', 420, 6),
    ('sat-toefl', 'lesson-1', 'SAT, TOEFL y políticas de admisión: qué necesitas realmente', 'Distingue requisitos NCAA, admisión universitaria, idioma y becas.', 420, 1),
    ('sat-toefl', 'lesson-2', 'Diagnóstico y plan de estudio inteligente', 'Un plan basado en evidencia, metas y el tiempo que realmente tienes.', 420, 2),
    ('sat-toefl', 'lesson-3', 'Cómo equilibrar entrenamiento, escuela y preparación', 'Una carga sostenible: que un objetivo no destruya los otros.', 420, 3),
    ('sat-toefl', 'lesson-4', 'Fechas, resultados y envío de puntajes sin errores', 'Registro, repeticiones, vigencia y envío oficial, bien planificados.', 420, 4),
    ('athlete-profile', 'lesson-1', 'Tu perfil reclutable y tu résumé atlético', 'La información que un coach necesita para decidir si sigue evaluándote.', 420, 1),
    ('athlete-profile', 'lesson-2', 'Un video que ayuda a evaluarte', 'Material deportivo útil, breve y auténtico.', 420, 2),
    ('athlete-profile', 'lesson-3', 'Tu narrativa: cómo contar quién eres', 'Una historia concreta que conecta esfuerzo, aprendizaje y metas.', 360, 3),
    ('athlete-profile', 'lesson-4', 'Mentalidad para desafiar las probabilidades', 'Acción valiente, sin prometer resultados ni negar la realidad.', 360, 4),
    ('athlete-profile', 'lesson-5', 'Reduce el riesgo: carácter, disciplina y confianza', 'Traduce tus cualidades en conductas que un coach pueda observar.', 420, 5),
    ('athlete-profile', 'lesson-6', 'Marca personal y redes sociales del atleta', 'Lo que un coach encuentra cuando te busca en internet: cómo cuidar tu presencia pública y convertirla en evidencia a tu favor.', 420, 6),
    ('athlete-profile', 'lesson-7', 'Rechazo, paciencia y constancia', 'Cómo sostener el proceso cuando llegan los ''no'', el silencio y las semanas sin avances.', 420, 7),
    ('documents-ready', 'lesson-1', 'Tu checklist de documentos', 'Documentos deportivos, académicos, personales y financieros antes de que sean urgentes.', 360, 1),
    ('documents-ready', 'lesson-2', 'Transcript y traducciones', 'Registros académicos comprensibles y oficiales para EE. UU.', 420, 2),
    ('documents-ready', 'lesson-3', 'Organiza tu carpeta', 'Una estructura digital segura, actualizable y fácil de compartir.', 300, 3),
    ('documents-ready', 'lesson-4', 'Fechas, versiones y envíos oficiales', 'Controla caducidad, recepción y trazabilidad de cada documento.', 420, 4),
    ('recruiting-strategy', 'lesson-1', 'Tu pipeline de recruiting: de lista a sistema', 'Convierte tu lista de universidades en un pipeline vivo con etapas, prioridades y próximos pasos claros.', 420, 1),
    ('recruiting-strategy', 'lesson-2', 'Seguimiento de coaches y universidades', 'Qué registrar de cada conversación, qué actualizaciones le importan a un coach y cuándo enviarlas.', 420, 2),
    ('recruiting-strategy', 'lesson-3', 'Tu calendario de comunicación', 'Un calendario realista que alinea tus contactos con la temporada, tus resultados y las fechas del recruiting.', 420, 3),
    ('recruiting-strategy', 'lesson-4', 'Varias conversaciones y ofertas a la vez', 'Cómo avanzar con varios programas en paralelo con honestidad, sin quemar puentes y sin perder ninguna oportunidad.', 420, 4),
    ('recruiting-strategy', 'lesson-5', 'Después del sí: compromiso y plan a cuatro años', 'Qué sigue después de elegir: cerrar el proceso con profesionalismo y llegar a tu primer año con un plan.', 420, 5)
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
