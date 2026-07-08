import type { Metadata } from "next";
import LegalShell, { type LegalSection } from "../components/LegalShell";

export const metadata: Metadata = {
  title: "Reglas de la comunidad",
  description: "Reglas de convivencia de la comunidad Ximo (Discord y espacios oficiales).",
};

const UPDATED = "7 de julio de 2026";

const intro = [
  "La comunidad Ximo vive principalmente en nuestro servidor de Discord, donde atletas comparten dudas, avances, experiencias y oportunidades. Estas reglas aplican en el servidor de Discord de Ximo y en cualquier otro espacio comunitario oficial.",
  "Discord es una plataforma externa: al usarla aplican también sus propios términos, políticas de privacidad y normas de comunidad.",
];

const sections: LegalSection[] = [
  {
    heading: "Lo esencial",
    list: [
      "Respeto siempre: sin insultos, acoso, burlas ni discriminación por ningún motivo.",
      "Esta es una comunidad de atletas estudiantes, muchos menores de edad. Compórtate en consecuencia.",
      "Nada de contenido sexual, violento, ilegal o que promueva sustancias prohibidas en el deporte.",
      "No compartas datos personales sensibles (tuyos ni de nadie): direcciones, teléfonos, documentos oficiales, datos bancarios.",
      "No suplantes a otras personas, coaches, universidades ni al equipo Ximo.",
    ],
  },
  {
    heading: "Contenido y promoción",
    list: [
      "Comparte avances, preguntas y recursos útiles; eso es la comunidad.",
      "No hagas spam ni publicidad no autorizada. Las marcas tienen un canal formal: la sección Promocionar de la app, con revisión manual.",
      "No publiques material con derechos de autor de terceros sin permiso.",
      "La información que otros miembros comparten es su opinión o experiencia, no asesoría profesional ni postura oficial de Ximo.",
    ],
  },
  {
    heading: "Seguridad de menores",
    paragraphs: [
      "Si eres menor de edad, participa con la autorización de tu madre, padre o tutor, y nunca acuerdes encuentros ni compartas información privada con desconocidos. Reporta de inmediato cualquier comportamiento que te haga sentir incómodo o inseguro.",
    ],
  },
  {
    heading: "Moderación y consecuencias",
    paragraphs: [
      "El equipo Ximo y sus moderadores pueden eliminar contenido, silenciar temporalmente o expulsar del servidor a quien incumpla estas reglas, según la gravedad y sin previo aviso en casos serios. Las conductas ilegales pueden reportarse a las autoridades.",
    ],
  },
  {
    heading: "Cómo reportar",
    paragraphs: [
      "Usa las herramientas de reporte de Discord, avisa a un moderador del servidor o escríbenos a ximoacademy@gmail.com.",
    ],
  },
];

export default function ReglasComunidadPage() {
  return <LegalShell title="Reglas de la comunidad" updated={UPDATED} intro={intro} sections={sections} />;
}
