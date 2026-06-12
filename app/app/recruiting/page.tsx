import Link from "next/link";
import { Badge, SectionHeader, StatusBadge, EmptyState, GlassPanel } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";
import { getRecruitingData } from "@/lib/data/recruiting";
import { getIdentity } from "@/lib/data/identity";

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
const SCHOLAR_ORDER = ["Investigando", "Contactado", "En conversación", "Interesado", "Oferta", "Comprometido"];

function fmtDate(ts: string | null): string {
  if (!ts) return "Sin fecha";
  return new Date(ts).toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

function DarkCard({ children, className = "", glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <div className={`rounded-2xl ximo-card-3d ${className}`}
      style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: glow ? "0 0 30px var(--border),0 4px 24px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.3)" }}>
      {children}
    </div>
  );
}

export default async function RecruitingPage() {
  const [data, identity] = await Promise.all([getRecruitingData(), getIdentity()]);
  const { universities, coaches, upcomingTasks, stats } = data;

  const classBadge = [identity?.gradYear ? `Clase ${identity.gradYear}` : null, identity?.country].filter(Boolean).join(" · ") || "Tu pipeline";

  const statCards = [
    { label: "Universidades", value: stats.universities },
    { label: "Contactadas", value: stats.contacted },
    { label: "Coaches activos", value: stats.responded },
    { label: "Con interés", value: stats.interest },
    { label: "Ofertas", value: stats.offers },
  ];

  const isEmpty = universities.length === 0 && coaches.length === 0;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 ximo-fade-up"
        style={{ background: "var(--hero-bg)", border: "1px solid var(--border-strong)", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full blur-3xl pointer-events-none ximo-glow-pulse"
          style={{ background: "radial-gradient(circle,rgba(47,127,134,0.3) 0%,transparent 70%)" }} />
        <div className="relative">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge className="border" style={{ borderColor: "var(--teal-border)", background: "var(--teal-bg)", color: "var(--teal)" }}>Recruiting</Badge>
            <Badge className="border" style={{ borderColor: "var(--border)", background: "var(--surface-hover)", color: "var(--text-label)" }}>{classBadge}</Badge>
          </div>
          <h1 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>Recruiting</h1>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
            Tu proceso completo en un lugar: universidades, coaches, respuestas, becas y próximas decisiones.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {statCards.map((s) => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "var(--hero-panel)", border: "1px solid var(--hero-panel-bd)" }}>
              <p className="text-xl font-black" style={{ color: "var(--text)" }}>{s.value}</p>
              <p className="text-[10px] font-bold" style={{ color: "var(--text-label)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {isEmpty ? (
        <EmptyState
          title="Empieza tu pipeline de recruiting"
          text="Agrega universidades y coaches para ver aquí tu proceso completo: etapas, claridad de beca, comunicación y próximos pasos. Explora el directorio NCAA D1 para empezar rápido."
          action="Explorar directorio NCAA"
          actionHref="/app/directorio"
        />
      ) : (
        <>
          {/* Pipeline board */}
          <ScrollReveal delay={60}>
            <DarkCard className="p-4 sm:p-5" glow>
              <SectionHeader dark title="Pipeline de universidades" subtitle="Estado de cada programa" action="Ver universidades →" actionHref="/app/universidades" />
              {universities.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--text-label)" }}>Aún no sigues universidades. <Link href="/app/directorio" style={{ color: "var(--teal)" }}>Explora el directorio →</Link></p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {universities.map((uni) => {
                    const stage = uni.recruiting_stage ?? "Investigando";
                    return (
                      <Link key={uni.id} href={`/app/universidades/${uni.id}`} className="block rounded-xl p-3.5 ximo-lift"
                        style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-black leading-tight" style={{ color: "var(--text)" }}>{uni.name}</p>
                            <p className="mt-0.5 text-[10px]" style={{ color: "var(--text-label)" }}>{[uni.division, uni.location].filter(Boolean).join(" · ") || "—"}</p>
                          </div>
                          <StatusBadge tone={STAGE_TONE[stage] ?? "neutral"}>{stage}</StatusBadge>
                        </div>
                        {uni.scholarship_clarity && <p className="text-[11px]" style={{ color: "var(--gold)" }}>{uni.scholarship_clarity}</p>}
                        {uni.priority && <p className="mt-1 text-[10px] font-bold" style={{ color: "var(--text-label)" }}>Prioridad {uni.priority.toLowerCase()}</p>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </DarkCard>
          </ScrollReveal>

          {/* Stage distribution + coach tracker */}
          <ScrollReveal delay={60}>
            <div className="grid gap-5 lg:grid-cols-2">
              <DarkCard className="p-4 sm:p-5">
                <SectionHeader dark title="Distribución por etapa" subtitle="Cuántas universidades en cada fase" />
                <div className="space-y-2">
                  {SCHOLAR_ORDER.map((stage) => {
                    const names = universities.filter((u) => (u.recruiting_stage ?? "Investigando") === stage).map((u) => u.name);
                    if (names.length === 0) return null;
                    return (
                      <div key={stage} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ border: "1px solid var(--border-subtle)" }}>
                        <StatusBadge tone={STAGE_TONE[stage] ?? "neutral"}>{stage}</StatusBadge>
                        <p className="flex-1 truncate text-[11px]" style={{ color: "var(--text-label)" }}>{names.join(", ")}</p>
                        <span className="text-xs font-black" style={{ color: "var(--text)" }}>{names.length}</span>
                      </div>
                    );
                  })}
                </div>
              </DarkCard>

              <DarkCard className="p-4 sm:p-5">
                <SectionHeader dark title="Comunicación con coaches" subtitle="Próximos follow-ups" action="Ver coaches →" actionHref="/app/coaches" />
                {coaches.length === 0 ? (
                  <p className="text-sm" style={{ color: "var(--text-label)" }}>Aún no agregas coaches.</p>
                ) : (
                  <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                    {coaches.slice(0, 6).map((c) => (
                      <Link key={c.id} href={`/app/coaches/${c.id}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-black" style={{ background: "var(--border)", color: "var(--teal)" }}>
                          {c.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold" style={{ color: "var(--text)" }}>{c.name}</p>
                          <p className="truncate text-[11px]" style={{ color: "var(--text-label)" }}>{c.university?.name ?? "Sin vincular"}</p>
                        </div>
                        <div className="text-right">
                          {c.status && <StatusBadge tone="info">{c.status}</StatusBadge>}
                          <p className="mt-1 text-[10px]" style={{ color: "var(--text-label)" }}>{fmtDate(c.next_follow_up_at)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </DarkCard>
            </div>
          </ScrollReveal>

          {/* Next steps */}
          <DarkCard className="p-4 sm:p-5">
            <SectionHeader dark title="Próximos pasos" subtitle="Tareas de recruiting pendientes" action="Ver tareas →" actionHref="/app/tareas" />
            {upcomingTasks.length === 0 ? (
              <GlassPanel className="px-4 py-6 text-center">
                <p className="text-sm font-bold" style={{ color: "var(--text-label)" }}>Sin tareas de recruiting pendientes</p>
                <p className="mt-1 text-[11px]" style={{ color: "var(--text-3)" }}>Crea tareas para no perder ningún follow-up.</p>
              </GlassPanel>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingTasks.map((step, i) => (
                  <Link key={step.id} href={`/app/tareas/${step.id}`} className="flex gap-3 rounded-xl p-3" style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-black" style={{ background: "var(--teal-muted)", color: "white" }}>{i + 1}</span>
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold leading-snug" style={{ color: "var(--text)" }}>{step.title}</p>
                      <p className="mt-0.5 text-[10px] font-semibold" style={{ color: "var(--teal-muted)" }}>{step.due_date ? fmtDate(step.due_date) : step.module ?? "Recruiting"}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </DarkCard>
        </>
      )}
    </div>
  );
}
