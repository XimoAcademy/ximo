import type { Metadata } from "next";
import LegalShell, { type LegalSection } from "../components/LegalShell";

export const metadata: Metadata = {
  title: "Cookies y tecnologías",
  description: "Cómo usa Ximo cookies, local storage y tecnologías similares.",
};

const UPDATED = "7 de julio de 2026";

const intro = [
  "Esta página explica qué cookies y tecnologías similares usa Ximo, para qué sirven y qué control tienes sobre ellas.",
];

const sections: LegalSection[] = [
  {
    heading: "Qué son estas tecnologías",
    paragraphs: [
      "Las cookies son pequeños archivos que el navegador guarda para recordar información entre visitas. El local storage y el session storage son almacenes del navegador que cumplen funciones parecidas: el primero persiste entre sesiones y el segundo se borra al cerrar la pestaña.",
    ],
  },
  {
    heading: "Categorías que usa Ximo",
    paragraphs: ["Ximo usa un conjunto deliberadamente pequeño de tecnologías:"],
    list: [
      "Esenciales (cookies de sesión): mantienen tu sesión iniciada y permiten que la app funcione. Sin ellas no puedes usar tu cuenta. Las gestiona nuestro proveedor de autenticación (Supabase).",
      "Preferencias (local storage): guardan elecciones como el tema claro/oscuro en tu dispositivo. No salen de tu navegador.",
      "Seguridad: registros técnicos mínimos (por ejemplo, para proteger el inicio de sesión y prevenir abuso).",
      "Analítica: actualmente Ximo NO usa cookies de analítica ni rastreadores de publicidad de terceros. Si en el futuro se añade analítica, actualizaremos esta página y el Aviso de Privacidad antes de activarla.",
    ],
  },
  {
    heading: "Pagos",
    paragraphs: [
      "Si inicias un pago, Stripe (nuestro procesador de pagos) puede establecer sus propias cookies en sus páginas de pago, conforme a sus políticas. Ximo no almacena los datos completos de tu tarjeta.",
    ],
  },
  {
    heading: "Cómo controlarlas",
    paragraphs: [
      "Puedes borrar o bloquear cookies y almacenamiento local desde la configuración de tu navegador. Ten en cuenta que bloquear las cookies esenciales impide iniciar sesión en Ximo.",
      "Ximo no muestra un panel de preferencias de cookies porque hoy solo usamos tecnologías esenciales y de preferencias. Si añadimos categorías opcionales (por ejemplo analítica), incorporaremos un control para activarlas o rechazarlas.",
    ],
  },
  {
    heading: "Contacto",
    paragraphs: [
      "¿Dudas sobre esta página? Escríbenos a ximoacademy@gmail.com.",
    ],
  },
];

export default function CookiesPage() {
  return <LegalShell title="Cookies y tecnologías" updated={UPDATED} intro={intro} sections={sections} />;
}
