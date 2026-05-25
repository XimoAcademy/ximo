// app/app/promocionar/page.tsx
// Visual-only brand promotion application page — no real form logic

import Link from "next/link";
import { Card, SectionHeader } from "../components/ui";

const steps = [
  {
    n: "01",
    title: "La marca solicita promoción",
    text: "Rellena el formulario con información de tu marca, producto y tipo de oportunidad.",
  },
  {
    n: "02",
    title: "ximo revisa si es útil para atletas",
    text: "Nuestro equipo evalúa si la marca está alineada con el deporte, la salud y los valores de la comunidad.",
  },
  {
    n: "03",
    title: "Si se aprueba, aparece como promoción filtrada",
    text: "Tu marca aparece dentro del feed de Comunidad como una tarjeta verificada y curada.",
  },
  {
    n: "04",
    title: "Los atletas descubren tu oportunidad",
    text: "Sin salir del ecosistema ximo. Sin spam. Sin publicidad invasiva.",
  },
];

const opportunityTypes = [
  { icon: "🏷", label: "Descuentos", text: "Precios especiales exclusivos para atletas ximo." },
  { icon: "🤝", label: "Patrocinios", text: "Apoya a atletas prometedores a cambio de visibilidad." },
  { icon: "🧪", label: "Pruebas de producto", text: "Atletas prueban tu producto y te dan feedback real." },
  { icon: "💊", label: "Suplementos y recuperación", text: "Nutrición deportiva validada, sin sustancias prohibidas." },
  { icon: "🎽", label: "Equipo deportivo", text: "Trajes, lentes, gorras, equipo técnico de alto rendimiento." },
  { icon: "🎓", label: "Becas o apoyos", text: "Apoyos económicos o materiales para atletas en desarrollo." },
];

const categories = [
  "Equipo deportivo",
  "Suplementos y nutrición",
  "Recuperación",
  "Tecnología deportiva",
  "Educación y becas",
  "Salud y bienestar",
  "Otro",
];

const opportunityOptions = [
  "Descuento exclusivo",
  "Patrocinio de atleta",
  "Prueba de producto",
  "Equipo gratuito",
  "Beca o apoyo económico",
  "Colaboración de contenido",
];

