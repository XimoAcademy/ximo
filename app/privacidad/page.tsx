import type { Metadata } from "next";
import LegalShell, { type LegalSection } from "../components/LegalShell";

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  description: "Aviso de privacidad de Ximo conforme a la LFPDPPP.",
};

const UPDATED = "10 de junio de 2026";
const CONTACT_EMAIL = "ximoacademy@gmail.com";

const intro = [
  "En Ximo valoramos tu privacidad. Este Aviso de Privacidad describe cómo recopilamos, usamos y protegemos tus datos personales, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), su Reglamento y los Lineamientos del Aviso de Privacidad vigentes en México.",
  "Al usar Ximo, aceptas las prácticas descritas en este Aviso.",
];

const sections: LegalSection[] = [
  {
    heading: "Responsable del tratamiento",
    paragraphs: [
      `Ximo (en adelante, el “Responsable”) es responsable del tratamiento de tus datos personales. Para cualquier asunto relacionado con este Aviso o con tus datos personales, puedes contactarnos en ${CONTACT_EMAIL}.`,
      "Domicilio para efectos de este Aviso: Estados Unidos Mexicanos. El domicilio completo del Responsable se proporcionará en respuesta a cualquier solicitud dirigida al correo de contacto.",
    ],
  },
  {
    heading: "Datos que recopilamos",
    paragraphs: ["Recopilamos los datos que nos proporcionas y los que se generan con tu uso del Servicio:"],
    list: [
      "Datos de identificación y contacto: nombre, correo electrónico, país, año de graduación.",
      "Datos deportivos y académicos: pruebas, tiempos, marcas, GPA, resultados de exámenes, metas.",
      "Datos de tu proceso de reclutamiento: universidades, coaches, correos, documentos y tareas que tú registras.",
      "Contenido que publicas en la comunidad.",
      "Datos de pago procesados por Stripe (Ximo no almacena los datos completos de tu tarjeta).",
      "Datos técnicos: información de sesión necesaria para autenticarte y operar el Servicio.",
    ],
  },
  {
    heading: "Finalidades del tratamiento",
    paragraphs: ["Finalidades primarias (necesarias para el Servicio):"],
    list: [
      "Crear y administrar tu cuenta, y autenticarte.",
      "Proporcionar y personalizar las herramientas de la plataforma.",
      "Procesar tu suscripción y pagos.",
      "Moderar el contenido de la comunidad y mantener un entorno seguro.",
      "Atender tus solicitudes de soporte.",
      "Enviarte notificaciones y recordatorios relacionados con tu proceso. Esta finalidad es secundaria en lo relativo a correos no esenciales: puedes desactivarlos en la sección Notificaciones sin que ello afecte el resto del Servicio.",
    ],
  },
  {
    heading: "Menores de edad",
    paragraphs: [
      "Ximo está dirigido a atletas estudiantes, que pueden ser menores de edad. El tratamiento de datos de menores se realiza bajo el consentimiento y la responsabilidad del padre, madre o tutor legal. Si eres padre, madre o tutor y deseas revisar o eliminar los datos de un menor, contáctanos.",
    ],
  },
  {
    heading: "Encargados y transferencias",
    paragraphs: [
      "Compartimos datos únicamente con proveedores que nos ayudan a operar el Servicio (encargados), bajo obligaciones contractuales de confidencialidad y seguridad:",
    ],
    list: [
      "Supabase — alojamiento de base de datos y autenticación.",
      "Stripe — procesamiento de pagos.",
      "Resend — envío de correos transaccionales.",
    ],
  },
  {
    heading: "Transferencias internacionales",
    paragraphs: [
      "Nuestros proveedores pueden almacenar o procesar datos en servidores ubicados fuera de México (principalmente en Estados Unidos). Estas remisiones se realizan únicamente para operar el Servicio, con proveedores que mantienen medidas de seguridad adecuadas. No vendemos tus datos personales ni los transferimos a terceros para fines distintos de los descritos en este Aviso.",
    ],
  },
  {
    heading: "Conservación y seguridad",
    paragraphs: [
      "Conservamos tus datos mientras tu cuenta esté activa y durante el tiempo necesario para cumplir obligaciones legales. Aplicamos medidas de seguridad técnicas y organizativas, incluyendo control de acceso a nivel de fila (RLS) para que cada usuario solo acceda a su propia información.",
    ],
  },
  {
    heading: "Tus derechos ARCO",
    paragraphs: [
      "Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte (derechos ARCO) al tratamiento de tus datos personales. Puedes ejercerlos de las siguientes formas:",
    ],
    list: [
      "Acceso y rectificación: directamente desde tu Perfil dentro de la app.",
      "Portabilidad: descarga una copia de tus datos desde Configuración → Exportar mis datos.",
      "Cancelación: elimina tu cuenta y tus datos desde Configuración → Eliminar cuenta.",
      `Cualquier derecho ARCO, dudas o solicitudes: escríbenos a ${CONTACT_EMAIL}. Responderemos en los plazos previstos por la LFPDPPP (máximo 20 días hábiles).`,
    ],
  },
  {
    heading: "Revocación del consentimiento y limitación de uso",
    paragraphs: [
      `Puedes revocar tu consentimiento al tratamiento de tus datos en cualquier momento eliminando tu cuenta desde Configuración o escribiéndonos a ${CONTACT_EMAIL}. Ten en cuenta que el Servicio requiere ciertos datos para funcionar: revocar el consentimiento sobre datos esenciales implica dejar de usar el Servicio.`,
      "Para limitar el uso o divulgación de tus datos sin eliminar tu cuenta, puedes desactivar los correos no esenciales en Notificaciones y controlar qué publicas en la comunidad.",
    ],
  },
  {
    heading: "Cookies y tecnologías similares",
    paragraphs: [
      "Usamos cookies estrictamente necesarias para mantener tu sesión iniciada y operar el Servicio. No utilizamos cookies de publicidad de terceros ni rastreadores con fines comerciales.",
    ],
  },
  {
    heading: "Autoridad de protección de datos",
    paragraphs: [
      "Si consideras que tu derecho a la protección de datos personales ha sido vulnerado, puedes acudir ante la autoridad mexicana competente en materia de protección de datos personales (Secretaría Anticorrupción y Buen Gobierno, que asumió las funciones del INAI) para iniciar el procedimiento de protección de derechos correspondiente.",
    ],
  },
  {
    heading: "Cambios a este Aviso",
    paragraphs: [
      "Podemos actualizar este Aviso de Privacidad. Publicaremos la versión vigente con su fecha de actualización en esta misma página y, cuando corresponda, te notificaremos los cambios relevantes por correo o dentro de la app.",
    ],
  },
  {
    heading: "Contacto",
    paragraphs: [
      `Para ejercer tus derechos o resolver dudas sobre el tratamiento de tus datos, escríbenos a ${CONTACT_EMAIL} o usa el centro de ayuda dentro de la aplicación.`,
    ],
  },
];

export default function PrivacidadPage() {
  return <LegalShell title="Aviso de Privacidad" updated={UPDATED} intro={intro} sections={sections} />;
}
