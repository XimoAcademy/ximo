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
      { href: "/app",          label: "Inicio",     icon: "◆" },
      { href: "/app/comunidad",label: "Comunidad",  icon: "◉", badge: "3" },
      { href: "/app/tareas",   label: "Tareas",     icon: "☐" },
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

const allNavItems = navGroups.flatMap((g) => g.items);

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname.startsWith(href);
}

const STREAK = { current: 7, goal: 30 };

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const streakPct = Math.round((STREAK.current / STREAK.goal) * 100);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (label: string) =>
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <div className="flex min-h-screen bg-[#F5F5F0] text-[#0D1B2A]">
      {/* ── Sidebar ── */}
      <aside className="hidden w-[212px] shrink-0 flex-col bg-[#07131F] lg:flex overflow-y-auto">

        {/* Logo + badge */}
        <div className="border-b border-white/6 px-4 py-4 shrink-0">
          <Link href="/app" className="block">
            <Image
              src="/brand/ximo-logo.png"
              alt="ximo Academy"
              width={100}
              height={32}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-full border border-[#C9A84C]/25 bg-[#C9A84C]/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-[#C9A84C] uppercase">
              Beta privada
            </span>
          </div>
        </div>

        {/* Profile — links to /app/perfil */}
        <div className="border-b border-white/6 px-3 py-3 shrink-0">
          <Link
            href="/app/perfil"
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-white/5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C9A84C]/15 text-[11px] font-black text-[#C9A84C]">
              MZ
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white/90">Manuel Zúñiga</p>
              <p className="text-[10px] text-white/30">Nadador · 2027 · MX</p>
            </div>
          </Link>
        </div>

        {/* Daily streak */}
        <div className="border-b border-white/6 px-3 py-3 shrink-0">
          <div className="rounded-xl border border-white/6 bg-white/4 px-3 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[9px] font-bold text-white/35 uppercase tracking-wider">Racha diaria</p>
              <span className="text-[11px] font-black text-[#C9A84C]">🔥 {STREAK.current}d</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#C9A84C] to-[#e8c76a]"
                style={{ width: `${streakPct}%` }}
              />
            </div>
            <p className="mt-1.5 text-[9px] text-white/25">
              {STREAK.goal - STREAK.current} días para la meta
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5">
          {navGroups.map((group) => {
            const isOpen = !collapsed[group.label];
            return (
              <div key={group.label} className="mb-1">
                <button
                  type="button"
                  onClick={() => toggle(group.label)}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[9px] font-bold tracking-widest text-white/25 uppercase hover:text-white/40 transition-colors"
                >
                  <span>{group.label}</span>
                  <span className="text-[10px] font-normal">{isOpen ? "˄" : "˅"}</span>
                </button>
                {isOpen && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const active = isActive(pathname, item.href);
                      const hasBadge = "badge" in item && item.badge;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-[12px] font-medium transition-all duration-150 ${
                            active
                              ? "bg-[#2F7F86]/20 text-[#7FAFB2] border-l-2 border-[#2F7F86]"
                              : "text-white/35 hover:bg-white/4 hover:text-white/70 border-l-2 border-transparent"
                          }`}
                        >
                          <span className="w-3.5 text-center text-[10px] opacity-50 shrink-0">
                            {item.icon}
                          </span>
                          <span className="flex-1 truncate">{item.label}</span>
                          {hasBadge && (
                            <span className="rounded-full bg-[#2F7F86]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#7FAFB2]">
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

        {/* Footer */}
        <div className="border-t border-white/6 px-3 py-3 shrink-0">
          <p className="text-center text-[9px] font-medium tracking-wide text-white/15">
            ximo Academy · México primero
          </p>
        </div>
      </aside>

      {/* ── Mobile top nav ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-white/8 bg-[#07131F] px-3 py-2 lg:hidden">
          <Image
            src="/brand/ximo-logo.png"
            alt="ximo Academy"
            width={68}
            height={24}
            className="h-6 w-auto shrink-0 object-contain"
          />
          <div className="flex flex-1 gap-1 overflow-x-auto pb-0.5">
            {allNavItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    active
                      ? "bg-[#2F7F86]/20 text-[#7FAFB2]"
                      : "text-white/40 hover:text-white/65"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] p-4 sm:p-5 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
