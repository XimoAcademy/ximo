// app/app/marcas/page.tsx — real brand opportunities (admin-approved)
import Link from "next/link";
import { SectionHeader } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";
import { getApprovedBrandAds, formatLabel, type BrandAd } from "@/lib/data/brands";

export const dynamic = "force-dynamic";

const CARD = { background: "var(--surface)", border: "1px solid var(--border)" } as const;
const INNER = { background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" } as const;

const futureItems = [
  "Códigos de descuento exclusivos para atletas Ximo",
  "Patrocinios parciales para suscriptores activos",
  "Pruebas de producto gratuitas",
  "Oportunidades para embajadores de marca",
  "Becas y apoyos económicos relacionados al deporte",
];

function BrandCard({ b }: { b: BrandAd }) {
  return (
    <div className="flex h-full flex-col rounded-2xl p-4 sm:p-5 ximo-lift" style={CARD}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl text-base font-black" style={{ background: "var(--border)", color: "var(--teal)" }}>
          {b.brandName.slice(0, 2).toUpperCase()}
        </div>
        <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ background: "rgba(5,150,105,0.12)", color: "#6ee7b7" }}>Activa</span>
      </div>
      <div className="flex-1">
        <h3 className="text-base font-black" style={{ color: "var(--text)" }}>{b.brandName}</h3>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {b.category && <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "var(--border-subtle)", color: "var(--text-label)" }}>{b.category}</span>}
          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(30,206,206,0.1)", color: "var(--teal)" }}>{formatLabel(b.format)}</span>
        </div>
        {b.title && <p className="mt-3 text-sm font-bold" style={{ color: "var(--text)" }}>{b.title}</p>}
        {b.body && <p className="mt-1.5 whitespace-pre-wrap text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>{b.body}</p>}
        {b.target_audience && <p className="mt-2 text-[11px]" style={{ color: "var(--text-label)" }}>Para: {b.target_audience}</p>}
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 border-t pt-3" style={{ borderColor: "var(--border)" }}>
        <span className="text-[10px] font-bold" style={{ color: "#6ee7b7" }}>✓ Revisado por Ximo</span>
        {b.media_url && (
          <a href={b.media_url} target="_blank" rel="noopener noreferrer" className="ximo-glass-btn teal text-[11px]" style={{ padding: "0.5rem 0.9rem" }}>
            Ver oportunidad ↗
          </a>
        )}
      </div>
    </div>
  );
}

export default async function MarcasPage() {
  const brands = await getApprovedBrandAds();

  return (
    <div className="space-y-5">
      <div className="ximo-fade-up">
        <h1 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>Marcas y oportunidades</h1>
        <p className="mt-1 max-w-xl text-sm" style={{ color: "var(--text-label)" }}>
          Un espacio para conectar atletas con marcas alineadas al deporte, rendimiento y crecimiento.
        </p>
      </div>

      {/* Quality banner */}
      <div className="overflow-hidden rounded-2xl ximo-card-3d" style={CARD}>
        <div className="flex items-start gap-4 p-4 sm:p-5" style={{ background: "linear-gradient(135deg, rgba(47,127,134,0.16), rgba(17,37,56,0.9))" }}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-black" style={{ background: "rgba(201,168,76,0.15)", color: "var(--gold)" }}>◈</div>
          <div>
            <p className="text-sm font-black" style={{ color: "var(--text)" }}>Filtro de calidad Ximo</p>
            <p className="mt-1 max-w-xl text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
              Toda marca o anuncio pasa por revisión interna antes de llegar a los atletas. Protegemos la comunidad de
              marcas que no cumplen con estándares de calidad y alineación con el deporte de alto rendimiento.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 px-4 pb-4 sm:px-5">
          {["Sin anuncios invasivos", "Solo productos validados", "Alineados al deporte", "Sin marcas cuestionables"].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full" style={{ background: "var(--teal)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--text-label)" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Brand cards (real, approved) */}
      <div>
        <SectionHeader title="Marcas curadas" subtitle="Seleccionadas para atletas serios" />
        {brands.length === 0 ? (
          <div className="rounded-2xl px-6 py-10 text-center" style={CARD}>
            <p className="text-sm font-black" style={{ color: "var(--text)" }}>Aún no hay marcas activas</p>
            <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>
              Estamos curando marcas alineadas al deporte de alto rendimiento. Las oportunidades aprobadas por el equipo
              Ximo aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {brands.map((b, i) => (
              <ScrollReveal key={b.id} delay={i * 60}>
                <BrandCard b={b} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>

      {/* Coming soon */}
      <div className="overflow-hidden rounded-2xl" style={CARD}>
        <div className="p-5" style={{ background: "linear-gradient(135deg, var(--border), rgba(17,37,56,0.95))" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--gold)" }}>El ecosistema crece</p>
          <p className="mt-1 text-base font-black" style={{ color: "var(--text)" }}>Oportunidades para suscriptores activos</p>
          <p className="mt-1.5 max-w-xl text-xs" style={{ color: "var(--text-3)" }}>
            Tener una suscripción activa te da acceso prioritario a nuevas marcas y oportunidades.
          </p>
        </div>
        <div className="p-5">
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {futureItems.map((item) => (
              <div key={item} className="flex items-start gap-2.5 rounded-xl p-3" style={INNER}>
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full" style={{ background: "rgba(30,206,206,0.6)" }} />
                <p className="text-xs font-semibold leading-snug" style={{ color: "var(--text-2)" }}>{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl px-4 py-3 text-center" style={{ background: "rgba(201,168,76,0.06)", border: "1px dashed rgba(201,168,76,0.2)" }}>
            <p className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>
              ¿Tu marca trabaja con atletas de alto rendimiento?{" "}
              <Link href="/app/promocionar" className="font-bold underline underline-offset-2" style={{ color: "var(--gold)" }}>Solicita revisión →</Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="rounded-xl px-4 py-2.5 text-center text-[11px]" style={{ border: "1px dashed var(--border)", color: "var(--text-3)" }}>
        Ximo · Solo marcas curadas · Sin publicidad invasiva
      </footer>
    </div>
  );
}
