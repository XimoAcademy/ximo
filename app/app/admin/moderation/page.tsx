import { redirect } from "next/navigation";
import { GlassPanel, InnerTile, BackLink, StatusBadge } from "../../components/ui";
import { CATEGORY_LABELS, type ModerationCategory } from "@/lib/moderation/types";
import { getModerationQueue, type ModItem } from "@/lib/data/moderation";
import { moderateAction } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, "warning" | "success" | "error" | "info" | "neutral"> = {
  pending: "warning",
  flagged: "warning",
  approved: "success",
  rejected: "error",
  hidden: "neutral",
};

const TARGET_LABEL: Record<ModItem["targetType"], string> = {
  post: "Publicación",
  comment: "Comentario",
  brand_ad: "Anuncio de marca",
};

function StatCardLite({ label, value }: { label: string; value: number }) {
  return (
    <InnerTile className="px-4 py-3 text-center">
      <p className="text-2xl font-black" style={{ color: "var(--teal)" }}>{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-label)" }}>{label}</p>
    </InnerTile>
  );
}

function ActionButton({ id, targetType, decision, label, variant }: { id: string; targetType: string; decision: string; label: string; variant: "teal" | "dark" | "reject" }) {
  return (
    <form action={moderateAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="target_type" value={targetType} />
      <input type="hidden" name="decision" value={decision} />
      {variant === "reject" ? (
        <button className="ximo-glass-chip rounded-full px-4 py-2 text-xs font-semibold" style={{ color: "var(--error)" }}>{label}</button>
      ) : (
        <button className={`ximo-glass-btn ${variant} text-xs`}>{label}</button>
      )}
    </form>
  );
}

export default async function ModerationAdminPage() {
  const { isAdmin, items, counts } = await getModerationQueue();
  if (!isAdmin) redirect("/app");

  return (
    <div className="mx-auto max-w-[920px] space-y-5">
      <BackLink href="/app">Dashboard</BackLink>

      <div className="ximo-fade-up">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>Moderación</h1>
          <StatusBadge tone="gold">Admin</StatusBadge>
        </div>
        <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
          Cola de contenido para revisión. Aprueba para publicar en la comunidad; oculta o rechaza lo que incumpla las reglas.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCardLite label="Pendientes" value={counts.pending} />
        <StatCardLite label="Marcados" value={counts.flagged} />
        <StatCardLite label="En cola" value={items.length} />
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <GlassPanel className="px-6 py-12 text-center">
            <p className="text-sm font-bold" style={{ color: "var(--text-label)" }}>No hay contenido pendiente de revisión.</p>
            <p className="mx-auto mt-1 max-w-sm text-[12px]" style={{ color: "var(--text-3)" }}>Todo el contenido nuevo aparecerá aquí para que lo revises antes de publicarse.</p>
          </GlassPanel>
        ) : (
          items.map((it) => (
            <GlassPanel key={`${it.targetType}-${it.id}`} className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone="info">{TARGET_LABEL[it.targetType]}</StatusBadge>
                <StatusBadge tone={STATUS_TONE[it.status] ?? "neutral"}>{it.status}</StatusBadge>
                {it.reportedCount > 0 && <StatusBadge tone="error">{it.reportedCount} reportes</StatusBadge>}
              </div>
              <p className="mt-2 text-sm font-bold" style={{ color: "var(--text)" }}>{it.author}</p>
              <p className="mt-0.5 whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{it.preview}</p>
              {it.categories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {it.categories.map((c) => (
                    <span key={c} className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
                      {CATEGORY_LABELS[c as ModerationCategory] ?? c}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                <ActionButton id={it.id} targetType={it.targetType} decision="approved" label="Aprobar" variant="teal" />
                {it.targetType !== "brand_ad" && <ActionButton id={it.id} targetType={it.targetType} decision="hidden" label="Ocultar" variant="dark" />}
                <ActionButton id={it.id} targetType={it.targetType} decision="rejected" label="Rechazar" variant="reject" />
              </div>
            </GlassPanel>
          ))
        )}
      </div>
    </div>
  );
}
