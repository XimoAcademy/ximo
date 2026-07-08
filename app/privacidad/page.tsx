import type { Metadata } from "next";
import LegalShell, { type LegalSection } from "../components/LegalShell";

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  description: "Aviso de privacidad de Ximo conforme a la LFPDPPP.",
};

const UPDATED = "7 de julio de 2026";
const CONTACT_EMAIL = "ximoacademy@gmail.com";

const intro = [
  "En Ximo valoramos tu privacidad. Este Aviso de Privacidad describe cómo recopilamos, usamos y protegemos tus datos personales, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) vigente en México y los lineamientos aplicables del aviso de privacidad.",
  "Ximo se ofrece actualmente como una versión demo gratuita y en pruebas; no se realizan cobros durante esta etapa. Al crear tu cuenta confirmas, mediante la casilla de aceptación del registro, que has leído y aceptas este Aviso.",
];

const sections: LegalSection[] = [
  {
    heading: "Responsable del tratamiento",
    paragraphs: [
      `“Ximo Academy” / “Ximo” (en adelante, el “Responsable”) es responsable del tratamiento de tus datos personales. Para cualquier asunto relacionado con este Aviso o con tus datos personales, puedes contactarnos en ${CONTACT_EMAIL}.`,
      // TODO(Manuel): sustituir por el domicilio fiscal completo y RFC reales antes del
      // lanzamiento de pago — solo tú puedes proporcionar esos datos fiscales.
      `Domicilio del Responsable: Estados Unidos Mexicanos. El domicilio completo y los datos fiscales del Responsable se proporcionan a cualquier titular que lo solicite escribiendo a ${CONTACT_EMAIL}.`,
    ],
  },
  {
    heading: "Datos que recopilamos",
    paragraphs: ["Recopilamos los datos que nos proporcionas y los que se generan con tu uso del Servicio:"],
    list: [
      "Cuenta: nombre, correo electrónico, contraseña (almacenada de forma cifrada por nuestro proveedor de autenticación), país, deporte y año de graduación.",
      "Perfil de atleta: pruebas, tiempos, marcas, metas, avances, universidades de interés, contactos de coaches, estado de tu proceso de reclutamiento y documentos que tú decides subir.",
      "Académico y recruiting: GPA, resultados de exámenes (SAT/TOEFL), preferencias de universidades, borradores de correos, fechas límite y notas.",
      "Actividad en la app: racha diaria, lecciones vistas, progreso de cursos, recursos guardados y datos de sesión.",
      "Comunidad: la comunidad Ximo vive en Discord (plataforma externa). Dentro de la app solo registramos tu interés/acceso a la sección de comunidad; lo que publiques en Discord se rige por las políticas de Discord.",
      "Publicidad (si envías un anuncio como marca): nombre de la marca y de la persona de contacto, correo, teléfono si lo proporcionas, información de campaña, audiencia, rango de presupuesto, archivos enviados y estado de revisión.",
      "Pagos: estado del pago y datos de facturación cuando aplique, procesados por Stripe. Ximo no almacena los datos completos de tu tarjeta; eso lo hace un procesador de pagos certificado.",
      "Técnicos: dirección IP, información del dispositivo/navegador, cookies y almacenamiento local, y registros de seguridad.",
    ],
  },
  {
    heading: "Datos sensibles",
    paragraphs: [
      "Ximo no solicita ni desea recopilar datos sensibles, incluyendo datos de salud, lesiones o información médica. Te pedimos no incluirlos en campos de texto libre, documentos ni en la comunidad.",
      "Si en el futuro alguna función requiriera datos de salud, se marcarán expresamente como sensibles y se recabarán únicamente con tu consentimiento expreso y por separado, conforme a la LFPDPPP.",
    ],
  },
  {
    heading: "Finalidades del tratamiento",
    paragraphs: ["Finalidades primarias (necesarias para el Servicio):"],
    list: [
      "Crear y administrar tu cuenta, y autenticarte.",
      "Proporcionar el panel, las herramientas de recruiting, los cursos, la racha diaria y el seguimiento de progreso.",
      "Enviarte correos de cuenta y de servicio (confirmaciones, seguridad, recordatorios de tu proceso).",
      "Revisar manualmente las solicitudes de anunciantes y gestionar su pago y publicación.",
      "Procesar tu suscripción y pagos, cuando aplique.",
      "Mejorar la aplicación y mantener su seguridad.",
      "Atender tus solicitudes de soporte.",
    ],
  },
  {
    heading: "Comunicaciones promocionales (finalidad secundaria)",
    paragraphs: [
      "Las comunicaciones de marketing o promocionales son opcionales y no condicionan el uso del Servicio. Solo se envían si las aceptas, y puedes darte de baja en cualquier momento desde Notificaciones (correos no esenciales) o escribiendo a ximoacademy@gmail.com.",
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
      "Supabase — alojamiento de base de datos, archivos y autenticación.",
      "Vercel — alojamiento de la aplicación.",
      "Stripe — procesamiento de pagos (cuando aplique).",
      "Resend — envío de correos transaccionales.",
    ],
  },
  {
    heading: "Enlaces y plataformas externas",
    paragraphs: [
      "La app contiene enlaces a plataformas externas: el servidor de Discord de la comunidad, sitios de anunciantes y recursos educativos. Al usarlas, el tratamiento de tus datos se rige por las políticas de esas plataformas, no por este Aviso.",
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
      "Conservamos tus datos mientras tu cuenta esté activa y durante el tiempo necesario para fines legales u operativos. Puedes solicitar la eliminación de tu cuenta y tus datos desde Configuración → Eliminar cuenta o escribiendo a ximoacademy@gmail.com. Aplicamos medidas de seguridad técnicas y organizativas, incluyendo control de acceso a nivel de fila (RLS) para que cada usuario solo acceda a su propia información.",
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
      "Para limitar el uso o divulgación de tus datos sin eliminar tu cuenta, puedes desactivar los correos no esenciales en Notificaciones y controlar qué información registras en tu perfil.",
    ],
  },
  {
    heading: "Cookies y tecnologías similares",
    paragraphs: [
      "Usamos cookies estrictamente necesarias para mantener tu sesión iniciada y operar el Servicio, y almacenamiento local para preferencias como el tema. No utilizamos cookies de publicidad de terceros ni rastreadores con fines comerciales. Más detalle en la página Cookies y tecnologías.",
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
