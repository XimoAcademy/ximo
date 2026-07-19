/**
 * Static course/lesson catalogue for Ximo's learning section.
 * Plain module (no React) so server pages and client players share it.
 *
 * Progression is visual/static: a lesson is unlocked only when the
 * previous one is completed. Real videos and completion tracking come later.
 */

/**
 * Publication state of a lesson.
 *  - "coming_soon": shown with the video placeholder (default while videos land)
 *  - "published":   videoUrl is live and playable
 */
export type LessonStatus = "coming_soon" | "published";

export interface LessonResource {
  label: string;
  /** Absent → shown as "Próximamente". */
  url?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  /**
   * Explicit position inside the course (1-based). Optional: when absent, the
   * array order rules. To reorder lessons manually, set `order` on each lesson
   * — `sortedLessons()` sorts by it — or simply move the entries in the array.
   */
  order?: number;
  /**
   * TODO(Manuel): paste the real video URL here when each video is ready
   * (Supabase `lesson-videos` public URL, or a YouTube/Vimeo link) and flip
   * `status` to "published". Until then the player shows the placeholder.
   */
  videoUrl?: string | null;
  /** Optional poster/thumbnail image for the video. */
  thumbnail?: string | null;
  /** Defaults to "coming_soon" when omitted. */
  status?: LessonStatus;
  /** Downloadable guides, templates, readings. Empty/omitted → placeholders. */
  resources?: LessonResource[];
  /**
   * TODO(quizzes): set to a quiz id defined in ./quizData.ts to attach a quiz.
   * The quiz UI only renders when this resolves to real quiz data.
   */
  quizId?: string | null;
  /** Deprecated: real completion now comes from `lesson_progress` (a Set passed in). */
  completed?: boolean;
}

/** Lessons of a course in display order (explicit `order` wins over array position). */
export function sortedLessons(course: Course): Lesson[] {
  return [...course.lessons].sort(
    (a, b) => (a.order ?? course.lessons.indexOf(a) + 1) - (b.order ?? course.lessons.indexOf(b) + 1)
  );
}

/** Key used in the completed-set: `${courseSlug}/${lessonSlug}`. */
export function lessonKey(courseId: string, lessonId: string): string {
  return `${courseId}/${lessonId}`;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  level: string;
  summary: string;
  description: string;
  whatYouLearn: string[];
  lessons: Lesson[];
}

export const CATEGORIES = [
  "Recruiting",
  "Correos a coaches",
  "Becas",
  "SAT/TOEFL",
  "Mentalidad",
  "Documentos",
  "Estrategia",
] as const;

