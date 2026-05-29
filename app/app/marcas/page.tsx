// Later: replace static brands with Supabase brands table
// Later: protect route with auth
import { Badge, Card, SectionHeader } from "../components/ui";

type BrandStatus = "Activa" | "Próximamente" | "Pendiente de filtro";

type Brand = {
  name: string;
  category: string;
  type: string;
  status: BrandStatus;
  description: string;
  reviewed: boolean;
  cta: string;
};

const STATUS_STYLE: Record<BrandStatus, string> = {
  Activa: "border border-[#059669]/25 bg-[#059669]/8 text-[#059669]",
  Próximamente: "border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#7a5f1f]",
  "Pendiente de filtro": "border border-[#5E7080]/20 bg-[#5E7080]/8 text-[#5E7080]",
};

const brands: Brand[] = [
  {
    name: "Speedo",
    category: "Equipo de natación",
    type: "Descuento fundador",
    status: "Activa",
    description: "Trajes, gafas y accesorios de competencia. Speedo es el equipo de referencia en natación universitaria NCAA.",
    reviewed: true,
    cta: "Ver oportunidad",
  },
  {
    name: "Arena",
    category: "Equipo de natación",
    type: "Descuento fundador",
    status: "Activa",
    description: "Alternativa premium a Speedo. Arena equipa a selecciones nacionales y nadadores de alto rendimiento en todo el mundo.",
    reviewed: true,
    cta: "Ver oportunidad",
  },
  {
    name: "Aquasport",
    category: "Tecnología deportiva",
    type: "Prueba de producto",
    status: "Activa",
    description: "Sensores de rendimiento y análisis de nado. Herramienta de datos para atletas que quieren optimizar técnica y tiempos.",
    reviewed: true,
    cta: "Ver oportunidad",
  },
  {
    name: "GNC",
    category: "Nutrición y suplementos",
    type: "Código de descuento",
    status: "Próximamente",
    description: "Proteínas, recuperación y nutrición deportiva. Solo productos con respaldo científico aptos para competencia WADA.",
    reviewed: true,
    cta: "Notificarme",
  },
  {
    name: "Recovery Partner",
    category: "Recuperación deportiva",
    type: "Patrocinio parcial",
    status: "Pendiente de filtro",
    description: "Tecnología de recuperación muscular. En proceso de revisión por el equipo ximo para validar calidad y confiabilidad.",
    reviewed: false,
    cta: "En revisión",
  },
];

const futureItems = [
  { icon: "🏷️", label: "Códigos de descuento exclusivos para atletas ximo" },
  { icon: "🤝", label: "Patrocinios parciales para atletas fundadores" },
  { icon: "📦", label: "Pruebas de producto gratis" },
  { icon: "💼", label: "Oportunidades para embajadores de marca" },
  { icon: "🎓", label: "Becas y apoyos económicos relacionados al deporte" },
];

export default function MarcasPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black tracking-tight text-[#0B1F33] sm:text-2xl">Marcas y oportunidades</h1>
        <p className="mt-1 text-sm text-[#5E7080] max-w-xl">
          Un espacio para conectar atletas con marcas alineadas al deporte, rendimiento y crecimiento.
        </p>
      </div>

      {/* Filter quality banner */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-[#0B1F33] to-[#112538] p-4 sm:p-5 flex gap-4 items-start">
          <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A84C]/20 text-xl">
            🛡️
          </div>
          <div>
            <p className="text-sm font-black text-white">Filtro de calidad ximo</p>
            <p className="mt-1 text-xs text-white/55 max-w-xl leading-relaxed">
              Toda marca o anuncio que aparezca aquí pasa por una revisión interna antes de llegar a los atletas. Protegemos la comunidad de marcas que no cumplen con estándares de calidad, confiabilidad y alineación con el deporte de alto rendimiento.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 p-4 sm:px-5">
          {[
            { icon: "✅", label: "Sin anuncios invasivos" },
            { icon: "🔬", label: "Solo productos validados" },
            { icon: "🏊", label: "Alineados al deporte" },
            { icon: "🚫", label: "Sin marcas cuestionables" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs font-semibold text-[#0B1F33]">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Brand cards */}
      <div>
        <SectionHeader
          title="Marcas curadas"
          subtitle="Seleccionadas para atletas serios"
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {brands.map((brand) => (
            <Card key={brand.name} className="flex flex-col p-4 sm:p-5 transition-all hover:-translate-y-0.5 hover:shadow-md duration-150">
              {/* Top */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B1F33]/6 text-base font-black text-[#0B1F33]">
                  {brand.name.slice(0, 2).toUpperCase()}
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${STATUS_STYLE[brand.status]}`}>
                  {brand.status}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-base font-black text-[#0B1F33]">{brand.name}</h3>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Badge className="border border-[#0B1F33]/10 bg-[#F5F5F0] text-[#5E7080]">
                    {brand.category}
                  </Badge>
                  <Badge className="border border-[#1D4ED8]/15 bg-[#1D4ED8]/8 text-[#1D4ED8]">
                    {brand.type}
                  </Badge>
                </div>
                <p className="mt-3 text-xs text-[#5E7080] leading-relaxed">{brand.description}</p>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-[#0B1F33]/6 flex items-center justify-between gap-2">
                {brand.reviewed ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#059669]">
                    <span>✓</span> Revisado por ximo
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[#5E7080]">Pendiente de filtro</span>
                )}
                <button
                  type="button"
                  disabled={brand.status === "Pendiente de filtro"}
                  className={`rounded-xl px-3 py-2 text-[11px] font-bold transition-colors ${
                    brand.status === "Pendiente de filtro"
                      ? "bg-[#0B1F33]/5 text-[#5E7080] cursor-not-allowed"
                      : brand.status === "Próximamente"
                      ? "border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#7a5f1f] hover:bg-[#C9A84C]/20"
                      : "bg-[#0B1F33] text-white hover:bg-[#112538]"
                  }`}
                >
                  {brand.cta}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Coming soon */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-[#0B1F33] via-[#112538] to-[#0A1C2E] p-5">
          <p className="text-xs font-bold tracking-widest text-[#C9A84C] uppercase mb-1">Próximamente</p>
          <p className="text-base font-black text-white">Oportunidades para atletas fundadores</p>
          <p className="mt-1.5 text-xs text-white/50 max-w-xl">
            El ecosistema de marcas ximo se expandirá. Ser fundador te da acceso prioritario.
          </p>
        </div>
        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {futureItems.map((item) => (
              <div key={item.label} className="flex items-start gap-2.5 rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/70 p-3">
                <span className="text-base shrink-0">{item.icon}</span>
                <p className="text-xs text-[#0B1F33] font-semibold leading-snug">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-[#C9A84C]/30 bg-[#C9A84C]/5 px-4 py-3 text-center">
            <p className="text-xs text-[#7a5f1f] font-semibold">
              ¿Tu marca trabaja con atletas de alto rendimiento?{" "}
              <span className="underline underline-offset-2 cursor-pointer hover:text-[#0B1F33]">
                Solicita revisión →
              </span>
            </p>
          </div>
        </div>
      </Card>

      <footer className="rounded-xl border border-dashed border-[#0B1F33]/12 bg-white/40 px-4 py-2.5 text-center text-[11px] text-[#5E7080]">
        Ximo · Solo marcas curadas · Sin publicidad invasiva
      </footer>
    </div>
  );
}
