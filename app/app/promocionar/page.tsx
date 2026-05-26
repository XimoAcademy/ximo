// app/app/promocionar/page.tsx — Brand ad review + budget simulator (visual only)
import Link from "next/link";
import { Card, SectionHeader } from "../components/ui";

const steps = [
  { n: "01", title: "Envía tu anuncio",           text: "Completa el formulario con tu marca, formato y descripción del anuncio." },
  { n: "02", title: "ximo lo revisa",              text: "El equipo evalúa si es relevante, seguro y útil para atletas. 48–72 h." },
  { n: "03", title: "Configuras presupuesto",      text: "Si se aprueba, eliges duración, presupuesto y alcance estimado." },
  { n: "04", title: "Aparece en Comunidad",        text: "Como promoción filtrada dentro del feed, etiquetada como verificada." },
];

const opportunityTypes = [
  { icon: "🏷", label: "Descuentos",               text: "Precios especiales para atletas ximo." },
  { icon: "🤝", label: "Patrocinios",              text: "Apoya atletas a cambio de visibilidad." },
  { icon: "🧪", label: "Pruebas de producto",      text: "Atletas prueban y dan feedback real." },
  { icon: "💊", label: "Suplementos/recuperación", text: "Nutrición validada, sin sustancias prohibidas." },
  { icon: "🎽", label: "Equipo deportivo",         text: "Trajes, lentes, gorras, equipo técnico." },
  { icon: "🎓", label: "Becas o apoyos",           text: "Apoyos económicos para atletas en desarrollo." },
];

const categories    = ["Equipo deportivo","Suplementos y nutrición","Recuperación","Tecnología deportiva","Educación y becas","Salud y bienestar","Otro"];
const formats       = ["Foto","Video","Texto","Oferta","Producto"];
const oppTypes      = ["Descuento exclusivo","Patrocinio de atleta","Prueba de producto","Equipo gratuito","Beca o apoyo","Colaboración de contenido"];

const budgetPlans = [
  { price: "$250 MXN", days: "3 días",  reach: "500–900 atletas",     highlight: false },
  { price: "$500 MXN", days: "7 días",  reach: "1,200–2,000 atletas", highlight: true  },
  { price: "$1,000 MXN",days:"14 días", reach: "2,800–4,500 atletas", highlight: false },
];

const reviewStatuses = [
  { status: "Pendiente de revisión", icon: "⏳", color: "border-amber-500/20 bg-amber-500/6",
    text: "Tu anuncio fue recibido y está esperando revisión del equipo ximo." },
  { status: "Aprobado", icon: "✓", color: "border-emerald-500/20 bg-emerald-500/6",
    text: "Tu anuncio fue aprobado. Ahora puedes configurar presupuesto, duración y alcance." },
  { status: "No aprobado", icon: "✕", color: "border-rose-500/20 bg-rose-500/6",
    text: "Tu anuncio no fue aprobado. Intenta mandar otro anuncio alineado con atletas y la comunidad ximo." },
];

function FakeField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-[#5E7080] uppercase tracking-wider mb-1.5">{label}</label>
      <div className="w-full rounded-xl border border-[#0B1F33]/10 bg-[#F5F5F0] px-4 py-2.5 text-sm text-[#5E7080]">{placeholder}</div>
    </div>
  );
}

