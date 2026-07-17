import type { Locale } from "./config";

/**
 * Dictionaries for the surfaces added by the international expansion: the
 * education & college-timeline profile section, the discreet NCAA notice, and
 * the NCAA Division I resource page. Spanish is the source language; English is
 * a full translation of THESE surfaces (not a claim of full-app coverage).
 *
 * Option keys (terms, statuses…) come from lib/education/fields.ts — the label
 * maps here translate those stable keys for display only.
 */

export interface Dict {
  education: {
    timelineHeading: string;
    timelineSubtitle: string;
    optionUnset: string;
    // Date of birth
    dobLabel: string;
    dobHelp: string;
    dobErrors: { future: string; invalid: string; required: string; too_old: string };
    // Identity / intl
    nationalityLabel: string;
    educationCountryLabel: string;
    timezoneLabel: string;
    // High school
    hsHeading: string;
    gradYearLabel: string;
    gradYearHelp: string;
    gradYearErrors: { required: string; not_four_digits: string; out_of_range: string; invalid: string };
    gradTermLabel: string;
    gradMonthLabel: string;
    gradStatusLabel: string;
    // Gap year
    gapHeading: string;
    gapQuestion: string;
    gapCountLabel: string;
    gapEnrollLabel: string;
    gapCompetitionLabel: string;
    gapWhy: string;
    // College
    collegeHeading: string;
    intendedYearLabel: string;
    intendedTermLabel: string;
    firstFullTimeLabel: string;
    priorEnrollLabel: string;
    priorTypeLabel: string;
    firstEnrollYearLabel: string;
    firstEnrollTermLabel: string;
    recruitingStatusLabel: string;
    firstFullTimeHelp: string;
    // NCAA notice (below college entry)
    noticeText: string;
    noticeLink: string;
    // Private timeline summary (optional)
    summaryHeading: string;
    summaryEstimate: string;
    summaryPrivate: string;
    summaryDelayWarning: string;
    summaryStart: string;
    summaryEnd: string;
    summaryDriverAge: string;
    summaryDriverEnrollment: string;
    // Save
    yes: string;
    no: string;
    // Option label maps (keys mirror lib/education/fields.ts)
    terms: Record<string, string>;
    gradStatuses: Record<string, string>;
    gapStatuses: Record<string, string>;
    priorTypes: Record<string, string>;
    recruitingStatuses: Record<string, string>;
  };
  ncaa: {
    metaTitle: string;
    metaDescription: string;
    breadcrumb: string;
    title: string;
    summary: string;
    lastReviewedLabel: string;
    lastReviewed: string;
    disclaimer: string;
    sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
    timeline: { heading: string; steps: Array<{ label: string; desc: string }> };
    examples: { heading: string; note: string; items: Array<{ title: string; body: string }> };
    exceptions: { heading: string; intro: string; items: string[]; caveat: string };
    scope: { heading: string; items: string[] };
    sources: { heading: string; items: Array<{ label: string; url: string }> };
    backLink: string;
  };
}

const SOURCES = [
  {
    label: "NCAA — Division I adopts age-based eligibility model",
    url: "https://www.ncaa.org/division-i-adopts-age-based-eligibility-model/",
  },
  {
    label: "NCAA Eligibility Center — Division I age-based eligibility rules",
    url: "https://www.ncaa.org/eligibility-center/division-i-age-based-eligibility-rules/",
  },
];

