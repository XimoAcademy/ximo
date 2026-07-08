// app/app/promocionar/page.tsx — advertiser submission wizard (manual review)
import Link from "next/link";
import { SectionHeader } from "../components/ui";
import BrandAdForm from "./BrandAdForm";

const steps = [
  { n: "01", title: "Envía tu solicitud",      text: "Completa el asistente con tu marca, tu archivo y los detalles de la campaña. No pagas nada en este paso." },
  { n: "02", title: "Ximo la revisa a mano",   text: "El equipo evalúa manualmente si el anuncio es relevante, seguro y útil para atletas. Tiempo estimado: 48–72 h." },
  { n: "03", title: "Si se aprueba, pagas",    text: "Recibes un correo con el resultado. Solo si tu anuncio fue aprobado podrás configurar presupuesto y pagar." },
  { n: "04", title: "Publicación controlada",  text: "Tras confirmarse el pago, el equipo Ximo publica manualmente en Marcas y oportunidades y, cuando aplica, en el canal de anuncios del Discord de Ximo." },
];

const oppTypes = [
  { icon: "🏷", label: "Descuentos",               text: "Precios especiales para atletas Ximo." },
  { icon: "🤝", label: "Patrocinios",              text: "Apoya atletas a cambio de visibilidad." },
  { icon: "🧪", label: "Pruebas de producto",      text: "Atletas prueban y dan feedback." },
  { icon: "💊", label: "Suplementos/recuperación", text: "Nutrición sin sustancias prohibidas." },
  { icon: "🎽", label: "Equipo deportivo",         text: "Trajes, lentes, gorras, equipo técnico." },
  { icon: "🎓", label: "Becas o apoyos",           text: "Apoyos económicos para atletas en desarrollo." },
];

const CARD = { background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" };

export default function PromocionarPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 ximo-fade-up"
        style={{ background: "var(--hero-bg)", border: "1px solid var(--border-strong)", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full blur-3xl pointer-events-none ximo-glow-pulse"
          style={{ background: "radial-gradient(circle,var(--border-strong) 0%,transparent 70%)" }} />
        <div className="relative flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl font-black ximo-float"
            style={{ background: "var(--hero-panel)", border: "1px solid var(--hero-panel-bd)", color: "var(--gold)" }}>◈</div>
          <div>
            <h1 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>Promociona con Ximo</h1>
            <p className="mt-2 text-sm leading-relaxed max-w-lg" style={{ color: "var(--text-2)" }}>
              Envía tu anuncio a revisión manual y conecta con atletas de forma limpia, útil y alineada al deporte.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Revisión manual", "Sin spam", "Marcas alineadas al deporte", "Sin pago antes de aprobarse"].map(tag => (
                <span key={tag} className="rounded-full px-3 py-1 text-[10px] font-bold"
                  style={{ border: "1px solid var(--hero-panel-bd)", background: "var(--hero-panel)", color: "var(--text-label)" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="ximo-fade-up delay-100">
        <SectionHeader dark title="Cómo funciona" subtitle="Revisión manual antes de cualquier pago o publicación." />
        <div className="grid gap-3 sm:grid-cols-2">
          {steps.map(s => (
            <div key={s.n} className="rounded-2xl p-4 sm:p-5 ximo-lift" style={CARD}>
              <div className="flex gap-4">
                <span className="text-2xl font-black leading-none mt-0.5 shrink-0" style={{ color: "var(--border-strong)" }}>{s.n}</span>
                <div>
                  <p className="text-sm font-bold text-brand">{s.title}</p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>{s.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opp types */}
      <div className="ximo-fade-up delay-200">
        <SectionHeader dark title="Tipos de oportunidades" subtitle="¿Qué tipo de marca puedes promocionar?" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {oppTypes.map(t => (
            <div key={t.label} className="rounded-2xl p-4 ximo-lift" style={CARD}>
              <div className="text-2xl mb-2">{t.icon}</div>
              <p className="text-sm font-bold text-brand mb-1">{t.label}</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wizard */}
      <div className="ximo-fade-up delay-200">
        <SectionHeader dark title="Enviar solicitud a revisión" subtitle="Cinco pasos. El equipo Ximo te responde por correo en 48–72 horas." />
        <div className="rounded-2xl p-5 sm:p-6" style={CARD}>
          <BrandAdForm />
        </div>
        <p className="mt-3 text-center text-xs" style={{ color: "var(--text-label)" }}>
          ¿Ya enviaste un anuncio?{" "}
          <Link href="/app/promocionar/revision" className="font-semibold underline underline-offset-2" style={{ color: "var(--teal)" }}>
            Consulta el estado de revisión →
          </Link>
        </p>
      </div>

      {/* Trust note */}
      <div className="rounded-2xl p-4 sm:p-5 flex items-start gap-4 ximo-fade-up delay-300" style={CARD}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
          style={{ background: "var(--border)", border: "1px solid var(--border-strong)" }}>🛡</div>
        <div>
          <p className="text-sm font-black text-brand">Revisión manual por Ximo</p>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>
            Los anuncios llegan al equipo Ximo antes de mostrarse. Revisamos que sean relevantes, seguros y útiles para
            atletas. No permitimos spam, contenido engañoso ni marcas desalineadas con el deporte. Ningún anuncio se
            publica automáticamente y ninguna marca paga antes de ser aprobada.
          </p>
        </div>
      </div>

      {/* Consumer-facing disclosure */}
      <div className="rounded-2xl p-4 ximo-fade-up delay-400" style={{ background: "var(--surface-hover)", border: "1px dashed var(--border-strong)" }}>
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-label)" }}>
          Los anuncios dentro de Ximo pueden ser enviados por marcas externas y revisados por Ximo antes de publicarse.
          Ximo no garantiza resultados, compras, rendimiento deportivo ni beneficios externos relacionados con dichos
          anuncios. Consulta la{" "}
          <Link href="/politica-de-anuncios" className="font-semibold underline underline-offset-2" style={{ color: "var(--teal)" }}>Política de anuncios</Link>{" "}
          y los{" "}
          <Link href="/terminos-anunciantes" className="font-semibold underline underline-offset-2" style={{ color: "var(--teal)" }}>Términos para anunciantes</Link>.
        </p>
      </div>

      <div className="pb-4">
        <Link href="/app/marcas"
          className="text-xs font-semibold transition-colors hover:text-[var(--teal)]" style={{ color: "var(--text-label)" }}>
          ← Ver Marcas y oportunidades
        </Link>
      </div>
    </div>
  );
}
