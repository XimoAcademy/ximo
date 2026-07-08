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
] as const;

export const COURSES: Course[] = [
  {
    id: "recruiting-basics",
    title: "Recruiting universitario desde cero",
    category: "Recruiting",
    level: "Fundamentos",
    summary: "Reglas NCAA, divisiones, calendario y cómo iniciar tu proceso como atleta internacional.",
    description:
      "El proceso de recruiting puede sentirse como una caja negra. Este curso te da el mapa completo: cómo funcionan las divisiones, qué buscan los coaches, cuándo empezar y cómo construir un proceso ordenado desde México.",
    whatYouLearn: [
      "Diferencias entre D1, D2, D3 y NAIA",
      "El calendario real del recruiting",
      "Qué miran los coaches en un atleta internacional",
      "Cómo organizar tu lista de universidades",
    ],
    lessons: [
      { id: "lesson-1", title: "Cómo funciona el recruiting", duration: "6 min", description: "Visión general del proceso y por qué empezar temprano cambia todo.", completed: true },
      { id: "lesson-2", title: "Divisiones NCAA y NAIA", duration: "8 min", description: "D1, D2, D3 y NAIA: nivel, becas y estilo de vida en cada una.", completed: true },
      { id: "lesson-3", title: "El calendario del recruiting", duration: "7 min", description: "Cuándo contactar, cuándo competir y cuándo decidir.", completed: false },
      { id: "lesson-4", title: "Construye tu lista de universidades", duration: "9 min", description: "Reach, target y safety: cómo equilibrar tu lista.", completed: false },
      { id: "lesson-5", title: "Tu primer plan de acción", duration: "5 min", description: "Convierte todo lo aprendido en próximos pasos concretos.", completed: false },
    ],
  },
  {
    id: "emails-to-coaches",
    title: "Cómo escribirle a coaches",
    category: "Correos a coaches",
    level: "Práctico",
    summary: "Estructura, plantillas y personalización que genera respuestas reales de coaches.",
    description:
      "Un buen primer correo abre puertas; uno genérico se ignora. Aprende a escribir mensajes claros, personales y con la información correcta para que un coach quiera responderte.",
    whatYouLearn: [
      "La estructura de un correo que sí se responde",
      "Qué incluir (y qué nunca incluir)",
      "Cómo personalizar a escala",
      "Cómo dar seguimiento sin ser pesado",
    ],
    lessons: [
      { id: "lesson-1", title: "Anatomía de un buen correo", duration: "7 min", description: "Las cinco partes de un primer mensaje efectivo.", completed: false },
      { id: "lesson-2", title: "Personalización que importa", duration: "6 min", description: "Cómo investigar al coach y al programa en minutos.", completed: false },
      { id: "lesson-3", title: "Tu video y tus tiempos", duration: "8 min", description: "Cómo presentar tus marcas para que un coach las entienda.", completed: false },
      { id: "lesson-4", title: "El arte del follow-up", duration: "6 min", description: "Cuándo y cómo dar seguimiento sin perder profesionalismo.", completed: false },
    ],
  },
  {
    id: "scholarships",
    title: "Becas y costo real",
    category: "Becas",
    level: "Intermedio",
    summary: "Entiende becas atléticas, need-based aid y cómo calcular el costo real de cada universidad.",
    description:
      "Una beca atlética no siempre cubre todo, y a veces una universidad sin beca atlética sale más barata. Aprende a leer ofertas, comparar costos reales y hacer las preguntas correctas.",
    whatYouLearn: [
      "Beca atlética vs. need-based vs. mérito académico",
      "Cómo calcular el costo neto real",
      "Qué preguntar sobre becas a un coach",
      "Cómo comparar ofertas entre universidades",
    ],
    lessons: [
      { id: "lesson-1", title: "Tipos de ayuda financiera", duration: "7 min", description: "Atlética, académica y need-based explicadas con claridad.", completed: false },
      { id: "lesson-2", title: "Calcular el costo neto", duration: "8 min", description: "Más allá del precio de lista: cómo saber lo que pagarás.", completed: false },
      { id: "lesson-3", title: "Preguntas sobre beca", duration: "6 min", description: "Cómo preguntar por beca sin cerrar la conversación.", completed: false },
    ],
  },
  {
    id: "sat-toefl",
    title: "SAT / TOEFL para atletas",
    category: "SAT/TOEFL",
    level: "Académico",
    summary: "Equilibra entrenamiento de élite con la preparación académica internacional que necesitas.",
    description:
      "Tus tiempos abren la puerta, pero tu elegibilidad académica la mantiene abierta. Arma un plan realista de SAT y TOEFL que conviva con tu calendario de entrenamiento y competencias.",
    whatYouLearn: [
      "Qué exámenes necesitas y cuándo",
      "Metas de puntaje por tipo de universidad",
      "Un plan de estudio que cabe en tu semana",
      "Recursos gratuitos y de pago que valen la pena",
    ],
    lessons: [
      { id: "lesson-1", title: "SAT vs. TOEFL: qué necesitas", duration: "6 min", description: "Para qué sirve cada examen y quién debe presentarlos.", completed: false },
      { id: "lesson-2", title: "Metas de puntaje realistas", duration: "7 min", description: "Cómo fijar metas según tus universidades objetivo.", completed: false },
      { id: "lesson-3", title: "Plan de estudio de atleta", duration: "8 min", description: "Estudiar en serio sin sacrificar el entrenamiento.", completed: false },
    ],
  },
  {
    id: "athlete-profile",
    title: "Perfil y mentalidad del atleta",
    category: "Mentalidad",
    level: "Esencial",
    summary: "Video, resume atlético, narrativa y la mentalidad que destaca ante coaches.",
    description:
      "Los coaches reclutan personas, no solo tiempos. Construye un perfil deportivo sólido y la mentalidad de proceso que te sostiene cuando el recruiting se pone difícil.",
    whatYouLearn: [
      "Cómo grabar un video deportivo efectivo",
      "Tu resume atlético, paso a paso",
      "La narrativa que te hace memorable",
      "Mentalidad de proceso vs. mentalidad de resultado",
    ],
    lessons: [
      { id: "lesson-1", title: "Tu video deportivo", duration: "8 min", description: "Qué grabar, cómo editarlo y dónde alojarlo.", completed: false },
      { id: "lesson-2", title: "El resume atlético", duration: "7 min", description: "La información que todo coach espera ver de un vistazo.", completed: false },
      { id: "lesson-3", title: "Tu narrativa", duration: "6 min", description: "Cómo contar tu historia sin sonar genérico.", completed: false },
      { id: "lesson-4", title: "Mentalidad de proceso", duration: "5 min", description: "Cómo sostener el esfuerzo cuando no hay respuestas todavía.", completed: false },
    ],
  },
  {
    id: "documents-ready",
    title: "Documentos listos para recruiting",
    category: "Documentos",
    level: "Práctico",
    summary: "Transcripts, traducciones, pasaporte y todo lo que un coach o universidad puede pedirte.",
    description:
      "Nada frena un proceso como un documento que falta. Prepara con anticipación tu carpeta completa para responder cualquier solicitud en horas, no en semanas.",
    whatYouLearn: [
      "La lista completa de documentos que necesitas",
      "Cómo traducir y certificar tu transcript",
      "Cómo organizar tu carpeta digital",
      "Plazos clave que no debes perder",
    ],
    lessons: [
      { id: "lesson-1", title: "Tu checklist de documentos", duration: "6 min", description: "Todo lo que necesitas reunido en un solo lugar.", completed: false },
      { id: "lesson-2", title: "Transcript y traducciones", duration: "7 min", description: "Cómo preparar tu historial académico para EE. UU.", completed: false },
      { id: "lesson-3", title: "Organiza tu carpeta", duration: "5 min", description: "Una estructura simple para encontrar todo al instante.", completed: false },
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
