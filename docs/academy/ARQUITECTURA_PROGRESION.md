# Academia — arquitectura de la progresión con quiz

Referencia breve para futuros desarrolladores (sistema desplegado 2026-07-18).

## Fuentes de verdad

| Qué | Dónde | Nota |
| --- | --- | --- |
| Catálogo (7 cursos · 43 lecciones) | `app/app/cursos/courseData.ts` | Estático; los `id` de curso/lección SON los slugs de BD. |
| Espejo en BD | `courses` / `lessons` (Supabase) | Solo para claves de progreso; la UI renderiza el catálogo estático. Mantener en sync vía `seed.sql` + migraciones (012, 013). |
| Cuestionarios | `app/app/cursos/quizData.ts` | 5 preguntas/lección, `passingScore: 80`, una `essential: true` obligatoria. Se importa SOLO en servidor; al cliente viaja `PublicQuiz` (sin `correctAnswer`). |
| Acciones prácticas | `app/app/cursos/lessonActions.ts` | "Acción en Ximo" por lección. |
| Progreso | `lesson_progress` (unique `user_id,lesson_id`) | Upsert idempotente; clave lógica `${courseSlug}/${lessonSlug}`. |
| Intentos de quiz | `quiz_attempts` (RLS owner-only, sin update/delete) | Historial inmutable; insert best-effort (no bloquea al alumno). |

## Reglas (server-side, no confiar en el cliente)

- `submitQuizAction` califica con `lib/education/quiz.ts` (`gradeQuiz`, testeada):
  aprueba si `score ≥ passingScore` **y** todas las esenciales correctas.
- Aprobar completa la lección (upsert en `lesson_progress`) y con ello
  desbloquea la siguiente. Gate secuencial validado en el servidor tanto en
  `submitQuizAction` como en `markLessonCompleteAction` (que además rechaza
  lecciones con quiz).
- Lecciones bloqueadas: la página server-side no envía `videoUrl` ni recursos
  al cliente.
- Reintentos ilimitados; lecciones completadas mantienen el quiz como
  práctica y nunca pierden progreso.
- Respuestas del cliente: normalizadas antes de almacenar (un entero válido o
  null por pregunta) — nunca se guarda payload crudo.

## Slugs posicionales

Los slugs de lección son `lesson-N` (posicionales). **Regla: solo append** —
insertar en medio cambia el significado del progreso ya registrado. Si algún
día hace falta insertar en medio, usar el campo `order` de `courseData.ts`
para el display y mantener el slug estable.

## Escala

- Lectura de progreso: 1 query por request (memoizada con React `cache()`).
- `quiz_attempts` crece append-only; índice `(user_id, lesson_id, created_at desc)`.
- El certificado agrega stats con 2 queries por curso.
