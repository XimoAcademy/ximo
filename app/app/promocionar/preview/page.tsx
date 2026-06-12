import Link from "next/link";
import { GlassPanel, InnerTile, BackLink, StatusBadge } from "../../components/ui";
import ScrollReveal from "../../../components/ScrollReveal";

export default function AdPreviewPage() {
  return (
    <div className="mx-auto max-w-[680px] space-y-5">
      <BackLink href="/app/promocionar/campana">Configurar campaña</BackLink>

      <div className="ximo-fade-up">
        <h1 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>
          Vista previa del anuncio
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
          Así verán los atletas tu promoción dentro del feed de Comunidad.
        </p>
      </div>

      {/* Sponsored card preview */}
      <ScrollReveal>
        <GlassPanel className="p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black"
                style={{ background: "var(--gold-bg)", color: "var(--gold)", border: "1px solid var(--gold-border)" }}
              >
                AT
              </div>
              <div>
                <p className="text-sm font-black" style={{ color: "var(--text)" }}>AquaTech Goggles</p>
                <p className="text-[10px]" style={{ color: "var(--text-label)" }}>Promoción · Equipo deportivo</p>
              </div>
            </div>
            <StatusBadge tone="gold">Promocionado</StatusBadge>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
            Lentes de competencia con visión panorámica y antiempañante. 15% de descuento para atletas Ximo
            con suscripción activa.
          </p>

          {/* Media placeholder */}
          <div
            className="mt-3 flex aspect-video w-full items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg, #0B1F33 0%, #143845 60%, #1F5F66 100%)" }}
          >
            <span className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
              Imagen o video de la marca
            </span>
          </div>

          {/* CTA inside ad */}
          <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
            <span className="text-[10px] font-semibold" style={{ color: "var(--text-label)" }}>
              Promoción revisada por Ximo
            </span>
            <span className="ximo-glass-btn gold shiny text-xs">Ver oferta →</span>
          </div>
        </GlassPanel>
      </ScrollReveal>

      {/* Notes */}
      <ScrollReveal delay={60}>
        <InnerTile className="flex items-start gap-3 px-4 py-3.5">
          <span className="mt-0.5 shrink-0 text-base">🛡</span>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>
            Todas las promociones se muestran con la etiqueta <strong style={{ color: "var(--gold)" }}>Promoción revisada por Ximo</strong>{" "}
            para que la comunidad siempre sepa qué es contenido patrocinado.
          </p>
        </InnerTile>
      </ScrollReveal>

      <div className="flex flex-wrap gap-3">
        <Link href="/app/promocionar/campana" className="ximo-glass-btn teal text-sm">
          Volver a la campaña
        </Link>
        <Link href="/app/comunidad" className="ximo-glass-btn dark text-sm">
          Ver la comunidad
        </Link>
      </div>
    </div>
  );
}
