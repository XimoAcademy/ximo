"use client";

// app/app/promocionar/page.tsx — dark premium brand ad manager (visual only)
import Link from "next/link";
import { SectionHeader } from "../components/ui";

const steps = [
  { n:"01", title:"Envía tu anuncio",        text:"Completa el formulario con tu marca, formato y descripción del anuncio." },
  { n:"02", title:"Ximo lo revisa",            text:"El equipo evalúa si es relevante, seguro y útil para atletas. 48–72 h." },
  { n:"03", title:"Configuras presupuesto",   text:"Si se aprueba, eliges duración, presupuesto y alcance estimado." },
  { n:"04", title:"Aparece en Comunidad",     text:"Como promoción filtrada dentro del feed, etiquetada como verificada." },
];

const oppTypes = [
  { icon:"🏷", label:"Descuentos",               text:"Precios especiales para atletas Ximo." },
  { icon:"🤝", label:"Patrocinios",              text:"Apoya atletas a cambio de visibilidad." },
  { icon:"🧪", label:"Pruebas de producto",      text:"Atletas prueban y dan feedback real." },
  { icon:"💊", label:"Suplementos/recuperación", text:"Nutrición validada, sin sustancias prohibidas." },
  { icon:"🎽", label:"Equipo deportivo",         text:"Trajes, lentes, gorras, equipo técnico." },
  { icon:"🎓", label:"Becas o apoyos",           text:"Apoyos económicos para atletas en desarrollo." },
];

const cats   = ["Equipo deportivo","Suplementos y nutrición","Recuperación","Tecnología deportiva","Educación y becas","Salud y bienestar","Otro"];
const fmts   = ["Foto","Video","Texto","Oferta","Producto"];
const optypes = ["Descuento exclusivo","Patrocinio de atleta","Prueba de producto","Equipo gratuito","Beca o apoyo","Colaboración de contenido"];

const budgets = [
  { price:"$250 MXN", days:"3 días",  reach:"500–900 atletas",     hot:false },
  { price:"$500 MXN", days:"7 días",  reach:"1,200–2,000 atletas", hot:true  },
  { price:"$1,000 MXN",days:"14 días",reach:"2,800–4,500 atletas", hot:false },
];

const statuses = [
  { status:"Pendiente de revisión", icon:"⏳", bg:"rgba(251,191,36,0.08)",  border:"rgba(251,191,36,0.2)",  color:"#fbbf24", text:"Tu anuncio fue recibido y está esperando revisión del equipo Ximo." },
  { status:"Aprobado",              icon:"✓",  bg:"rgba(5,150,105,0.08)",   border:"rgba(5,150,105,0.2)",   color:"#6ee7b7", text:"Tu anuncio fue aprobado. Ahora puedes configurar presupuesto, duración y alcance." },
  { status:"No aprobado",           icon:"✕",  bg:"rgba(239,68,68,0.08)",   border:"rgba(239,68,68,0.2)",   color:"#f87171", text:"Tu anuncio no fue aprobado. Intenta mandar otro anuncio alineado con atletas y la comunidad Ximo." },
];

const CARD = { background:"var(--surface)", border:"1px solid var(--border)", boxShadow:"0 4px 24px rgba(0,0,0,0.4)" };

function FakeField({ label, placeholder, tall=false }: { label:string; placeholder:string; tall?:boolean }) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color:"var(--text-label)" }}>{label}</label>
      <div className={`w-full rounded-xl px-4 py-2.5 text-sm ${tall?"min-h-[80px]":""}`}
        style={{ background:"var(--surface-hover)", border:"1px solid var(--border)", color:"var(--text-label)" }}>
        {placeholder}
      </div>
    </div>
  );
}

function PillSelect({ options }: { options:string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(o => (
        <span key={o} className="rounded-full px-2.5 py-1 text-[10px] font-medium cursor-pointer transition-all duration-150 hover:bg-[var(--border)] hover:text-[var(--teal)]"
          style={{ background:"var(--surface-hover)", border:"1px solid var(--border)", color:"var(--text-label)" }}>
          {o}
        </span>
      ))}
    </div>
  );
}

