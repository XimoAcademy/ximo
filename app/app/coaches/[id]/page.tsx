import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassPanel, InnerTile, BackLink, StatusBadge } from "../../components/ui";
import ScrollReveal from "../../../components/ScrollReveal";
import { getCoach } from "@/lib/data/coaches";
import { getUniversityOptions } from "@/lib/data/coaches";
import EditCoachForm from "./EditCoachForm";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, "neutral" | "info" | "gold" | "success" | "error" | "warning"> = {
  "Sin contactar": "neutral",
  Contactado: "info",
  "Esperando respuesta": "warning",
  Respondió: "gold",
  "Interés alto": "success",
  "Interés confirmado": "success",
  "Llamada agendada": "info",
  Descartado: "error",
};

function fmtDate(ts: string | null): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
}

export default async function CoachDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [coach, universities] = await Promise.all([getCoach(id), getUniversityOptions()]);
  if (!coach) notFound();

  return (
    <div className="mx-auto max-w-[920px] space-y-5">
      <BackLink href="/app/coaches">Coaches</BackLink>

      <ScrollReveal>
        <GlassPanel className="p-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-black"
                style={{ background: "var(--teal-bg)", color: "var(--teal)", border: "1px solid var(--teal-border)" }}>
                {coach.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </div>
              <div>
                <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>{coach.name}</h1>
                <p className="text-sm" style={{ color: "var(--text-label)" }}>
                  {[coach.role, coach.university?.name].filter(Boolean).join(" · ") || "Sin universidad vinculada"}
                </p>
                {coach.email && (
                  <a href={`mailto:${coach.email}`} className="mt-0.5 inline-block text-xs font-semibold" style={{ color: "var(--teal)" }}>
                    {coach.email}
                  </a>
                )}
              </div>
            </div>
            {coach.status && <StatusBadge tone={STATUS_TONE[coach.status] ?? "neutral"}>{coach.status}</StatusBadge>}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <InnerTile className="px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Último contacto</p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>{fmtDate(coach.last_contact_at)}</p>
            </InnerTile>
            <InnerTile className="px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Próximo follow-up</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: "var(--teal)" }}>{fmtDate(coach.next_follow_up_at)}</p>
            </InnerTile>
            <InnerTile className="px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Teléfono</p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>{coach.phone ?? "—"}</p>
            </InnerTile>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {coach.email && <a href={`mailto:${coach.email}`} className="ximo-glass-btn teal text-xs">Escribir correo</a>}
            <Link href="/app/correos" className="ximo-glass-btn dark text-xs">Registrar correo</Link>
          </div>
        </GlassPanel>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <GlassPanel className="p-5 sm:p-6">
          <h2 className="mb-4 text-base font-black" style={{ color: "var(--text)" }}>Editar y dar seguimiento</h2>
          <EditCoachForm coach={coach} universities={universities} />
        </GlassPanel>
      </ScrollReveal>
    </div>
  );
}
