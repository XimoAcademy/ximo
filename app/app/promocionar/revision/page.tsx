import Link from "next/link";
import { GlassPanel, InnerTile, BackLink, StatusBadge } from "../../components/ui";
import ScrollReveal from "../../../components/ScrollReveal";
import { getUserBrandAds, type UserBrandAd } from "@/lib/data/brands";

export const dynamic = "force-dynamic";

type Tone = "warning" | "success" | "error";

const STATUS_MAP: Record<string, { label: string; tone: Tone; icon: string; text: string; next: string }> = {
  pending: {
    label: "Pendiente",
    tone: "warning",
    icon: "⏳",
    text: "Tu anuncio fue recibido y está esperando revisión del equipo Ximo. Tiempo estimado: 48–72 horas.",
    next: "Espera la respuesta del equipo. Te avisaremos por correo cuando haya una actualización.",
  },
  approved: {
    label: "Aprobado",
    tone: "success",
    icon: "✓",
    text: "Tu anuncio fue aprobado. Ahora puedes configurar presupuesto, duración y alcance.",
    next: "Configura tu campaña para empezar a aparecer en Comunidad.",
  },
  rejected: {
    label: "No aprobado",
    tone: "error",
    icon: "✕",
    text: "Tu anuncio no fue aprobado. Intenta enviar otro alineado con atletas y la comunidad Ximo.",
    next: "Revisa los lineamientos y envía una nueva propuesta.",
  },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "2-digit" });
}

function AdCard({ ad, i }: { ad: UserBrandAd; i: number }) {
  const s = STATUS_MAP[ad.review_status] ?? STATUS_MAP.pending;
  return (
    <ScrollReveal delay={i * 60}>
      <GlassPanel className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
              style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}
            >
              {s.icon}
            </span>
            <div>
              <p className="text-sm font-black" style={{ color: "var(--text)" }}>{ad.title || ad.brandName}</p>
              <p className="text-[11px]" style={{ color: "var(--text-label)" }}>
                {ad.brandName}
                {ad.category ? ` · ${ad.category}` : ""}
                {ad.format ? ` · ${ad.format}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px]" style={{ color: "var(--text-3)" }}>{fmtDate(ad.created_at)}</span>
            <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
          {s.text}
        </p>

        <InnerTile className="mt-3 px-3.5 py-2.5">
          <p className="text-[11px]" style={{ color: "var(--text-label)" }}>
            <span className="font-bold" style={{ color: "var(--text-2)" }}>Siguiente paso:</span> {s.next}
          </p>
        </InnerTile>

        {ad.review_status !== "rejected" && (
          <Link href="/app/promocionar/campana" className="ximo-glass-btn teal mt-4 inline-block text-xs">
            Configurar campaña y pagar
          </Link>
        )}
        {ad.review_status === "rejected" && (
          <Link href="/app/promocionar" className="ximo-glass-btn dark mt-4 inline-block text-xs">
            Enviar otro anuncio
          </Link>
        )}
      </GlassPanel>
    </ScrollReveal>
  );
}

export default async function RevisionPage(props: { searchParams: Promise<{ sent?: string; ad?: string }> }) {
  const searchParams = await props.searchParams;
  const sent = searchParams.sent === "1";
  const paid = searchParams.ad === "paid";
  const ads = await getUserBrandAds();

  return (
    <div className="mx-auto max-w-[820px] space-y-5">
      <BackLink href="/app/promocionar">Promocionar</BackLink>

      <div className="ximo-fade-up">
        <h1 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>
          Estado de revisión
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
          Sigue el estado de cada anuncio que enviaste a revisión.
        </p>
      </div>

      {sent && (
        <div className="ximo-fade-up rounded-2xl px-5 py-4"
          style={{ background: "var(--teal-bg)", border: "1px solid var(--teal-border)" }}>
          <p className="text-sm font-black" style={{ color: "var(--teal)" }}>¡Anuncio enviado!</p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--text-2)" }}>
            Tu anuncio fue recibido. El equipo Ximo lo revisará en 48–72 horas y te avisará por correo.
          </p>
        </div>
      )}

      {paid && (
        <div className="ximo-fade-up rounded-2xl px-5 py-4"
          style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>
          <p className="text-sm font-black" style={{ color: "var(--gold)" }}>¡Pago confirmado! 🎉</p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--text-2)" }}>
            Tu campaña fue pagada y tu anuncio se está publicando en el feed de Comunidad. Puede tardar unos segundos en activarse.
          </p>
        </div>
      )}

      {ads.length === 0 ? (
        <GlassPanel className="px-6 py-12 text-center">
          <p className="text-sm font-black" style={{ color: "var(--text)" }}>Aún no has enviado anuncios</p>
          <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>
            Envía tu primer anuncio a revisión para aparecer frente a atletas mexicanos.
          </p>
          <Link href="/app/promocionar" className="ximo-glass-btn teal mt-5 inline-block text-xs">
            Crear anuncio
          </Link>
        </GlassPanel>
      ) : (
        <div className="space-y-4">
          {ads.map((ad, i) => (
            <AdCard key={ad.id} ad={ad} i={i} />
          ))}
        </div>
      )}
    </div>
  );
}
