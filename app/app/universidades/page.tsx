import Link from "next/link";
import PageHeader from "../components/PageHeader";
import { StatusBadge, EmptyState, StatCard } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";
import { getUniversities, type UniversityRow } from "@/lib/data/universities";
import AddUniversityForm from "./AddUniversityForm";

export const dynamic = "force-dynamic";

const STAGE_TONE: Record<string, "neutral" | "info" | "gold" | "success" | "error"> = {
  Investigando: "neutral",
  Contactado: "info",
  "En conversación": "info",
  Interesado: "gold",
  Oferta: "success",
  Comprometido: "success",
  Descartado: "error",
};
const PRIORITY_TONE: Record<string, "error" | "warning" | "info"> = {
  Alta: "error",
  Media: "warning",
  Baja: "info",
};

function UniCard({ uni }: { uni: UniversityRow }) {
  const stage = uni.recruiting_stage ?? "Investigando";
  return (
    <Link href={`/app/universidades/${uni.id}`} className="block rounded-2xl p-4 sm:p-5 ximo-card-3d"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-black" style={{ color: "var(--text)" }}>{uni.name}</h2>
            <StatusBadge tone={STAGE_TONE[stage] ?? "neutral"}>{stage}</StatusBadge>
            {uni.priority && <StatusBadge tone={PRIORITY_TONE[uni.priority] ?? "warning"}>{uni.priority}</StatusBadge>}
            {uni.fit_type && <StatusBadge tone="neutral">{uni.fit_type}</StatusBadge>}
          </div>
          <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
            {[uni.division, uni.location].filter(Boolean).join(" · ") || "Detalles por completar"}
          </p>
          {uni.scholarship_clarity && (
            <p className="mt-2 text-[12px]" style={{ color: "var(--gold)" }}>{uni.scholarship_clarity}</p>
          )}
        </div>
        <span className="shrink-0 text-xs font-semibold" style={{ color: "var(--teal)" }}>Ver →</span>
      </div>
    </Link>
  );
}

export default async function UniversidadesPage() {
  const { rows } = await getUniversities();

  const counts = {
    total: rows.length,
    active: rows.filter((u) => u.recruiting_stage && !["Investigando", "Descartado"].includes(u.recruiting_stage)).length,
    offers: rows.filter((u) => ["Oferta", "Comprometido"].includes(u.recruiting_stage ?? "")).length,
  };

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Universidades"
          subtitle="Compara opciones, claridad de beca, nivel deportivo y próximos pasos."
        />
        <AddUniversityForm />
      </div>

      {/* Directory CTA */}
      <Link href="/app/directorio" className="mb-5 block rounded-2xl p-5 ximo-card-3d"
        style={{ background: "var(--surface)", border: "1px solid var(--teal-border)" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black" style={{ color: "var(--text)" }}>Directorio NCAA D1</p>
            <p className="mt-0.5 text-xs" style={{ color: "var(--text-label)" }}>
              Explora 141 programas D1 de natación y los contactos de sus coaches. Agrega los que te interesen con un clic.
            </p>
          </div>
          <span className="text-xs font-semibold" style={{ color: "var(--teal)" }}>Abrir directorio →</span>
        </div>
      </Link>

      {rows.length === 0 ? (
        <EmptyState
          title="Aún no sigues ninguna universidad"
          text="Agrega tu primera universidad manualmente o explora el directorio NCAA D1 para encontrar programas y agregarlos a tu lista."
          action="Explorar directorio NCAA"
          actionHref="/app/directorio"
        />
      ) : (
        <>
          <div className="mb-5 grid grid-cols-3 gap-3">
            <StatCard label="En seguimiento" value={counts.total} />
            <StatCard label="Conversaciones activas" value={counts.active} accent="gold" />
            <StatCard label="Ofertas" value={counts.offers} accent="text" />
          </div>
          <div className="space-y-4">
            {rows.map((uni, i) => (
              <ScrollReveal key={uni.id} delay={i * 40}>
                <UniCard uni={uni} />
              </ScrollReveal>
            ))}
          </div>
        </>
      )}
    </>
  );
}
