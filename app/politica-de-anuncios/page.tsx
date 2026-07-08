import type { Metadata } from "next";
import LegalShell, { type LegalSection } from "../components/LegalShell";

export const metadata: Metadata = {
  title: "Política de anuncios",
  description: "Reglas de la publicidad dentro de Ximo: revisión manual, etiquetado y contenido permitido.",
};

const UPDATED = "7 de julio de 2026";

const intro = [
  "Ximo muestra, de forma limitada y controlada, anuncios de marcas externas dirigidos a atletas estudiantes. Esta política explica cómo funciona esa publicidad y qué reglas aplican, tanto para quien anuncia como para quien la ve.",
  "Los anuncios dentro de Ximo pueden ser enviados por marcas externas y revisados por Ximo antes de publicarse. Ximo no garantiza resultados, compras, rendimiento deportivo ni beneficios externos relacionados con dichos anuncios.",
];

const sections: LegalSection[] = [
  {
    heading: "Revisión manual, siempre",
    paragraphs: [
      "Ningún anuncio se publica automáticamente. Toda solicitud pasa por revisión manual del equipo Ximo, que puede aprobarla o rechazarla a su criterio.",
      "El pago solo se solicita después de la aprobación. Ninguna marca paga por un anuncio que no ha sido aprobado, y un anuncio rechazado no genera ningún cargo.",
      "Incluso después del pago, la activación final de la publicación la realiza manualmente el equipo Ximo.",
    ],
  },
  {
    heading: "Etiquetado claro",
    paragraphs: [
      "Todo contenido pagado se muestra identificado como “Publicidad” o “Patrocinado”, separado del contenido propio de Ximo, e indica la marca anunciante. Cuando sea relevante, se muestra también un medio de contacto del anunciante.",
    ],
  },
  {
    heading: "Contenido no permitido",
    paragraphs: ["Rechazamos anuncios que incluyan, entre otros:"],
    list: [
      "Afirmaciones engañosas, exageradas o imposibles de verificar (resultados garantizados, curas milagro, ingresos asegurados).",
      "Sustancias prohibidas en el deporte, dopaje, alcohol, tabaco, vapeo o apuestas.",
      "Contenido ilegal, violento, sexual, discriminatorio o de odio.",
      "Productos o servicios sin relación razonable con atletas estudiantes.",
      "Esquemas de dinero rápido, criptomonedas especulativas o multinivel.",
      "Cualquier material que infrinja derechos de autor o de marca de terceros.",
    ],
  },
  {
    heading: "Protección a menores",
    paragraphs: [
      "La audiencia de Ximo incluye menores de edad. No se permiten anuncios que exploten su inexperiencia o credulidad, que presionen a la compra, que promuevan productos inadecuados para menores o que soliciten datos personales de menores.",
    ],
  },
  {
    heading: "Alcance y resultados",
    paragraphs: [
      "Cualquier cifra de alcance mostrada durante la configuración de una campaña es una estimación de referencia, no una promesa. Ximo no garantiza alcance, clics, ventas ni ningún resultado de campaña.",
    ],
  },
  {
    heading: "Correos promocionales",
    paragraphs: [
      "Si Ximo envía comunicaciones promocionales directas, siempre podrás darte de baja: en la app desde Notificaciones (correos no esenciales) o escribiendo a ximoacademy@gmail.com. Los correos de servicio (cuenta, seguridad, pagos) no son promocionales.",
    ],
  },
  {
    heading: "Reportar un anuncio",
    paragraphs: [
      "Si un anuncio te parece engañoso o inapropiado, escríbenos a ximoacademy@gmail.com con una captura o el nombre de la marca. Lo revisaremos y, si corresponde, lo retiraremos.",
    ],
  },
  {
    heading: "Relación con otras políticas",
    paragraphs: [
      "Esta política se complementa con los Términos para anunciantes (obligaciones de quien anuncia), los Términos y Condiciones y el Aviso de Privacidad de Ximo.",
    ],
  },
];

export default function PoliticaDeAnunciosPage() {
  return <LegalShell title="Política de anuncios" updated={UPDATED} intro={intro} sections={sections} />;
}