export default function PromocionarPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 ximo-fade-up"
        style={{ background:"var(--hero-bg)", border:"1px solid var(--border-strong)", boxShadow:"0 8px 32px rgba(0,0,0,0.18)" }}>
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full blur-3xl pointer-events-none ximo-glow-pulse"
          style={{ background:"radial-gradient(circle,var(--border-strong) 0%,transparent 70%)" }} />
        <div className="relative flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl font-black ximo-float"
            style={{ background:"var(--hero-panel)", border:"1px solid var(--hero-panel-bd)", color:"var(--gold)" }}>◈</div>
          <div>
            <h1 className="text-2xl font-black sm:text-3xl" style={{ color:"var(--text)" }}>Promociona con Ximo</h1>
            <p className="mt-2 text-sm leading-relaxed max-w-lg" style={{ color:"var(--text-2)" }}>
              Envía tu anuncio a revisión y conecta con atletas de forma limpia, útil y alineada al deporte.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Revisión garantizada","Sin spam","Solo marcas deportivas","Comunidad real"].map(tag => (
                <span key={tag} className="rounded-full px-3 py-1 text-[10px] font-bold"
                  style={{ border:"1px solid var(--hero-panel-bd)", background:"var(--hero-panel)", color:"var(--text-label)" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Brand panel */}
      <div
        className="ximo-fade-up delay-100 flex items-center justify-center rounded-2xl px-6 py-10"
        style={{ background: "var(--surface-hover)", border: "1px dashed var(--border-strong)" }}
      >
        <div className="text-center">
          <p className="text-sm font-bold" style={{ color: "var(--text-label)" }}>Panel de marca</p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-label)" }}>Dashboard interactivo próximamente</p>
        </div>
      </div>

      {/* Steps */}
      <div className="ximo-fade-up delay-100">
        <SectionHeader dark title="Cómo funciona" subtitle="El proceso protege a los atletas y garantiza calidad." />
        <div className="grid gap-3 sm:grid-cols-2">
          {steps.map(s => (
            <div key={s.n} className="rounded-2xl p-4 sm:p-5 ximo-lift" style={CARD}>
              <div className="flex gap-4">
                <span className="text-2xl font-black leading-none mt-0.5 shrink-0" style={{ color:"var(--border-strong)" }}>{s.n}</span>
                <div>
                  <p className="text-sm font-bold text-brand">{s.title}</p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color:"var(--text-label)" }}>{s.text}</p>
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
              <p className="text-xs leading-relaxed" style={{ color:"var(--text-label)" }}>{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="ximo-fade-up delay-200">
        <SectionHeader dark title="Enviar anuncio a revisión" subtitle="El equipo Ximo te responde en 48–72 horas." />
        <div className="rounded-2xl p-5 sm:p-6 space-y-4" style={CARD}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FakeField label="Nombre de la marca" placeholder="Tu marca…" />
            <FakeField label="Contacto"            placeholder="email@marca.com" />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color:"var(--text-label)" }}>Categoría</label>
            <PillSelect options={cats} />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color:"var(--text-label)" }}>Formato del anuncio</label>
            <PillSelect options={fmts} />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color:"var(--text-label)" }}>Tipo de oportunidad</label>
            <PillSelect options={optypes} />
          </div>
          <FakeField label="Producto o servicio"  placeholder="Nombre del producto…" />
          <FakeField label="Descripción del anuncio" placeholder="¿Cómo beneficia tu producto a los atletas?" tall />
          <div className="grid gap-4 sm:grid-cols-2">
            <FakeField label="Link de referencia" placeholder="https://tumarca.com" />
            <FakeField label="Público objetivo"   placeholder="Nadadores 16–22 años…" />
          </div>
          <div className="rounded-xl flex items-start gap-2.5 px-4 py-3"
            style={{ border:"1px solid rgba(201,168,76,0.2)", background:"rgba(201,168,76,0.06)" }}>
            <span className="text-base mt-0.5 shrink-0">🔒</span>
            <p className="text-xs leading-relaxed" style={{ color:"rgba(201,168,76,0.7)" }}>
              <strong>Revisión garantizada.</strong> Todas las promociones pasan por revisión manual antes de aparecer en la comunidad.
            </p>
          </div>
          <button type="button"
            className="w-full rounded-xl py-3 text-sm font-bold text-on-dark transition-all duration-200 hover:scale-[1.02]"
            style={{ background:"linear-gradient(90deg,var(--teal-muted),#1F5F66)", boxShadow:"0 0 20px var(--border-strong)" }}>
            Enviar a revisión →
          </button>
        </div>
      </div>

      {/* Review statuses */}
      <div className="ximo-fade-up delay-300">
        <SectionHeader dark title="Estado de revisión" subtitle="Los tres estados posibles de tu anuncio." />
        <div className="grid gap-3 sm:grid-cols-3">
          {statuses.map(s => (
            <div key={s.status} className="rounded-2xl p-4"
              style={{ background:s.bg, border:`1px solid ${s.border}` }}>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">{s.icon}</span>
                <p className="text-sm font-bold text-brand">{s.status}</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color:`${s.color}80` }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Budget simulator */}
      <div className="ximo-fade-up delay-300">
        <SectionHeader dark title="Configurar presupuesto" subtitle="Solo disponible si tu anuncio fue aprobado. Estimados de referencia." />
        <div className="grid gap-3 sm:grid-cols-3 mb-4">
          {budgets.map(b => (
            <div key={b.price} className="rounded-2xl p-4 text-center ximo-lift"
              style={b.hot
                ? { border:"1px solid rgba(47,127,134,0.35)", background:"var(--border-subtle)", boxShadow:"0 0 24px var(--border-strong)" }
                : CARD}>
              {b.hot && <span className="mb-2 inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                style={{ background:"var(--teal-muted)", color:"white" }}>Recomendado</span>}
              <p className="text-xl font-black text-brand">{b.price}</p>
              <p className="mt-0.5 text-xs font-bold" style={{ color:"var(--teal)" }}>{b.days}</p>
              <p className="mt-1.5 text-[10px] leading-relaxed" style={{ color:"var(--text-label)" }}>{b.reach}</p>
              <p className="mt-0.5 text-[9px] italic" style={{ color:"var(--text-label)" }}>alcance estimado</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-4" style={CARD}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[{l:"Presupuesto",v:"$500 MXN"},{l:"Duración",v:"7 días"},{l:"Alcance estimado",v:"1,200–2,000"},{l:"Tipo de campaña",v:"Comunidad feed"}].map(i => (
              <div key={i.l} className="rounded-xl p-3 text-center"
                style={{ background:"var(--surface-hover)", border:"1px solid var(--border-subtle)" }}>
                <p className="text-base font-black text-brand">{i.v}</p>
                <p className="text-[10px] mt-0.5" style={{ color:"var(--text-label)" }}>{i.l}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-center" style={{ color:"var(--text-label)" }}>
            Ubicación: Promociones filtradas dentro de Comunidad · Estimados de referencia
          </p>
          <button type="button"
            className="mt-3 w-full rounded-xl py-2.5 text-xs font-bold text-brand transition-all duration-200 hover:scale-[1.01]"
            style={{ border:"1px solid var(--border-strong)", background:"var(--border-subtle)", color:"var(--teal)" }}>
            Confirmar presupuesto →
          </button>
        </div>
      </div>

      {/* Trust note */}
      <div className="rounded-2xl p-4 sm:p-5 flex items-start gap-4 ximo-fade-up delay-400" style={CARD}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
          style={{ background:"var(--border)", border:"1px solid var(--border-strong)" }}>🛡</div>
        <div>
          <p className="text-sm font-black text-brand">Revisión por Ximo</p>
          <p className="mt-1 text-xs leading-relaxed" style={{ color:"var(--text-label)" }}>
            Los anuncios llegan al equipo Ximo antes de mostrarse. Revisamos que sean relevantes, seguros y útiles para atletas. No permitimos spam ni marcas desalineadas con el deporte.
          </p>
        </div>
      </div>

      <div className="pb-4">
        <Link href="/app/comunidad"
          className="text-xs font-semibold transition-colors hover:text-[var(--teal)]" style={{ color:"var(--text-label)" }}>
          ← Volver a Comunidad
        </Link>
      </div>
    </div>
  );
}
