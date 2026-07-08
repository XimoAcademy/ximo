"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import { signOutAction } from "@/lib/auth/actions";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: string;
}
interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Principal",
    items: [
      { href: "/app",           label: "Inicio",     icon: "◆" },
      { href: "/app/comunidad", label: "Comunidad",  icon: "◉" },
      { href: "/app/tareas",    label: "Tareas",     icon: "☐" },
    ],
  },
  {
    label: "Recruiting",
    items: [
      { href: "/app/recruiting",    label: "Recruiting",    icon: "◈" },
      { href: "/app/directorio",    label: "Directorio NCAA", icon: "◎" },
      { href: "/app/universidades", label: "Universidades", icon: "◫" },
      { href: "/app/coaches",       label: "Coaches",       icon: "⬘" },
      { href: "/app/correos",       label: "Correos",       icon: "✉" },
      { href: "/app/documentos",    label: "Documentos",    icon: "▣" },
    ],
  },
  {
    label: "Desarrollo",
    items: [
      { href: "/app/progreso",  label: "Progreso",  icon: "◑" },
      { href: "/app/cursos",    label: "Cursos",    icon: "◳" },
      { href: "/app/sat-toefl", label: "SAT/TOEFL", icon: "◇" },
    ],
  },
  {
    label: "Oportunidades",
    items: [
      { href: "/app/marcas",      label: "Marcas",            icon: "◇" },
      { href: "/app/promocionar", label: "Promocionar marca", icon: "◈" },
    ],
  },
  // "Cuenta" (Configuración, Facturación, Notificaciones, Ayuda) now lives
  // inside /app/perfil instead of the sidebar.
];

const adminGroup: NavGroup = {
  label: "Admin",
  items: [
    { href: "/app/admin/moderation", label: "Moderación", icon: "⚑" },
    { href: "/app/admin/ads", label: "Anuncios", icon: "◈" },
  ],
};

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname.startsWith(href);
}

export interface ShellIdentity {
  name: string;
  initials: string;
  sport: string;
  gradYear: number | null;
  country: string | null;
}

const STREAK_GOAL = 30;

