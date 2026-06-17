import Link from "next/link";
import { BackLink } from "../../components/ui";
import { getUserBrandAds } from "@/lib/data/brands";
import { isStripeConfigured } from "@/lib/stripe/server";
import CampanaClient from "./CampanaClient";

export const dynamic = "force-dynamic";

export default async function CampanaPage() {
  const ads = await getUserBrandAds();
  // The most recent ad that can still be published (not rejected).
  const payable = ads.find((a) => a.review_status !== "rejected") ?? null;

  if (!payable) {
    return (
      <div className="mx-auto max-w-[760px] space-y-5">
        <BackLink href="/app/promocionar">Promocionar</BackLink>
        <div className="rounded-2xl p-8 text-center" style={{ background: "var(--surface)", border: "1px dashed var(--border-strong)" }}>
          <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Aún no tienes un anuncio para configurar</p>
          <p className="mx-auto mt-1 max-w-sm text-xs" style={{ color: "var(--text-label)" }}>
            Primero envía un anuncio a revisión. Cuando esté listo, podrás configurar el presupuesto, la duración y publicarlo.
          </p>
          <Link href="/app/promocionar" className="ximo-glass-btn teal mt-5 inline-block text-xs">Enviar un anuncio →</Link>
        </div>
      </div>
    );
  }

  return (
    <CampanaClient
      adId={payable.id}
      adTitle={payable.title || payable.brandName}
      stripeOn={isStripeConfigured()}
      approved={payable.review_status === "approved"}
    />
  );
}
