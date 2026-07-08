import type { Metadata } from "next";
import LegalShell, { type LegalSection } from "../components/LegalShell";

export const metadata: Metadata = {
  title: "Términos para anunciantes",
  description: "Condiciones que aceptan las marcas que envían anuncios a revisión en Ximo.",
};

const UPDATED = "7 de julio de 2026";

const intro = [
  "Estos términos aplican a toda persona o marca (el “Anunciante”) que envía una solicitud de anuncio a Ximo. Al enviar una solicitud desde la sección Promocionar, el Anunciante acepta estos términos, la Política de anuncios y los Términos y Condiciones generales de Ximo.",
];

const sections: LegalSection[] = [
  {
    heading: "Proceso: revisión antes que todo",
    list: [
      "Enviar una solicitud no garantiza su publicación. Toda solicitud pasa por revisión manual del equipo Ximo.",
      "No se solicita ni procesa ningún pago antes de la aprobación. Un anuncio rechazado no genera cargo alguno.",
      "Tras la aprobación, el Anunciante recibe un correo para configurar la campaña y completar el pago.",
      "Confirmado el pago, la activación de la publicación la realiza manualmente el equipo Ximo.",
      "Ximo puede rechazar, pausar o retirar un anuncio que incumpla estas condiciones, incluso después de publicado. Si el retiro no se debe a un incumplimiento del Anunciante, se acordará un reembolso proporcional del periodo no exhibido.",
    ],
  },
  {
    heading: "Declaraciones del Anunciante",
    paragraphs: ["Al enviar una solicitud, el Anunciante declara y garantiza que:"],
    list: [
      "Tiene todos los derechos y permisos necesarios sobre el material del anuncio: fotos, videos, logotipos, música, textos y testimonios.",
      "La información proporcionada (marca, contacto, producto, precios y ofertas) es verdadera y no induce a error.",
      "Su producto o servicio cumple la legislación mexicana aplicable, incluida la Ley Federal de Protección al Consumidor.",
      "Entiende que la audiencia de Ximo incluye menores de edad y que su anuncio no debe explotarlos ni dirigirles contenido inadecuado.",
      "Cuenta con las licencias o registros sanitarios/regulatorios que su producto requiera (por ejemplo, suplementos).",
    ],
  },
  {
    heading: "Sin resultados garantizados",
    paragraphs: [
      "Ximo no garantiza alcance, impresiones, clics, ventas ni ningún resultado de campaña. Las cifras de alcance mostradas al configurar una campaña son estimaciones de referencia.",
    ],
  },
  {
    heading: "Pagos",
    paragraphs: [
      "Los pagos de campañas se procesan a través de un proveedor de pagos (Stripe cuando está habilitado). Ximo no almacena los datos completos de la tarjeta del Anunciante.",
      "El precio, la duración y el resto de condiciones se muestran antes de confirmar el pago. No hay cargos ocultos ni renovaciones automáticas de campañas: cada campaña se contrata y paga de forma individual.",
    ],
  },
  {
    heading: "Responsabilidad",
    paragraphs: [
      "El Anunciante es el único responsable de su anuncio, de su producto o servicio y de cualquier transacción con los usuarios. Ximo actúa únicamente como espacio de exhibición con revisión previa y no es parte de esas transacciones.",
      "El Anunciante mantendrá a Ximo en paz y a salvo frente a reclamaciones de terceros derivadas del contenido de su anuncio o de sus productos.",
    ],
  },
  {
    heading: "Datos del Anunciante",
    paragraphs: [
      "Los datos enviados en la solicitud (marca, contacto, archivos, presupuesto) se usan para gestionar la revisión, el pago y la publicación, conforme al Aviso de Privacidad de Ximo. Puedes solicitar su corrección o eliminación en ximoacademy@gmail.com.",
    ],
  },
  {
    heading: "Contacto",
    paragraphs: ["Dudas sobre estos términos: ximoacademy@gmail.com."],
  },
];

export default function TerminosAnunciantesPage() {
  return <LegalShell title="Términos para anunciantes" updated={UPDATED} intro={intro} sections={sections} />;
}
