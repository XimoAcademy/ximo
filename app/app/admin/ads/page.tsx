import { redirect } from "next/navigation";
import { GlassPanel, InnerTile, BackLink, StatusBadge } from "../../components/ui";
import { getAdQueue, type AdItem } from "@/lib/data/ads";
import { discordAdsMode } from "@/lib/discord/ads";
import { reviewAdAction, publishAdAction, postAdToDiscordAction } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<AdItem["review_status"], "warning" | "success" | "error" | "info" | "gold"> = {
  pending: "warning",
  approved_pending_payment: "info",
  paid_ready_to_publish: "gold",
  approved: "success",
  rejected: "error",
};

const STATUS_LABEL: Record<AdItem["review_status"], string> = {
  pending: "Pendiente de revisión",
  approved_pending_payment: "Aprobado · pendiente de pago",
  paid_ready_to_publish: "Pagado · listo para publicar",
  approved: "Publicado",
  rejected: "Rechazado",
};

function fmtDate(ts: string): string {
  return new Date(ts).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: "teal" | "gold" | "error" }) {
  const color = accent === "gold" ? "var(--gold)" : accent === "error" ? "var(--error)" : "var(--teal)";
  return (
    <InnerTile className="px-4 py-3 text-center">
      <p className="text-2xl font-black" style={{ color }}>{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-label)" }}>{label}</p>
    </InnerTile>
  );
}

export default async function AdminAdsPage() {
  const { isAdmin, items, counts } = await getAdQueue();
  if (!isAdmin) redirect("/app");

  const pending = items.filter((i) => i.review_status === "pending");
  const readyToPublish = items.filter((i) => i.review_status === "paid_ready_to_publish");
  const rest = items.filter((i) => i.review_status !== "pending" && i.review_status !== "paid_ready_to_publish");
  const discordMode = discordAdsMode();

  return (
    <div className="mx-auto max-w-[920px] space-y-5">
      <BackLink href="/app/admin/moderation">Moderación</BackLink>

      <div className="ximo-fade-up">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>Solicitudes de anuncios</h1>
          <StatusBadge tone="gold">Admin</StatusBadge>
        </div>
        <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
          Revisión manual: aprobar envía al anunciante un correo para pagar; nada se publica sin tu aprobación final.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Pendientes" value={counts.pending} />
        <StatCard label="Esperan pago" value={counts.approved_pending_payment} />
        <StatCard label="Por publicar" value={counts.paid_ready_to_publish} accent="gold" />
        <StatCard label="Rechazados" value={counts.rejected} accent="error" />
      </div>

      {/* Pending review */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
            Por revisar ({pending.length})
          </p>
          {pending.map((ad) => (
            <AdCard key={ad.id} ad={ad} actions="review" />
          ))}
        </div>
      )}

      {pending.length === 0 && readyToPublish.length === 0 && (
        <GlassPanel className="px-6 py-12 text-center">
          <p className="text-sm font-bold" style={{ color: "var(--text-label)" }}>No hay solicitudes pendientes.</p>
          <p className="mt-1 text-[12px]" style={{ color: "var(--text-3)" }}>Todas las solicitudes han sido revisadas.</p>
        </GlassPanel>
      )}

      {/* Paid — awaiting manual publication */}
      {readyToPublish.length > 0 && (
        <div className="space-y-3">
          <p className="mt-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
            Pagados · listos para publicar ({readyToPublish.length})
          </p>
          {readyToPublish.map((ad) => (
            <AdCard key={ad.id} ad={ad} actions="publish" />
          ))}
        </div>
      )}

      {/* History */}
      {rest.length > 0 && (
        <div className="space-y-3">
          <p className="mt-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
            Historial ({rest.length})
          </p>
          {rest.map((ad) => (
            <AdCard key={ad.id} ad={ad} actions="none" discordMode={discordMode} />
          ))}
        </div>
      )}
    </div>
  );
}