export const COURSES: Course[] = [
  {
    id: "recruiting-basics",
    title: "Recruiting universitario desde cero",
    category: "Recruiting",
    level: "Fundamentos",
    summary: "La base estratégica: cómo decide un coach, dónde existen oportunidades y cómo construir un proceso con orden.",
    description:
      "El proceso de recruiting puede sentirse como una caja negra. Este curso te da el mapa completo: cómo decide realmente un coach, cómo analizar rosters y conferencias, qué significan las divisiones y cómo construir una lista estratégica con un plan de acción medible.",
    whatYouLearn: [
      "Cómo decide realmente un coach y qué es el encaje con un programa",
      "Analizar rosters, conferencias y relevos con información pública",
      "Divisiones NCAA I, II y III, y el calendario completo del proceso",
      "Tu lista estratégica y tu plan de acción medible",
    ],
    lessons: [
      { id: "lesson-1", title: "Cómo funciona realmente el recruiting", duration: "8 min", description: "El recruiting no es una lista de tiempos: cada decisión depende del encaje entre atleta y programa." },
      { id: "lesson-2", title: "Los coaches construyen un roster, no un ranking", duration: "7 min", description: "Cómo cambian los equipos cada temporada y cómo esos cambios determinan el recruiting." },
      { id: "lesson-3", title: "Cómo analizar un roster, una conferencia y los relevos", duration: "7 min", description: "Convierte páginas públicas de resultados en información estratégica, sin conclusiones falsas." },
      { id: "lesson-4", title: "Tu competencia real y el encaje con el programa", duration: "7 min", description: "Deja la comparación masiva: identifica al grupo de atletas que compite por tu mismo espacio." },
      { id: "lesson-5", title: "Potencial, progresión y proyección a cuatro años", duration: "7 min", description: "Cómo documentar tu desarrollo y presentarlo sin exageraciones." },
      { id: "lesson-6", title: "Divisiones y rutas: NCAA I, II y III", duration: "7 min", description: "Diferencias reales de experiencia, competencia y ayuda financiera, sin jerarquías de valor personal." },
      { id: "lesson-7", title: "El calendario completo del recruiting", duration: "7 min", description: "Recruiting, admisión, exámenes y documentos avanzan en paralelo: planifícalos con anticipación." },
      { id: "lesson-8", title: "Eligibility Center y proceso para atletas internacionales", duration: "7 min", description: "Cuentas, documentos y certificaciones explicadas de manera clara y segura." },
      { id: "lesson-9", title: "Construye tu lista estratégica y tu plan de acción", duration: "7 min", description: "Une nivel deportivo, carrera, costo y probabilidad de encaje en una estrategia medible." },
      { id: "lesson-10", title: "Mitos del recruiting y el efecto de los transfers", duration: "7 min", description: "Los mitos que descartan atletas sin razón y cómo los transfers cambian las necesidades de un roster cada año." },
    ],
  },
  {
    id: "emails-to-coaches",
    title: "Cómo escribirle a coaches",
    category: "Correos a coaches",
    level: "Práctico",
    summary: "Comunicación que abre conversaciones, demuestra preparación y mantiene una reputación profesional.",
    description:
      "Un buen primer correo abre puertas; uno genérico se ignora. Aprende a escribir mensajes claros y personales, a dar seguimiento con valor, a interpretar el silencio de un coach y a prepararte para llamadas y Zoom.",
    whatYouLearn: [
      "La estructura de un correo que sí se responde",
      "Personalización real y cómo presentar tu video y tus tiempos",
      "Follow-up, profesionalismo y reputación en cada interacción",
      "Cómo interpretar el interés de un coach y conversar en llamadas o Zoom",
    ],
    lessons: [
      { id: "lesson-1", title: "Anatomía de un buen correo", duration: "7 min", description: "Una estructura breve, útil y fácil de responder." },
      { id: "lesson-2", title: "Personalización que importa", duration: "6 min", description: "Diferencia la investigación real de los cumplidos genéricos." },
      { id: "lesson-3", title: "Tu video y tus tiempos", duration: "7 min", description: "Evidencia deportiva clara, verificable y fácil de abrir." },
      { id: "lesson-4", title: "El arte del follow-up", duration: "6 min", description: "Cuándo, por qué y cómo volver a contactar aportando valor." },
      { id: "lesson-5", title: "Profesionalismo, rapidez y reputación", duration: "7 min", description: "Cada interacción es evidencia de tu comportamiento futuro como atleta." },
      { id: "lesson-6", title: "Cómo interpretar el silencio y los niveles de interés", duration: "7 min", description: "Lee las acciones de un coach sin confundir señales con garantías." },
      { id: "lesson-7", title: "Llamadas, Zoom y conversaciones con coaches", duration: "7 min", description: "Responde con autenticidad y evalúa también al programa." },
    ],
  },
  {
    id: "scholarships",
    title: "Becas y costo neto",
    category: "Becas",
    level: "Intermedio",
    summary: "Entiende el presupuesto del programa, combina fuentes de ayuda y compara el costo real antes de decidir.",
    description:
      "Una beca atlética no siempre cubre todo, y a veces una universidad sin beca atlética sale más barata. Aprende cómo piensa un coach sobre su presupuesto, cómo se arma el paquete financiero completo y cómo comparar ofertas y cerrar el proceso con honestidad.",
    whatYouLearn: [
      "Cómo piensa un coach sobre su presupuesto deportivo",
      "Becas completas, parciales y los mitos del full ride",
      "El paquete financiero completo y el costo neto real",
      "Visitas, ofertas, negociación honesta y cierre del proceso",
    ],
    lessons: [
      { id: "lesson-1", title: "Cómo piensa un coach sobre el presupuesto", duration: "7 min", description: "El dinero deportivo es limitado y se distribuye estratégicamente." },
      { id: "lesson-2", title: "Becas deportivas: completas, parciales y mitos", duration: "7 min", description: "Qué puede cubrir una ayuda y por qué la mayoría no debe asumir un full ride." },
      { id: "lesson-3", title: "El paquete financiero completo", duration: "7 min", description: "Todas las fuentes de ayuda y cuáles aplican a estudiantes internacionales." },
      { id: "lesson-4", title: "Cómo calcular el costo neto real", duration: "7 min", description: "Construye una comparación financiera completa junto con tu familia." },
      { id: "lesson-5", title: "Visitas, ofertas y preguntas antes de decidir", duration: "7 min", description: "Evalúa cada campus en lo humano, lo deportivo y lo financiero." },
      { id: "lesson-6", title: "Comparar opciones, negociar con honestidad y cerrar el proceso", duration: "7 min", description: "Toma una decisión integral y comunícala profesionalmente." },
    ],
  },
  {
    id: "sat-toefl",
    title: "SAT / TOEFL para atletas",
    category: "SAT/TOEFL",
    level: "Académico",
    summary: "Planifica exámenes académicos e idioma sin sacrificar entrenamiento, escuela ni fechas de admisión.",
    description:
      "Tus tiempos abren la puerta, pero tu elegibilidad académica la mantiene abierta. Distingue qué exámenes necesitas realmente, arma un plan de estudio inteligente que conviva con tu entrenamiento y envía tus puntajes sin errores.",
    whatYouLearn: [
      "Qué exigen NCAA, admisión, idioma y becas — y qué no",
      "Diagnóstico y plan de estudio basado en evidencia",
      "Cómo equilibrar entrenamiento, escuela y preparación",
      "Fechas, repeticiones, vigencia y envío oficial de puntajes",
    ],
    lessons: [
      { id: "lesson-1", title: "SAT, TOEFL y políticas de admisión: qué necesitas realmente", duration: "7 min", description: "Distingue requisitos NCAA, admisión universitaria, idioma y becas." },
      { id: "lesson-2", title: "Diagnóstico y plan de estudio inteligente", duration: "7 min", description: "Un plan basado en evidencia, metas y el tiempo que realmente tienes." },
      { id: "lesson-3", title: "Cómo equilibrar entrenamiento, escuela y preparación", duration: "7 min", description: "Una carga sostenible: que un objetivo no destruya los otros." },
      { id: "lesson-4", title: "Fechas, resultados y envío de puntajes sin errores", duration: "7 min", description: "Registro, repeticiones, vigencia y envío oficial, bien planificados." },
    ],
  },
  {
    id: "athlete-profile",
    title: "Perfil y mentalidad del atleta",
    category: "Mentalidad",
    level: "Esencial",
    summary: "Construye una presentación honesta, profesional y memorable, respaldada por evidencia y hábitos.",
    description:
      "Los coaches reclutan personas, no solo tiempos. Construye un perfil reclutable con evidencia real, un video que ayuda a evaluarte, una narrativa auténtica y la mentalidad para desafiar las probabilidades sin promesas vacías.",
    whatYouLearn: [
      "Tu perfil reclutable y tu résumé atlético",
      "Un video deportivo útil, breve y auténtico",
      "Una narrativa que conecta esfuerzo, aprendizaje y metas",
      "Mentalidad, carácter y disciplina que un coach puede observar",
    ],
    lessons: [
      { id: "lesson-1", title: "Tu perfil reclutable y tu résumé atlético", duration: "7 min", description: "La información que un coach necesita para decidir si sigue evaluándote." },
      { id: "lesson-2", title: "Un video que ayuda a evaluarte", duration: "7 min", description: "Material deportivo útil, breve y auténtico." },
      { id: "lesson-3", title: "Tu narrativa: cómo contar quién eres", duration: "6 min", description: "Una historia concreta que conecta esfuerzo, aprendizaje y metas." },
      { id: "lesson-4", title: "Mentalidad para desafiar las probabilidades", duration: "6 min", description: "Acción valiente, sin prometer resultados ni negar la realidad." },
      { id: "lesson-5", title: "Reduce el riesgo: carácter, disciplina y confianza", duration: "7 min", description: "Traduce tus cualidades en conductas que un coach pueda observar." },
      { id: "lesson-6", title: "Marca personal y redes sociales del atleta", duration: "7 min", description: "Lo que un coach encuentra cuando te busca en internet: cómo cuidar tu presencia pública y convertirla en evidencia a tu favor." },
      { id: "lesson-7", title: "Rechazo, paciencia y constancia", duration: "7 min", description: "Cómo sostener el proceso cuando llegan los 'no', el silencio y las semanas sin avances." },
    ],
  },
  {
    id: "documents-ready",
    title: "Documentos listos para recruiting",
    category: "Documentos",
    level: "Práctico",
    summary: "Prepara, traduce, ordena y envía documentos oficiales sin retrasar oportunidades.",
    description:
      "Nada frena un proceso como un documento que falta. Prepara con anticipación tu carpeta completa — transcripts, traducciones, versiones y envíos oficiales — para responder cualquier solicitud en horas, no en semanas.",
    whatYouLearn: [
      "La lista completa de documentos que necesitas",
      "Cómo traducir y certificar tu transcript",
      "Una carpeta digital segura, actualizable y fácil de compartir",
      "Fechas, versiones y envíos oficiales bajo control",
    ],
    lessons: [
      { id: "lesson-1", title: "Tu checklist de documentos", duration: "6 min", description: "Documentos deportivos, académicos, personales y financieros antes de que sean urgentes." },
      { id: "lesson-2", title: "Transcript y traducciones", duration: "7 min", description: "Registros académicos comprensibles y oficiales para EE. UU." },
      { id: "lesson-3", title: "Organiza tu carpeta", duration: "5 min", description: "Una estructura digital segura, actualizable y fácil de compartir." },
      { id: "lesson-4", title: "Fechas, versiones y envíos oficiales", duration: "7 min", description: "Controla caducidad, recepción y trazabilidad de cada documento." },
    ],
  },
  {
    id: "recruiting-strategy",
    title: "Estrategia y gestión del proceso",
    category: "Estrategia",
    level: "Avanzado",
    summary: "Convierte lo aprendido en un sistema: pipeline, seguimiento, calendario de comunicación y decisiones con varias ofertas.",
    description:
      "Saber recruiting no basta: hay que gestionarlo. Este curso convierte todo lo aprendido en un sistema de trabajo — tu pipeline de universidades, el seguimiento de cada conversación, un calendario de comunicación realista y un método para decidir con claridad cuando hay varias opciones sobre la mesa.",
    whatYouLearn: [
      "Construir y mantener tu pipeline de universidades",
      "Registrar cada contacto y saber qué actualización enviar y cuándo",
      "Un calendario de comunicación que no depende de la memoria",
      "Gestionar varias conversaciones y cerrar el proceso con un plan a cuatro años",
    ],
    lessons: [
      { id: "lesson-1", title: "Tu pipeline de recruiting: de lista a sistema", duration: "7 min", description: "Convierte tu lista de universidades en un pipeline vivo con etapas, prioridades y próximos pasos claros." },
      { id: "lesson-2", title: "Seguimiento de coaches y universidades", duration: "7 min", description: "Qué registrar de cada conversación, qué actualizaciones le importan a un coach y cuándo enviarlas." },
      { id: "lesson-3", title: "Tu calendario de comunicación", duration: "7 min", description: "Un calendario realista que alinea tus contactos con la temporada, tus resultados y las fechas del recruiting." },
      { id: "lesson-4", title: "Varias conversaciones y ofertas a la vez", duration: "7 min", description: "Cómo avanzar con varios programas en paralelo con honestidad, sin quemar puentes y sin perder ninguna oportunidad." },
      { id: "lesson-5", title: "Después del sí: compromiso y plan a cuatro años", duration: "7 min", description: "Qué sigue después de elegir: cerrar el proceso con profesionalismo y llegar a tu primer año con un plan." },
    ],
  },
];

