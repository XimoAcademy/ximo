/**
 * Quiz registry for Ximo courses.
 *
 * Every lesson's quiz gates its completion: the lesson is only marked
 * completed after the quiz is passed (see actions.ts → submitQuizAction).
 * Grading is authoritative on the server (lib/education/quiz.ts); this module
 * is plain data shared by server pages and the lesson player.
 *
 * The 35 quizzes of the master curriculum come from "Ximo Academia Completa"
 * (2026-07-16): 5 scenario questions per lesson, one marked `essential` that
 * must be answered correctly to pass, passing score 80 (4 de 5).
 */

export interface QuizQuestion {
  question: string;
  options: string[];
  /** Index into `options`. */
  correctAnswer: number;
  /** Shown after answering, to reinforce the concept. */
  explanation: string;
  /** Must be answered correctly to pass, regardless of score. */
  essential?: boolean;
}

export interface Quiz {
  quizId: string;
  /** `${courseId}/${lessonId}` — matches the lesson-progress key format. */
  lessonId: string;
  questions: QuizQuestion[];
  /** Percentage (0–100) needed to pass. */
  passingScore: number;
}

export const QUIZZES: Quiz[] = [
  {
    quizId: "recruiting-basics-l1",
    lessonId: "recruiting-basics/lesson-1",
    passingScore: 80,
    questions: [
      {
        question: "Un coach pierde a dos velocistas de relevos. ¿Qué atleta puede ser más útil aunque tenga menor ranking?",
        options: ["El fondista con mejor ranking, siempre", "El velocista que cubre la necesidad del roster", "El atleta que envíe más correos", "El atleta de mayor estatura"],
        correctAnswer: 1,
        explanation: "La decisión se basa en la necesidad específica del programa, no únicamente en el ranking.",
      },
      {
        question: "¿Qué describe mejor el recruiting?",
        options: ["Una clasificación nacional automática", "Una decisión basada solo en becas", "La conexión entre necesidades del programa y un perfil completo", "Un examen de velocidad"],
        correctAnswer: 2,
        explanation: "El coach evalúa el conjunto: rendimiento, potencial, admisión, carácter, presupuesto y encaje.",
      },
      {
        question: "¿Qué puede comunicar una progresión constante?",
        options: ["Una beca garantizada", "Potencial y respuesta al entrenamiento", "Que el atleta ya alcanzó su límite", "Que la marca actual no importa"],
        correctAnswer: 1,
        explanation: "La progresión ayuda a proyectar desarrollo, aunque no garantiza una oferta.",
      },
      {
        question: "¿Cuál es una forma de reducir riesgo para el coach?",
        options: ["Exagerar resultados", "Responder profesionalmente y cumplir", "Ocultar calificaciones", "Mandar mensajes diarios"],
        correctAnswer: 1,
        explanation: "La consistencia y la honestidad hacen más predecible trabajar con el atleta.",
      },
      {
        question: "¿Cuál es el error principal del atleta que se descarta sin investigar?",
        options: ["Deja que una comparación fuera de contexto decida por el coach", "Entrena demasiado", "Investiga el roster", "Incluye sus calificaciones"],
        correctAnswer: 0,
        explanation: "El atleta debe presentar su caso y permitir que el programa evalúe el encaje real.",
        essential: true,
      },
    ],
  },
  {
    quizId: "recruiting-basics-l2",
    lessonId: "recruiting-basics/lesson-2",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué indica un grupo numeroso de seniors en tu especialidad?",
        options: ["Que debes descartar la universidad", "Que podría existir una necesidad futura que debes investigar", "Que recibirás una beca", "Que el roster está equivocado"],
        correctAnswer: 1,
        explanation: "Los seniors pueden señalar futuras vacantes, pero hay que confirmarlas.",
      },
      {
        question: "¿Por qué no basta con contar atletas?",
        options: ["Porque todos reciben beca", "Porque debes analizar funciones, eventos y profundidad", "Porque los rosters son secretos", "Porque solo importan los freshmen"],
        correctAnswer: 1,
        explanation: "Dos atletas pueden ocupar funciones completamente distintas.",
      },
      {
        question: "¿Qué frase es más profesional al escribir a un coach?",
        options: ["Sé que necesita dos velocistas", "Noté que varios velocistas son upperclassmen y me gustaría conocer sus necesidades para mi clase", "Su roster está mal construido", "Debe reclutarme"],
        correctAnswer: 1,
        explanation: "Plantea una observación y una pregunta, sin asumir decisiones internas.",
      },
      {
        question: "¿Qué factor puede limitar una incorporación además del talento?",
        options: ["Presupuesto y espacio del roster", "Color del uniforme", "Número de seguidores", "Popularidad del atleta"],
        correctAnswer: 0,
        explanation: "Los recursos y cupos condicionan decisiones reales.",
      },
      {
        question: "¿Qué construye un coach?",
        options: ["Un ranking permanente", "Un equipo para varias temporadas", "Una lista de correos", "Un catálogo de tiempos"],
        correctAnswer: 1,
        explanation: "El recruiting busca equilibrio presente y futuro en el equipo.",
        essential: true,
      },
    ],
  },
  {
    quizId: "recruiting-basics-l3",
    lessonId: "recruiting-basics/lesson-3",
    passingScore: 80,
    questions: [
      {
        question: "¿Cuál es un mejor estándar que el récord escolar para evaluar encaje?",
        options: ["La marca del campeón olímpico", "Resultados de conferencia y roster actual", "Seguidores del equipo", "Promedio de edad de la ciudad"],
        correctAnswer: 1,
        explanation: "La conferencia y el roster muestran el contexto real de contribución.",
      },
      {
        question: "Una conversión de LCM a SCY debe presentarse como:",
        options: ["Resultado oficial", "Estimación claramente identificada", "Récord personal", "Garantía de puntuación"],
        correctAnswer: 1,
        explanation: "Las conversiones ayudan a comparar, pero no sustituyen el tiempo original.",
      },
      {
        question: "¿Qué puede indicar que los mismos cuatro atletas repitan muchos relevos?",
        options: ["Que no entrenan", "Que podría existir necesidad de profundidad", "Que el coach rechaza internacionales", "Que todos tienen beca completa"],
        correctAnswer: 1,
        explanation: "La concentración puede sugerir una necesidad, no demostrarla.",
      },
      {
        question: "¿Por qué revisar dos temporadas de conferencia?",
        options: ["Para aumentar el trabajo", "Para identificar tendencias y evitar un año atípico", "Porque una sola temporada es ilegal", "Para ignorar el roster"],
        correctAnswer: 1,
        explanation: "Las tendencias son más confiables que una única fotografía.",
      },
      {
        question: "¿Qué debe producir tu análisis?",
        options: ["Una garantía de oferta", "Preguntas y una hipótesis prudente", "Una demanda de beca", "Una crítica al coach"],
        correctAnswer: 1,
        explanation: "La investigación mejora decisiones y conversaciones, no revela el plan interno completo.",
        essential: true,
      },
    ],
  },
  {
    quizId: "recruiting-basics-l4",
    lessonId: "recruiting-basics/lesson-4",
    passingScore: 80,
    questions: [
      {
        question: "¿Quién forma parte de tu competencia más directa?",
        options: ["Todos los atletas del país", "Atletas de clase y función similares que podrían ocupar el mismo espacio", "Solo tus compañeros", "Solo quienes tienen récords"],
        correctAnswer: 1,
        explanation: "El grupo relevante depende de generación, especialidad, admisión e interés.",
      },
      {
        question: "¿Qué aumenta el número de puertas reales?",
        options: ["Ignorar la escuela", "Mejorar el perfil académico y de idioma", "Enviar mensajes idénticos", "Ocultar costos"],
        correctAnswer: 1,
        explanation: "La viabilidad académica permite que más programas te consideren.",
      },
      {
        question: "Dos atletas tienen marcas similares. ¿Qué puede diferenciar al más reclutable?",
        options: ["Profesionalismo e interés demostrado", "Número de emojis", "Promesas exageradas", "Hablar mal de otros programas"],
        correctAnswer: 0,
        explanation: "La comunicación reduce incertidumbre sin sustituir el rendimiento.",
      },
      {
        question: "¿Por qué crear grupos de universidades?",
        options: ["Para garantizar becas", "Para balancear riesgo y concentrar esfuerzos", "Para contactar solo famosas", "Para evitar investigar"],
        correctAnswer: 1,
        explanation: "Una cartera balanceada protege el proceso y mejora decisiones.",
      },
      {
        question: "Un rechazo de una universidad significa:",
        options: ["Que no sirves para el deporte", "Que no hubo encaje en ese contexto; debes seguir evaluando otras opciones", "Que debes abandonar", "Que todos los coaches piensan igual"],
        correctAnswer: 1,
        explanation: "Las decisiones dependen de contexto, no definen todo tu potencial.",
        essential: true,
      },
    ],
  },
  {
    quizId: "recruiting-basics-l5",
    lessonId: "recruiting-basics/lesson-5",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué muestra mejor una trayectoria?",
        options: ["Una sola marca sin fecha", "Resultados organizados con contexto", "Una promesa futura", "Un video motivacional"],
        correctAnswer: 1,
        explanation: "La trayectoria necesita datos verificables y condiciones claras.",
      },
      {
        question: "¿Cómo debe presentarse una limitación de entrenamiento?",
        options: ["Como excusa para todo", "Como contexto verificable junto con acciones y progreso", "Ocultándola", "Culpando al entrenador"],
        correctAnswer: 1,
        explanation: "El contexto ayuda a proyectar sin eliminar responsabilidad.",
      },
      {
        question: "¿Cuál es una actualización creíble?",
        options: ["Seguro bajaré tres segundos", "Bajé a 26.24 en competencia oficial; adjunto resultado y continúo trabajando virajes", "Soy el futuro campeón", "Mi conversión vale como oficial"],
        correctAnswer: 1,
        explanation: "Incluye evidencia, contexto y siguiente trabajo.",
      },
      {
        question: "¿Qué reduce riesgo además de mejorar?",
        options: ["Consistencia y capacidad de recibir feedback", "Cambiar de objetivo cada semana", "Responder tarde", "Exagerar"],
        correctAnswer: 0,
        explanation: "Los hábitos permiten proyectar adaptación universitaria.",
      },
      {
        question: "Potencial significa:",
        options: ["Garantía de mejora", "Una estimación basada en señales, no una promesa", "Ignorar tiempos actuales", "Ser joven"],
        correctAnswer: 1,
        explanation: "El potencial es una proyección incierta sustentada en evidencia.",
        essential: true,
      },
    ],
  },
  {
    quizId: "recruiting-basics-l6",
    lessonId: "recruiting-basics/lesson-6",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué división no ofrece becas deportivas?",
        options: ["I", "II", "III", "Todas ofrecen"],
        correctAnswer: 2,
        explanation: "División III no ofrece ayuda basada en capacidad deportiva, aunque puede ofrecer mérito y necesidad.",
      },
      {
        question: "¿Qué caracteriza generalmente a División II?",
        options: ["Solo becas completas", "Modelo de equivalencias y ayuda frecuentemente parcial", "Ausencia de competencia", "Sin requisitos académicos"],
        correctAnswer: 1,
        explanation: "La ayuda puede dividirse y combinarse con otras fuentes.",
      },
      {
        question: "¿Qué cambió para ciertas instituciones DI desde 2025?",
        options: ["Desaparecieron los rosters", "Programas opt-in operan con límites de roster y mayor flexibilidad potencial de becas", "No existen becas", "Todos reciben full ride"],
        correctAnswer: 1,
        explanation: "Las reglas dependen de la adopción institucional y deben confirmarse.",
      },
      {
        question: "¿Qué debe decidir entre dos divisiones?",
        options: ["Solo el nombre", "Encaje deportivo, académico, financiero y personal", "Número de seguidores", "Color del campus"],
        correctAnswer: 1,
        explanation: "La experiencia completa importa más que la etiqueta.",
      },
      {
        question: "¿Por qué no es una jerarquía personal?",
        options: ["Porque el valor del atleta no depende de la división y los modelos son distintos", "Porque todas tienen mismo nivel", "Porque no existen coaches", "Porque los resultados no importan"],
        correctAnswer: 0,
        explanation: "La división describe una estructura, no el valor humano del atleta.",
        essential: true,
      },
    ],
  },
  {
    quizId: "recruiting-basics-l7",
    lessonId: "recruiting-basics/lesson-7",
    passingScore: 80,
    questions: [
      {
        question: "¿Por qué no existe un calendario universal?",
        options: ["Porque nadie usa fechas", "Porque reglas y plazos varían por deporte, división y universidad", "Porque el coach decide todo", "Porque los internacionales no tienen plazos"],
        correctAnswer: 1,
        explanation: "Cada proceso combina normas y fechas institucionales distintas.",
      },
      {
        question: "¿Qué cuatro carriles debe incluir el calendario?",
        options: ["Redes, ropa, viajes, amigos", "Deportivo, comunicación, académico y financiero", "Solo entrenamientos", "Solo aplicaciones"],
        correctAnswer: 1,
        explanation: "Las áreas avanzan en paralelo y dependen unas de otras.",
      },
      {
        question: "¿Una llamada positiva elimina requisitos de admisión?",
        options: ["Sí", "No", "Solo en DI", "Solo con beca"],
        correctAnswer: 1,
        explanation: "La universidad y elegibilidad mantienen procesos propios.",
      },
      {
        question: "¿Qué debes incluir para exámenes y traducciones?",
        options: ["Cero margen", "Tiempo para repetición y retrasos", "Solo la fecha final", "Una promesa del coach"],
        correctAnswer: 1,
        explanation: "El margen protege opciones.",
      },
      {
        question: "Ante una duda de reglas, debes:",
        options: ["Buscar un atajo", "Confirmar con fuentes oficiales, coach o compliance", "Copiar lo que hizo otro atleta", "Ignorarla"],
        correctAnswer: 1,
        explanation: "La precisión protege al atleta y al programa.",
        essential: true,
      },
    ],
  },
  {
    quizId: "recruiting-basics-l8",
    lessonId: "recruiting-basics/lesson-8",
    passingScore: 80,
    questions: [
      {
        question: "Un atleta internacional que busca DI o DII generalmente necesita:",
        options: ["Profile Page únicamente", "Academic and Athletics Certification Account", "Ninguna cuenta", "Cuenta de coach"],
        correctAnswer: 1,
        explanation: "DI y DII normalmente requieren certificación académica y deportiva.",
      },
      {
        question: "Para DIII, un atleta internacional generalmente necesita:",
        options: ["Athletics Certification Account", "No registrarse", "Cuenta SAT", "Cuenta de beca"],
        correctAnswer: 0,
        explanation: "La NCAA certifica el componente deportivo para internacionales en DIII.",
      },
      {
        question: "¿Quién debe enviar los registros académicos oficiales?",
        options: ["El atleta desde su correo personal", "La institución educativa por el canal aceptado", "Un compañero", "El coach universitario"],
        correctAnswer: 1,
        explanation: "Los documentos del estudiante se consideran no oficiales.",
      },
      {
        question: "¿Qué debe hacerse con historial deportivo?",
        options: ["Ocultar actividades", "Responder de forma completa y precisa", "Inventar fechas", "Solo mencionar victorias"],
        correctAnswer: 1,
        explanation: "La certificación requiere información honesta.",
      },
      {
        question: "Ximo sustituye la decisión oficial de NCAA o compliance:",
        options: ["Sí", "No", "Solo en demo", "Solo para natación"],
        correctAnswer: 1,
        explanation: "Ximo orienta; las autoridades competentes determinan elegibilidad.",
        essential: true,
      },
    ],
  },
  {
    quizId: "recruiting-basics-l9",
    lessonId: "recruiting-basics/lesson-9",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué hace estratégica a una lista?",
        options: ["Tener cien nombres", "Combinar encaje, evidencia, categorías y acciones", "Incluir solo DI", "Ordenar por fama"],
        correctAnswer: 1,
        explanation: "La estrategia conecta criterios con trabajo concreto.",
      },
      {
        question: "¿Qué significa “segura”?",
        options: ["Admisión garantizada", "Mayor compatibilidad estimada, sin garantía", "Beca completa", "Coach obligado a responder"],
        correctAnswer: 1,
        explanation: "Ninguna opción es automática.",
      },
      {
        question: "Cada universidad debe tener:",
        options: ["Solo una razón deportiva", "Una razón deportiva y académica, además de viabilidad financiera", "Un logo bonito", "Muchos seguidores"],
        correctAnswer: 1,
        explanation: "La experiencia universitaria es integral.",
      },
      {
        question: "¿Por qué trabajar por tandas?",
        options: ["Para enviar menos siempre", "Para aprender, personalizar y ajustar", "Para ocultar correos", "Porque solo hay tres coaches"],
        correctAnswer: 1,
        explanation: "El proceso iterativo mejora calidad.",
      },
      {
        question: "Una lista sin siguiente acción es:",
        options: ["Una estrategia completa", "Información sin ejecución", "Una oferta", "Un compromiso"],
        correctAnswer: 1,
        explanation: "El plan necesita fechas y acciones para producir resultados.",
        essential: true,
      },
    ],
  },
  {
    quizId: "emails-to-coaches-l1",
    lessonId: "emails-to-coaches/lesson-1",
    passingScore: 80,
    questions: [
      {
        question: "¿Cuál es el objetivo principal del primer correo?",
        options: ["Obtener una beca inmediata", "Conseguir el siguiente paso de conversación", "Contar toda tu vida", "Negociar alojamiento"],
        correctAnswer: 1,
        explanation: "El primer contacto busca abrir una evaluación o respuesta.",
      },
      {
        question: "¿Qué asunto es más útil?",
        options: ["Hello", "Scholarship please", "Manuel Zúñiga | 2028 sprinter | 50 Free 23.10 SCY", "Urgent"],
        correctAnswer: 2,
        explanation: "Incluye información identificable sin exagerar.",
      },
      {
        question: "¿Qué debe incluir el cuerpo?",
        options: ["Datos verificables y enlaces directos", "Solo motivación", "Una crítica al roster", "Cincuenta fotografías"],
        correctAnswer: 0,
        explanation: "El coach necesita evaluar rápido.",
      },
      {
        question: "¿Qué cierre facilita respuesta?",
        options: ["Espero que responda", "¿Está reclutando velocistas para la clase 2028?", "Deme beca", "Gracias"],
        correctAnswer: 1,
        explanation: "Una pregunta concreta reduce ambigüedad.",
      },
      {
        question: "¿Por qué debe ser breve?",
        options: ["Porque los coaches no leen", "Porque debe facilitar encontrar datos y decidir el siguiente paso", "Porque la gramática no importa", "Porque no se puede usar email"],
        correctAnswer: 1,
        explanation: "Brevedad significa claridad, no falta de información.",
        essential: true,
      },
    ],
  },
  {
    quizId: "emails-to-coaches-l2",
    lessonId: "emails-to-coaches/lesson-2",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué frase es personalización real?",
        options: ["Su universidad es excelente", "Me interesa su programa de biología marina por su enfoque en conservación costera", "Tiene buen logo", "Quiero ir a Estados Unidos"],
        correctAnswer: 1,
        explanation: "Conecta un elemento concreto con una meta.",
      },
      {
        question: "¿Cómo hablar del roster?",
        options: ["Afirmando que sabes sus vacantes", "Con una observación prudente y una pregunta", "Criticándolo", "Ignorándolo siempre"],
        correctAnswer: 1,
        explanation: "El análisis orienta preguntas, no certezas.",
      },
      {
        question: "¿Qué sistema mantiene calidad y volumen?",
        options: ["Copiar todo", "Plantilla con campos obligatorios de investigación", "No investigar", "Enviar por redes únicamente"],
        correctAnswer: 1,
        explanation: "Estandariza lo común y personaliza lo significativo.",
      },
      {
        question: "¿Qué debes hacer si no encuentras una razón real?",
        options: ["Inventarla", "Revisar si la universidad pertenece a tu lista", "Copiar Wikipedia", "Hablar de clima"],
        correctAnswer: 1,
        explanation: "La ausencia de encaje también es información.",
      },
      {
        question: "Personalización significa:",
        options: ["Cambiar el nombre", "Demostrar una conexión específica y verdadera", "Escribir mil palabras", "Mencionar al coach en cada línea"],
        correctAnswer: 1,
        explanation: "La personalización útil explica por qué existe la conversación.",
        essential: true,
      },
    ],
  },
  {
    quizId: "emails-to-coaches-l3",
    lessonId: "emails-to-coaches/lesson-3",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué debe priorizar un video?",
        options: ["Efectos", "Capacidad de evaluar al atleta", "Música", "Duración máxima"],
        correctAnswer: 1,
        explanation: "El propósito es observación deportiva.",
      },
      {
        question: "¿Cómo se presenta una conversión?",
        options: ["Como tiempo oficial", "Como estimación junto al resultado original", "Sin curso de piscina", "Como récord"],
        correctAnswer: 1,
        explanation: "La transparencia evita comparaciones falsas.",
      },
      {
        question: "¿Qué datos acompañan un tiempo?",
        options: ["Evento, curso, fecha y fuente", "Solo segundos", "Edad del coach", "Número de seguidores"],
        correctAnswer: 0,
        explanation: "El contexto permite verificar y comparar.",
      },
      {
        question: "¿Qué prueba debes hacer antes de enviar?",
        options: ["Abrir enlaces en privado y móvil", "Cambiar velocidad", "Eliminar fecha", "Pedir contraseña"],
        correctAnswer: 0,
        explanation: "Los permisos rotos crean fricción.",
      },
      {
        question: "Editar la velocidad del video para parecer mejor es:",
        options: ["Marketing", "Engaño que puede destruir confianza", "Recomendado", "Necesario"],
        correctAnswer: 1,
        explanation: "La evidencia debe ser auténtica.",
        essential: true,
      },
    ],
  },
  {
    quizId: "emails-to-coaches-l4",
    lessonId: "emails-to-coaches/lesson-4",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué hace valiosa una actualización?",
        options: ["Que sea frecuente", "Que aporte información relevante", "Que tenga emojis", "Que exija respuesta"],
        correctAnswer: 1,
        explanation: "Debe cambiar o facilitar la evaluación.",
      },
      {
        question: "¿Por qué mantener el hilo?",
        options: ["Para ocupar espacio", "Para conservar contexto", "Porque es obligatorio", "Para ocultar fechas"],
        correctAnswer: 1,
        explanation: "El historial ayuda al coach.",
      },
      {
        question: "Tras varios intentos sin respuesta, conviene:",
        options: ["Escribir diario", "Reducir frecuencia y priorizar otras opciones", "Amenazar", "Llamar a todos"],
        correctAnswer: 1,
        explanation: "La estrategia distribuye tiempo según señales.",
      },
      {
        question: "¿Qué es incorrecto?",
        options: ["Compartir nueva marca", "Confirmar formulario", "Usar culpa o urgencia falsa", "Cerrar respetuosamente"],
        correctAnswer: 2,
        explanation: "La presión daña la relación.",
      },
      {
        question: "Follow-up significa:",
        options: ["Repetir el mismo mensaje sin límite", "Mantener contacto con contexto, valor y respeto", "Conseguir respuesta a cualquier costo", "Usar todas las plataformas"],
        correctAnswer: 1,
        explanation: "La persistencia profesional tiene criterio.",
        essential: true,
      },
    ],
  },
  {
    quizId: "emails-to-coaches-l5",
    lessonId: "emails-to-coaches/lesson-5",
    passingScore: 80,
    questions: [
      {
        question: "Si necesitas tiempo para reunir un documento, debes:",
        options: ["Desaparecer", "Confirmar recepción y dar un plazo realista", "Inventarlo", "Enviar otra cosa"],
        correctAnswer: 1,
        explanation: "Comunicar el proceso conserva confianza.",
      },
      {
        question: "Profesionalismo significa:",
        options: ["Palabras difíciles", "Claridad, respeto y cumplimiento", "Ser adulto", "Responder a medianoche"],
        correctAnswer: 1,
        explanation: "Es conducta, no apariencia.",
      },
      {
        question: "¿Qué ayuda a evitar errores?",
        options: ["Archivos con nombres lógicos y firma completa", "Correos sin asunto", "Múltiples cuentas", "Links privados"],
        correctAnswer: 0,
        explanation: "La organización reduce fricción.",
      },
      {
        question: "¿Rapidez significa responder durante todo momento?",
        options: ["Sí", "No; significa tener un sistema razonable", "Solo fines de semana", "Solo si hay beca"],
        correctAnswer: 1,
        explanation: "La consistencia puede coexistir con límites.",
      },
      {
        question: "La reputación se construye principalmente con:",
        options: ["Promesas", "Acciones repetidas y verificables", "Seguidores", "Una llamada"],
        correctAnswer: 1,
        explanation: "La confianza depende de comportamiento sostenido.",
        essential: true,
      },
    ],
  },
  {
    quizId: "emails-to-coaches-l6",
    lessonId: "emails-to-coaches/lesson-6",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué suele indicar más interés?",
        options: ["Respuesta automática", "Llamada con preguntas específicas", "Like en redes", "Abrir el correo"],
        correctAnswer: 1,
        explanation: "La inversión de tiempo y próximos pasos son señales más fuertes.",
      },
      {
        question: "¿Las categorías garantizan una oferta?",
        options: ["Sí", "No", "Solo la más alta", "Solo DI"],
        correctAnswer: 1,
        explanation: "Son herramientas de interpretación, no contratos.",
      },
      {
        question: "¿Qué pregunta puede aclarar proceso?",
        options: ["¿Cuánta beca me dará hoy?", "¿Qué próximos pasos recomienda para mi clase?", "¿Por qué no responde?", "¿Soy su número uno?"],
        correctAnswer: 1,
        explanation: "Busca claridad sin presión.",
      },
      {
        question: "¿Por qué mantener opciones?",
        options: ["Porque todos mienten", "Porque circunstancias pueden cambiar hasta formalizar", "Para jugar con coaches", "Para enviar más correos"],
        correctAnswer: 1,
        explanation: "Roster, admisión y presupuesto siguen en movimiento.",
      },
      {
        question: "Debes medir interés con:",
        options: ["Lo que deseas escuchar", "Patrones de acciones y pasos concretos", "Emojis", "Velocidad del Wi-Fi"],
        correctAnswer: 1,
        explanation: "Las acciones ofrecen evidencia más útil.",
        essential: true,
      },
    ],
  },
  {
    quizId: "emails-to-coaches-l7",
    lessonId: "emails-to-coaches/lesson-7",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué es una llamada de recruiting?",
        options: ["Un interrogatorio unilateral", "Una evaluación mutua", "Una oferta automática", "Una prueba de inglés únicamente"],
        correctAnswer: 1,
        explanation: "Ambas partes deben obtener claridad.",
      },
      {
        question: "Si no conoces un dato, debes:",
        options: ["Inventarlo", "Decir que lo enviarás después y cumplir", "Cambiar de tema", "Culpar a alguien"],
        correctAnswer: 1,
        explanation: "La honestidad conserva confianza.",
      },
      {
        question: "¿Qué historia muestra madurez?",
        options: ["Culpar a todos", "Explicar dificultad, responsabilidad y aprendizaje", "Negar errores", "Decir que nunca fallas"],
        correctAnswer: 1,
        explanation: "Los coaches evalúan adaptación.",
      },
      {
        question: "Después de la llamada conviene:",
        options: ["No escribir", "Agradecer, cumplir compromisos y registrar información", "Publicarla", "Comprometerse inmediatamente"],
        correctAnswer: 1,
        explanation: "El seguimiento consolida la conversación.",
      },
      {
        question: "¿Quién debe liderar progresivamente el proceso?",
        options: ["El atleta, con apoyo familiar", "Solo los padres", "Un consultor", "El coach de club"],
        correctAnswer: 0,
        explanation: "El atleta debe demostrar autonomía apropiada.",
        essential: true,
      },
    ],
  },
  {
    quizId: "scholarships-l1",
    lessonId: "scholarships/lesson-1",
    passingScore: 80,
    questions: [
      {
        question: "¿Espacio en roster y beca significan lo mismo?",
        options: ["Sí", "No", "Solo DI", "Solo natación"],
        correctAnswer: 1,
        explanation: "Un coach puede tener uno sin el otro.",
      },
      {
        question: "¿Por qué puede repartir ayuda?",
        options: ["Para castigar atletas", "Para cubrir varias necesidades del equipo", "Porque los tiempos no importan", "Porque DIII exige becas"],
        correctAnswer: 1,
        explanation: "El presupuesto forma parte de construir el roster.",
      },
      {
        question: "¿Qué puede mejorar el paquete sin cambiar tiempos?",
        options: ["Mérito académico", "Más mensajes", "Una promesa", "Un video con música"],
        correctAnswer: 0,
        explanation: "La ayuda académica puede reducir costo.",
      },
      {
        question: "¿Una cifra verbal es definitiva?",
        options: ["Sí", "No, debe confirmarse por escrito", "Solo si es alta", "Solo por teléfono"],
        correctAnswer: 1,
        explanation: "Las condiciones formales importan.",
      },
      {
        question: "La cantidad ofrecida define tu valor personal:",
        options: ["Sí", "No", "Solo si es completa", "Solo en DI"],
        correctAnswer: 1,
        explanation: "Refleja recursos y estrategia, no todo tu valor.",
        essential: true,
      },
    ],
  },
  {
    quizId: "scholarships-l2",
    lessonId: "scholarships/lesson-2",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué significa necesariamente “50% scholarship”?",
        options: ["50% de todos los gastos", "Nada sin conocer la base cubierta", "Full ride", "50% de vuelos"],
        correctAnswer: 1,
        explanation: "El porcentaje necesita definición.",
      },
      {
        question: "¿DIII ofrece becas deportivas?",
        options: ["Sí", "No", "Solo internacionales", "Solo natación"],
        correctAnswer: 1,
        explanation: "Puede ofrecer otras formas de ayuda.",
      },
      {
        question: "¿Qué comparación es más útil?",
        options: ["Porcentaje", "Costo neto restante", "Logo", "División"],
        correctAnswer: 1,
        explanation: "La familia paga el saldo, no el porcentaje.",
      },
      {
        question: "¿Qué debes confirmar sobre renovación?",
        options: ["Condiciones y duración", "Número de seguidores", "Clima", "Marca del uniforme"],
        correctAnswer: 0,
        explanation: "La continuidad financiera es esencial.",
      },
      {
        question: "La mayoría de la ayuda deportiva debe asumirse como full ride:",
        options: ["Sí", "No", "Solo por email", "Solo si el coach sonríe"],
        correctAnswer: 1,
        explanation: "La ayuda suele ser parcial y debe verificarse.",
        essential: true,
      },
    ],
  },
  {
    quizId: "scholarships-l3",
    lessonId: "scholarships/lesson-3",
    passingScore: 80,
    questions: [
      {
        question: "¿Toda ayuda federal aplica a internacionales?",
        options: ["Sí", "No; depende de ciudadanía o estatus", "Solo DI", "Solo con coach"],
        correctAnswer: 1,
        explanation: "Hay que revisar elegibilidad específica.",
      },
      {
        question: "¿Qué puede requerir fecha temprana?",
        options: ["Becas de mérito", "El uniforme", "El roster público", "Un follow-up"],
        correctAnswer: 0,
        explanation: "Algunos apoyos tienen plazos propios.",
      },
      {
        question: "¿Cómo tratar una ayuda pendiente?",
        options: ["Como garantizada", "Como estimada separada", "Sumarla dos veces", "Ignorar condiciones"],
        correctAnswer: 1,
        explanation: "No debe inflar el paquete confirmado.",
      },
      {
        question: "¿Qué debes revisar de becas externas?",
        options: ["Cómo se combinan con otras ayudas", "El logo", "El deporte del donante", "Solo el nombre"],
        correctAnswer: 0,
        explanation: "Pueden modificar el paquete.",
      },
      {
        question: "El paquete sostenible depende de:",
        options: ["Total y condiciones a varios años", "Una cifra del primer día", "La división", "El ranking"],
        correctAnswer: 0,
        explanation: "La continuidad importa tanto como el año inicial.",
        essential: true,
      },
    ],
  },
  {
    quizId: "scholarships-l4",
    lessonId: "scholarships/lesson-4",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué diferencia hay entre costo facturado y personal?",
        options: ["Ninguna", "Uno aparece en cuenta; ambos afectan presupuesto", "El personal no importa", "El facturado es opcional"],
        correctAnswer: 1,
        explanation: "Todos deben planearse.",
      },
      {
        question: "¿Cómo usar tipo de cambio?",
        options: ["El mejor histórico", "Con margen y escenarios", "Ignorarlo", "Fijarlo por cuatro años"],
        correctAnswer: 1,
        explanation: "La variación puede alterar viabilidad.",
      },
      {
        question: "¿Por qué proyectar cuatro años?",
        options: ["Para hacer una cifra grande", "Para evaluar renovación e incrementos", "Porque el coach lo exige", "Para eliminar becas"],
        correctAnswer: 1,
        explanation: "La sostenibilidad es multianual.",
      },
      {
        question: "¿Qué resta del costo?",
        options: ["Ayudas confirmadas y compatibles", "Promesas", "Likes", "Posibles becas sin solicitud"],
        correctAnswer: 0,
        explanation: "Solo evidencia real debe reducir el saldo.",
      },
      {
        question: "El costo neto real es:",
        options: ["Tuition menos porcentaje", "Todo lo que la familia debe cubrir después de ayuda", "Solo vuelos", "La beca deportiva"],
        correctAnswer: 1,
        explanation: "Debe integrar cargos y gastos reales.",
        essential: true,
      },
    ],
  },
  {
    quizId: "scholarships-l5",
    lessonId: "scholarships/lesson-5",
    passingScore: 80,
    questions: [
      {
        question: "¿Una visita garantiza oferta?",
        options: ["Sí", "No", "Solo oficial", "Solo DI"],
        correctAnswer: 1,
        explanation: "Es una señal posible de interés, no un compromiso.",
      },
      {
        question: "¿Qué debes imaginar?",
        options: ["El día de fotos", "Un día normal de estudio y entrenamiento", "Solo competencias", "Solo residencia"],
        correctAnswer: 1,
        explanation: "La rutina determina la experiencia.",
      },
      {
        question: "¿Quién confirma financial aid?",
        options: ["Solo el coach", "La oficina responsable y documentos oficiales", "Compañeros", "Redes"],
        correctAnswer: 1,
        explanation: "La autoridad institucional debe validar.",
      },
      {
        question: "¿Qué hacer con promesas?",
        options: ["Asumirlas", "Pedir claridad y documentación", "Publicarlas", "Ignorar costos"],
        correctAnswer: 1,
        explanation: "La evidencia protege decisiones.",
      },
      {
        question: "La visita sirve para:",
        options: ["Ser vendido", "Evaluación mutua y recopilación de información", "Aceptar de inmediato", "Conseguir regalos"],
        correctAnswer: 1,
        explanation: "El atleta también decide.",
        essential: true,
      },
    ],
  },
  {
    quizId: "scholarships-l6",
    lessonId: "scholarships/lesson-6",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué es negociar honestamente?",
        options: ["Inventar ofertas", "Explicar necesidades reales y preguntar por flexibilidad", "Amenazar", "Publicar cifras"],
        correctAnswer: 1,
        explanation: "La transparencia protege reputación.",
      },
      {
        question: "¿Qué debes confirmar antes de decidir?",
        options: ["Solo interés del coach", "Admisión, costo, ayuda y condiciones", "Instagram", "Uniforme"],
        correctAnswer: 1,
        explanation: "Las piezas formales son esenciales.",
      },
      {
        question: "¿Por qué avisar a otros programas?",
        options: ["Para presumir", "Para cerrar con respeto y liberar sus procesos", "Porque es obligatorio publicar", "Para pedir regalos"],
        correctAnswer: 1,
        explanation: "La cortesía mantiene relaciones.",
      },
      {
        question: "¿La matriz decide por ti?",
        options: ["Sí", "No; organiza evidencia y prioridades", "Solo si hay empate", "Solo DI"],
        correctAnswer: 1,
        explanation: "La decisión sigue siendo humana.",
      },
      {
        question: "¿Cuándo termina el recruiting?",
        options: ["Con una respuesta positiva", "Cuando los procesos y documentos aplicables están formalizados y entendidos", "Con una visita", "Con un follow-up"],
        correctAnswer: 1,
        explanation: "El interés no sustituye la formalización.",
        essential: true,
      },
    ],
  },
  {
    quizId: "sat-toefl-l1",
    lessonId: "sat-toefl/lesson-1",
    passingScore: 80,
    questions: [
      {
        question: "¿SAT y TOEFL cumplen la misma función?",
        options: ["Sí", "No", "Solo en DI", "Solo para becas"],
        correctAnswer: 1,
        explanation: "Uno evalúa preparación académica y el otro inglés.",
      },
      {
        question: "¿Quién define mínimos TOEFL?",
        options: ["NCAA para todas", "Cada institución o programa", "El coach únicamente", "College Board"],
        correctAnswer: 1,
        explanation: "Las políticas son institucionales.",
      },
      {
        question: "Test optional significa que SAT nunca ayuda:",
        options: ["Sí", "No; puede influir en mérito u otros contextos", "Solo internacionales", "Solo atletas"],
        correctAnswer: 1,
        explanation: "Hay que revisar becas y programas.",
      },
      {
        question: "¿Qué debe registrar la matriz?",
        options: ["Política, mínimo, fecha, exención y fuente", "Solo nombre", "Clima", "Uniforme"],
        correctAnswer: 0,
        explanation: "La investigación debe ser accionable.",
      },
      {
        question: "Elegibilidad deportiva y admisión son:",
        options: ["El mismo proceso", "Procesos relacionados pero distintos", "Opcionales", "Controlados solo por el coach"],
        correctAnswer: 1,
        explanation: "Cumplir uno no completa automáticamente el otro.",
        essential: true,
      },
    ],
  },
  {
    quizId: "sat-toefl-l2",
    lessonId: "sat-toefl/lesson-2",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué debe seguir a un diagnóstico?",
        options: ["Más preguntas al azar", "Clasificación de errores y plan", "Cambiar universidad", "Dormir menos"],
        correctAnswer: 1,
        explanation: "La medición debe cambiar la acción.",
      },
      {
        question: "Un error por descuido se corrige principalmente con:",
        options: ["Teoría avanzada siempre", "Rutinas de revisión y atención", "Más vocabulario", "Ignorarlo"],
        correctAnswer: 1,
        explanation: "La causa define la intervención.",
      },
      {
        question: "¿Cómo definir meta?",
        options: ["Por comparación social", "Por requisitos y becas de universidades", "Por influencer", "Sin fecha"],
        correctAnswer: 1,
        explanation: "La meta debe servir a la estrategia.",
      },
      {
        question: "¿Qué ciclo es útil?",
        options: ["Practicar sin revisar", "Aprender, practicar, cronometrar y revisar", "Solo simulacros", "Solo videos"],
        correctAnswer: 1,
        explanation: "Combina conocimiento y ejecución.",
      },
      {
        question: "Un diagnóstico define tu inteligencia:",
        options: ["Sí", "No; muestra desempeño actual y áreas de trabajo", "Solo SAT", "Solo TOEFL"],
        correctAnswer: 1,
        explanation: "Es una medición, no identidad.",
        essential: true,
      },
    ],
  },
  {
    quizId: "sat-toefl-l3",
    lessonId: "sat-toefl/lesson-3",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué significa periodizar estudio?",
        options: ["No estudiar", "Ajustar carga a temporada y fechas", "Solo estudiar verano", "Hacer todo diario"],
        correctAnswer: 1,
        explanation: "La carga cambia según contexto.",
      },
      {
        question: "¿Qué protege memoria y rendimiento?",
        options: ["Dormir menos", "Sueño suficiente", "Cafeína", "Última hora"],
        correctAnswer: 1,
        explanation: "La recuperación es parte del aprendizaje.",
      },
      {
        question: "¿Cuándo hacer simulacro?",
        options: ["Después de competencia siempre", "Descansado y en condiciones comparables", "A medianoche", "Sin tiempo"],
        correctAnswer: 1,
        explanation: "Necesitas una medición útil.",
      },
      {
        question: "¿Qué tipo de sesiones combina el plan?",
        options: ["Solo largas", "Cortas específicas y largas para simulación", "Solo videos", "Solo lectura"],
        correctAnswer: 1,
        explanation: "Cada formato cumple una función.",
      },
      {
        question: "Disciplina sostenible significa:",
        options: ["Máximo diario", "Distribuir esfuerzo y proteger salud", "No descansar", "Ocultar agotamiento"],
        correctAnswer: 1,
        explanation: "La sostenibilidad permite llegar al objetivo.",
        essential: true,
      },
    ],
  },
  {
    quizId: "sat-toefl-l4",
    lessonId: "sat-toefl/lesson-4",
    passingScore: 80,
    questions: [
      {
        question: "¿Cuánto duran los resultados TOEFL según ETS?",
        options: ["Seis meses", "Dos años", "Para siempre", "Un mes"],
        correctAnswer: 1,
        explanation: "La vigencia es de dos años.",
      },
      {
        question: "¿Qué escala usa TOEFL desde enero de 2026?",
        options: ["0–120 solamente", "1–6 en medios puntos", "400–1600", "A–F"],
        correctAnswer: 1,
        explanation: "ETS actualizó la escala.",
      },
      {
        question: "¿Enviado significa recibido?",
        options: ["Siempre", "No; debes verificar asociación al expediente", "Solo SAT", "Solo TOEFL"],
        correctAnswer: 1,
        explanation: "El procesamiento puede fallar.",
      },
      {
        question: "¿Por qué primera fecha temprana?",
        options: ["Para presumir", "Para dejar margen de repetición y retrasos", "Porque es obligatoria", "Para evitar estudiar"],
        correctAnswer: 1,
        explanation: "El margen conserva opciones.",
      },
      {
        question: "Fechas y precios deben obtenerse de:",
        options: ["Capturas viejas", "Fuentes oficiales actuales", "Rumores", "Un solo coach"],
        correctAnswer: 1,
        explanation: "La información cambia.",
        essential: true,
      },
    ],
  },
  {
    quizId: "athlete-profile-l1",
    lessonId: "athlete-profile/lesson-1",
    passingScore: 80,
    questions: [
      {
        question: "¿Cuál es la función del perfil?",
        options: ["Decorar", "Reducir fricción y facilitar evaluación", "Contar toda la vida", "Sustituir contacto"],
        correctAnswer: 1,
        explanation: "Debe ayudar al coach a entender rápidamente.",
      },
      {
        question: "¿Cómo presentar promedio mexicano?",
        options: ["Solo 9.2", "9.2/10 con sistema y transcript", "Convertir a 4.0 sin método", "Ocultarlo"],
        correctAnswer: 1,
        explanation: "La escala evita interpretaciones falsas.",
      },
      {
        question: "¿Qué logros priorizar?",
        options: ["Todos desde primaria", "Recientes y relevantes", "Solo seguidores", "Sin fecha"],
        correctAnswer: 1,
        explanation: "La selección aporta contexto.",
      },
      {
        question: "¿Por qué incluir versión?",
        options: ["Para hacer el nombre largo", "Para evitar circular datos viejos", "Porque NCAA exige formato", "Para impresionar"],
        correctAnswer: 1,
        explanation: "Controla actualización.",
      },
      {
        question: "¿Qué nunca debes hacer?",
        options: ["Usar una página", "Inventar equivalencias o resultados", "Agregar enlaces", "Incluir carrera"],
        correctAnswer: 1,
        explanation: "La exactitud sostiene confianza.",
        essential: true,
      },
    ],
  },
  {
    quizId: "athlete-profile-l2",
    lessonId: "athlete-profile/lesson-2",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué debe aparecer primero?",
        options: ["Logo largo", "Atleta y contexto", "Música", "Agradecimientos"],
        correctAnswer: 1,
        explanation: "El coach necesita identificar la evidencia.",
      },
      {
        question: "¿Por qué mostrar acción completa?",
        options: ["Para alargar", "Para evaluar preparación, ejecución y resultado", "Porque no se puede editar", "Para incluir público"],
        correctAnswer: 1,
        explanation: "El contexto técnico importa.",
      },
      {
        question: "¿Qué edición está prohibida éticamente?",
        options: ["Cortar silencios", "Alterar velocidad para parecer mejor", "Agregar título", "Marcar al atleta"],
        correctAnswer: 1,
        explanation: "Manipula la evidencia.",
      },
      {
        question: "¿Qué acompaña el video?",
        options: ["Resultados y fecha", "Solo hashtags", "Contraseña", "Promesas"],
        correctAnswer: 0,
        explanation: "Permite verificar.",
      },
      {
        question: "El video existe para:",
        options: ["Entretener", "Facilitar evaluación auténtica", "Conseguir seguidores", "Sustituir resultados"],
        correctAnswer: 1,
        explanation: "La utilidad deportiva es central.",
        essential: true,
      },
    ],
  },
  {
    quizId: "athlete-profile-l3",
    lessonId: "athlete-profile/lesson-3",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué debe ocupar el centro?",
        options: ["Lo que otros hicieron", "Tus decisiones y acciones", "Frases famosas", "Drama"],
        correctAnswer: 1,
        explanation: "La narrativa muestra agencia.",
      },
      {
        question: "¿Qué detalle demuestra disciplina?",
        options: ["Soy disciplinado", "Doce semanas registrando y cumpliendo un cambio", "Me gusta ganar", "Todos lo saben"],
        correctAnswer: 1,
        explanation: "La conducta concreta prueba valores.",
      },
      {
        question: "¿La misma versión sirve para todo?",
        options: ["Sí", "No; debe adaptarse a formato", "Solo inglés", "Solo email"],
        correctAnswer: 1,
        explanation: "La profundidad cambia.",
      },
      {
        question: "¿Cómo hablar de personas que se burlaron?",
        options: ["Exponerlas", "Centrarte en tu respuesta sin exagerar", "Amenazarlas", "Inventar nombres"],
        correctAnswer: 1,
        explanation: "Protege privacidad y demuestra madurez.",
      },
      {
        question: "Una narrativa fuerte combina:",
        options: ["Drama y promesas", "Contexto, acción, resultado y aprendizaje", "Solo logros", "Solo dificultades"],
        correctAnswer: 1,
        explanation: "El crecimiento necesita proceso.",
        essential: true,
      },
    ],
  },
  {
    quizId: "athlete-profile-l4",
    lessonId: "athlete-profile/lesson-4",
    passingScore: 80,
    questions: [
      {
        question: "¿Creer en ti garantiza resultado?",
        options: ["Sí", "No", "Solo si entrenas", "Solo DI"],
        correctAnswer: 1,
        explanation: "La confianza permite actuar, no controlar todo.",
      },
      {
        question: "¿Qué cambia al tocar una puerta?",
        options: ["Garantiza sí", "Crea una posibilidad que antes era cero", "Elimina competencia", "Asegura beca"],
        correctAnswer: 1,
        explanation: "La acción abre resultados posibles.",
      },
      {
        question: "¿Qué necesita la motivación?",
        options: ["Solo frases", "Método y acciones", "Negar datos", "Comparación"],
        correctAnswer: 1,
        explanation: "La ejecución convierte aspiración en proceso.",
      },
      {
        question: "¿Cuándo debe cambiar una ruta?",
        options: ["Nunca", "Cuando evidencia, salud o viabilidad lo requieren", "Después de un comentario", "Solo por miedo"],
        correctAnswer: 1,
        explanation: "La flexibilidad responsable no es rendirse.",
      },
      {
        question: "“¿Y si sí?” significa:",
        options: ["Ignorar riesgos", "Dar una oportunidad real mediante acción preparada", "Prometer éxito", "Rechazar planes alternos"],
        correctAnswer: 1,
        explanation: "Es valentía con método.",
        essential: true,
      },
    ],
  },
  {
    quizId: "athlete-profile-l5",
    lessonId: "athlete-profile/lesson-5",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué demuestra ética de trabajo?",
        options: ["Decirlo", "Conductas consistentes", "Una frase", "Una foto"],
        correctAnswer: 1,
        explanation: "La evidencia se construye con hábitos.",
      },
      {
        question: "¿Cómo manejar un error en un dato?",
        options: ["Ocultarlo", "Corregirlo pronto y explicar", "Culpar", "Crear otro dato"],
        correctAnswer: 1,
        explanation: "La honestidad aumenta confianza.",
      },
      {
        question: "¿Cuándo pedir referencias?",
        options: ["El día final", "Con anticipación y contexto", "Nunca", "Después de enviarlas"],
        correctAnswer: 1,
        explanation: "La calidad requiere tiempo.",
      },
      {
        question: "¿Autonomía significa excluir familia?",
        options: ["Sí", "No; liderar lo apropiado e involucrarla en decisiones importantes", "Solo dinero", "Solo llamadas"],
        correctAnswer: 1,
        explanation: "La responsabilidad incluye apoyo.",
      },
      {
        question: "Reducir riesgo significa:",
        options: ["Parecer perfecto", "Ofrecer evidencia de confiabilidad y planes para debilidades", "Ocultar problemas", "Prometer permanencia"],
        correctAnswer: 1,
        explanation: "El coach necesita información creíble.",
        essential: true,
      },
    ],
  },
  {
    quizId: "documents-ready-l1",
    lessonId: "documents-ready/lesson-1",
    passingScore: 80,
    questions: [
      {
        question: "¿El checklist es un paquete universal?",
        options: ["Sí", "No; es un inventario adaptable", "Solo NCAA", "Solo coaches"],
        correctAnswer: 1,
        explanation: "Cada institución puede pedir cosas distintas.",
      },
      {
        question: "¿Qué dato debe tener cada documento?",
        options: ["Color", "Responsable, plazo, versión y canal", "Número de seguidores", "Universidad favorita"],
        correctAnswer: 1,
        explanation: "La operatividad importa.",
      },
      {
        question: "¿Quién debe recibir documentos financieros?",
        options: ["Cualquier coach", "La oficina o portal autorizado", "Redes", "Compañeros"],
        correctAnswer: 1,
        explanation: "Son datos sensibles.",
      },
      {
        question: "¿Por qué revisar antes de vacaciones?",
        options: ["Para estudiar menos", "Porque terceros pueden tardar o cerrar", "Porque caducan todos", "Por el uniforme"],
        correctAnswer: 1,
        explanation: "La disponibilidad institucional afecta plazos.",
      },
      {
        question: "¿Qué debes hacer antes de enviar un documento sensible?",
        options: ["Compartirlo rápido", "Verificar destinatario, propósito y canal", "Publicarlo", "Quitar nombre"],
        correctAnswer: 1,
        explanation: "La seguridad es parte del proceso.",
        essential: true,
      },
    ],
  },
  {
    quizId: "documents-ready-l2",
    lessonId: "documents-ready/lesson-2",
    passingScore: 80,
    questions: [
      {
        question: "¿Quién evalúa la equivalencia final de calificaciones?",
        options: ["El atleta", "La institución u organismo correspondiente", "Un conversor cualquiera", "El coach de club"],
        correctAnswer: 1,
        explanation: "No debes inventar conversiones.",
      },
      {
        question: "¿Qué significa traducción línea por línea?",
        options: ["Resumir", "Correspondencia completa con el original", "Cambiar materias", "Convertir notas"],
        correctAnswer: 1,
        explanation: "Debe conservar contenido.",
      },
      {
        question: "¿Una copia del atleta es oficial para NCAA?",
        options: ["Generalmente sí", "No; los registros del estudiante se consideran no oficiales", "Solo por WhatsApp", "Solo si tiene color"],
        correctAnswer: 1,
        explanation: "El origen del envío importa.",
      },
      {
        question: "¿Qué hacer si hay error?",
        options: ["Editar PDF", "Solicitar corrección a la escuela", "Ocultarlo", "Borrar la materia"],
        correctAnswer: 1,
        explanation: "La institución emisora debe corregir.",
      },
      {
        question: "¿Debes convertir tu promedio por tu cuenta?",
        options: ["Sí", "No, salvo que una institución indique un método específico", "Siempre a 4.0", "Solo con IA"],
        correctAnswer: 1,
        explanation: "Conserva escala original y contexto.",
        essential: true,
      },
    ],
  },
  {
    quizId: "documents-ready-l3",
    lessonId: "documents-ready/lesson-3",
    passingScore: 80,
    questions: [
      {
        question: "¿Por qué no usar una carpeta pública única?",
        options: ["Porque es fea", "Porque documentos tienen distinta sensibilidad", "Porque el coach no usa internet", "Porque NCAA lo prohíbe siempre"],
        correctAnswer: 1,
        explanation: "El acceso debe ser proporcional.",
      },
      {
        question: "¿Qué nombre es mejor?",
        options: ["final2.pdf", "2026-07-16_Resume_ManuelZuniga.pdf", "doc.pdf", "nuevo.pdf"],
        correctAnswer: 1,
        explanation: "Fecha y contenido facilitan control.",
      },
      {
        question: "¿Cómo probar enlace?",
        options: ["Desde tu cuenta", "En incógnito o cuenta externa", "Solo copiarlo", "No probar"],
        correctAnswer: 1,
        explanation: "Simula la experiencia del destinatario.",
      },
      {
        question: "¿Qué permiso suele bastar para coach?",
        options: ["Editar todo", "Lectura del archivo necesario", "Administrador", "Acceso a finanzas"],
        correctAnswer: 1,
        explanation: "Principio de mínimo acceso.",
      },
      {
        question: "¿Qué debe separarse?",
        options: ["Cursos", "Público, compartible y sensible", "Nombres", "Fechas"],
        correctAnswer: 1,
        explanation: "La seguridad depende de clasificación.",
        essential: true,
      },
    ],
  },
  {
    quizId: "documents-ready-l4",
    lessonId: "documents-ready/lesson-4",
    passingScore: 80,
    questions: [
      {
        question: "¿“Enviado” es estado final?",
        options: ["Sí", "No; falta confirmar recepción y asociación", "Solo email", "Solo NCAA"],
        correctAnswer: 1,
        explanation: "El recorrido tiene varias etapas.",
      },
      {
        question: "¿Qué define oficialidad?",
        options: ["Nombre del archivo", "Emisor y canal aceptado", "Color", "Tamaño"],
        correctAnswer: 1,
        explanation: "La procedencia es esencial.",
      },
      {
        question: "¿Qué hacer con versión reemplazada?",
        options: ["Dejarla pública", "Archivar y revocar cuando corresponda", "Renombrarla final", "Enviar ambas"],
        correctAnswer: 1,
        explanation: "Evita confusión.",
      },
      {
        question: "¿Para qué sirve comprobante?",
        options: ["Decorar", "Dar trazabilidad ante problemas", "Sustituir documento", "Garantizar admisión"],
        correctAnswer: 1,
        explanation: "Permite investigar el envío.",
      },
      {
        question: "El ciclo documental termina cuando:",
        options: ["Guardas archivo", "El destinatario confirma recepción, asociación y requisitos completos", "Lo mandas por chat", "El coach dice gracias"],
        correctAnswer: 1,
        explanation: "La confirmación completa el proceso.",
        essential: true,
      },
    ],
  },  // ── Expansión 2026-07-18: lecciones nuevas (autoría propia, mismo formato) ──
  {
    quizId: "recruiting-basics-l10",
    lessonId: "recruiting-basics/lesson-10",
    passingScore: 80,
    questions: [
      {
        question: "Un atleta cree que si no recibió respuesta en su primer contacto, el proceso terminó para siempre. ¿Qué está ignorando?",
        options: ["Que las necesidades del roster cambian cada temporada por graduaciones, bajas y transfers", "Que los coaches nunca cambian de opinión", "Que debía enviar más correos el mismo día", "Que el ranking decide todo"],
        correctAnswer: 0,
        explanation: "Un roster es dinámico: una necesidad que hoy no existe puede abrirse el próximo semestre.",
      },
      {
        question: "Un equipo pierde a un velocista por el transfer portal en mayo. ¿Qué puede significar para un recruit internacional?",
        options: ["Nada, los transfers no afectan al recruiting", "Que se abre una necesidad que antes no existía", "Que el programa dejará de reclutar", "Que solo reclutarán transfers"],
        correctAnswer: 1,
        explanation: "Las salidas inesperadas cambian las prioridades del coach y pueden abrir espacios a mitad del ciclo.",
      },
      {
        question: "¿Cuál de estas afirmaciones es un mito?",
        options: ["Los tiempos se interpretan en contexto", "Si eres suficientemente rápido, todo lo demás no importa", "La comunicación forma parte de la evaluación", "El presupuesto limita las ofertas"],
        correctAnswer: 1,
        explanation: "Los tiempos importan, pero admisión, carácter, presupuesto y encaje también deciden.",
      },
      {
        question: "¿Por qué un coach puede preferir a un freshman internacional sobre un transfer con mejores marcas?",
        options: ["Porque los transfers siempre rinden menos", "Por proyección a cuatro años, encaje y presupuesto", "Porque la NCAA prohíbe transfers", "Porque los internacionales no pasan por admisión"],
        correctAnswer: 1,
        explanation: "Cuatro años de desarrollo y un mejor encaje pueden pesar más que una marca puntual.",
      },
      {
        question: "ESENCIAL: ¿Cuál es la conclusión correcta sobre los mitos del recruiting?",
        options: ["Creerlos no cuesta nada", "Sirven para motivar", "Un mito puede hacer que te descartes de oportunidades que sí existían", "Solo afectan a los atletas lentos"],
        correctAnswer: 2,
        explanation: "El costo real de un mito es la puerta que nunca tocaste. Decide con datos, no con suposiciones.",
        essential: true,
      },
    ],
  },
  {
    quizId: "athlete-profile-l6",
    lessonId: "athlete-profile/lesson-6",
    passingScore: 80,
    questions: [
      {
        question: "Un coach interesado busca al atleta en redes antes de responder. ¿Qué evalúa principalmente?",
        options: ["Cuántos seguidores tiene", "Carácter, disciplina y coherencia con lo que el atleta dice de sí mismo", "La calidad artística de sus fotos", "Si publica todos los días"],
        correctAnswer: 1,
        explanation: "Las redes son evidencia de conducta: el coach busca coherencia entre tu perfil y tu comportamiento público.",
      },
      {
        question: "¿Qué contenido fortalece más un perfil reclutable?",
        options: ["Entrenamiento, competencias y progreso reales", "Solo contenido viral", "Opiniones polémicas para destacar", "Fotos sin contexto"],
        correctAnswer: 0,
        explanation: "El contenido que documenta tu proceso deportivo y académico respalda tu candidatura.",
      },
      {
        question: "Un atleta tiene publicaciones antiguas con lenguaje ofensivo. ¿Qué es lo más profesional?",
        options: ["Ignorarlas, nadie las verá", "Revisarlas y limpiarlas antes de contactar programas, y ajustar su criterio a futuro", "Borrar la cuenta el día de la visita", "Culpar a un amigo"],
        correctAnswer: 1,
        explanation: "Auditar tu presencia pública antes de contactar es parte de presentarte con seriedad.",
      },
      {
        question: "¿Qué papel juega la marca personal respecto al video y al résumé?",
        options: ["Los sustituye", "Es evidencia complementaria de consistencia; no reemplaza resultados verificables", "Es lo único que importa", "No tiene ninguna relación"],
        correctAnswer: 1,
        explanation: "Tu presencia pública suma contexto y confianza, pero los datos verificables siguen siendo la base.",
      },
      {
        question: "ESENCIAL: ¿Cuál es el principio correcto para redes sociales durante el recruiting?",
        options: ["Publicar lo que sea para crecer", "Todo lo público forma parte de tu evaluación: cuídalo como parte de tu perfil", "Las redes son privadas y no cuentan", "Solo importa una plataforma"],
        correctAnswer: 1,
        explanation: "Si un coach puede verlo, es parte de tu candidatura. Trátalo con el mismo cuidado que un correo.",
        essential: true,
      },
    ],
  },
  {
    quizId: "athlete-profile-l7",
    lessonId: "athlete-profile/lesson-7",
    passingScore: 80,
    questions: [
      {
        question: "Un atleta recibe tres 'no' seguidos. ¿Cuál es la interpretación más útil?",
        options: ["No sirve para el deporte", "Esos programas no tenían encaje este año; el proceso continúa con datos nuevos", "Debe dejar de contactar programas", "Los coaches se equivocaron"],
        correctAnswer: 1,
        explanation: "Un 'no' habla del encaje con un programa específico en un momento específico, no de tu valor total.",
      },
      {
        question: "¿Qué diferencia a la constancia de la insistencia sin valor?",
        options: ["La constancia aporta información nueva y respeta tiempos; la insistencia repite lo mismo sin aportar", "Son lo mismo", "La insistencia funciona mejor", "La constancia es enviar más mensajes diarios"],
        correctAnswer: 0,
        explanation: "Volver a contactar es válido cuando traes algo nuevo: resultados, avances o respuestas a lo que el coach pidió.",
      },
      {
        question: "Un mes sin respuestas. ¿Qué hace un atleta con sistema?",
        options: ["Abandona el proceso", "Revisa su pipeline, actualiza resultados y prepara los siguientes contactos planificados", "Escribe a todos los coaches el mismo día", "Cambia de deporte"],
        correctAnswer: 1,
        explanation: "El silencio se gestiona con proceso, no con impulsos: siempre hay trabajo útil que sí depende de ti.",
      },
      {
        question: "¿Cómo afecta el miedo al rechazo a la mayoría de los procesos?",
        options: ["No afecta", "Hace que el atleta no toque puertas que sí estaban abiertas", "Mejora la disciplina", "Garantiza mejores ofertas"],
        correctAnswer: 1,
        explanation: "El mayor costo del miedo es la oportunidad no intentada — la puerta que nunca se tocó.",
      },
      {
        question: "ESENCIAL: ¿Qué es lo único que el atleta controla por completo?",
        options: ["La respuesta de los coaches", "Su preparación, su comunicación y su constancia", "El presupuesto del programa", "Las decisiones del roster"],
        correctAnswer: 1,
        explanation: "Enfoca tu energía en lo que controlas: preparación, calidad de comunicación y constancia semanal.",
        essential: true,
      },
    ],
  },
  {
    quizId: "recruiting-strategy-l1",
    lessonId: "recruiting-strategy/lesson-1",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué distingue a un pipeline de una simple lista de universidades?",
        options: ["Tiene más nombres", "Cada universidad tiene etapa, prioridad y próximo paso definido", "Está ordenada alfabéticamente", "Solo incluye programas D1"],
        correctAnswer: 1,
        explanation: "Un pipeline es una lista con estado: sabes dónde está cada conversación y qué sigue.",
      },
      {
        question: "Una universidad no responde tras dos contactos con valor. ¿Qué hace el atleta con sistema?",
        options: ["La elimina para siempre", "La mueve a menor prioridad y agenda una revisión futura", "Escribe a diario hasta obtener respuesta", "Publica su molestia en redes"],
        correctAnswer: 1,
        explanation: "El silencio de hoy no es un cierre definitivo: se baja la prioridad y se revisa cuando haya datos nuevos.",
      },
      {
        question: "¿Por qué conviene registrar cada interacción con un programa?",
        options: ["Para presumir contactos", "Para decidir el siguiente paso con contexto real y no depender de la memoria", "Porque la NCAA lo exige", "Para enviar el mismo correo a todos"],
        correctAnswer: 1,
        explanation: "Con decenas de conversaciones en meses, la memoria falla; el registro evita errores y contradicciones.",
      },
      {
        question: "¿Cuántas universidades conviene tener activas en un pipeline?",
        options: ["Todas las existentes", "Una sola para enfocarse", "Las que puedas atender con calidad: amplitud suficiente sin perder personalización", "Exactamente tres"],
        correctAnswer: 2,
        explanation: "El límite es tu capacidad de dar seguimiento personalizado; el volumen sin calidad no ayuda.",
      },
      {
        question: "ESENCIAL: ¿Cuál es el objetivo del pipeline?",
        options: ["Garantizar una beca", "Que ninguna oportunidad se pierda por desorden y que cada semana tenga próximos pasos claros", "Impresionar a los coaches", "Contactar más rápido que otros atletas"],
        correctAnswer: 1,
        explanation: "El pipeline no promete resultados: elimina el desorden como causa de oportunidades perdidas.",
        essential: true,
      },
    ],
  },
  {
    quizId: "recruiting-strategy-l2",
    lessonId: "recruiting-strategy/lesson-2",
    passingScore: 80,
    questions: [
      {
        question: "¿Qué actualización le importa más a un coach?",
        options: ["Cualquier mensaje semanal", "Resultados nuevos verificables, mejoras de marcas o avances académicos relevantes", "Saludos de festividades", "Cambios de foto de perfil"],
        correctAnswer: 1,
        explanation: "Una actualización vale cuando cambia la evaluación: marcas, resultados, admisión o elegibilidad.",
      },
      {
        question: "Tras una llamada con un coach, ¿qué debe registrar el atleta?",
        options: ["Solo la fecha", "Temas tratados, señales de interés, dudas del coach y compromisos acordados", "Nada, para eso está la memoria", "La duración exacta"],
        correctAnswer: 1,
        explanation: "Lo acordado en una llamada define tus próximos pasos; sin registro, se pierde o se contradice.",
      },
      {
        question: "Un coach pidió 'mantenme informado de tu temporada'. ¿Qué seguimiento es correcto?",
        options: ["Escribir cada día", "Enviar resultados relevantes al cierre de cada competencia importante, con contexto breve", "Esperar a que él escriba", "Reenviar la misma presentación"],
        correctAnswer: 1,
        explanation: "Cumplir exactamente lo que el coach pidió, en el momento correcto, es seguimiento profesional.",
      },
      {
        question: "¿Cuál es una señal de que el seguimiento se está haciendo mal?",
        options: ["Mensajes con información nueva", "El atleta no recuerda qué le dijo a cada programa ni cuándo", "Registro de cada interacción", "Fechas de revisión definidas"],
        correctAnswer: 1,
        explanation: "Perder el hilo de tus propias conversaciones produce contradicciones que un coach sí nota.",
      },
      {
        question: "ESENCIAL: ¿Para qué sirve el seguimiento sistemático?",
        options: ["Para presionar a los coaches", "Para que cada contacto llegue en buen momento, con datos correctos y sin contradicciones", "Para llenar tablas", "Para evitar hablar por teléfono"],
        correctAnswer: 1,
        explanation: "El sistema existe para que tu comunicación sea oportuna, veraz y consistente durante meses.",
        essential: true,
      },
    ],
  },
  {
    quizId: "recruiting-strategy-l3",
    lessonId: "recruiting-strategy/lesson-3",
    passingScore: 80,
    questions: [
      {
        question: "¿Alrededor de qué se construye un buen calendario de comunicación?",
        options: ["De fechas aleatorias", "De tus competencias, resultados y los momentos clave de recruiting y admisión", "De los días festivos", "Del horario del coach"],
        correctAnswer: 1,
        explanation: "Los contactos se planean alrededor de los momentos donde tienes algo relevante que comunicar.",
      },
      {
        question: "¿Qué evita un calendario de comunicación?",
        options: ["Tener que competir", "Largos silencios sin plan y ráfagas de mensajes sin motivo", "Hablar con varios programas", "Actualizar resultados"],
        correctAnswer: 1,
        explanation: "Sin calendario, la comunicación se vuelve reactiva: meses de silencio o mensajes por ansiedad.",
      },
      {
        question: "Se acerca el cierre de temporada con tus mejores marcas. ¿Qué hace el atleta con calendario?",
        options: ["Nada especial", "Planifica desde antes a quién enviará resultados y qué dirá según cada conversación", "Espera un mes después", "Publica solo en redes"],
        correctAnswer: 1,
        explanation: "Los mejores momentos del año se aprovechan cuando el plan de comunicación existe desde antes.",
      },
      {
        question: "El atleta tiene exámenes y una competencia el mismo mes. ¿Qué hace con su calendario?",
        options: ["Ignora los exámenes", "Ajusta la carga: agenda contactos antes o después del pico y protege lo académico", "Cancela la competencia", "Improvisa según el día"],
        correctAnswer: 1,
        explanation: "El calendario también protege tu elegibilidad: lo académico es parte del proceso, no un estorbo.",
      },
      {
        question: "ESENCIAL: ¿Cuál es el principio del calendario de comunicación?",
        options: ["Contactar más que nadie", "Que cada contacto tenga motivo, momento y destinatario pensados con anticipación", "Escribir solo cuando hay ansiedad", "Delegar los correos"],
        correctAnswer: 1,
        explanation: "Comunicación planificada = mensajes con propósito en el momento correcto, sostenibles por meses.",
        essential: true,
      },
    ],
  },
  {
    quizId: "recruiting-strategy-l4",
    lessonId: "recruiting-strategy/lesson-4",
    passingScore: 80,
    questions: [
      {
        question: "¿Es correcto hablar con varios programas a la vez?",
        options: ["No, es desleal", "Sí: es parte normal del proceso, siempre con honestidad y profesionalismo", "Solo si son de divisiones distintas", "Solo si ninguno pregunta"],
        correctAnswer: 1,
        explanation: "Los coaches también evalúan a varios atletas a la vez; explorar opciones es normal y esperado.",
      },
      {
        question: "Un coach pregunta si hablas con otros programas. ¿Qué respuesta es profesional?",
        options: ["Negarlo aunque sea falso", "Reconocerlo con naturalidad y reafirmar tu interés genuino en su programa", "Dar detalles inventados de otras ofertas", "Cambiar de tema"],
        correctAnswer: 1,
        explanation: "La transparencia genera confianza; mentir o inventar ofertas destruye tu credibilidad.",
      },
      {
        question: "Tienes una oferta con fecha límite y esperas respuesta de otro programa. ¿Qué haces?",
        options: ["Dejar pasar la fecha", "Comunicar tu situación con respeto: preguntar plazos reales a uno y tiempos al otro", "Aceptar ambas", "Inventar una oferta mayor para presionar"],
        correctAnswer: 1,
        explanation: "Preguntar plazos y tiempos con honestidad es legítimo; comprometerse en falso no lo es.",
      },
      {
        question: "¿Qué daña tu reputación en un proceso con varias ofertas?",
        options: ["Preguntar plazos", "Comprometerte con un programa y seguir negociando en secreto", "Agradecer una oferta", "Pedir tiempo razonable"],
        correctAnswer: 1,
        explanation: "Un compromiso dado se respeta; el mundo del deporte es pequeño y la reputación viaja.",
      },
      {
        question: "ESENCIAL: ¿Cuál es la regla de oro con varias conversaciones?",
        options: ["Ganar tiempo con evasivas", "La honestidad: puedes explorar opciones, pero lo que afirmas debe ser verdad", "Presionar con supuestas ofertas", "Decidir por el logo"],
        correctAnswer: 1,
        explanation: "Explorar en paralelo es válido; mentir nunca. Tu palabra es parte de tu perfil.",
        essential: true,
      },
    ],
  },
  {
    quizId: "recruiting-strategy-l5",
    lessonId: "recruiting-strategy/lesson-5",
    passingScore: 80,
    questions: [
      {
        question: "Elegiste universidad. ¿Qué corresponde hacer con los demás programas activos?",
        options: ["Desaparecer sin avisar", "Agradecer y comunicar tu decisión con respeto: el deporte es un mundo pequeño", "Bloquear a los coaches", "Mantenerlos como respaldo secreto"],
        correctAnswer: 1,
        explanation: "Cerrar bien cada conversación protege tu reputación y deja puertas abiertas para el futuro.",
      },
      {
        question: "¿Qué es lo primero tras aceptar una oferta?",
        options: ["Relajarse hasta el día del viaje", "Confirmar por escrito los acuerdos y completar requisitos pendientes de admisión, elegibilidad y documentos", "Cambiar de teléfono", "Renegociar la beca"],
        correctAnswer: 1,
        explanation: "El 'sí' inicia una fase administrativa: sin requisitos completos, la oportunidad puede complicarse.",
      },
      {
        question: "¿Por qué conviene un plan del primer año?",
        options: ["Para impresionar al coach", "Porque la transición (idioma, estudios, entrenamiento, vida nueva) es el mayor reto del primer semestre", "Porque lo pide la NCAA", "No conviene, mejor improvisar"],
        correctAnswer: 1,
        explanation: "Anticipar la transición reduce el riesgo real de los primeros meses: rendimiento, materias y adaptación.",
      },
      {
        question: "¿Qué papel juegan las condiciones escritas de tu oferta después del sí?",
        options: ["Ya no importan", "Son tu referencia ante cualquier duda: renovación y condiciones académicas y deportivas", "Se pueden ignorar", "Solo le importan al coach"],
        correctAnswer: 1,
        explanation: "Lo escrito protege a ambas partes; guárdalo y consúltalo cuando algo no sea claro.",
      },
      {
        question: "ESENCIAL: ¿Cuándo termina realmente el proceso de recruiting?",
        options: ["Al recibir la primera oferta", "Cuando cierras con profesionalismo, cumples los requisitos y llegas con un plan; tu reputación te acompaña siempre", "Al enviar el primer correo", "Nunca se sabe"],
        correctAnswer: 1,
        explanation: "El proceso cierra con hechos: requisitos completos, acuerdos claros y una llegada preparada.",
        essential: true,
      },
    ],
  },
];

export function getQuiz(quizId: string | null | undefined): Quiz | undefined {
  if (!quizId) return undefined;
  return QUIZZES.find((q) => q.quizId === quizId);
}

export function getQuizForLesson(courseId: string, lessonId: string): Quiz | undefined {
  return QUIZZES.find((q) => q.lessonId === `${courseId}/${lessonId}`);
}
