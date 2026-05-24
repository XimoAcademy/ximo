"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/app", label: "Inicio", icon: "◆" },
  { href: "/app/universidades", label: "Universidades", icon: "◫" },
  { href: "/app/coaches", label: "Coaches", icon: "⬘" },
  { href: "/app/correos", label: "Correos", icon: "✉" },
  { href: "/app/documentos", label: "Documentos", icon: "▣" },
  { href: "/app/progreso", label: "Progreso", icon: "◑" },
  { href: "/app/cursos", label: "Cursos", icon: "◳" },
  { href: "/app/sat-toefl", label: "SAT / TOEFL", icon: "◇" },
  { href: "/app/perfil", label: "Perfil", icon: "◷" },
];

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname.startsWith(href);
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#F5F5F0] text-[#0D1B2A]">
      <aside className="hidden w-[220px] shrink-0 flex-col bg-[#0A1C2E] lg:flex">
        <div className="border-b border-white/8 px-5 py-5">
          <Link href="/app" className="block">
            <Image
              src="/brand/ximo-logo.png"
              alt="ximo Academy"
              width={120}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
            <span className="mt-3 inline-flex items-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/12 px-2.5 py-0.5 text-[9px] font-bold tracking-wide text-[#C9A84C] uppercase">
              Beta privada
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors ${
                  active
                    ? "border-l-2 border-[#C9A84C] bg-white/8 text-white"
                    : "border-l-2 border-transparent text-white/45 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                <span className="text-[11px] opacity-70">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/8 px-4 py-4">
          <p className="mb-3 text-center text-[9px] font-medium tracking-wide text-white/25">
            ximo Academy · México primero
          </p>
          <Link
            href="/app/perfil"
            className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5 transition-colors hover:bg-white/8"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9A84C]/20 text-xs font-bold text-[#C9A84C]">
              MZ
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">
                Manuel Zúñiga
              </p>
              <p className="text-[10px] text-white/35">
                Nadador · Clase 2027 · MX
              </p>
            </div>
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-[#0B1F33]/8 bg-[#0A1C2E] px-3 py-2 lg:hidden">
          <Image
            src="/brand/ximo-logo.png"
            alt="ximo Academy"
            width={80}
            height={28}
            className="h-7 w-auto shrink-0 object-contain"
          />
          <div className="flex flex-1 gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap ${
                    active
                      ? "bg-[#C9A84C]/20 text-[#C9A84C]"
                      : "text-white/50"
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