function AdCard({
  ad,
  actions,
  discordMode = null,
}: {
  ad: AdItem;
  actions: "review" | "publish" | "none";
  discordMode?: "webhook" | "bot" | null;
}) {
  const details: Array<[string, string | null]> = [
    ["Contacto", ad.contact_name],
    ["Correo", ad.contact_email],
    ["Teléfono", ad.contact_phone],
    ["Sitio", ad.website],
    ["Audiencia", ad.target_audience],
    ["Presupuesto (rango)", ad.budget_range],
    ["Pagado (MXN)", ad.budget != null ? `$${ad.budget.toLocaleString("es-MX")}` : null],
    ["Fechas preferidas", ad.preferred_dates],
    ["Link de destino", ad.cta_url],
  ];

  return (
    <GlassPanel className="p-5">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone={STATUS_TONE[ad.review_status]}>{STATUS_LABEL[ad.review_status]}</StatusBadge>
        <span className="text-xs font-semibold" style={{ color: "var(--text-label)" }}>{ad.brand_name}</span>
        <span className="ml-auto text-[10px]" style={{ color: "var(--text-3)" }}>{fmtDate(ad.created_at)}</span>
      </div>

      {ad.title && (
        <p className="mt-3 text-base font-black" style={{ color: "var(--text)" }}>{ad.title}</p>
      )}
      {ad.body && (
        <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{ad.body}</p>
      )}

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {details.filter(([, v]) => v).map(([label, value]) => (
          <InnerTile key={label} className="px-3 py-2">
            <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: "var(--text-label)" }}>{label}</p>
            <p className="mt-0.5 truncate text-xs font-semibold" style={{ color: "var(--text-2)" }}>{value}</p>
          </InnerTile>
        ))}
        {ad.media_url && (
          <InnerTile className="px-3 py-2 sm:col-span-2">
            <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: "var(--text-label)" }}>Archivo del anuncio</p>
            <a href={ad.media_url} target="_blank" rel="noopener noreferrer"
              className="mt-0.5 block truncate text-[11px] font-semibold underline underline-offset-2" style={{ color: "var(--teal)" }}>
              {ad.media_url} ↗
            </a>
          </InnerTile>
        )}
      </div>

      {actions === "review" && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4" style={{ borderColor: "var(--border)" }}>
          <form action={reviewAdAction}>
            <input type="hidden" name="id" value={ad.id} />
            <input type="hidden" name="decision" value="approved" />
            <button className="ximo-glass-btn teal text-xs">Aprobar anuncio</button>
          </form>
          <form action={reviewAdAction}>
            <input type="hidden" name="id" value={ad.id} />
            <input type="hidden" name="decision" value="rejected" />
            <button className="ximo-glass-chip rounded-full px-4 py-2 text-xs font-semibold" style={{ color: "var(--error)" }}>Rechazar anuncio</button>
          </form>
          <p className="w-full text-[10px] sm:ml-auto sm:w-auto" style={{ color: "var(--text-3)" }}>
            Al decidir se envía el correo correspondiente al anunciante.
          </p>
        </div>
      )}

      {actions === "publish" && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4" style={{ borderColor: "var(--border)" }}>
          <form action={publishAdAction}>
            <input type="hidden" name="id" value={ad.id} />
            <button className="ximo-glass-btn gold shiny text-xs">Publicar anuncio</button>
          </form>
          <p className="text-[10px]" style={{ color: "var(--text-3)" }}>
            El pago está confirmado. Publicar lo hace visible en Marcas y oportunidades.
          </p>
        </div>
      )}

      {/* Discord: manual, admin-only, and only for ads already approved + paid + published. */}
      {ad.review_status === "approved" && (
        <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--border)" }}>
          {ad.platform === "discord" ? (
            <StatusBadge tone="success">Publicado en Discord ✓</StatusBadge>
          ) : discordMode ? (
            <div className="flex flex-wrap items-center gap-2">
              <form action={postAdToDiscordAction}>
                <input type="hidden" name="id" value={ad.id} />
                <button className="ximo-glass-btn dark text-xs">Publicar en Discord</button>
              </form>
              <p className="text-[10px]" style={{ color: "var(--text-3)" }}>
                Publica este anuncio en el canal de anuncios del Discord de Ximo ({discordMode === "webhook" ? "vía webhook" : "vía bot"}), etiquetado como Publicidad.
              </p>
            </div>
          ) : (
            <InnerTile className="px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-label)" }}>
                Publicación en Discord — modo manual
              </p>
              <p className="mt-1 text-[11px] leading-relaxed" style={{ color: "var(--text-3)" }}>
                No hay webhook/bot configurado (variables DISCORD_ADS_WEBHOOK_URL o DISCORD_BOT_TOKEN +
                DISCORD_ADS_CHANNEL_ID). Para publicar: copia el título, la descripción y el link del anuncio,
                y pégalos manualmente en el canal de anuncios del servidor de Discord, iniciando el mensaje con
                “Publicidad · {ad.brand_name}”.
              </p>
            </InnerTile>
          )}
        </div>
      )}
    </GlassPanel>
  );
}
