import Link from "next/link";
import PageHeader from "../components/PageHeader";
import { GlassPanel, StatusBadge } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";
import { getFullProfile } from "@/lib/data/profile";
import { getCurrentUser } from "@/lib/auth/getUser";
import { computeInitials } from "@/lib/data/identity";
import ProfileForm from "./ProfileForm";
import AvatarUploader from "./AvatarUploader";

export const dynamic = "force-dynamic";

const SUB_LABEL: Record<string, string> = {
  active: "Activa",
  manual_active: "Activa",
  trialing: "Periodo de prueba",
  past_due: "Pago pendiente",
  canceled: "Cancelada",
  inactive: "Inactiva",
};

export default async function PerfilPage() {
  const [{ profile, athlete }, user] = await Promise.all([getFullProfile(), getCurrentUser()]);
  const name = profile?.full_name || "Atleta Ximo";
  const initials = computeInitials(name);
  const subStatus = profile?.subscription_status ?? "inactive";
  const subActive = ["active", "manual_active", "trialing"].includes(subStatus);

  return (
    <>
      <div className="mb-2 flex items-start justify-between gap-3">
        <PageHeader title="Perfil del atleta" subtitle="Tu información deportiva, académica y personal para recruiting." />
        <Link href="/app/settings" aria-label="Configuración" title="Configuración"
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 hover:opacity-80"
          style={{ background: "var(--teal-bg)", border: "1px solid var(--teal-border)", color: "var(--teal)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="8" cy="8" r="2.5" />
            <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M2.93 2.93l1.06 1.06M12.01 12.01l1.06 1.06M2.93 13.07l1.06-1.06M12.01 3.99l1.06-1.06" />
          </svg>
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_288px]">
        <div className="space-y-5">
          <ScrollReveal>
            <GlassPanel className="p-5 sm:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                {user && <AvatarUploader userId={user.id} initials={initials} initialUrl={profile?.avatar_url ?? null} />}
                <div className="text-right">
                  <p className="text-lg font-black" style={{ color: "var(--text)" }}>{name}</p>
                  <p className="text-sm" style={{ color: "var(--text-label)" }}>
                    {[profile?.sport || "Natación", profile?.country].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
              <ProfileForm profile={profile} athlete={athlete} />
            </GlassPanel>
          </ScrollReveal>
        </div>

        <div className="space-y-5">
          <ScrollReveal delay={40}>
            <GlassPanel className="p-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>Cuenta</p>
              <nav className="space-y-1">
                {[
                  { href: "/app/settings", label: "Configuración", icon: "⚙" },
                  { href: "/app/billing", label: "Facturación", icon: "▤" },
                  { href: "/app/notifications", label: "Notificaciones", icon: "◔" },
                  { href: "/app/help", label: "Ayuda", icon: "?" },
                ].map((it) => (
                  <Link key={it.href} href={it.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--surface-hover)]"
                    style={{ color: "var(--text-2)" }}>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs"
                      style={{ background: "var(--surface-hover)", color: "var(--teal)" }}>{it.icon}</span>
                    <span className="text-sm font-semibold">{it.label}</span>
                    <span className="ml-auto text-xs" style={{ color: "var(--text-3)" }}>→</span>
                  </Link>
                ))}
              </nav>
            </GlassPanel>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <GlassPanel className="p-5" tone={subActive ? "teal" : "default"}>
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full ximo-glow-pulse" style={{ background: subActive ? "var(--teal-muted)" : "var(--text-3)" }} />
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>Suscripción</p>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "var(--text-3)" }}>Estado</span>
                  <StatusBadge tone={subActive ? "success" : "warning"}>{SUB_LABEL[subStatus] ?? subStatus}</StatusBadge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "var(--text-3)" }}>Plan</span>
                  <span className="text-xs font-bold" style={{ color: "var(--text)" }}>
                    {profile?.plan_type === "annual" ? "Anual" : profile?.plan_type === "monthly" ? "Mensual" : "—"}
                  </span>
                </div>
              </div>
              <Link href="/app/billing" className="ximo-glass-btn teal mt-4 block w-full text-center text-xs">Gestionar suscripción</Link>
            </GlassPanel>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <GlassPanel className="p-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>Tu progreso</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                Registra tus marcas en Progreso para que tu perfil muestre tus mejores tiempos y tu índice de fortaleza por estilo.
              </p>
              <Link href="/app/progreso" className="ximo-glass-btn dark mt-4 block w-full text-center text-xs">Ir a Progreso →</Link>
            </GlassPanel>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <GlassPanel className="p-5" tone="gold">
              <p className="mb-1.5 text-xs font-black" style={{ color: "var(--gold)" }}>¿Representas una marca?</p>
              <p className="mb-3 text-[11px] leading-relaxed" style={{ color: "var(--text-3)" }}>
                Promociona productos, descuentos o patrocinios dentro de Ximo, con revisión manual.
              </p>
              <Link href="/app/promocionar" className="ximo-glass-btn gold shiny block w-full text-center text-xs">Promocionar con Ximo →</Link>
            </GlassPanel>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
