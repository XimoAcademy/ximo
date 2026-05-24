"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navGroups = [
  {
    label: "Principal",
    items: [
      { href: "/app", label: "Inicio", icon: "◆" },
      { href: "/app/comunidad", label: "Comunidad", icon: "◉" },
      { href: "/app/marcas", label: "Marcas", icon: "◈" },
    ],
  },
  {
    label: "Recruiting",
    items: [
      { href: "/app/universidades", label: "Universidades", icon: "◫" },
      { href: "/app/coaches", label: "Coaches", icon: "⬘" },
      { href: "/app/correos", label: "Correos", icon: "✉" },
      { href: "/app/documentos", label: "Documentos", icon: "▣" },
    ],
  },
  {
    label: "Desarrollo",
    items: [
      { href: "/app/progreso", label: "Progreso", icon: "◑" },
      { href: "/app/cursos", label: "Cursos", icon: "◳" },
      { href: "/app/sat-toefl", label: "SAT / TOEFL", icon: "◇" },
      { href: "/app/perfil", label: "Perfil", icon: "◷" },
    ],
  },
];

const allNavItems = navGroups.flatMap((g) => g.items);

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname.startsWith(href);
}

// Later: replace with real streak from Supabase user profile
const STREAK = { current: 7, goal: 30 };

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const streakPct = Math.round((STREAK.current / STREAK.goal) * 100);

  return (
    <div className="flex min-h-screen bg-[#F5F5F0] text-[#0D1B2A]">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden w-[224px] shrink-0 flex-col bg-[#0A1C2E] lg:flex">
        {/* Logo */}
        <div className="border-b border-white/8 px-5 py-4">
          <Link href="/app" className="block">
            <Image
              src="/brand/ximo-logo.png"
              alt="ximo Academy"
              width={110}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/12 px-2.5 py-0.5 text-[9px] font-bold tracking-widest text-[#C9A84C] uppercase">
              Beta privada
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/6 px-2 py-0.5 text-[9px] font-semibold text-white/40">
              MX
            </span>
          </div>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 px-2 text-[9px] font-bold tracking-widest text-white/25 uppercase">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-all duration-150 ${
                        active
                          ? "border-l-2 border-[#C9A84C] bg-white/10 text-white"
                          : "border-l-2 border-transparent text-white/40 hover:bg-white/5 hover:text-white/80"
                      }`}
                    >
                      <span className="w-4 text-center text-[11px] opacity-60">
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.href === "/app/comunidad" && (
                        <span className="rounded-full bg-[#C9A84C]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#C9A84C]">
                          3
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Streak card */}
        <div className="border-t border-white/8 px-3 py-3">
          <div className="rounded-xl bg-white/5 border border-white/8 px-3 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                Racha diaria
              </p>
              <span className="text-[11px] font-black text-[#C9A84C]">
                🔥 {STREAK.current}d
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#C9A84C] to-[#e8c76a] transition-all"
                style={{ width: `${streakPct}%` }}
              />
            </div>
            <p className="mt-1.5 text-[9px] text-white/30">
              Meta: {STREAK.goal} días · {STREAK.goal - STREAK.current} restantes
            </p>
          </div>
        </div>

        {/* User footer */}
        <div className="border-t border-white/8 px-3 py-3">
          <Link
            href="/app/perfil"
            className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5 transition-colors hover:bg-white/8"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C9A84C]/20 text-xs font-black text-[#C9A84C]">
              MZ
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">
                Manuel Zúñiga
              </p>
              <p className="text-[10px] text-white/35">Nadador · 2027 · MX</p>
            </div>
          </Link>
          <p className="mt-2.5 text-center text-[9px] font-medium tracking-wide text-white/20">
            ximo Academy · México primero
          </p>
        </div>
      </aside>

      {/* ── Mobile top nav ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-white/8 bg-[#0A1C2E] px-3 py-2 lg:hidden">
          <Image
            src="/brand/ximo-logo.png"
            alt="ximo Academy"
            width={72}
            height={26}
            className="h-6 w-auto shrink-0 object-contain"
          />
          <div className="flex flex-1 gap-1 overflow-x-auto scrollbar-none pb-0.5">
            {allNavItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    active
                      ? "bg-[#C9A84C]/20 text-[#C9A84C]"
                      : "text-white/45 hover:text-white/70"
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
