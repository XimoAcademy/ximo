import type { Metadata } from "next";
import LegalShell, { type LegalSection } from "../components/LegalShell";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y condiciones de uso de Ximo.",
};

const UPDATED = "7 de julio de 2026";

const intro = [
  "Bienvenido a Ximo. Estos Términos y Condiciones (los “Términos”) regulan el acceso y uso de la plataforma Ximo (el “Servicio”), una aplicación que ayuda a atletas a organizar su proceso de reclutamiento universitario. Al crear una cuenta o usar el Servicio, aceptas estos Términos.",
  "Si no estás de acuerdo con estos Términos, no utilices el Servicio.",
];

const sections: LegalSection[] = [
  {
    heading: "Versión demo (fase de prueba)",
    paragraphs: [
      "Actualmente Ximo se ofrece como una VERSIÓN DEMO en fase de prueba. El acceso es gratuito y no se cobra ninguna cantidad por usar el Servicio durante esta etapa.",
      "Si Ximo avanza a una versión de pago, te lo notificaremos con anticipación (por correo y/o dentro de la app) antes de que inicie cualquier cobro. Para entonces se te pedirá aceptar de forma expresa los términos actualizados y, en su caso, un plan de pago.",
      "No realizaremos ningún cargo automático sin aviso previo y sin tu aceptación expresa. Si no aceptas los nuevos términos o el plan de pago, podrás dejar de usar el Servicio sin costo alguno.",
      "El paso de activación del demo muestra un precio de $0.00 MXN y sirve únicamente para probar el flujo de activación y confirmación. No genera ningún cargo y el registro que produce es un registro de prueba: no constituye una factura ni un comprobante fiscal (CFDI). Si en el futuro se emiten comprobantes fiscales, se informará expresamente.",
      "Al ser una versión en pruebas, el Servicio puede presentar cambios, interrupciones o ajustes mientras lo mejoramos.",
    ],
  },
  {
    heading: "Descripción del Servicio",
    paragraphs: [
      "Ximo ofrece herramientas para organizar el proceso de reclutamiento deportivo universitario: seguimiento de universidades y coaches, plantillas de correos, gestión de documentos, cursos educativos, seguimiento de progreso, acceso a la comunidad de atletas (en Discord) y un espacio de marcas revisadas.",
      "Ximo es una plataforma educativa y de organización. No somos una agencia, escuela, universidad, asesor legal ni asesor financiero, y no actuamos como reclutador garantizado.",
      "No garantizamos admisiones, becas, patrocinios, resultados deportivos ni el desempeño de ningún anuncio. Eres responsable de la veracidad de los datos y documentos que registras.",
    ],
  },
  {
    heading: "Elegibilidad y menores de edad",
    paragraphs: [
      "El Servicio está dirigido a atletas estudiantes. Si eres menor de 18 años, debes contar con el consentimiento y la supervisión de tu padre, madre o tutor legal para crear una cuenta y, en su caso, para contratar una suscripción de pago.",
      "Al usar el Servicio siendo menor de edad, declaras que cuentas con dicho consentimiento. El padre, madre o tutor es responsable del uso del Servicio y de los pagos realizados por el menor.",
    ],
  },
  {
    heading: "Tu cuenta",
    paragraphs: [
      "Eres responsable de mantener la confidencialidad de tus credenciales y de toda la actividad realizada en tu cuenta. Debes proporcionar información veraz y mantenerla actualizada.",
      "Notifícanos de inmediato si detectas un uso no autorizado de tu cuenta.",
    ],
  },
  {
    heading: "Suscripción y pagos (cuando aplique)",
    paragraphs: [
      "Durante la versión demo NO hay cobros: el acceso es gratuito. Esta sección describe cómo funcionarán los pagos únicamente SI Ximo habilita una versión de pago en el futuro, y aplicará solo después de que aceptes expresamente un plan.",
      "En su momento, el acceso de pago se ofrecería por suscripción (mensual o anual). El precio y la moneda serían los mostrados al momento de la contratación, antes de confirmar el pago. Los pagos se procesarían a través de Stripe; Ximo no almacena los datos completos de tu tarjeta.",
      "Una suscripción de pago se renovaría automáticamente al final de cada periodo, al precio vigente, salvo que canceles antes de la fecha de renovación. Podrías cancelar en cualquier momento, sin penalización, desde Facturación dentro de la app, y conservarías el acceso hasta el final del periodo ya pagado. Reiteramos: nada de esto ocurre durante la versión demo y nunca sin tu aceptación previa.",
    ],
  },
  {
    heading: "Uso aceptable",
    paragraphs: ["Al usar el Servicio te comprometes a no:"],
    list: [
      "Publicar contenido ilegal, ofensivo, acosador, difamatorio o que infrinja derechos de terceros.",
      "Compartir información personal de terceros sin su consentimiento.",
      "Usar el Servicio para spam, fraude o cualquier fin engañoso.",
      "Intentar vulnerar la seguridad del Servicio o acceder a datos de otros usuarios.",
    ],
  },
  {
    heading: "Contenido de usuario",
    paragraphs: [
      "Eres responsable del contenido y los archivos que subes al Servicio (por ejemplo, documentos o material de anuncios). Debes contar con los derechos o permisos necesarios sobre fotos, videos, logotipos, música, testimonios y cualquier material de terceros.",
      "No está permitido subir contenido ilegal, de odio, sexual explícito, engañoso o que infrinja derechos de autor de terceros. Podemos retirar u ocultar contenido que incumpla estos Términos, sin previo aviso.",
    ],
  },
  {
    heading: "Comunidad en Discord",
    paragraphs: [
      "La comunidad Ximo opera en un servidor de Discord. Discord es una plataforma externa: al unirte aplican sus propios términos, políticas de privacidad y normas, además de las Reglas de la comunidad de Ximo publicadas en /reglas-comunidad.",
    ],
  },
  {
    heading: "Propiedad intelectual",
    paragraphs: [
      "El Servicio, su marca, diseño, cursos y contenido propio son propiedad de Ximo y están protegidos por las leyes aplicables. No puedes reproducir, distribuir ni crear obras derivadas sin autorización.",
    ],
  },
  {
    heading: "Marcas y publicidad de terceros",
    paragraphs: [
      "El Servicio puede mostrar anuncios de marcas externas, siempre revisados manualmente antes de publicarse y etiquetados como “Publicidad” o “Patrocinado”. Ximo no garantiza resultados, compras ni beneficios relacionados con dichos anuncios.",
      "Cualquier transacción que realices con una marca tercera es entre tú y dicha marca; Ximo no es parte ni responsable de dichas transacciones. Las marcas que anuncian aceptan además los Términos para anunciantes y la Política de anuncios.",
    ],
  },
  {
    heading: "Terminación",
    paragraphs: [
      "Podemos suspender o cancelar tu acceso si incumples estos Términos. Tú puedes cerrar tu cuenta en cualquier momento. Algunas disposiciones (propiedad intelectual, limitación de responsabilidad) sobreviven a la terminación.",
    ],
  },
  {
    heading: "Limitación de responsabilidad",
    paragraphs: [
      "El Servicio se proporciona “tal cual”. En la máxima medida permitida por la ley, Ximo no será responsable por daños indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de uso del Servicio, ni por decisiones tomadas con base en la información de la plataforma.",
    ],
  },
  {
    heading: "Cambios a estos Términos",
    paragraphs: [
      "Podemos actualizar estos Términos. Te notificaremos los cambios relevantes. El uso continuado del Servicio tras la entrada en vigor de los cambios implica tu aceptación.",
    ],
  },
  {
    heading: "Ley aplicable y contacto",
    paragraphs: [
      "Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos. Como consumidor, conservas todos los derechos que te otorga la Ley Federal de Protección al Consumidor; nada en estos Términos los limita.",
      "Para cualquier duda o reclamación, escríbenos a ximoacademy@gmail.com o contáctanos desde el centro de ayuda dentro de la aplicación.",
    ],
  },
];

export default function TerminosPage() {
  return <LegalShell title="Términos y Condiciones" updated={UPDATED} intro={intro} sections={sections} />;
}
