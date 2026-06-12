import { redirect } from "next/navigation";
import { GlassPanel, InnerTile, BackLink, StatusBadge } from "../../components/ui";
import { getAdQueue, type AdItem } from "@/lib/data/ads";
import { reviewAdAction } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<AdItem["review_status"], "warning" | "success" | "error"> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

const STATUS_LABEL: Record<AdItem["review_status"], string> = {
  pending: "Pendiente",
  approved: "Aprobado",
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

function ReviewButton({ id, decision, label, variant }: { id: string; decision: "approved" | "rejected"; label: string; variant: "teal" | "reject" }) {
  return (
    <form action={reviewAdAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="decision" value={decision} />
      {variant === "reject" ? (
        <button className="ximo-glass-chip rounded-full px-4 py-2 text-xs font-semibold" style={{ color: "var(--error)" }}>{label}</button>
      ) : (
        <button className="ximo-glass-btn teal text-xs">{label}</button>
      )}
    </form>
  );
}

export default async function AdminAdsPage() {
  const { isAdmin, items, counts } = await getAdQueue();
  if (!isAdmin) redirect("/app");

  const pending = items.filter((i) => i.review_status === "pending");
  const reviewed = items.filter((i) => i.review_status !== "pending");

  return (
    <div className="mx-auto max-w-[920px] space-y-5">
      <BackLink href="/app/admin/moderation">Moderación</BackLink>

      <div className="ximo-fade-up">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>Anuncios de marca</h1>
          <StatusBadge tone="gold">Admin</StatusBadge>
        </div>
        <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
          Revisa los anuncios enviados por marcas. Aprueba para publicar en la comunidad; rechaza si no cumplen las normas.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Pendientes" value={counts.pending} />
        <StatCard label="Aprobados" value={counts.approved} accent="gold" />
        <StatCard label="Rechazados" value={counts.rejected} accent="error" />
      </div>

      {/* Pending ads */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
            Por revisar ({pending.length})
          </p>
          {pending.map((ad) => (
            <AdCard key={ad.id} ad={ad} showActions />
          ))}
        </div>
      )}

      {pending.length === 0 && (
        <GlassPanel className="px-6 py-12 text-center">
          <p className="text-sm font-bold" style={{ color: "var(--text-label)" }}>No hay anuncios pendientes.</p>
          <p className="mt-1 text-[12px]" style={{ color: "var(--text-3)" }}>Todos los anuncios han sido revisados.</p>
        </GlassPanel>
      )}

      {/* Reviewed ads */}
      {reviewed.length > 0 && (
        <div className="space-y-3">
          <p className="mt-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
            Historial ({reviewed.length})
          </p>
          {reviewed.map((ad) => (
            <AdCard key={ad.id} ad={ad} showActions={false} />
          ))}
        </div>
      )}
    </div>
  );
}

function AdCard({ ad, showActions }: { ad: AdItem; showActions: boolean }) {
  return (
    <GlassPanel className="p-5">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone={STATUS_TONE[ad.review_status]}>{STATUS_LABEL[ad.review_status]}</StatusBadge>
        <span className="text-xs font-semibold" style={{ color: "var(--text-label)" }}>{ad.brand_name}</span>
        {ad.platform && (
          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
            style={{ background: "var(--surface-hover)", color: "var(--text-2)", border: "1px solid var(--border-subtle)" }}>
            {ad.platform}
          </span>
        )}
        <span className="ml-auto text-[10px]" style={{ color: "var(--text-3)" }}>{fmtDate(ad.created_at)}</span>
      </div>

      {ad.title && (
        <p className="mt-3 text-base font-black" style={{ color: "var(--text)" }}>{ad.title}</p>
      )}
      {ad.body && (
        <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{ad.body}</p>
      )}

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {ad.cta_label && ad.cta_url && (
          <InnerTile className="px-3 py-2">
            <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: "var(--text-label)" }}>CTA</p>
            <p className="mt-0.5 truncate text-xs font-semibold" style={{ color: "var(--teal)" }}>{ad.cta_label}</p>
          </InnerTile>
        )}
        {ad.budget != null && (
          <InnerTile className="px-3 py-2">
            <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: "var(--text-label)" }}>Presupuesto</p>
            <p className="mt-0.5 text-xs font-bold" style={{ color: "var(--gold)" }}>
              ${ad.budget.toLocaleString("es-MX")} USD
            </p>
          </InnerTile>
        )}
        {ad.media_url && (
          <InnerTile className="px-3 py-2 sm:col-span-2">
            <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: "var(--text-label)" }}>Media</p>
            <p className="mt-0.5 truncate text-[11px]" style={{ color: "var(--text-3)" }}>{ad.media_url}</p>
          </InnerTile>
        )}
      </div>

      {showActions && (
        <div className="mt-4 flex flex-wrap gap-2 border-t pt-4" style={{ borderColor: "var(--border)" }}>
          <ReviewButton id={ad.id} decision="approved" label="Aprobar" variant="teal" />
          <ReviewButton id={ad.id} decision="rejected" label="Rechazar" variant="reject" />
        </div>
      )}
    </GlassPanel>
  );
}
