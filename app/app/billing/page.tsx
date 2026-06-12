import Link from "next/link";
import PageHeader from "../components/PageHeader";
import { GlassPanel, InnerTile, StatusBadge } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";
import { getBillingInfo } from "@/lib/data/billing";
import { isStripeConfigured, isAnnualConfigured, getDisplayPrices } from "@/lib/stripe/server";
import CheckoutButtons from "./CheckoutButtons";
import ManageButton from "./ManageButton";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; tone: "success" | "warning" | "error" | "neutral" }> = {
  active: { label: "Activa", tone: "success" },
  manual_active: { label: "Activa", tone: "success" },
  trialing: { label: "Periodo de prueba", tone: "success" },
  past_due: { label: "Pago pendiente", tone: "warning" },
  canceled: { label: "Cancelada", tone: "error" },
  inactive: { label: "Inactiva", tone: "neutral" },
};

function fmtDate(ts: string | null): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const { success, canceled } = await searchParams;
  const info = await getBillingInfo();
  const status = info?.status ?? "inactive";
  const s = STATUS[status] ?? STATUS.inactive;
  const active = ["active", "manual_active", "trialing"].includes(status);
  const planLabel = info?.planType === "annual" ? "Anual" : info?.planType === "monthly" ? "Mensual" : "—";
  const stripeOn = isStripeConfigured();
  const annualOn = isAnnualConfigured();
  const prices = stripeOn ? await getDisplayPrices() : {};

  return (
    <div className="mx-auto max-w-[760px] space-y-5">
      <PageHeader title="Facturación" subtitle="Gestiona tu plan y revisa el estado de tu suscripción." />

      {success && (
        <div className="ximo-fade-up rounded-xl px-4 py-3 text-[13px] font-semibold" style={{ background: "var(--success-bg)", color: "var(--success)", border: "1px solid var(--success)" }}>
          ¡Gracias! Estamos confirmando tu pago. Tu suscripción se activa en cuanto recibimos la confirmación (unos segundos).
        </div>
      )}
      {canceled && (
        <div className="ximo-fade-up rounded-xl px-4 py-3 text-[13px] font-semibold" style={{ background: "var(--warning-bg)", color: "var(--warning)", border: "1px solid var(--warning)" }}>
          Cancelaste el pago. Puedes intentarlo de nuevo cuando quieras.
        </div>
      )}

      {!active && stripeOn && (
        <ScrollReveal>
          <GlassPanel tone="teal" className="p-5 sm:p-6">
            <p className="text-sm font-black" style={{ color: "var(--text)" }}>Activa tu suscripción</p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>Elige tu plan y completa el pago seguro con Stripe.</p>
            <div className="mt-4 max-w-sm">
              <CheckoutButtons
                annualEnabled={annualOn}
                monthlyLabel={prices.monthly ? `Suscribirme · ${prices.monthly.label}/mes` : "Suscribirme · plan mensual"}
                annualLabel={prices.annual ? `Suscribirme · ${prices.annual.label}/año` : "Suscribirme · plan anual"}
              />
            </div>
          </GlassPanel>
        </ScrollReveal>
      )}

      <ScrollReveal>
        <GlassPanel tone={active ? "gold" : "default"} className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full ximo-glow-pulse" style={{ background: active ? "var(--teal)" : "var(--text-3)" }} />
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>Estado de suscripción</p>
              </div>
              <p className="mt-2 text-2xl font-black" style={{ color: "var(--text)" }}>
                {active ? `Plan ${planLabel.toLowerCase()}` : "Sin suscripción activa"}
              </p>
              <p className="mt-0.5 text-sm" style={{ color: "var(--text-label)" }}>
                {info?.currentPeriodEnd ? `Próxima renovación: ${fmtDate(info.currentPeriodEnd)}` : "Ximo · acceso completo a la plataforma"}
              </p>
            </div>
            <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
          </div>

          <div className="mt-5 flex flex-wrap items-start gap-3">
            {active && stripeOn ? (
              <ManageButton />
            ) : !active ? (
              <Link href="/subscribe" className="ximo-glass-btn teal text-xs">Ver planes</Link>
            ) : null}
          </div>
        </GlassPanel>
      </ScrollReveal>

      <ScrollReveal delay={60}>
        <GlassPanel className="p-5">
          <h2 className="mb-4 text-base font-black" style={{ color: "var(--text)" }}>Detalles</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Plan", value: planLabel },
              { label: "Estado", value: s.label },
              { label: "Inicio del periodo", value: fmtDate(info?.currentPeriodStart ?? null) },
              { label: "Renovación", value: fmtDate(info?.currentPeriodEnd ?? null) },
              { label: "Correo de la cuenta", value: info?.email ?? "—" },
              { label: "Proveedor de pago", value: info?.provider ?? "Por configurar" },
            ].map((row) => (
              <InnerTile key={row.label} className="px-3.5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>{row.label}</p>
                <p className="mt-0.5 truncate text-sm font-bold" style={{ color: "var(--text)" }}>{row.value}</p>
              </InnerTile>
            ))}
          </div>
        </GlassPanel>
      </ScrollReveal>

      <ScrollReveal delay={90}>
        <GlassPanel className="p-5">
          <h2 className="mb-2 text-base font-black" style={{ color: "var(--text)" }}>¿Necesitas ayuda con tu suscripción?</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
            Para cambios de plan, cancelaciones o aclaraciones de pago, escríbenos desde el centro de ayuda y te
            respondemos lo antes posible.
          </p>
          <Link href="/app/help" className="ximo-glass-btn dark mt-4 inline-block text-xs">Ir a Ayuda</Link>
        </GlassPanel>
      </ScrollReveal>
    </div>
  );
}
