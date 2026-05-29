"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";

const navGroups = [
  {
    label: "Principal",
    items: [
      { href: "/app",           label: "Inicio",     icon: "◆" },
      { href: "/app/comunidad", label: "Comunidad",  icon: "◉", badge: "3" },
      { href: "/app/tareas",    label: "Tareas",     icon: "☐" },
    ],
  },
  {
    label: "Recruiting",
    items: [
      { href: "/app/recruiting",    label: "Recruiting",    icon: "◈" },
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
      { href: "/app/promocionar", label: "Promocionar marca", icon: "◈" },
    ],
  },
];

const allItems = navGroups.flatMap((g) => g.items);

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname.startsWith(href);
}

const STREAK = { current: 7, goal: 30 };

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const pct = Math.round((STREAK.current / STREAK.goal) * 100);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (l: string) => setCollapsed((p) => ({ ...p, [l]: !p[l] }));

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>

      {/* ── Sidebar ── */}
      <aside
        className="hidden w-[216px] shrink-0 flex-col lg:flex overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, var(--bg) 0%, var(--bg-mid) 100%)",
          borderRight: "1px solid var(--border-subtle)",
        }}
      >

        {/* Logo — emblem + Argent wordmark */}
        <div className="shrink-0 border-b px-4 py-4" style={{ borderColor: "var(--border-subtle)" }}>
          <Link href="/app" className="flex items-center gap-2.5">
            <Image
              src="/brand/ximo-logo.png"
              alt="Ximo"
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 object-contain"
              priority
            />
            <span className="font-display text-xl font-bold leading-none" style={{ color: "var(--text)" }}>
              Ximo
            </span>
          </Link>
          <span
            className="mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase"
            style={{ borderColor: "var(--gold-border)", color: "var(--gold)", background: "var(--gold-bg)" }}
          >
            App en desarrollo
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
              MZ
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold" style={{ color: "var(--text)" }}>Manuel Zúñiga</p>
              <p className="text-[10px]" style={{ color: "var(--text-label)" }}>Nadador · 2027 · MX</p>
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
                {STREAK.current}d
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
              {STREAK.goal - STREAK.current} días para la meta
            </p>
          </div>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5">
          {navGroups.map((group) => {
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
                          className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-[12px] font-medium transition-all duration-150 hover:bg-[var(--surface-hover)]"
                          style={
                            active
                              ? {
                                  background: "var(--teal-bg)",
                                  color: "var(--teal)",
                                  borderLeft: "2px solid var(--teal)",
                                  boxShadow: "inset 0 0 12px var(--surface-hover)",
                                }
                              : {
                                  color: "var(--text-2)",
                                  borderLeft: "2px solid transparent",
                                }
                          }
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
          <p className="text-center text-[9px] font-medium tracking-wide" style={{ color: "var(--text-3)" }}>
            Ximo · México primero
          </p>
        </div>
      </aside>

      {/* ── Mobile top nav ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div
          className="flex items-center gap-3 px-3 py-2 lg:hidden"
          style={{ background: "var(--bg)", borderBottom: "1px solid var(--border-subtle)" }}
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
                  className="shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-colors"
                  style={{
                    color: active ? "var(--teal)" : "var(--text-2)",
                    background: active ? "var(--teal-bg)" : "transparent",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto" style={{ background: "var(--bg)" }}>
          <div className="mx-auto max-w-[1400px] p-4 sm:p-5 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
