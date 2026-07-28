import PageHeader from "../components/PageHeader";
import { GlassPanel, InnerTile, StatusBadge } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";
import { getNotifications } from "@/lib/data/notifications";
import { getUserSettings } from "@/lib/settings/actions";
import { markAllReadAction, markReadAction } from "./actions";
import PrefsForm from "./PrefsForm";

export const dynamic = "force-dynamic";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `Hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Ayer";
  if (d < 7) return `Hace ${d} días`;
  return new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

const TYPE_TONE: Record<string, "success" | "info" | "warning" | "gold" | "neutral"> = {
  coach: "success",
  community: "info",
  document: "warning",
  subscription: "gold",
  recruiting: "info",
  live_support: "info",
};

export default async function NotificationsPage() {
  const [{ rows, unread }, settings] = await Promise.all([getNotifications(), getUserSettings()]);

  return (
    <div className="mx-auto max-w-[760px] space-y-5">
      <PageHeader title="Notificaciones" subtitle="Controla qué te avisamos y revisa tu actividad reciente." />

      <ScrollReveal>
        <GlassPanel className="p-5">
          <h2 className="mb-1 text-base font-black" style={{ color: "var(--text)" }}>Preferencias</h2>
          <p className="mb-4 text-xs" style={{ color: "var(--text-label)" }}>Elige qué notificaciones quieres recibir.</p>
          <PrefsForm
            email={settings?.email_notifications ?? true}
            community={settings?.community_notifications ?? true}
          />
        </GlassPanel>
      </ScrollReveal>

      <ScrollReveal delay={70}>
        <GlassPanel className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-black" style={{ color: "var(--text)" }}>
              Actividad reciente {unread > 0 && <span style={{ color: "var(--teal)" }}>· {unread} nuevas</span>}
            </h2>
            {unread > 0 && (
              <form action={markAllReadAction}>
                <button className="ximo-glass-chip rounded-full px-3 py-1.5 text-xs font-semibold" style={{ color: "var(--teal)" }}>
                  Marcar todo como leído
                </button>
              </form>
            )}
          </div>

          {rows.length === 0 ? (
            <InnerTile className="px-4 py-8 text-center">
              <p className="text-sm font-bold" style={{ color: "var(--text-label)" }}>Sin notificaciones todavía</p>
              <p className="mx-auto mt-1 max-w-sm text-[12px]" style={{ color: "var(--text-3)" }}>
                Aquí verás avisos de tus coaches, novedades de Ximo y recordatorios de tu proceso.
              </p>
            </InnerTile>
          ) : (
            <div className="space-y-2">
              {rows.map((n) => (
                <InnerTile key={n.id} className="flex items-center gap-2 px-3.5 py-3">
                  <form action={markReadAction} className="min-w-0 flex-1">
                    <input type="hidden" name="id" value={n.id} />
                    <button type="submit" className="flex w-full items-center gap-3 text-left">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: n.read_at ? "var(--border-strong)" : "var(--teal)" }} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold" style={{ color: "var(--text)" }}>{n.title ?? "Notificación"}</p>
                        {n.body && <p className="truncate text-[12px]" style={{ color: "var(--text-2)" }}>{n.body}</p>}
                        <p className="text-[11px]" style={{ color: "var(--text-label)" }}>{timeAgo(n.created_at)}</p>
                      </div>
                    </button>
                  </form>
                  {n.type && <StatusBadge tone={TYPE_TONE[n.type] ?? "neutral"}>{n.type}</StatusBadge>}
                  {n.type === "live_support" && n.action_url && (
                    <a
                      href={n.action_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ximo-glass-btn teal shrink-0 text-[11px]"
                    >
                      Unirse
                    </a>
                  )}
                </InnerTile>
              ))}
            </div>
          )}
        </GlassPanel>
      </ScrollReveal>
    </div>
  );
}
