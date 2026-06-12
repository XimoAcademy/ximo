import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassPanel, InnerTile, BackLink, StatusBadge } from "../../components/ui";
import ScrollReveal from "../../../components/ScrollReveal";
import { getUniversity } from "@/lib/data/universities";
import EditUniversityForm from "./EditUniversityForm";

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

export default async function UniversidadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getUniversity(id);
  if (!detail) notFound();
  const { university: uni, coaches, emails } = detail;
  const stage = uni.recruiting_stage ?? "Investigando";

  return (
    <div className="mx-auto max-w-[920px] space-y-5">
      <BackLink href="/app/universidades">Universidades</BackLink>

      <ScrollReveal>
        <GlassPanel className="p-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone={STAGE_TONE[stage] ?? "neutral"}>{stage}</StatusBadge>
                {uni.division && <StatusBadge tone="neutral">{uni.division}</StatusBadge>}
                {uni.priority && <StatusBadge tone="gold">Prioridad {uni.priority.toLowerCase()}</StatusBadge>}
              </div>
              <h1 className="mt-3 text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>{uni.name}</h1>
              <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
                {[uni.division, uni.location].filter(Boolean).join(" · ") || "Completa los detalles abajo"}
              </p>
            </div>
            {uni.website && (
              <a href={uni.website} target="_blank" rel="noopener noreferrer" className="ximo-glass-btn dark text-xs">
                Sitio oficial ↗
              </a>
            )}
          </div>
        </GlassPanel>
      </ScrollReveal>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Related coaches */}
        <ScrollReveal delay={60}>
          <GlassPanel className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black" style={{ color: "var(--text)" }}>Coaches</h2>
              <Link href="/app/coaches" className="text-xs font-semibold" style={{ color: "var(--teal)" }}>Ver todos →</Link>
            </div>
            {coaches.length === 0 ? (
              <InnerTile className="px-4 py-6 text-center">
                <p className="text-sm font-bold" style={{ color: "var(--text-label)" }}>Sin coaches vinculados</p>
                <p className="mt-1 text-[11px]" style={{ color: "var(--text-3)" }}>Agrega coaches de este programa desde la sección Coaches.</p>
              </InnerTile>
            ) : (
              <div className="space-y-2.5">
                {coaches.map((c) => (
                  <Link key={c.id} href={`/app/coaches/${c.id}`}>
                    <InnerTile className="flex items-center justify-between px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{c.name}</p>
                        {c.role && <p className="text-[11px]" style={{ color: "var(--text-label)" }}>{c.role}</p>}
                      </div>
                      {c.status && <StatusBadge tone="info">{c.status}</StatusBadge>}
                    </InnerTile>
                  </Link>
                ))}
              </div>
            )}
          </GlassPanel>
        </ScrollReveal>

        {/* Recent emails */}
        <ScrollReveal delay={90}>
          <GlassPanel className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black" style={{ color: "var(--text)" }}>Correos</h2>
              <Link href="/app/correos" className="text-xs font-semibold" style={{ color: "var(--teal)" }}>Ver todos →</Link>
            </div>
            {emails.length === 0 ? (
              <InnerTile className="px-4 py-6 text-center">
                <p className="text-sm font-bold" style={{ color: "var(--text-label)" }}>Sin correos registrados</p>
                <p className="mt-1 text-[11px]" style={{ color: "var(--text-3)" }}>Registra tus correos a este programa desde la sección Correos.</p>
              </InnerTile>
            ) : (
              <div className="space-y-2.5">
                {emails.map((e) => (
                  <InnerTile key={e.id} className="flex items-center justify-between px-4 py-3">
                    <p className="min-w-0 truncate text-sm font-semibold" style={{ color: "var(--text)" }}>{e.subject || "(Sin asunto)"}</p>
                    {e.status && <StatusBadge tone="neutral">{e.status}</StatusBadge>}
                  </InnerTile>
                ))}
              </div>
            )}
          </GlassPanel>
        </ScrollReveal>
      </div>

      {/* Edit */}
      <ScrollReveal delay={120}>
        <GlassPanel className="p-5 sm:p-6">
          <h2 className="mb-4 text-base font-black" style={{ color: "var(--text)" }}>Detalles y seguimiento</h2>
          <EditUniversityForm uni={uni} />
        </GlassPanel>
      </ScrollReveal>
    </div>
  );
}
