import type { Metadata } from "next";
import LegalShell, { type LegalSection } from "../components/LegalShell";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y condiciones de uso de Ximo.",
};

const UPDATED = "10 de junio de 2026";

const intro = [
  "Bienvenido a Ximo. Estos Términos y Condiciones (los “Términos”) regulan el acceso y uso de la plataforma Ximo (el “Servicio”), una aplicación de suscripción que ayuda a atletas a organizar su proceso de reclutamiento universitario. Al crear una cuenta o usar el Servicio, aceptas estos Términos.",
  "Si no estás de acuerdo con estos Términos, no utilices el Servicio.",
];

const sections: LegalSection[] = [
  {
    heading: "Descripción del Servicio",
    paragraphs: [
      "Ximo ofrece herramientas para organizar el proceso de reclutamiento deportivo universitario: seguimiento de universidades y coaches, plantillas de correos, gestión de documentos, registro de marcas deportivas, cursos educativos y una comunidad de atletas.",
      "Ximo es una herramienta de organización y educación. No garantizamos la admisión, el otorgamiento de becas, ni resultados específicos en tu proceso de reclutamiento.",
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
    heading: "Suscripción, pagos y renovación",
    paragraphs: [
      "El acceso completo al Servicio requiere una suscripción de pago (mensual o anual). El precio y la moneda aplicables son los mostrados al momento de la contratación, antes de confirmar el pago. Los pagos se procesan a través de Stripe; Ximo no almacena los datos completos de tu tarjeta.",
      "Las suscripciones se renuevan automáticamente al final de cada periodo, al precio vigente, salvo que canceles antes de la fecha de renovación. Puedes cancelar en cualquier momento, sin penalización, desde Facturación → Gestionar suscripción dentro de la app.",
      "Al cancelar conservarás el acceso hasta el final del periodo ya pagado. Salvo que la ley aplicable disponga lo contrario, los pagos no son reembolsables por periodos ya iniciados. Si crees que hubo un cargo erróneo, escríbenos y lo revisaremos.",
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
    heading: "Contenido de usuario y moderación",
    paragraphs: [
      "Eres responsable del contenido que publicas en la comunidad. Conservas tus derechos sobre dicho contenido, y nos otorgas una licencia para mostrarlo dentro del Servicio.",
      "Todo el contenido publicado pasa por un proceso de revisión antes de ser visible para la comunidad. Podemos retirar, ocultar o rechazar contenido que incumpla estos Términos, sin previo aviso.",
    ],
  },
  {
    heading: "Propiedad intelectual",
    paragraphs: [
      "El Servicio, su marca, diseño, cursos y contenido propio son propiedad de Ximo y están protegidos por las leyes aplicables. No puedes reproducir, distribuir ni crear obras derivadas sin autorización.",
    ],
  },
  {
    heading: "Marcas y promociones de terceros",
    paragraphs: [
      "El Servicio puede mostrar promociones de marcas, previamente revisadas. Cualquier transacción que realices con una marca tercera es entre tú y dicha marca; Ximo no es parte ni responsable de dichas transacciones.",
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
