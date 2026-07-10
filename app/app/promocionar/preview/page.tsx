import Link from "next/link";
import { InnerTile, BackLink, StatusBadge, GlassPanel } from "../../components/ui";
import ScrollReveal from "../../../components/ScrollReveal";
import BrandAdCard from "../../components/BrandAdCard";
import { getMyAdPreview } from "@/lib/data/brands";

export const dynamic = "force-dynamic";

// Human labels consistent with /app/promocionar/revision.
const STATUS_LABEL: Record<string, { label: string; tone: "warning" | "success" | "error" }> = {
  pending: { label: "Pendiente de revisión", tone: "warning" },
  approved_pending_payment: { label: "Aprobado · pendiente de pago", tone: "success" },
  paid_ready_to_publish: { label: "Pagado · en activación", tone: "success" },
  approved: { label: "Publicado", tone: "success" },
  rejected: { label: "No aprobado", tone: "error" },
};

export default async function AdPreviewPage() {
  const preview = await getMyAdPreview();
  const status = preview ? STATUS_LABEL[preview.review_status] ?? STATUS_LABEL.pending : null;

  return (
    <div className="mx-auto max-w-[680px] space-y-5">
      <BackLink href="/app/promocionar/campana">Configurar campaña</BackLink>

      <div className="ximo-fade-up">
        <h1 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>
          Vista previa del anuncio
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
          {preview
            ? "Esta es la tarjeta exacta de tu anuncio, tal como los atletas la verán en Marcas y oportunidades cuando se publique."
            : "Aquí verás tu anuncio exactamente como aparecerá en Marcas y oportunidades."}
        </p>
      </div>

      {preview ? (
        <>
          {/* The REAL card: same component + same data the published section renders. */}
          <ScrollReveal>
            <div className="mx-auto max-w-[420px]">
              <BrandAdCard b={preview.ad} />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={40}>
            <InnerTile className="flex items-center justify-between gap-3 px-4 py-3">
              <p className="text-xs font-semibold" style={{ color: "var(--text-label)" }}>
                Estado actual de este anuncio
              </p>
              {status && <StatusBadge tone={status.tone}>{status.label}</StatusBadge>}
            </InnerTile>
          </ScrollReveal>
        </>
      ) : (
        <GlassPanel className="px-6 py-12 text-center">
          <p className="text-sm font-black" style={{ color: "var(--text)" }}>Aún no has enviado anuncios</p>
          <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>
            Envía tu primer anuncio a revisión y aquí verás la tarjeta exacta con la que aparecerá frente a los
            atletas.
          </p>
          <Link href="/app/promocionar" className="ximo-glass-btn teal mt-5 inline-block text-xs">
            Crear anuncio
          </Link>
        </GlassPanel>
      )}

      {/* Notes */}
      <ScrollReveal delay={60}>
        <InnerTile className="flex items-start gap-3 px-4 py-3.5">
          <span className="mt-0.5 shrink-0 text-base">🛡</span>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>
            Todas las promociones se muestran con la etiqueta <strong style={{ color: "var(--gold)" }}>Publicidad</strong>{" "}
            para que los atletas siempre sepan qué es contenido patrocinado. Los anuncios son enviados por marcas
            externas y revisados por Ximo antes de publicarse; Ximo no garantiza resultados relacionados con ellos.
          </p>
        </InnerTile>
      </ScrollReveal>

      <div className="flex flex-wrap gap-3">
        <Link href="/app/promocionar/campana" className="ximo-glass-btn teal text-sm">
          Volver a la campaña
        </Link>
        <Link href="/app/marcas" className="ximo-glass-btn dark text-sm">
          Ver Marcas y oportunidades
        </Link>
      </div>
    </div>
  );
}
