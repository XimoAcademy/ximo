// app/app/promocionar/page.tsx
// Brand ad submission + review + budget setup mockup — static/visual only

import Link from "next/link";
import { Card, SectionHeader } from "../components/ui";

const steps = [
  { n: "01", title: "Envía tu anuncio", text: "Completa el formulario con info de tu marca, tipo de anuncio y formato." },
  { n: "02", title: "ximo lo revisa", text: "El equipo ximo evalúa si el anuncio es relevante, seguro y útil para atletas." },
  { n: "03", title: "Si se aprueba, configuras presupuesto", text: "Elige duración, presupuesto y alcance estimado. Como Facebook Ads, pero para atletas." },
  { n: "04", title: "Aparece en Comunidad como promoción filtrada", text: "Tu anuncio se muestra dentro del feed de Comunidad como tarjeta revisada y curada." },
];

const adFormats = ["Foto", "Video", "Texto", "Oferta", "Producto"];

const categories = [
  "Equipo deportivo",
  "Suplementos y nutrición",
  "Recuperación",
  "Tecnología deportiva",
  "Educación y becas",
  "Salud y bienestar",
  "Otro",
];

const adTypes = [
  "Descuento exclusivo",
  "Patrocinio de atleta",
  "Prueba de producto",
  "Equipo gratuito",
  "Beca o apoyo económico",
  "Colaboración de contenido",
  "Campaña de marca",
];

const audiences = [
  "Nadadores",
  "Atletas 2025–2028",
  "Todos los deportes",
  "Atletas en proceso NCAA",
  "Padres de atletas",
];

const statusCards = [
  {
    status: "Pendiente de revisión",
    color: "border-amber-400/30 bg-amber-400/6",
    dot: "bg-amber-400",
    badge: "text-amber-700 bg-amber-400/12 border-amber-400/25",
    text: "Tu anuncio fue recibido y está esperando revisión del equipo ximo.",
    brand: "Nike Training MX",
    format: "Foto",
  },
  {
    status: "Aprobado",
    color: "border-[#059669]/30 bg-[#059669]/5",
    dot: "bg-[#059669]",
    badge: "text-[#059669] bg-[#059669]/10 border-[#059669]/25",
    text: "Tu anuncio fue aprobado. Ahora puedes configurar presupuesto, duración y alcance.",
    brand: "Aquasport MX",
    format: "Oferta",
    showBudget: true,
  },
  {
    status: "No aprobado",
    color: "border-red-400/25 bg-red-400/4",
    dot: "bg-red-400",
    badge: "text-red-600 bg-red-400/10 border-red-400/25",
    text: "Tu anuncio no fue aprobado. Intenta mandar otro anuncio alineado con atletas y la comunidad ximo.",
    brand: "MarcaEjemplo",
    format: "Video",
  },
];

const budgetOptions = [
  { amount: "$250 MXN", days: "3 días", reach: "500–900 atletas", active: false },
  { amount: "$500 MXN", days: "7 días", reach: "1,200–2,000 atletas", active: true },
  { amount: "$1,000 MXN", days: "14 días", reach: "2,800–4,500 atletas", active: false },
];

