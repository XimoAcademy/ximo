-- ════════════════════════════════════════════════════════════════════════
-- 012 — Academia v2: currículo completo (6 cursos · 35 lecciones)
--
-- Alinea la BD con el currículo maestro "Ximo Academia Completa"
-- (versión de trabajo 2026-07-16): actualiza títulos/descripciones de las
-- 22 lecciones existentes e inserta las 13 nuevas. Los slugs posicionales
-- (lesson-N) se conservan, por lo que lesson_progress sigue siendo válido.
--
-- NOTA: algunos slugs cambian de tema (p. ej. recruiting-basics/lesson-2
-- pasa de "Divisiones NCAA y NAIA" a "Los coaches construyen un roster").
-- Los videos aún no están publicados (status coming_soon), así que el
-- progreso registrado hasta hoy es de prueba; no se borra nada.
--
-- Idempotente: upsert por (course_id, slug). Probar primero en ximo-staging.
-- Mantener en sync con app/app/cursos/courseData.ts y supabase/seed.sql.
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. Cursos: descripciones alineadas al mapa de la academia ────────────
update public.courses set title = v.title, description = v.description
from (
  values
    ('recruiting-basics', 'Recruiting universitario desde cero',
     'La base estratégica: cómo decide un coach, dónde existen oportunidades y cómo construir un proceso con orden.'),
    ('emails-to-coaches', 'Cómo escribirle a coaches',
     'Comunicación que abre conversaciones, demuestra preparación y mantiene una reputación profesional.'),
    ('scholarships', 'Becas y costo neto',
     'Entiende el presupuesto del programa, combina fuentes de ayuda y compara el costo real antes de decidir.'),
    ('sat-toefl', 'SAT / TOEFL para atletas',
     'Planifica exámenes académicos e idioma sin sacrificar entrenamiento, escuela ni fechas de admisión.'),
    ('athlete-profile', 'Perfil y mentalidad del atleta',
     'Construye una presentación honesta, profesional y memorable, respaldada por evidencia y hábitos.'),
    ('documents-ready', 'Documentos listos para recruiting',
     'Prepara, traduce, ordena y envía documentos oficiales sin retrasar oportunidades.')
) as v(slug, title, description)
where public.courses.slug = v.slug;

-- ── 2. Lecciones: upsert de las 35 del currículo maestro ─────────────────
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
    ('documents-ready', 'lesson-1', 'Tu checklist de documentos', 'Documentos deportivos, académicos, personales y financieros antes de que sean urgentes.', 360, 1),
    ('documents-ready', 'lesson-2', 'Transcript y traducciones', 'Registros académicos comprensibles y oficiales para EE. UU.', 420, 2),
    ('documents-ready', 'lesson-3', 'Organiza tu carpeta', 'Una estructura digital segura, actualizable y fácil de compartir.', 300, 3),
    ('documents-ready', 'lesson-4', 'Fechas, versiones y envíos oficiales', 'Controla caducidad, recepción y trazabilidad de cada documento.', 420, 4)
) as l(course_slug, slug, title, description, duration_seconds, sort_order)
  on l.course_slug = c.slug
on conflict (course_id, slug) do update
  set title = excluded.title,
      description = excluded.description,
      duration_seconds = excluded.duration_seconds,
      sort_order = excluded.sort_order,
      updated_at = now();
