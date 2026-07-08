import Link from "next/link";
import PageHeader from "../components/PageHeader";
import { GlassPanel, InnerTile } from "../components/ui";
import { FaqItem } from "../components/interactive";
import ScrollReveal from "../../components/ScrollReveal";

const topics = [
  { title: "Cómo contactar coaches", desc: "Plantillas, timing y seguimiento que genera respuestas.", href: "/app/coaches" },
  { title: "Cómo organizar universidades", desc: "Compara opciones, beca, nivel y próximos pasos.", href: "/app/universidades" },
  { title: "Cómo funciona la suscripción", desc: "Planes, renovación y gestión de tu cuenta.", href: "/app/billing" },
  { title: "Comunidad en Discord", desc: "Únete al canal donde los atletas comparten dudas y avances.", href: "/app/comunidad" },
  { title: "Cómo subir documentos", desc: "Ten listo todo lo que un coach puede pedirte.", href: "/app/documentos" },
  { title: "Cómo registrar tu progreso", desc: "Marca tiempos y visualiza tu mejora por estilo.", href: "/app/progreso" },
];

const faqs = [
  { q: "¿Necesito pagar para usar Ximo?", a: "Por ahora no. Ximo está en fase demo y el acceso es gratuito. Si más adelante se habilita un plan de pago, te avisaremos antes y tendrás que aceptarlo de forma expresa: no se cobra nada automáticamente." },
  { q: "¿Dónde está la comunidad de Ximo?", a: "En Discord. Entra a la sección Comunidad y únete con el botón o el código QR. Discord es una plataforma externa con sus propios términos y reglas." },
  { q: "¿Cómo cambio de plan o cancelo mi suscripción?", a: "Entra a Facturación y toca \"Gestionar suscripción\" para abrir el portal seguro de pagos, donde puedes cambiar de plan, actualizar tu tarjeta o cancelar. Si cancelas, conservas el acceso hasta el final del periodo ya pagado." },
  { q: "¿Ximo es solo para nadadores?", a: "Por ahora sí. Empezamos con natación para construir la mejor experiencia posible, y ampliaremos a más deportes con el tiempo." },
  { q: "¿Cómo contacto a un coach desde Ximo?", a: "En la sección Coaches puedes ver el estado de cada relación, plantillas de correo y tu próximo follow-up sugerido. Personaliza la plantilla y envíala desde tu correo." },
  { q: "¿Cómo se desbloquean las lecciones de los cursos?", a: "Cada lección se desbloquea cuando completas la anterior. Así avanzas paso a paso sin saltarte fundamentos importantes." },
  { q: "¿Cómo cambio el tema de la app?", a: "Entra a Configuración y usa el interruptor de tema para cambiar entre modo oscuro y claro. Tu elección se guarda en este dispositivo." },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-[820px] space-y-5">
      <PageHeader title="Centro de ayuda" subtitle="Encuentra respuestas rápidas o contacta a soporte." />

      {/* Common topics */}
      <ScrollReveal>
        <div>
          <h2 className="mb-3 text-base font-black" style={{ color: "var(--text)" }}>
            Temas comunes
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {topics.map((t) => (
              <Link key={t.title} href={t.href}>
                <GlassPanel className="h-full p-4">
                  <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
                    {t.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>
                    {t.desc}
                  </p>
                  <p className="mt-2 text-xs font-semibold" style={{ color: "var(--teal)" }}>
                    Ver →
                  </p>
                </GlassPanel>
              </Link>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* FAQs */}
      <ScrollReveal delay={70}>
        <GlassPanel className="p-5">
          <h2 className="mb-4 text-base font-black" style={{ color: "var(--text)" }}>
            Preguntas frecuentes
          </h2>
          <div className="space-y-2.5">
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </GlassPanel>
      </ScrollReveal>

      {/* Contact support */}
      <ScrollReveal delay={110}>
        <GlassPanel tone="teal" className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black" style={{ color: "var(--text)" }}>
                ¿No encontraste lo que buscabas?
              </h2>
              <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
                Nuestro equipo te responde en menos de 48 horas.
              </p>
            </div>
            <a href="mailto:ximoacademy@gmail.com" className="ximo-glass-btn teal text-xs">
              Contactar soporte
            </a>
          </div>
          <InnerTile className="mt-4 px-4 py-3">
            <p className="text-[11px]" style={{ color: "var(--text-label)" }}>
              También puedes escribirnos en el Discord de la comunidad o revisar el estado de tu cuenta en{" "}
              <Link href="/app/billing" className="font-semibold" style={{ color: "var(--teal)" }}>
                Facturación
              </Link>
              .
            </p>
          </InnerTile>
        </GlassPanel>
      </ScrollReveal>
    </div>
  );
}
