/**
 * "Acción dentro de Ximo" per lesson — the practical exercise the student
 * completes inside the app after watching the lesson. Extracted from the
 * master curriculum "Ximo Academia Completa" (2026-07-16).
 * Keyed by `${courseId}/${lessonId}` (same format as lesson-progress keys).
 */

export const LESSON_ACTIONS: Record<string, string> = {
  "recruiting-basics/lesson-1":
    "Completa una ficha con tu año de graduación, tres pruebas o posiciones principales, mejores resultados, progresión anual, promedio académico y tres cualidades que aportas fuera del marcador.",
  "recruiting-basics/lesson-2":
    "Elige una universidad y crea una tabla con nombre, año, especialidad, mejores eventos o posición y posible año de salida de cada atleta relevante.",
  "recruiting-basics/lesson-3":
    "Analiza una universidad con una hoja de cuatro columnas: roster, conferencia, relevos y tu comparación. Termina con tres preguntas para el coach, no con tres conclusiones definitivas.",
  "recruiting-basics/lesson-4":
    "Crea tres grupos de cinco universidades: ambiciosas, compatibles y seguras en lo deportivo. Después revisa admisión y costo para confirmar que también son opciones reales.",
  "recruiting-basics/lesson-5":
    "Carga una tabla con tus últimos ocho resultados relevantes y escribe una explicación de máximo cien palabras sobre tu desarrollo, sin predicciones absolutas.",
  "recruiting-basics/lesson-6":
    "Selecciona dos programas de cada división y compáralos en una matriz: carrera, nivel, posible rol, costo publicado, ayuda disponible y preguntas pendientes.",
  "recruiting-basics/lesson-7":
    "Construye un calendario de doce meses con fechas deportivas, SAT/TOEFL, documentos, aplicaciones, financial aid, seguimientos y ventanas de decisión.",
  "recruiting-basics/lesson-8":
    "Registra tu tipo de cuenta previsto, NCAA ID si ya existe, escuelas cursadas, documentos solicitados, responsable de envío y estado de cada requisito.",
  "recruiting-basics/lesson-9":
    "Entrega una lista inicial de veinte universidades con categoría, carrera, roster, conferencia, costo estimado, contacto, nivel de interés y siguiente acción.",
  "emails-to-coaches/lesson-1":
    "Redacta una versión maestra de máximo 180 palabras con campos variables claramente marcados. No la envíes hasta completar la personalización de la siguiente lección.",
  "emails-to-coaches/lesson-2":
    "Personaliza tu correo para tres universidades y subraya las frases que solo podrían pertenecer a cada una. Si una frase sirve para todas, reescríbela.",
  "emails-to-coaches/lesson-3":
    "Publica una página o carpeta de solo lectura con video principal, resultados oficiales, progresión y datos de contacto. Pide a otra persona que la evalúe sin explicación.",
  "emails-to-coaches/lesson-4":
    "Crea una secuencia de tres seguimientos: recordatorio, actualización con valor y cierre respetuoso. Define qué condición activaría cada uno.",
  "emails-to-coaches/lesson-5":
    "Configura una firma profesional, renombra tus archivos principales y crea un tablero de solicitudes con fecha recibida, compromiso y estado.",
  "emails-to-coaches/lesson-6":
    "Revisa tus conversaciones y asigna un nivel de interés basado únicamente en acciones. Escribe la siguiente pregunta o acción para cada programa.",
  "emails-to-coaches/lesson-7":
    "Realiza una llamada simulada de quince minutos. Graba solo tu práctica, revisa claridad y crea una lista de preguntas que ninguna página web puede responder.",
  "scholarships/lesson-1":
    "Agrega a tu tabla dos columnas separadas: “espacio deportivo” y “ayuda financiera”. Registra evidencia, fecha y quién proporcionó cada dato.",
  "scholarships/lesson-2":
    "Crea un glosario personal: costo de asistencia, tuition, fees, housing, meals, ayuda deportiva, mérito, necesidad, renovación y costo de bolsillo.",
  "scholarships/lesson-3":
    "Diseña una tabla por universidad con fuente, cantidad, duración, condición, estado y contacto responsable.",
  "scholarships/lesson-4":
    "Calcula el costo neto de tres universidades en dólares y moneda familiar, con escenario bajo, esperado y alto para cuatro años.",
  "scholarships/lesson-5":
    "Crea una guía de visita con veinte preguntas y una rúbrica de evaluación para completar durante las primeras veinticuatro horas posteriores.",
  "scholarships/lesson-6":
    "Completa una matriz final, una lista de condiciones pendientes y borradores de aceptación y rechazo respetuoso.",
  "sat-toefl/lesson-1":
    "Completa una matriz de diez universidades con SAT, examen de inglés, mínimos, becas asociadas, fechas y fuente oficial.",
  "sat-toefl/lesson-2":
    "Realiza un diagnóstico y registra veinte errores con categoría, regla aprendida y ejercicio de corrección.",
  "sat-toefl/lesson-3":
    "Diseña un calendario de ocho semanas con carga deportiva, escolar y de examen en escala baja, media o alta. Corrige cualquier semana con tres cargas altas simultáneas.",
  "sat-toefl/lesson-4":
    "Crea una hoja con examen, cuenta, nombre legal, fecha, sede, resultado esperado, fecha de publicación, destinatarios y confirmación de recepción.",
  "athlete-profile/lesson-1":
    "Crea un résumé de una página y una versión de perfil web con los mismos datos. Pide a alguien que encuentre tu generación, evento principal, mejor resultado y promedio en menos de veinte segundos.",
  "athlete-profile/lesson-2":
    "Crea un guion técnico de video con apertura de cinco segundos, secuencia de evidencia y cierre con datos. Después edita una primera versión de máximo tres minutos, salvo que tu deporte requiera otra duración.",
  "athlete-profile/lesson-3":
    "Escribe una historia de 250 palabras con situación, decisión, acción, resultado y aprendizaje. Después redúcela a cuatro frases sin perder evidencia.",
  "athlete-profile/lesson-4":
    "Escribe una puerta que no has tocado, el miedo asociado, la evidencia necesaria y una acción específica con fecha dentro de siete días.",
  "athlete-profile/lesson-5":
    "Crea una matriz “riesgo percibido / evidencia / acción / responsable / fecha”. Revisa con un adulto de confianza y corrige puntos ciegos.",
  "documents-ready/lesson-1":
    "Completa un inventario de al menos veinte elementos con estado, responsable, plazo y sensibilidad. No subas información financiera real a espacios no seguros.",
  "documents-ready/lesson-2":
    "Obtén una copia informativa de tu transcript, documenta la escala y escribe a la escuela para conocer plazo y proceso de envío oficial y traducción.",
  "documents-ready/lesson-3":
    "Construye la estructura propuesta, renombra archivos y crea una tabla de enlace, permiso, propietario, última revisión y fecha de revocación.",
  "documents-ready/lesson-4":
    "Crea un panel final por universidad con documento, versión, remitente autorizado, fecha límite, envío, recepción, asociación, revisión y siguiente acción.",  // ── Expansión 2026-07-18: lecciones nuevas ──
  "recruiting-basics/lesson-10":
    "Escribe tres mitos que habías creído sobre el recruiting y, junto a cada uno, la evidencia de esta lección que lo corrige. Revisa tu lista de universidades y marca cuáles descartaste por un mito y no por datos.",
  "athlete-profile/lesson-6":
    "Audita tus redes públicas: busca tu nombre como lo haría un coach, revisa tus últimas 20 publicaciones y elimina o ajusta lo que no representaría tu candidatura. Registra en tu perfil de Ximo los enlaces que sí quieres que un coach encuentre.",
  "athlete-profile/lesson-7":
    "Define tu rutina mínima semanal del proceso (30–60 minutos): qué revisas, qué actualizas y a quién contactas. Prográmala en Tareas de Ximo y cúmplela una semana completa antes de evaluarla.",
  "recruiting-strategy/lesson-1":
    "Crea tu pipeline en Universidades de Ximo: asigna a cada una etapa (investigación, contactada, en conversación, evaluación, descartada por ahora), prioridad y un próximo paso con fecha.",
  "recruiting-strategy/lesson-2":
    "Registra en Coaches de Ximo tu última interacción con cada programa activo: fecha, canal, temas y próximo paso. Marca qué programas esperan una actualización tuya y prográmala.",
  "recruiting-strategy/lesson-3":
    "Construye tu calendario de los próximos tres meses en Tareas: competencias, fechas académicas, ventanas de contacto y actualizaciones planificadas por programa.",
  "recruiting-strategy/lesson-4":
    "Crea una tabla comparativa de tus conversaciones activas: etapa, interés mostrado, plazos mencionados y qué te falta saber de cada programa para decidir.",
  "recruiting-strategy/lesson-5":
    "Redacta tu checklist post-decisión en Documentos: confirmaciones escritas, requisitos de admisión y elegibilidad pendientes, fechas límite y tu plan del primer semestre.",
};

export function getLessonAction(courseId: string, lessonId: string): string | undefined {
  return LESSON_ACTIONS[`${courseId}/${lessonId}`];
}
