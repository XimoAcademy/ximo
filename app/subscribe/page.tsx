import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Emblem from "../components/Emblem";
import { activateSubscriptionAction } from "@/lib/auth/actions";
import { isSubscriptionActive } from "@/lib/subscription/requireSubscription";
import { isStripeConfigured, isAnnualConfigured, getDisplayPrices } from "@/lib/stripe/server";
import PlanCheckoutButton from "@/app/app/billing/PlanCheckoutButton";
import CheckoutConfirming from "./CheckoutConfirming";

export const metadata: Metadata = {
  title: "Suscripción · Ximo",
  description: "Activa tu suscripción a Ximo y desbloquea todas las herramientas de recruiting.",
};

const features = [
  "Dashboard deportivo completo",
  "Recruiting pipeline con etapas",
  "Comunidad de atletas serios",
  "Seguimiento de tareas diarias",
  "Gestión de documentos",
  "Progreso y marcas deportivas",
  "Coaches y universidades NCAA",
  "Oportunidades de promoción de marca",
];

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  if (await isSubscriptionActive()) redirect("/app");

  const { checkout } = await searchParams;
  const confirming = checkout === "success";
  const stripeOn = isStripeConfigured();
  const annualOn = isAnnualConfigured();
  const prices = stripeOn ? await getDisplayPrices() : {};

  const monthlyPrice = prices.monthly?.label ?? "$49 USD";
  const annualPrice = prices.annual?.label ?? null;
  // Months-free equivalent when both real prices share a currency. Kept to one
  // decimal so "1.5 meses gratis" reads honestly instead of rounding to 2.
  const monthsFree =
    prices.monthly && prices.annual && prices.monthly.currency === prices.annual.currency
      ? Math.max(0, Math.round((12 - prices.annual.amount / prices.monthly.amount) * 10) / 10)
      : null;
  const savingsLabel =
    monthsFree && monthsFree > 0
      ? `${monthsFree} ${monthsFree === 1 ? "mes gratis" : "meses gratis"}`
      : null;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute" style={{ width: 600, height: 600, top: "-15%", left: "-10%", background: "radial-gradient(circle, var(--teal-bg) 0%, transparent 65%)", filter: "blur(80px)" }} />
        <div className="absolute" style={{ width: 500, height: 500, bottom: "-10%", right: "-8%", background: "radial-gradient(circle, var(--gold-bg) 0%, transparent 65%)", filter: "blur(80px)" }} />
      </div>
      <div className="ximo-soft-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className={`relative z-10 w-full ${annualOn ? "max-w-[820px]" : "max-w-[480px]"}`}>
        <div className="mb-10 flex justify-center">
          <Emblem size={96} />
        </div>

        {confirming ? (
          <CheckoutConfirming />
        ) : (
          <>
            <div className="ximo-fade-up mb-10 text-center">
              <h1 className="text-3xl font-black sm:text-4xl" style={{ color: "var(--text)" }}>
                Acceso completo
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                Una suscripción desbloquea toda la plataforma.
              </p>
            </div>

            <div className={`grid gap-5 ${annualOn ? "md:grid-cols-2" : ""}`}>
              {/* Monthly plan */}
              <div
                className="ximo-lift ximo-fade-up delay-100 rounded-3xl p-8"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--teal-border)",
                  boxShadow: "0 0 60px var(--teal-bg)",
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>Plan mensual</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-black" style={{ color: "var(--text)" }}>{monthlyPrice}</span>
                  <span className="text-sm font-medium" style={{ color: "var(--text-label)" }}>/ mes</span>
                </div>
                <p className="mt-1 text-[11px]" style={{ color: "var(--text-3)" }}>Facturado mensualmente · Cancela cuando quieras</p>

                <div className="my-7 h-px w-full" style={{ background: "var(--teal-border)" }} />

                <ul className="space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <span className="text-xs shrink-0" style={{ color: "var(--teal)" }}>✓</span>
                      <span className="text-[12px]" style={{ color: "var(--text-2)" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                {stripeOn ? (
                  <PlanCheckoutButton plan="monthly" label="Suscribirme ahora" className="ximo-glass-btn teal w-full text-sm" />
                ) : (
                  <form action={activateSubscriptionAction} className="mt-8 block">
                    <input type="hidden" name="plan" value="monthly" />
                    <button type="submit" className="ximo-glass-btn teal w-full text-sm">
                      Suscribirme ahora
                    </button>
                  </form>
                )}
              </div>

              {/* Annual plan — only when configured in Stripe */}
              {annualOn && (
                <div
                  className="ximo-lift ximo-fade-up delay-200 relative rounded-3xl p-8"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--gold-border)",
                    boxShadow: "0 0 60px var(--gold-bg)",
                  }}
                >
                  {savingsLabel && (
                    <span
                      className="absolute -top-3 right-6 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider"
                      style={{ background: "var(--gold)", color: "#0B1F33" }}
                    >
                      {savingsLabel}
                    </span>
                  )}
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--gold)" }}>Plan anual</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-black" style={{ color: "var(--text)" }}>{annualPrice ?? "Plan anual"}</span>
                    {annualPrice && <span className="text-sm font-medium" style={{ color: "var(--text-label)" }}>/ año</span>}
                  </div>
                  <p className="mt-1 text-[11px]" style={{ color: "var(--text-3)" }}>Facturado anualmente · Cancela cuando quieras</p>

                  <div className="my-7 h-px w-full" style={{ background: "var(--gold-border)" }} />

                  <ul className="space-y-3">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <span className="text-xs shrink-0" style={{ color: "var(--gold)" }}>✓</span>
                        <span className="text-[12px]" style={{ color: "var(--text-2)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <PlanCheckoutButton plan="annual" label="Suscribirme al año" className="ximo-glass-btn gold w-full text-sm" />
                </div>
              )}
            </div>

            <p className="ximo-fade-up delay-300 mt-8 text-center text-[10px]" style={{ color: "var(--text-3)" }}>
              Sin plan gratuito · Acceso inmediato al activar · La suscripción se renueva automáticamente y puedes cancelarla en cualquier momento desde Facturación
            </p>

            <div className="ximo-fade-up delay-400 mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] font-medium" style={{ color: "var(--text-3)" }}>
              <Link href="/login" className="transition-opacity hover:opacity-70">Iniciar sesión</Link>
              <span style={{ color: "var(--border-strong)" }}>·</span>
              <Link href="/terminos" className="transition-opacity hover:opacity-70">Términos</Link>
              <span style={{ color: "var(--border-strong)" }}>·</span>
              <Link href="/privacidad" className="transition-opacity hover:opacity-70">Privacidad</Link>
              <span style={{ color: "var(--border-strong)" }}>·</span>
              <Link href="/" className="transition-opacity hover:opacity-70">Página principal</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