export default function PromocionarPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0B1F33] to-[#1D4ED8] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C9A84C]/20 text-2xl">
            🏷
          </div>
          <div>
            <h1 className="text-2xl font-black text-white sm:text-3xl">
              Promociona con ximo
            </h1>
            <p className="mt-2 text-sm text-white/55 leading-relaxed max-w-xl">
              Un espacio curado para marcas que quieren conectar con atletas de
              forma limpia, útil y alineada al deporte.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Revisado por ximo", "Sin spam", "Solo marcas deportivas", "Comunidad real"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[10px] font-bold text-white/60"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cómo funciona */}
      <div>
        <SectionHeader
          title="Cómo funciona"
          subtitle="El proceso de revisión protege a los atletas y garantiza calidad."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {steps.map((step) => (
            <Card key={step.n} className="p-4 sm:p-5">
              <div className="flex gap-4">
                <span className="text-2xl font-black text-[#C9A84C]/40 leading-none mt-0.5">
                  {step.n}
                </span>
                <div>
                  <p className="text-sm font-bold text-[#0B1F33] leading-snug">{step.title}</p>
                  <p className="mt-1 text-xs text-[#5E7080] leading-relaxed">{step.text}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Tipos de oportunidades */}
      <div>
        <SectionHeader
          title="Tipos de oportunidades"
          subtitle="¿Qué tipo de marca o producto puedes promocionar?"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {opportunityTypes.map((type) => (
            <Card
              key={type.label}
              className="p-4 hover:shadow-[0_4px_20px_rgba(11,31,51,0.10)] transition-shadow cursor-default"
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <p className="text-sm font-bold text-[#0B1F33] mb-1">{type.label}</p>
              <p className="text-xs text-[#5E7080] leading-relaxed">{type.text}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Application form — visual only */}
      <div>
        <SectionHeader
          title="Solicitar revisión"
          subtitle="Completa el formulario y nuestro equipo te responde en 48–72 horas."
        />
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold text-[#5E7080] uppercase tracking-wider mb-1.5">
                Nombre de la marca
              </label>
              <div className="w-full rounded-xl border border-[#0B1F33]/12 bg-[#F5F5F0] px-4 py-2.5 text-sm text-[#5E7080]">
                Tu marca…
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#5E7080] uppercase tracking-wider mb-1.5">
                Contacto
              </label>
              <div className="w-full rounded-xl border border-[#0B1F33]/12 bg-[#F5F5F0] px-4 py-2.5 text-sm text-[#5E7080]">
                email@marca.com
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold text-[#5E7080] uppercase tracking-wider mb-1.5">
                Categoría
              </label>
              <div className="w-full rounded-xl border border-[#0B1F33]/12 bg-[#F5F5F0] px-4 py-2.5 text-sm text-[#5E7080] flex items-center justify-between mb-1.5">
                <span>Selecciona…</span><span className="text-[10px]">˅</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {categories.map((c) => (
                  <span key={c} className="rounded-full border border-[#0B1F33]/8 bg-white px-2 py-0.5 text-[10px] font-medium text-[#5E7080] cursor-pointer hover:border-[#0B1F33]/20 transition-colors">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#5E7080] uppercase tracking-wider mb-1.5">
                Tipo de oportunidad
              </label>
              <div className="w-full rounded-xl border border-[#0B1F33]/12 bg-[#F5F5F0] px-4 py-2.5 text-sm text-[#5E7080] flex items-center justify-between mb-1.5">
                <span>Selecciona…</span><span className="text-[10px]">˅</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {opportunityOptions.map((o) => (
                  <span key={o} className="rounded-full border border-[#0B1F33]/8 bg-white px-2 py-0.5 text-[10px] font-medium text-[#5E7080] cursor-pointer hover:border-[#0B1F33]/20 transition-colors">
                    {o}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5E7080] uppercase tracking-wider mb-1.5">
              Producto o servicio
            </label>
            <div className="w-full rounded-xl border border-[#0B1F33]/12 bg-[#F5F5F0] px-4 py-2.5 text-sm text-[#5E7080]">
              Nombre del producto o servicio…
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5E7080] uppercase tracking-wider mb-1.5">
              Descripción
            </label>
            <div className="w-full rounded-xl border border-[#0B1F33]/12 bg-[#F5F5F0] px-4 py-3 text-sm text-[#5E7080] min-h-[80px]">
              ¿Cómo beneficia tu producto o marca a los atletas? ¿Qué tipo de oportunidad ofreces?
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5E7080] uppercase tracking-wider mb-1.5">
              Link de marca
            </label>
            <div className="w-full rounded-xl border border-[#0B1F33]/12 bg-[#F5F5F0] px-4 py-2.5 text-sm text-[#5E7080]">
              https://tumarca.com
            </div>
          </div>

          {/* Trust note */}
          <div className="rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/6 px-4 py-3 flex items-start gap-2.5">
            <span className="text-base mt-0.5">🔒</span>
            <p className="text-xs text-[#7a5f1f] leading-relaxed">
              <strong>Revisión garantizada.</strong> Todas las promociones pasan por revisión manual antes de aparecer en la comunidad. No publicamos spam ni marcas desalineadas con el deporte.
            </p>
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-[#0B1F33] py-3 text-sm font-bold text-white hover:bg-[#112538] transition-colors"
          >
            Solicitar revisión →
          </button>
        </Card>
      </div>

      <div className="pb-4">
        <Link
          href="/app/comunidad"
          className="text-xs font-semibold text-[#5E7080] hover:text-[#0B1F33] transition-colors"
        >
          ← Volver a Comunidad
        </Link>
      </div>
    </div>
  );
}
