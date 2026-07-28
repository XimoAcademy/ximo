import PageHeader from "../components/PageHeader";
import { GlassPanel, EmptyState } from "../components/ui";
import { getPublishedAnnouncements } from "@/lib/data/announcements";
import { formatInZone } from "@/lib/scheduling/timezone";

export const dynamic = "force-dynamic";

export default async function LiveSupportPage() {
  const { upcoming, past } = await getPublishedAnnouncements();

  return (
    <div className="mx-auto max-w-[760px] space-y-5">
      <PageHeader
        title="Soporte en vivo"
        subtitle="Sesiones en vivo por Discord con el equipo de Ximo — resuelve tus dudas en tiempo real."
      />

      <div className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
          Próximas sesiones {upcoming.length > 0 && `(${upcoming.length})`}
        </p>

        {upcoming.length === 0 ? (
          <EmptyState
            title="No hay sesiones programadas"
            text="Cuando el equipo Ximo programe una nueva sesión de soporte en vivo, la verás aquí y recibirás una notificación."
          />
        ) : (
          upcoming.map((a) => (
            <GlassPanel key={a.id} tone="teal" className="p-5">
              <p className="text-xs font-semibold" style={{ color: "var(--teal)" }}>
                {formatInZone(a.starts_at, a.timezone)}
              </p>
              <p className="mt-1 text-base font-black" style={{ color: "var(--text)" }}>
                {a.title}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                {a.description}
              </p>
              <a href={a.discord_link} target="_blank" rel="noopener noreferrer" className="ximo-glass-btn teal mt-4 inline-block text-xs">
                Unirse por Discord
              </a>
            </GlassPanel>
          ))
        )}
      </div>

      {past.length > 0 && (
        <div className="space-y-3">
          <p className="mt-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
            Sesiones anteriores
          </p>
          {past.map((a) => (
            <GlassPanel key={a.id} className="p-4">
              <p className="text-[11px]" style={{ color: "var(--text-3)" }}>
                {formatInZone(a.starts_at, a.timezone)}
              </p>
              <p className="mt-0.5 text-sm font-bold" style={{ color: "var(--text-2)" }}>
                {a.title}
              </p>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
}
