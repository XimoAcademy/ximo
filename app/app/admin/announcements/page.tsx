import { redirect } from "next/navigation";
import Link from "next/link";
import { GlassPanel, InnerTile, BackLink, StatusBadge } from "../../components/ui";
import { getAllAnnouncementsForAdmin, type AnnouncementRow } from "@/lib/data/announcements";
import { formatInZone } from "@/lib/scheduling/timezone";
import { DIRECTO_TITULO } from "@/lib/announcements/text";
import { publishAction, unpublishAction, duplicateAction, deleteAction } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<AnnouncementRow["status"], "success" | "warning" | "neutral"> = {
  draft: "neutral",
  published: "success",
  unpublished: "warning",
};

const STATUS_LABEL: Record<AnnouncementRow["status"], string> = {
  draft: "Borrador",
  published: "Publicado",
  unpublished: "Despublicado",
};

function StatCardLite({ label, value }: { label: string; value: number }) {
  return (
    <InnerTile className="px-4 py-3 text-center">
      <p className="text-2xl font-black" style={{ color: "var(--teal)" }}>
        {value}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-label)" }}>
        {label}
      </p>
    </InnerTile>
  );
}

export default async function AnnouncementsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { isAdmin, items } = await getAllAnnouncementsForAdmin();
  if (!isAdmin) redirect("/app");
  const { error } = await searchParams;

  const counts = { draft: 0, published: 0, unpublished: 0 };
  for (const a of items) counts[a.status] += 1;
  const now = Date.now();

  return (
    <div className="mx-auto max-w-[920px] space-y-5">
      <BackLink href="/app">Dashboard</BackLink>

      <div className="ximo-fade-up">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>
              Directos
            </h1>
            <StatusBadge tone="gold">Solo admin</StatusBadge>
          </div>
          <Link href="/app/admin/announcements/new" className="ximo-glass-btn teal text-xs">
            Programar directo
          </Link>
        </div>
        <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
          Elige fecha y hora; el texto del aviso es siempre el mismo. Publicar avisa a todos los atletas de
          inmediato y programa los recordatorios de 24 h, 1 h y 10 min.
        </p>
      </div>

      {error === "pasado" && (
        <div
          className="rounded-xl px-4 py-3 text-sm font-semibold"
          style={{ background: "var(--error-bg)", color: "var(--error)", border: "1px solid var(--error)" }}
        >
          No se puede publicar un directo cuya fecha ya pasó. Cambia la fecha primero.
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <StatCardLite label="Borradores" value={counts.draft} />
        <StatCardLite label="Publicados" value={counts.published} />
        <StatCardLite label="Total" value={items.length} />
      </div>

      {items.length === 0 ? (
        <GlassPanel className="px-6 py-12 text-center">
          <p className="text-sm font-bold" style={{ color: "var(--text-label)" }}>
            Todavía no has programado ningún directo.
          </p>
          <p className="mx-auto mt-1 max-w-sm text-[12px]" style={{ color: "var(--text-3)" }}>
            Programa el primero para avisar a los atletas de la próxima sesión de dudas en Discord.
          </p>
        </GlassPanel>
      ) : (
        <div className="space-y-3">
          {items.map((a) => {
            const pasado = new Date(a.starts_at).getTime() < now;
            return (
              <GlassPanel key={a.id} className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={STATUS_TONE[a.status]}>{STATUS_LABEL[a.status]}</StatusBadge>
                  {pasado && <StatusBadge tone="neutral">Ya ocurrió</StatusBadge>}
                </div>

                <p className="mt-2 text-base font-black" style={{ color: "var(--text)" }}>
                  🔴 {DIRECTO_TITULO}
                </p>
                <p className="mt-0.5 text-sm font-semibold" style={{ color: "var(--teal)" }}>
                  {formatInZone(a.starts_at, a.timezone)}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                  <Link
                    href={`/app/admin/announcements/${a.id}/edit`}
                    className="ximo-glass-chip rounded-full px-4 py-2 text-xs font-semibold"
                    style={{ color: "var(--text-2)" }}
                  >
                    Cambiar fecha
                  </Link>

                  {a.status !== "published" && (
                    <form action={publishAction}>
                      <input type="hidden" name="id" value={a.id} />
                      <button className="ximo-glass-btn gold shiny text-xs">Publicar</button>
                    </form>
                  )}
                  {a.status === "published" && (
                    <form action={unpublishAction}>
                      <input type="hidden" name="id" value={a.id} />
                      <button className="ximo-glass-chip rounded-full px-4 py-2 text-xs font-semibold" style={{ color: "var(--text-2)" }}>
                        Despublicar
                      </button>
                    </form>
                  )}
                  <form action={duplicateAction}>
                    <input type="hidden" name="id" value={a.id} />
                    <button className="ximo-glass-chip rounded-full px-4 py-2 text-xs font-semibold" style={{ color: "var(--text-2)" }}>
                      Duplicar
                    </button>
                  </form>
                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={a.id} />
                    <button className="ximo-glass-chip rounded-full px-4 py-2 text-xs font-semibold" style={{ color: "var(--error)" }}>
                      Eliminar
                    </button>
                  </form>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      )}
    </div>
  );
}