export default function PromocionarPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Hero */}
      <div className="rounded-2xl bg-[#0B1F33] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2F7F86]/20 text-2xl">🏷</div>
          <div>
            <h1 className="text-2xl font-black text-white sm:text-3xl">Promociona con ximo</h1>
            <p className="mt-2 text-sm text-white/45 leading-relaxed max-w-xl">
              Envía tu anuncio a revisión y conecta con atletas de forma limpia, útil y alineada al deporte.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Revisión garantizada","Sin spam","Solo marcas deportivas","Comunidad real"].map((tag) => (
                <span key={tag} className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[10px] font-bold text-white/50">✓ {tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cómo funciona */}
      <div>
        <SectionHeader title="Cómo funciona" subtitle="El proceso protege a los atletas y garantiza calidad." />
        <div className="grid gap-3 sm:grid-cols-2">
          {steps.map((s) => (
            <Card key={s.n} className="p-4 sm:p-5">
              <div className="flex gap-4">
                <span className="text-2xl font-black text-[#2F7F86]/30 leading-none mt-0.5 shrink-0">{s.n}</span>
                <div>
                  <p className="text-sm font-bold text-[#0B1F33]">{s.title}</p>
                  <p className="mt-1 text-xs text-[#5E7080] leading-relaxed">{s.text}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Tipos */}
      <div>
        <SectionHeader title="Tipos de oportunidades" subtitle="¿Qué tipo de marca o producto puedes promocionar?" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {opportunityTypes.map((t) => (
            <Card key={t.label} className="p-4 hover:shadow-[0_4px_18px_rgba(11,31,51,0.09)] transition-shadow">
              <div className="text-2xl mb-2">{t.icon}</div>
              <p className="text-sm font-bold text-[#0B1F33] mb-1">{t.label}</p>
              <p className="text-xs text-[#5E7080] leading-relaxed">{t.text}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Ad submission form — visual only */}
      <div>
        <SectionHeader title="Enviar anuncio a revisión" subtitle="Completa el formulario. El equipo ximo te responde en 48–72 horas." />
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FakeField label="Nombre de la marca"   placeholder="Tu marca…" />
            <FakeField label="Contacto"              placeholder="email@marca.com" />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-[11px] font-bold text-[#5E7080] uppercase tracking-wider mb-1.5">Categoría</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <span key={c} className="rounded-full border border-[#0B1F33]/8 bg-white px-2.5 py-1 text-[10px] font-medium text-[#5E7080] cursor-pointer hover:border-[#2F7F86]/30 hover:text-[#1F5F66] transition-colors">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Formato */}
          <div>
            <label className="block text-[11px] font-bold text-[#5E7080] uppercase tracking-wider mb-1.5">Formato del anuncio</label>
            <div className="flex flex-wrap gap-1.5">
              {formats.map((f) => (
                <span key={f} className="rounded-full border border-[#0B1F33]/8 bg-white px-2.5 py-1 text-[10px] font-medium text-[#5E7080] cursor-pointer hover:border-[#2F7F86]/30 hover:text-[#1F5F66] transition-colors">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Tipo de oportunidad */}
          <div>
            <label className="block text-[11px] font-bold text-[#5E7080] uppercase tracking-wider mb-1.5">Tipo de oportunidad</label>
            <div className="flex flex-wrap gap-1.5">
              {oppTypes.map((o) => (
                <span key={o} className="rounded-full border border-[#0B1F33]/8 bg-white px-2.5 py-1 text-[10px] font-medium text-[#5E7080] cursor-pointer hover:border-[#2F7F86]/30 hover:text-[#1F5F66] transition-colors">
                  {o}
                </span>
              ))}
            </div>
          </div>

          <FakeField label="Producto o servicio" placeholder="Nombre del producto o servicio…" />

          <div>
            <label className="block text-[11px] font-bold text-[#5E7080] uppercase tracking-wider mb-1.5">Descripción del anuncio</label>
            <div className="w-full rounded-xl border border-[#0B1F33]/10 bg-[#F5F5F0] px-4 py-3 text-sm text-[#5E7080] min-h-[80px]">
              ¿Cómo beneficia tu producto a los atletas? ¿Qué oportunidad ofreces?
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FakeField label="Link de referencia"  placeholder="https://tumarca.com" />
            <FakeField label="Público objetivo"    placeholder="Nadadores universitarios, 16–22 años…" />
          </div>

          <div className="rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/6 px-4 py-3 flex items-start gap-2.5">
            <span className="text-base mt-0.5 shrink-0">🔒</span>
            <p className="text-xs text-[#7a5f1f] leading-relaxed">
              <strong>Revisión garantizada.</strong> Todas las promociones pasan por revisión manual antes de aparecer en la comunidad. No publicamos spam ni marcas desalineadas con el deporte.
            </p>
          </div>

          <button type="button"
            className="w-full rounded-xl bg-[#0B1F33] py-3 text-sm font-bold text-white hover:bg-[#07131F] transition-colors">
            Enviar a revisión →
          </button>
        </Card>
      </div>

      {/* Estado de revisión */}
      <div>
        <SectionHeader title="Estado de revisión" subtitle="Los tres estados posibles de tu anuncio." />
        <div className="grid gap-3 sm:grid-cols-3">
          {reviewStatuses.map((r) => (
            <div key={r.status} className={`rounded-2xl border p-4 ${r.color}`}>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">{r.icon}</span>
                <p className="text-sm font-bold text-[#0B1F33]">{r.status}</p>
              </div>
              <p className="text-xs text-[#5E7080] leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Budget simulator */}
      <div>
        <SectionHeader title="Configurar presupuesto" subtitle="Solo disponible si tu anuncio fue aprobado. Estimados de referencia." />
        <div className="grid gap-3 sm:grid-cols-3 mb-4">
          {budgetPlans.map((plan) => (
            <div key={plan.price}
              className={`rounded-2xl border p-4 text-center transition-shadow cursor-default ${
                plan.highlight
                  ? "border-[#2F7F86]/35 bg-[#2F7F86]/8 shadow-[0_2px_14px_rgba(47,127,134,0.12)]"
                  : "border-[#0B1F33]/8 bg-white/95"
              }`}>
              {plan.highlight && (
                <span className="mb-2 inline-flex items-center rounded-full bg-[#2F7F86] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wide">
                  Recomendado
                </span>
              )}
              <p className="text-xl font-black text-[#0B1F33]">{plan.price}</p>
              <p className="mt-0.5 text-xs font-bold text-[#2F7F86]">{plan.days}</p>
              <p className="mt-1.5 text-[10px] text-[#5E7080] leading-relaxed">{plan.reach}</p>
              <p className="mt-1 text-[9px] text-[#5E7080] italic">alcance estimado</p>
            </div>
          ))}
        </div>

        <Card className="p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Presupuesto",      value: "$500 MXN" },
              { label: "Duración",         value: "7 días" },
              { label: "Alcance estimado", value: "1,200–2,000" },
              { label: "Tipo de campaña",  value: "Comunidad feed" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/60 p-3 text-center">
                <p className="text-base font-black text-[#0B1F33]">{item.value}</p>
                <p className="text-[10px] text-[#5E7080] mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-[#5E7080] text-center">
            Ubicación: Promociones filtradas dentro de Comunidad · Estimados de referencia
          </p>
          <button type="button"
            className="mt-3 w-full rounded-xl border border-[#0B1F33]/10 bg-[#F5F5F0] py-2.5 text-xs font-bold text-[#0B1F33] hover:bg-[#0B1F33] hover:text-white transition-colors">
            Confirmar presupuesto →
          </button>
        </Card>
      </div>

      {/* ximo review note */}
      <Card className="p-4 sm:p-5 flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B1F33] text-lg">🛡</div>
        <div>
          <p className="text-sm font-black text-[#0B1F33]">Revisión por ximo</p>
          <p className="mt-1 text-xs text-[#5E7080] leading-relaxed">
            Los anuncios llegan al equipo ximo antes de mostrarse. Revisamos que sean relevantes, seguros y útiles para atletas. No permitimos spam, marcas desalineadas, ni contenido que no aporte valor a la comunidad.
          </p>
        </div>
      </Card>

      <div className="pb-4">
        <Link href="/app/comunidad"
          className="text-xs font-semibold text-[#5E7080] hover:text-[#0B1F33] transition-colors">
          ← Volver a Comunidad
        </Link>
      </div>
    </div>
  );
}