export default function AppShell({
  children,
  identity,
  isAdmin = false,
  unreadCount = 0,
  streak = 0,
}: {
  children: ReactNode;
  identity?: ShellIdentity | null;
  isAdmin?: boolean;
  unreadCount?: number;
  streak?: number;
}) {
  const baseGroups = isAdmin ? [...navGroups, adminGroup] : navGroups;
  // Inject the real unread-notifications badge onto the Notificaciones item.
  const groups: NavGroup[] = baseGroups.map((g) => ({
    ...g,
    items: g.items.map((it) =>
      it.href === "/app/notifications" && unreadCount > 0
        ? { ...it, badge: unreadCount > 9 ? "9+" : String(unreadCount) }
        : it
    ),
  }));
  const allItems = groups.flatMap((g) => g.items);
  const pathname = usePathname();

  const name = identity?.name ?? "Atleta";
  const initials = identity?.initials ?? "XI";
  const subline = [identity?.sport ?? "Natación", identity?.gradYear ?? null, identity?.country ?? null]
    .filter(Boolean)
    .join(" · ");
  const pct = Math.min(100, Math.round((streak / STREAK_GOAL) * 100));
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (l: string) => setCollapsed((p) => ({ ...p, [l]: !p[l] }));

  return (
    <div className="ximo-app-scrim flex min-h-screen" style={{ background: "transparent" }}>

      <a href="#main-content" className="ximo-skip-link">Saltar al contenido</a>

      {/* ── Sidebar ── */}
      <aside
        className="hidden w-[216px] shrink-0 flex-col lg:flex overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%)",
          backdropFilter: "blur(22px) saturate(150%)",
          WebkitBackdropFilter: "blur(22px) saturate(150%)",
          borderRight: "1px solid var(--border-subtle)",
          boxShadow: "inset -1px 0 0 rgba(255,255,255,0.05)",
        }}
      >

        {/* Logo — cropped emblem (zoomed past the image whitespace) + Argent wordmark */}
        <div className="shrink-0 border-b px-4 py-4" style={{ borderColor: "var(--border-subtle)" }}>
          <Link href="/app" className="flex items-center gap-2">
            <div
              aria-label="Ximo"
              role="img"
              className="shrink-0"
              style={{
                width: 60,
                height: 60,
                backgroundImage: "url(/brand/ximo-logo.png)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center 46%",
                backgroundSize: "480%",
                // Glow + ring so the mark reads clearly on the dark sidebar.
                borderRadius: "14px",
                boxShadow: "inset 0 0 0 1px rgba(30,206,206,0.18), 0 0 14px rgba(30,206,206,0.35)",
                filter: "drop-shadow(0 0 6px rgba(30,206,206,0.5))",
              }}
            />
            <span className="font-display text-2xl font-bold leading-none" style={{ color: "var(--text)" }}>
              Ximo
            </span>
          </Link>
          <span
            className="mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase"
            style={{ borderColor: "var(--gold-border)", color: "var(--gold)", background: "var(--gold-bg)" }}
          >
            México primero
          </span>
        </div>

        {/* Profile */}
        <div className="shrink-0 border-b px-3 py-3" style={{ borderColor: "var(--surface-hover)" }}>
          <Link
            href="/app/perfil"
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all duration-200 hover:bg-[var(--border-subtle)]"
            style={{ background: "var(--surface-hover)" }}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-black"
              style={{
                background: "linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.07))",
                color: "var(--gold)",
                border: "1px solid rgba(201,168,76,0.18)",
              }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold" style={{ color: "var(--text)" }}>{name}</p>
              <p className="truncate text-[10px]" style={{ color: "var(--text-label)" }}>{subline}</p>
            </div>
          </Link>
        </div>

        {/* Daily streak */}
        <div className="shrink-0 border-b px-3 py-3" style={{ borderColor: "var(--surface-hover)" }}>
          <div
            className="rounded-xl p-3"
            style={{
              background: "var(--surface-hover)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>
                Racha diaria
              </p>
              <span className="text-[11px] font-black" style={{ color: "var(--gold)" }}>
                {streak}d
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div
                className="h-full rounded-full ximo-progress-bar"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, var(--teal-muted), var(--gold))",
                  "--progress-width": `${pct}%`,
                } as React.CSSProperties}
              />
            </div>
            <p className="mt-1.5 text-[9px]" style={{ color: "var(--text-label)" }}>
              {streak <= 0
                ? "Comienza tu racha hoy"
                : streak >= STREAK_GOAL
                  ? "¡Meta alcanzada! 🔥"
                  : `${STREAK_GOAL - streak} días para la meta`}
            </p>
          </div>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5">
          {groups.map((group) => {
            const open = !collapsed[group.label];
            return (
              <div key={group.label} className="mb-0.5">
                <button
                  type="button"
                  onClick={() => toggle(group.label)}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors duration-150 hover:text-[var(--text-2)]"
                  style={{ color: "var(--text-3)" }}
                >
                  <span className="text-[9px] font-bold tracking-widest uppercase">{group.label}</span>
                  <span className="text-[10px]">{open ? "˄" : "˅"}</span>
                </button>
                {open && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const active = isActive(pathname, item.href);
                      const hasBadge = "badge" in item && item.badge;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-[12px] font-medium transition-all duration-150 ${active ? "ximo-glass-chip active" : "hover:bg-[var(--surface-hover)]"}`}
                          style={active ? undefined : { color: "var(--text-2)" }}
                        >
                          <span className="w-3.5 shrink-0 text-center text-[10px] opacity-50">
                            {item.icon}
                          </span>
                          <span className="flex-1 truncate">{item.label}</span>
                          {hasBadge && (
                            <span
                              className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                              style={{ background: "var(--border)", color: "var(--teal)" }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Subscription status */}
        <div className="shrink-0 border-t px-3 py-3" style={{ borderColor: "var(--surface-hover)" }}>
          <div
            className="mb-3 flex items-center gap-2 rounded-xl px-3 py-2"
            style={{ background: "var(--border-subtle)", border: "1px solid var(--border)" }}
          >
            <div className="h-1.5 w-1.5 rounded-full shrink-0 ximo-glow-pulse" style={{ background: "var(--teal-muted)" }} />
            <span className="text-[10px] font-semibold" style={{ color: "var(--text-label)" }}>
              Ximo active
            </span>
          </div>
          <form action={signOutAction} className="mb-2">
            <button type="submit" className="ximo-glass-chip flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold" style={{ color: "var(--text-2)" }}>
              <span aria-hidden>⎋</span> Cerrar sesión
            </button>
          </form>
          <p className="text-center text-[9px] font-medium tracking-wide" style={{ color: "var(--text-3)" }}>
            Ximo · México primero
          </p>
        </div>
      </aside>

      {/* ── Mobile top nav ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div
          className="sticky top-0 z-30 flex items-center gap-3 px-3 py-2 lg:hidden"
          style={{
            background: "var(--surface)",
            backdropFilter: "blur(20px) saturate(150%)",
            WebkitBackdropFilter: "blur(20px) saturate(150%)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <Link href="/app" className="flex shrink-0 items-center gap-1.5">
            <Image
              src="/brand/ximo-logo.png"
              alt="Ximo"
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 object-contain"
            />
            <span className="font-display text-base font-bold leading-none" style={{ color: "var(--text)" }}>
              Ximo
            </span>
          </Link>
          <div className="flex flex-1 gap-1 overflow-x-auto pb-0.5 scrollbar-none">
            {allItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-colors ${active ? "ximo-glass-chip active" : ""}`}
                  style={active ? undefined : { color: "var(--text-2)" }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <main id="main-content" className="flex-1 overflow-y-auto" style={{ background: "transparent" }}>
          {/* Persistent demo banner — Ximo is offered as a free demo. */}
          <div
            className="flex items-center justify-center gap-2 px-4 py-1.5 text-center text-[11px] font-semibold"
            style={{ background: "var(--teal-bg)", borderBottom: "1px solid var(--teal-border)", color: "var(--teal)" }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--teal)" }} />
            Versión demo · estás probando Ximo gratis mientras desarrollamos la versión final.
          </div>
          <div className="mx-auto max-w-[1400px] p-4 sm:p-5 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
