import Link from "next/link";
import { BackLink } from "../../components/ui";
import { getUserBrandAds } from "@/lib/data/brands";
import { isStripeConfigured } from "@/lib/stripe/server";
import CampanaClient from "./CampanaClient";

export const dynamic = "force-dynamic";

export default async function CampanaPage() {
  const ads = await getUserBrandAds();
  // Payment is only possible after manual approval — never while pending.
  const payable = ads.find((a) => a.review_status === "approved_pending_payment") ?? null;

  if (!payable) {
    const hasPending = ads.some((a) => a.review_status === "pending");
    return (
      <div className="mx-auto max-w-[760px] space-y-5">
        <BackLink href="/app/promocionar">Promocionar</BackLink>
        <div className="rounded-2xl p-8 text-center" style={{ background: "var(--surface)", border: "1px dashed var(--border-strong)" }}>
          <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
            {hasPending ? "Tu anuncio sigue en revisión" : "Aún no tienes un anuncio aprobado para configurar"}
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs" style={{ color: "var(--text-label)" }}>
            {hasPending
              ? "El equipo Ximo lo está revisando manualmente. Si se aprueba, recibirás un correo para configurar la campaña y pagar."
              : "Primero envía un anuncio a revisión. Solo los anuncios aprobados pueden configurar presupuesto y pagar."}
          </p>
          <Link href={hasPending ? "/app/promocionar/revision" : "/app/promocionar"} className="ximo-glass-btn teal mt-5 inline-block text-xs">
            {hasPending ? "Ver estado de revisión →" : "Enviar un anuncio →"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <CampanaClient
      adId={payable.id}
      adTitle={payable.title || payable.brandName}
      stripeOn={isStripeConfigured()}
    />
  );
}