export function getCourse(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function getLesson(course: Course, lessonId: string): Lesson | undefined {
  return course.lessons.find((l) => l.id === lessonId);
}

export function lessonIndex(course: Course, lessonId: string): number {
  return course.lessons.findIndex((l) => l.id === lessonId);
}

export function isLessonCompleted(course: Course, lesson: Lesson, completed: Set<string>): boolean {
  return completed.has(lessonKey(course.id, lesson.id));
}

export function courseProgress(course: Course, completed: Set<string>): { done: number; total: number; pct: number } {
  const total = course.lessons.length;
  const done = course.lessons.filter((l) => completed.has(lessonKey(course.id, l.id))).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

// A lesson is unlocked if it is the first, already completed, or the previous
// lesson is completed.
export function isLessonUnlocked(course: Course, index: number, completed: Set<string>): boolean {
  if (index <= 0) return true;
  const lesson = course.lessons[index];
  if (lesson && completed.has(lessonKey(course.id, lesson.id))) return true;
  const prev = course.lessons[index - 1];
  return !!prev && completed.has(lessonKey(course.id, prev.id));
}

// The lesson a "Continuar" CTA should point to: first unlocked + not completed,
// otherwise the first lesson.
export function currentLesson(course: Course, completed: Set<string>): Lesson {
  for (let i = 0; i < course.lessons.length; i++) {
    const l = course.lessons[i];
    if (isLessonUnlocked(course, i, completed) && !completed.has(lessonKey(course.id, l.id))) {
      return l;
    }
  }
  return course.lessons[0];
}