export default function PromocionarPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0B1F33] to-[#1D4ED8] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C9A84C]/20 text-2xl">
            ◈
          </div>
          <div>
            <h1 className="text-2xl font-black text-white sm:text-3xl">
              Promociona con ximo
            </h1>
            <p className="mt-2 text-sm text-white/60 leading-relaxed max-w-xl">
              Envía tu anuncio a revisión y conecta con atletas de forma limpia, útil y alineada al deporte.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Solo anuncios aprobados", "Revisado por humanos", "Protegemos a los atletas", "Sin spam"].map((tag) => (
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

      {/* Ad submission form — visual only */}
      <div>
        <SectionHeader
          title="Enviar anuncio a revisión"
          subtitle="Completa el formulario. Nuestro equipo responde en 48–72 horas."
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
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <span key={c} className="rounded-full border border-[#0B1F33]/10 bg-white px-2.5 py-1 text-[10px] font-semibold text-[#5E7080] cursor-pointer hover:border-[#C9A84C]/40 hover:text-[#0B1F33] transition-colors">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#5E7080] uppercase tracking-wider mb-1.5">
                Tipo de anuncio
              </label>
              <div className="flex flex-wrap gap-1.5">
                {adTypes.map((t) => (
                  <span key={t} className="rounded-full border border-[#0B1F33]/10 bg-white px-2.5 py-1 text-[10px] font-semibold text-[#5E7080] cursor-pointer hover:border-[#C9A84C]/40 hover:text-[#0B1F33] transition-colors">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5E7080] uppercase tracking-wider mb-1.5">
              Formato del anuncio
            </label>
            <div className="flex flex-wrap gap-2">
              {adFormats.map((f) => (
                <span key={f} className={`rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer transition-colors ${f === "Foto" ? "border-[#C9A84C]/40 bg-[#C9A84C]/8 text-[#7a5f1f]" : "border-[#0B1F33]/10 bg-white text-[#5E7080] hover:border-[#0B1F33]/20"}`}>
                  {f}
                </span>
              ))}
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
              Descripción del anuncio
            </label>
            <div className="w-full rounded-xl border border-[#0B1F33]/12 bg-[#F5F5F0] px-4 py-3 text-sm text-[#5E7080] min-h-[80px]">
              ¿Qué ofreces y cómo beneficia a los atletas? ¿Por qué encaja con la comunidad ximo?
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold text-[#5E7080] uppercase tracking-wider mb-1.5">
                Link de referencia
              </label>
              <div className="w-full rounded-xl border border-[#0B1F33]/12 bg-[#F5F5F0] px-4 py-2.5 text-sm text-[#5E7080]">
                https://tumarca.com
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#5E7080] uppercase tracking-wider mb-1.5">
                Público objetivo
              </label>
              <div className="flex flex-wrap gap-1.5">
                {audiences.map((a) => (
                  <span key={a} className="rounded-full border border-[#0B1F33]/10 bg-white px-2.5 py-1 text-[10px] font-semibold text-[#5E7080] cursor-pointer hover:border-[#C9A84C]/40 hover:text-[#0B1F33] transition-colors">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Trust note */}
          <div className="rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/6 px-4 py-3 flex items-start gap-2.5">
            <span className="text-base mt-0.5">🔒</span>
            <p className="text-xs text-[#7a5f1f] leading-relaxed">
              <strong>Revisión garantizada.</strong> Todos los anuncios pasan por revisión manual antes de aparecer en Comunidad. No publicamos spam ni marcas desalineadas con el deporte.
            </p>
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-[#0B1F33] py-3 text-sm font-bold text-white hover:bg-[#112538] transition-colors"
          >
            Enviar a revisión →
          </button>
        </Card>
      </div>

      {/* Estado de revisión */}
      <div>
        <SectionHeader
          title="Estado de revisión"
          subtitle="Así se ve el proceso después de enviar tu anuncio."
        />
        <div className="space-y-3">
          {statusCards.map((card) => (
            <Card key={card.status} className={`p-4 sm:p-5 border ${card.color}`}>
              <div className="flex items-start gap-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${card.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-[#0B1F33]">{card.brand}</p>
                    <span className="text-[10px] text-[#5E7080]">· {card.format}</span>
                    <span className={`ml-auto rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${card.badge}`}>
                      {card.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#5E7080] leading-relaxed">{card.text}</p>
                  {card.showBudget && (
                    <button
                      type="button"
                      className="mt-3 rounded-xl border border-[#059669]/25 bg-[#059669]/8 px-4 py-1.5 text-[11px] font-bold text-[#059669] hover:bg-[#059669]/15 transition-colors"
                    >
                      Configurar presupuesto →
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Budget simulator */}
      <div>
        <SectionHeader
          title="Configurar presupuesto"
          subtitle="Estimaciones visuales. Precios y alcances son aproximados."
        />

        {/* Active plan */}
        <Card className="p-5 sm:p-6 mb-4 border border-[#059669]/25 bg-[#059669]/4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold text-[#059669] uppercase tracking-wider">Plan seleccionado</span>
            <span className="rounded-full bg-[#059669]/12 border border-[#059669]/25 px-2 py-0.5 text-[10px] font-bold text-[#059669]">Recomendado</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Presupuesto", value: "$500 MXN" },
              { label: "Duración", value: "7 días" },
              { label: "Alcance estimado", value: "1,200–2,000 atletas" },
              { label: "Tipo de campaña", value: "Comunidad feed" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-white/80 border border-[#0B1F33]/8 px-4 py-3">
                <p className="text-[10px] font-bold text-[#5E7080] uppercase tracking-wider mb-1">{label}</p>
                <p className="text-base font-black text-[#0B1F33]">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-white/60 border border-[#0B1F33]/8 px-4 py-3 flex items-center gap-2">
            <span className="text-sm">📍</span>
            <div>
              <p className="text-[11px] font-bold text-[#0B1F33]">Ubicación</p>
              <p className="text-[11px] text-[#5E7080]">Promociones filtradas dentro de Comunidad</p>
            </div>
          </div>
        </Card>

        {/* Plan cards */}
        <div className="grid gap-3 sm:grid-cols-3">
          {budgetOptions.map((opt) => (
            <Card
              key={opt.amount}
              className={`p-4 cursor-pointer transition-all ${opt.active ? "border-[#C9A84C]/40 bg-[#C9A84C]/4" : "hover:border-[#0B1F33]/20"}`}
            >
              <p className="text-lg font-black text-[#0B1F33] mb-1">{opt.amount}</p>
              <p className="text-xs font-semibold text-[#5E7080] mb-0.5">{opt.days}</p>
              <p className="text-[11px] text-[#5E7080]">{opt.reach}</p>
              {opt.active && (
                <span className="mt-2 inline-block rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 px-2 py-0.5 text-[9px] font-bold text-[#7a5f1f]">
                  Activo
                </span>
              )}
            </Card>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-[#5E7080] text-center">
          * Estimaciones visuales. Los precios y alcances reales pueden variar al activar campañas.
        </p>
      </div>

      {/* Revisión por ximo */}
      <Card className="p-5 sm:p-6">
        <div className="flex gap-4 items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B1F33]/8 text-lg">
            🔍
          </div>
          <div>
            <p className="text-sm font-bold text-[#0B1F33] mb-1">Revisión por ximo</p>
            <p className="text-xs text-[#5E7080] leading-relaxed">
              Los anuncios llegan al equipo ximo antes de mostrarse. Revisamos que sean relevantes, seguros y útiles para atletas. Solo aprobamos marcas que genuinamente benefician a la comunidad.
            </p>
          </div>
        </div>
      </Card>

      {/* CTA */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0B1F33] to-[#0A1C2E] p-6 text-center">
        <p className="text-base font-black text-white mb-2">¿Listo para conectar con atletas?</p>
        <p className="text-xs text-white/45 mb-5">Tu anuncio pasa por revisión antes de aparecer en la comunidad.</p>
        <button
          type="button"
          className="rounded-xl bg-[#C9A84C] px-8 py-3 text-sm font-bold text-[#0B1F33] hover:bg-[#e8c76a] transition-colors"
        >
          Enviar anuncio a revisión →
        </button>
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
