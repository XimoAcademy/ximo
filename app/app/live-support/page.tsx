import PageHeader from "../components/PageHeader";
import { GlassPanel, EmptyState } from "../components/ui";
import { getPublishedAnnouncements } from "@/lib/data/announcements";
import { formatInZone } from "@/lib/scheduling/timezone";
import { DIRECTO_TITULO, DIRECTO_DONDE } from "@/lib/announcements/text";

export const dynamic = "force-dynamic";

export default async function LiveSupportPage() {
  const { upcoming, past } = await getPublishedAnnouncements();

  return (
    <div className="mx-auto max-w-[760px] space-y-5">
      <PageHeader
        title="Directos"
        subtitle="Sesiones en vivo con el equipo de Ximo para resolver tus dudas, dentro de la comunidad de Discord."
      />

      <div className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
          Próximos directos {upcoming.length > 0 && `(${upcoming.length})`}
        </p>

        {upcoming.length === 0 ? (
          <EmptyState
            title="No hay ningún directo programado"
            text="Cuando el equipo Ximo programe el próximo directo lo verás aquí, y te avisaremos con 24 horas, 1 hora y 10 minutos de anticipación."
          />
        ) : (
          upcoming.map((a) => (
            <GlassPanel key={a.id} tone="teal" className="p-5">
              <p className="text-base font-black" style={{ color: "var(--text)" }}>
                🔴 {DIRECTO_TITULO}
              </p>
              <p className="mt-1 text-sm font-semibold" style={{ color: "var(--teal)" }}>
                {formatInZone(a.starts_at, a.timezone)}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                {DIRECTO_DONDE}
              </p>
            </GlassPanel>
          ))
        )}
      </div>

      {past.length > 0 && (
        <div className="space-y-3">
          <p className="mt-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
            Directos anteriores
          </p>
          {past.map((a) => (
            <GlassPanel key={a.id} className="p-4">
              <p className="text-[11px]" style={{ color: "var(--text-3)" }}>
                {formatInZone(a.starts_at, a.timezone)}
              </p>
              <p className="mt-0.5 text-sm font-bold" style={{ color: "var(--text-2)" }}>
                {DIRECTO_TITULO}
              </p>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
}