const es: Dict = {
  education: {
    timelineHeading: "Educación y línea de tiempo a college",
    timelineSubtitle:
      "Nos ayuda a orientarte mejor. Solo verás las preguntas que apliquen a tu caso.",
    optionUnset: "Sin definir",
    dobLabel: "Fecha de nacimiento",
    dobHelp: "Se usa para calcular tu edad cuando hace falta. Es privada y no se muestra públicamente.",
    dobErrors: {
      future: "La fecha no puede estar en el futuro.",
      invalid: "Ingresa una fecha válida.",
      required: "Ingresa tu fecha de nacimiento.",
      too_old: "Ingresa una fecha válida.",
    },
    nationalityLabel: "Nacionalidad",
    educationCountryLabel: "País donde estudias la preparatoria",
    timezoneLabel: "Zona horaria",
    hsHeading: "Preparatoria",
    gradYearLabel: "Año de graduación de preparatoria",
    gradYearHelp: "Escribe el año con cuatro dígitos (por ejemplo, 2027).",
    gradYearErrors: {
      required: "Escribe tu año de graduación.",
      not_four_digits: "Escribe exactamente cuatro dígitos (por ejemplo, 2027).",
      out_of_range: "Escribe un año válido.",
      invalid: "Escribe un año válido.",
    },
    gradTermLabel: "Periodo de graduación",
    gradMonthLabel: "Mes previsto (opcional)",
    gradStatusLabel: "Estatus",
    gapHeading: "Año sabático (gap year)",
    gapQuestion: "¿Planeas tomar un año sabático antes del college?",
    gapCountLabel: "¿Cuántos años sabáticos?",
    gapEnrollLabel: "¿Esperas inscribirte de tiempo completo en un college durante ese periodo?",
    gapCompetitionLabel: "¿Esperas competir de forma organizada durante ese periodo?",
    gapWhy:
      "La inscripción de tiempo completo y la competencia organizada pueden afectar tu elegibilidad. Esto no es una certificación oficial de la NCAA.",
    collegeHeading: "Ingreso a college previsto",
    intendedYearLabel: "Año de ingreso a college previsto",
    intendedTermLabel: "Periodo de ingreso previsto",
    firstFullTimeLabel: "¿Sería tu primera inscripción de tiempo completo en cualquier college o universidad?",
    priorEnrollLabel: "¿Ya te inscribiste de tiempo completo en alguna institución?",
    priorTypeLabel: "Tipo de institución",
    firstEnrollYearLabel: "Año de tu primera inscripción de tiempo completo",
    firstEnrollTermLabel: "Periodo de tu primera inscripción",
    recruitingStatusLabel: "Estatus de recruiting",
    firstFullTimeHelp:
      "«Primera inscripción de tiempo completo» significa inscribirte y asistir a clases en cualquier college o universidad — no solo una institución NCAA.",
    noticeText:
      "Tu fecha de nacimiento y tu primera inscripción de tiempo completo pueden afectar cuándo comienza tu periodo de elegibilidad de la NCAA División I.",
    noticeLink: "Conoce la línea de tiempo de elegibilidad de la NCAA División I",
    summaryHeading: "Tu línea de tiempo (estimación)",
    summaryEstimate:
      "Estimación privada basada en tu fecha de nacimiento y tus planes de inscripción. No es una certificación oficial.",
    summaryPrivate: "Solo tú puedes ver esto.",
    summaryDelayWarning:
      "Inscribirte más tarde puede reducir el tiempo disponible: tu periodo por edad podría empezar antes de tu primera inscripción.",
    summaryStart: "Inicio estimado del periodo",
    summaryEnd: "Fin estimado del periodo",
    summaryDriverAge: "Determinado por tu edad (cumpleaños 19).",
    summaryDriverEnrollment: "Determinado por tu primera inscripción de tiempo completo.",
    yes: "Sí",
    no: "No",
    terms: { winter: "Invierno", spring: "Primavera", summer: "Verano", fall: "Otoño", other: "Otro" },
    gradStatuses: { expected: "Prevista", completed: "Completada" },
    gapStatuses: {
      no: "No",
      planned: "Sí, planeado",
      unsure: "No estoy seguro",
      current: "Lo estoy tomando ahora",
      completed: "Ya lo completé",
    },
    priorTypes: {
      us_college: "College en EE. UU.",
      international_university: "Universidad internacional",
      junior_college: "Junior college",
      community_college: "Community college",
      other: "Otra institución",
    },
    recruitingStatuses: {
      prospect: "Prospecto",
      gap_year: "Año sabático",
      committed: "Comprometido",
      enrolled: "Inscrito",
      transfer: "Transferencia",
      other: "Otro",
    },
  },
  ncaa: {
    metaTitle: "Elegibilidad por edad de la NCAA División I",
    metaDescription:
      "Guía educativa de Ximo sobre el modelo de elegibilidad por edad de la NCAA División I: cuándo empieza el periodo continuo de cinco años y qué significa para atletas internacionales.",
    breadcrumb: "Recursos",
    title: "Elegibilidad por edad de la NCAA División I",
    summary:
      "La NCAA División I adoptó un modelo de elegibilidad basado en la edad: un periodo continuo de cinco años. Aquí lo explicamos en palabras claras, con ejemplos para atletas internacionales. Es material educativo, no una certificación oficial.",
    lastReviewedLabel: "Última revisión",
    lastReviewed: "12 de julio de 2026",
    disclaimer:
      "Esta página es informativa. Ximo no determina elegibilidad oficial. Las decisiones oficiales las toman el NCAA Eligibility Center y la oficina de cumplimiento de la universidad. Otras reglas académicas y deportivas también aplican.",
    sections: [
      {
        heading: "Adopción y aplicación",
        paragraphs: [
          "El modelo de elegibilidad por edad de la División I se adoptó oficialmente el 23 de junio de 2026.",
          "Aplica plenamente a los prospectos que se inscriben de tiempo completo por primera vez en cualquier college o universidad en otoño de 2027 o después.",
          "Para quienes se inscriben durante el ciclo 2026-27, las reglas de transición pueden permitir el modelo anterior o el nuevo, el que sea más beneficioso. No asumas que la regla de otoño 2027 aplica igual a todos los atletas actuales.",
        ],
      },
      {
        heading: "No es una promesa de «cinco por cinco»",
        paragraphs: [
          "La NCAA lo describe como un periodo continuo de cinco años. Algunas personas lo llaman «5 for 5», pero la NCAA dice que esa descripción no es del todo exacta.",
          "No garantiza que cada atleta reciba cinco años completos de elegibilidad. Siguen aplicando otras reglas académicas y deportivas, y quien retrasa su inscripción puede tener menos tiempo disponible.",
        ],
      },
      {
        heading: "Cuándo empieza el periodo",
        paragraphs: ["El periodo de cinco años empieza con lo que ocurra primero de estas dos cosas:"],
        bullets: [
          "El periodo académico en que te inscribes de tiempo completo y asistes a clases por primera vez en cualquier college o universidad. Esto incluye instituciones en EE. UU., universidades internacionales, junior colleges, community colleges y otras instituciones postsecundarias.",
          "El disparador por edad ligado a tu cumpleaños 19: si cumples 19 antes del 1 de septiembre, el periodo comienza al inicio del año académico inmediatamente posterior a tu cumpleaños; si cumples 19 en o después del 1 de septiembre, comienza al inicio del año académico siguiente, salvo que tu inscripción de tiempo completo ocurra antes.",
        ],
      },
      {
        heading: "Un periodo continuo",
        paragraphs: [
          "Una vez que empieza, el periodo normalmente corre de forma continua. No se pausa automáticamente porque no compitas, te transfieras, te sientes una temporada, cambies de equipo, dejes de participar temporalmente o tomes tiempo fuera después de que el reloj ya empezó.",
          "Esto es distinto del sistema anterior de conteo de temporadas y redshirt.",
        ],
      },
      {
        heading: "Conceptos que se eliminan",
        paragraphs: [
          "El nuevo modelo de la División I elimina o reemplaza varios conceptos previos. Esto no significa que las lesiones o las circunstancias personales dejen de importar en todos los contextos; solo describimos lo que dice la regla sobre el periodo de elegibilidad.",
        ],
        bullets: [
          "Conteo de temporadas de competencia.",
          "Reglas de redshirt deportivo.",
          "Reglas de inscripción retrasada y cronogramas por deporte.",
          "Varias categorías tradicionales de waivers.",
          "Waivers por hardship médico.",
          "Extensiones del reloj de elegibilidad.",
        ],
      },
    ],
    timeline: {
      heading: "Cómo se ve la línea de tiempo",
      steps: [
        { label: "Preparatoria", desc: "Terminas la prepa (en cualquier país y en cualquier periodo del año)." },
        { label: "Disparador", desc: "El reloj empieza con lo primero: tu inscripción de tiempo completo o tu disparador por edad (19)." },
        { label: "5 años", desc: "Un periodo continuo de cinco años académicos para competir." },
        { label: "Cierre", desc: "El periodo termina; retrasar la inscripción puede reducir el tiempo disponible." },
      ],
    },
    examples: {
      heading: "Ejemplos educativos",
      note: "Ejemplos ilustrativos. No son una certificación oficial de elegibilidad.",
      items: [
        {
          title: "Inscripción inmediata tras la prepa",
          body: "Te gradúas y te inscribes de tiempo completo el otoño siguiente. El periodo de cinco años empieza con esa inscripción.",
        },
        {
          title: "Un año sabático",
          body: "Tomas un año antes de inscribirte. Si aún no llega tu disparador por edad, el periodo empieza cuando te inscribes de tiempo completo.",
        },
        {
          title: "Inscripción retrasada después de los 19",
          body: "Si tu disparador por edad ocurre antes de tu primera inscripción, el reloj puede empezar por edad — y parte del periodo transcurre antes de que compitas.",
        },
        {
          title: "Primera inscripción en una universidad internacional",
          body: "Inscribirte de tiempo completo en una universidad fuera de EE. UU. cuenta igual que en un college estadounidense para iniciar el periodo.",
        },
        {
          title: "Graduación en invierno, primavera o verano",
          body: "«Verano» no cae en los mismos meses en todos los países. Guardamos tu periodo y, si hace falta, el mes por separado para estimar mejor.",
        },
      ],
    },
    exceptions: {
      heading: "Excepciones limitadas",
      intro: "La regla contempla excepciones limitadas que pueden excluir o pausar tiempo del periodo:",
      items: ["Embarazo.", "Servicio militar activo.", "Misiones religiosas oficiales.", "Compromisos de servicio similares aprobados, cuando aplican."],
      caveat:
        "Competir de forma organizada durante ciertos periodos de servicio puede impedir que la excepción aplique. Ninguna excepción está garantizada.",
    },
    scope: {
      heading: "Alcance",
      items: [
        "Esta página describe la NCAA División I.",
        "División II, División III, NAIA, NJCAA y otras organizaciones pueden usar sistemas de elegibilidad distintos.",
        "Ximo no certifica elegibilidad de forma oficial.",
        "El NCAA Eligibility Center y la oficina de cumplimiento de la universidad hacen las determinaciones oficiales.",
      ],
    },
    sources: { heading: "Fuentes oficiales", items: SOURCES },
    backLink: "Volver a tu perfil",
  },
};

