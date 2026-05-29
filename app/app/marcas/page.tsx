// app/app/marcas/page.tsx
import { SectionHeader } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";

const CARD  = { background:"var(--surface)", border:"1px solid var(--border)" } as const;
const INNER = { background:"var(--surface-hover)", border:"1px solid var(--border-subtle)"  } as const;

type BrandStatus = "Activa" | "Próximamente" | "Pendiente de filtro";
type Brand = { name:string; category:string; type:string; status:BrandStatus; description:string; reviewed:boolean; cta:string; };

function statusStyle(s: BrandStatus): { background:string; color:string } {
  if (s === "Activa")              return { background:"rgba(5,150,105,0.12)",   color:"#6ee7b7" };
  if (s === "Próximamente")        return { background:"rgba(201,168,76,0.12)",  color:"var(--gold)" };
  return                                  { background:"var(--border-subtle)",   color:"var(--text-label)" };
}

const brands: Brand[] = [
  { name:"Speedo",           category:"Equipo de natación",     type:"Descuento fundador",  status:"Activa",             description:"Trajes, gafas y accesorios de competencia. El equipo de referencia en natación universitaria NCAA.",               reviewed:true,  cta:"Ver oportunidad" },
  { name:"Arena",            category:"Equipo de natación",     type:"Descuento fundador",  status:"Activa",             description:"Alternativa premium a Speedo. Arena equipa a selecciones nacionales y nadadores de alto rendimiento.",             reviewed:true,  cta:"Ver oportunidad" },
  { name:"Aquasport",        category:"Tecnología deportiva",   type:"Prueba de producto",  status:"Activa",             description:"Sensores de rendimiento y análisis de nado. Herramienta de datos para optimizar técnica y tiempos.",                reviewed:true,  cta:"Ver oportunidad" },
  { name:"GNC",              category:"Nutrición y suplementos",type:"Código de descuento", status:"Próximamente",       description:"Proteínas, recuperación y nutrición deportiva. Solo productos con respaldo científico aptos para competencia WADA.", reviewed:true,  cta:"Notificarme" },
  { name:"Recovery Partner", category:"Recuperación deportiva", type:"Patrocinio parcial",  status:"Pendiente de filtro",description:"Tecnología de recuperación muscular. En proceso de revisión por el equipo Ximo.",                                   reviewed:false, cta:"En revisión" },
];

const futureItems = [
  "Códigos de descuento exclusivos para atletas Ximo",
  "Patrocinios parciales para suscriptores activos",
  "Pruebas de producto gratuitas",
  "Oportunidades para embajadores de marca",
  "Becas y apoyos económicos relacionados al deporte",
];

export default function MarcasPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="ximo-fade-up">
        <h1 className="text-2xl font-black sm:text-3xl" style={{ color:"var(--text)" }}>Marcas y oportunidades</h1>
        <p className="mt-1 max-w-xl text-sm" style={{ color:"var(--text-label)" }}>
          Un espacio para conectar atletas con marcas alineadas al deporte, rendimiento y crecimiento.
        </p>
      </div>

      {/* Quality banner */}
      <div className="overflow-hidden rounded-2xl ximo-card-3d" style={CARD}>
        <div className="flex gap-4 items-start p-4 sm:p-5"
          style={{ background:"linear-gradient(135deg, rgba(47,127,134,0.16), rgba(17,37,56,0.9))" }}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-black"
            style={{ background:"rgba(201,168,76,0.15)", color:"var(--gold)" }}>
            ◈
          </div>
          <div>
            <p className="text-sm font-black" style={{ color:"var(--text)" }}>Filtro de calidad Ximo</p>
            <p className="mt-1 max-w-xl text-xs leading-relaxed" style={{ color:"var(--text-3)" }}>
              Toda marca o anuncio pasa por revisión interna antes de llegar a los atletas. Protegemos la comunidad de marcas que no cumplen con estándares de calidad y alineación con el deporte de alto rendimiento.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 px-4 pb-4 sm:px-5">
          {["Sin anuncios invasivos","Solo productos validados","Alineados al deporte","Sin marcas cuestionables"].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full" style={{ background:"var(--teal)" }} />
              <span className="text-xs font-semibold" style={{ color:"var(--text-label)" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Brand cards */}
      <div>
        <SectionHeader title="Marcas curadas" subtitle="Seleccionadas para atletas serios" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {brands.map((b, i) => {
            const ss = statusStyle(b.status);
            return (
              <ScrollReveal key={b.name} delay={i * 60}>
              <div className="flex flex-col rounded-2xl p-4 sm:p-5 ximo-lift h-full" style={CARD}>
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl text-base font-black"
                    style={{ background:"var(--border)", color:"var(--teal)" }}>
                    {b.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={ss}>{b.status}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-black" style={{ color:"var(--text)" }}>{b.name}</h3>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background:"var(--border-subtle)", color:"var(--text-label)" }}>{b.category}</span>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background:"rgba(30,206,206,0.1)", color:"var(--teal)" }}>{b.type}</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed" style={{ color:"var(--text-3)" }}>{b.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 border-t pt-3" style={{ borderColor:"var(--border)" }}>
                  {b.reviewed
                    ? <span className="text-[10px] font-bold" style={{ color:"#6ee7b7" }}>✓ Revisado por Ximo</span>
                    : <span className="text-[10px] font-bold" style={{ color:"var(--text-label)" }}>Pendiente de filtro</span>
                  }
                  <button
                    type="button"
                    disabled={b.status === "Pendiente de filtro"}
                    className={`ximo-glass-btn ${b.status === "Activa" ? "teal" : "gold"} text-[11px]`}
                    style={{ padding: "0.5rem 0.9rem" }}
                  >
                    {b.cta}
                  </button>
                </div>
              </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Coming soon */}
      <div className="overflow-hidden rounded-2xl" style={CARD}>
        <div className="p-5" style={{ background:"linear-gradient(135deg, var(--border), rgba(17,37,56,0.95))" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color:"var(--gold)" }}>Próximamente</p>
          <p className="mt-1 text-base font-black" style={{ color:"var(--text)" }}>Oportunidades para suscriptores activos</p>
          <p className="mt-1.5 max-w-xl text-xs" style={{ color:"var(--text-3)" }}>
            El ecosistema de marcas Ximo se expandirá. Tener una suscripción activa te da acceso prioritario.
          </p>
        </div>
        <div className="p-5">
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {futureItems.map((item) => (
              <div key={item} className="flex items-start gap-2.5 rounded-xl p-3" style={INNER}>
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full" style={{ background:"rgba(30,206,206,0.6)" }} />
                <p className="text-xs font-semibold leading-snug" style={{ color:"var(--text-2)" }}>{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl px-4 py-3 text-center" style={{ background:"rgba(201,168,76,0.06)", border:"1px dashed rgba(201,168,76,0.2)" }}>
            <p className="text-xs font-semibold" style={{ color:"rgba(201,168,76,0.7)" }}>
              ¿Tu marca trabaja con atletas de alto rendimiento?{" "}
              <span className="cursor-pointer underline underline-offset-2 transition-opacity hover:opacity-70">Solicita revisión →</span>
            </p>
          </div>
        </div>
      </div>

      <footer className="rounded-xl px-4 py-2.5 text-center text-[11px]" style={{ border:"1px dashed var(--border)", color:"rgba(127,175,178,0.25)" }}>
        Ximo · Solo marcas curadas · Sin publicidad invasiva
      </footer>
    </div>
  );
}

