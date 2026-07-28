import { redirect } from "next/navigation";
import Link from "next/link";
import { GlassPanel, InnerTile, BackLink, StatusBadge } from "../../components/ui";
import { getAllAnnouncementsForAdmin, type AnnouncementRow } from "@/lib/data/announcements";
import { formatInZone } from "@/lib/scheduling/timezone";
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

export default async function AnnouncementsAdminPage() {
  const { isAdmin, items } = await getAllAnnouncementsForAdmin();
  if (!isAdmin) redirect("/app");

  const counts = { draft: 0, published: 0, unpublished: 0 };
  for (const a of items) counts[a.status] += 1;

  return (
    <div className="mx-auto max-w-[920px] space-y-5">
      <BackLink href="/app">Dashboard</BackLink>

      <div className="ximo-fade-up">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>
              Anuncios
            </h1>
            <StatusBadge tone="gold">Admin</StatusBadge>
          </div>
          <Link href="/app/admin/announcements/new" className="ximo-glass-btn teal text-xs">
            Nuevo anuncio
          </Link>
        </div>
        <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
          Programa y publica sesiones de soporte en vivo por Discord. Publicar avisa a todos los usuarios de
          inmediato y programa sus recordatorios automáticos.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCardLite label="Borradores" value={counts.draft} />
        <StatCardLite label="Publicados" value={counts.published} />
        <StatCardLite label="Total" value={items.length} />
      </div>

      {items.length === 0 ? (
        <GlassPanel className="px-6 py-12 text-center">
          <p className="text-sm font-bold" style={{ color: "var(--text-label)" }}>
            Todavía no hay anuncios.
          </p>
          <p className="mx-auto mt-1 max-w-sm text-[12px]" style={{ color: "var(--text-3)" }}>
            Crea el primero para avisar a los atletas de la próxima sesión de soporte en vivo.
          </p>
        </GlassPanel>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <GlassPanel key={a.id} className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone={STATUS_TONE[a.status]}>{STATUS_LABEL[a.status]}</StatusBadge>
                <span className="ml-auto text-[10px]" style={{ color: "var(--text-3)" }}>
                  {formatInZone(a.starts_at, a.timezone)}
                </span>
              </div>

              <p className="mt-2 text-base font-black" style={{ color: "var(--text)" }}>
                {a.title}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                {a.description}
              </p>

              <InnerTile className="mt-3 px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: "var(--text-label)" }}>
                  Link de Discord
                </p>
                <a
                  href={a.discord_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 block truncate text-[11px] font-semibold underline underline-offset-2"
                  style={{ color: "var(--teal)" }}
                >
                  {a.discord_link} ↗
                </a>
              </InnerTile>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                <Link
                  href={`/app/admin/announcements/${a.id}/edit`}
                  className="ximo-glass-chip rounded-full px-4 py-2 text-xs font-semibold"
                  style={{ color: "var(--text-2)" }}
                >
                  Editar
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
          ))}
        </div>
      )}
    </div>
  );
}