const en: Dict = {
  education: {
    timelineHeading: "Education & college timeline",
    timelineSubtitle: "This helps us guide you better. You'll only see the questions that apply to you.",
    optionUnset: "Not set",
    dobLabel: "Date of birth",
    dobHelp: "Used to calculate your age when needed. It's private and never shown publicly.",
    dobErrors: {
      future: "The date can't be in the future.",
      invalid: "Enter a valid date.",
      required: "Enter your date of birth.",
      too_old: "Enter a valid date.",
    },
    nationalityLabel: "Nationality",
    educationCountryLabel: "Country where you attend high school",
    timezoneLabel: "Time zone",
    hsHeading: "High school",
    gradYearLabel: "High school graduation year",
    gradYearHelp: "Type the four-digit year (for example, 2027).",
    gradYearErrors: {
      required: "Enter your graduation year.",
      not_four_digits: "Type exactly four digits (for example, 2027).",
      out_of_range: "Enter a valid year.",
      invalid: "Enter a valid year.",
    },
    gradTermLabel: "Graduation term",
    gradMonthLabel: "Expected month (optional)",
    gradStatusLabel: "Status",
    gapHeading: "Gap year",
    gapQuestion: "Are you planning to take a gap year before college?",
    gapCountLabel: "How many gap years?",
    gapEnrollLabel: "Do you expect to enroll full time at a college during that period?",
    gapCompetitionLabel: "Do you expect to compete in organized competition during that period?",
    gapWhy:
      "Full-time enrollment and organized competition may affect your eligibility. This is not official NCAA certification.",
    collegeHeading: "Intended college enrollment",
    intendedYearLabel: "Intended college-entry year",
    intendedTermLabel: "Intended college-entry term",
    firstFullTimeLabel: "Will this be your first full-time enrollment at any college or university?",
    priorEnrollLabel: "Have you previously enrolled full time at any institution?",
    priorTypeLabel: "Institution type",
    firstEnrollYearLabel: "Year of your first full-time enrollment",
    firstEnrollTermLabel: "Term of your first full-time enrollment",
    recruitingStatusLabel: "Recruiting status",
    firstFullTimeHelp:
      "\"First full-time enrollment\" means enrolling and attending classes at any college or university — not only an NCAA institution.",
    noticeText:
      "Your date of birth and first full-time college enrollment may affect when your NCAA Division I eligibility period begins.",
    noticeLink: "Learn about the NCAA Division I eligibility timeline",
    summaryHeading: "Your timeline (estimate)",
    summaryEstimate:
      "A private estimate based on your date of birth and enrollment plans. It is not an official certification.",
    summaryPrivate: "Only you can see this.",
    summaryDelayWarning:
      "Enrolling later may reduce your available time: your age-based period could begin before your first enrollment.",
    summaryStart: "Estimated period start",
    summaryEnd: "Estimated period end",
    summaryDriverAge: "Driven by your age (19th birthday).",
    summaryDriverEnrollment: "Driven by your first full-time enrollment.",
    yes: "Yes",
    no: "No",
    terms: { winter: "Winter", spring: "Spring", summer: "Summer", fall: "Fall", other: "Other" },
    gradStatuses: { expected: "Expected", completed: "Completed" },
    gapStatuses: {
      no: "No",
      planned: "Yes, planned",
      unsure: "Unsure",
      current: "Currently taking one",
      completed: "Already completed one",
    },
    priorTypes: {
      us_college: "U.S. college",
      international_university: "International university",
      junior_college: "Junior college",
      community_college: "Community college",
      other: "Another institution",
    },
    recruitingStatuses: {
      prospect: "Prospect",
      gap_year: "Gap year",
      committed: "Committed",
      enrolled: "Enrolled",
      transfer: "Transfer",
      other: "Other",
    },
  },
  ncaa: {
    metaTitle: "NCAA Division I age-based eligibility",
    metaDescription:
      "Ximo's educational guide to the NCAA Division I age-based eligibility model: when the continuous five-year period begins and what it means for international athletes.",
    breadcrumb: "Resources",
    title: "NCAA Division I age-based eligibility",
    summary:
      "NCAA Division I adopted an age-based eligibility model: a continuous five-year period. Here it is in plain language, with examples for international athletes. This is educational material, not an official certification.",
    lastReviewedLabel: "Last reviewed",
    lastReviewed: "July 12, 2026",
    disclaimer:
      "This page is informational. Ximo does not determine official eligibility. Official decisions are made by the NCAA Eligibility Center and the university's compliance office. Other academic and athletics rules also apply.",
    sections: [
      {
        heading: "Adoption and implementation",
        paragraphs: [
          "The Division I age-based eligibility model was officially adopted on June 23, 2026.",
          "It fully applies to prospects who initially enroll full time at any college or university in fall 2027 or later.",
          "For prospects enrolling during the 2026-27 year, transition rules may allow the old model or the new one, whichever is more beneficial. Don't assume the fall 2027 rule applies identically to every current athlete.",
        ],
      },
      {
        heading: "It is not a guaranteed \"five for five\"",
        paragraphs: [
          "The NCAA describes it as a continuous five-year eligibility period. Some people call it \"5 for 5,\" but the NCAA says that description is not fully accurate.",
          "It does not guarantee that every athlete receives five complete years of eligibility. Other academic and athletics rules still apply, and athletes who delay enrollment may have less time remaining.",
        ],
      },
      {
        heading: "When the period begins",
        paragraphs: ["The five-year period begins with the earlier of these two:"],
        bullets: [
          "The academic term when you first enroll full time and attend classes at any college or university. This includes U.S. institutions, international universities, junior colleges, community colleges, and other postsecondary institutions.",
          "The age-based trigger tied to your 19th birthday: if you turn 19 before September 1, the period begins at the start of the academic year immediately following your birthday; if you turn 19 on or after September 1, it begins at the start of the subsequent academic year, unless full-time enrollment happens earlier.",
        ],
      },
      {
        heading: "A continuous period",
        paragraphs: [
          "Once it begins, the period normally runs continuously. It does not automatically pause because you don't compete, transfer, sit out, change teams, stop participating temporarily, or take time away after the clock has already begun.",
          "This differs from the previous season-counting and redshirt system.",
        ],
      },
      {
        heading: "Concepts that are removed",
        paragraphs: [
          "The new Division I model removes or replaces several previous concepts. This does not mean injuries or personal circumstances stop mattering in every context; we only describe what the rule says about the eligibility period.",
        ],
        bullets: [
          "Seasons-of-competition tracking.",
          "Athletics redshirt rules.",
          "Delayed-enrollment rules and sport-specific timelines.",
          "Several traditional waiver categories.",
          "Medical-hardship waivers.",
          "Eligibility-clock extensions.",
        ],
      },
    ],
    timeline: {
      heading: "What the timeline looks like",
      steps: [
        { label: "High school", desc: "You finish high school (in any country, in any term of the year)." },
        { label: "Trigger", desc: "The clock starts with the earlier of: your full-time enrollment or your age trigger (19)." },
        { label: "5 years", desc: "A continuous five academic-year period to compete." },
        { label: "Close", desc: "The period ends; delaying enrollment can reduce the available time." },
      ],
    },
    examples: {
      heading: "Educational examples",
      note: "Illustrative examples. They are not an official eligibility certification.",
      items: [
        {
          title: "Immediate enrollment after high school",
          body: "You graduate and enroll full time the following fall. The five-year period begins with that enrollment.",
        },
        {
          title: "A one-year gap",
          body: "You take a year before enrolling. If your age trigger hasn't arrived yet, the period begins when you enroll full time.",
        },
        {
          title: "Delayed enrollment past age 19",
          body: "If your age trigger occurs before your first enrollment, the clock may start by age — and part of the period elapses before you compete.",
        },
        {
          title: "First enrollment at an international university",
          body: "Enrolling full time at a university outside the U.S. counts the same as a U.S. college for starting the period.",
        },
        {
          title: "Winter, spring, or summer graduation",
          body: "\"Summer\" isn't the same months everywhere. We store your term and, when needed, the month separately for a better estimate.",
        },
      ],
    },
    exceptions: {
      heading: "Limited exceptions",
      intro: "The rule allows limited exceptions that may exclude or pause time from the period:",
      items: ["Pregnancy.", "Active-duty military service.", "Official religious missions.", "Similar approved service commitments, where applicable."],
      caveat:
        "Organized competition during certain service periods can prevent the exception from applying. No exception is guaranteed.",
    },
    scope: {
      heading: "Scope",
      items: [
        "This page describes NCAA Division I.",
        "Division II, Division III, NAIA, NJCAA, and other organizations may use different eligibility systems.",
        "Ximo does not officially certify eligibility.",
        "The NCAA Eligibility Center and the university's compliance office make official determinations.",
      ],
    },
    sources: { heading: "Official sources", items: SOURCES },
    backLink: "Back to your profile",
  },
};

const DICTS: Record<Locale, Dict> = { es, en };

export function getDictionary(locale: Locale): Dict {
  return DICTS[locale] ?? es;
}
