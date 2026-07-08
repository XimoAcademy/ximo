import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "../components/ScrollReveal";

export const metadata: Metadata = {
  title: "Cómo nace Ximo",
  description: "La historia detrás de Ximo, documentada en público paso a paso.",
};

/**
 * "Cómo nace Ximo" — styled to match the home journey: dark premium panels,
 * glass borders, teal/gold accents and the same typographic rhythm.
 */

const panel =
  "rounded-3xl border border-white/10 bg-[rgba(8,11,22,0.65)] px-7 py-10 backdrop-blur-md shadow-2xl sm:px-11 sm:py-12";

const platforms = [
  {
    name: "Instagram",
    handle: "@delfinmanny_",
    text: "Avances, historias y decisiones del proyecto, contadas día a día.",
    link: "https://www.instagram.com/delfinmanny_/",
    cta: "Ver Instagram ↗",
  },
  {
    name: "TikTok",
    handle: "@delfinmanny",
    text: "Videos cortos sobre el proceso, los aprendizajes y la construcción de Ximo desde cero.",
    link: "https://www.tiktok.com/@delfinmanny",
    cta: "Ver TikTok ↗",
  },
  {
    name: "YouTube",
    handle: "@delfinmanny",
    text: "Contenido a fondo sobre recruiting, becas, universidades y la visión detrás de Ximo.",
    link: "https://www.youtube.com/@delfinmanny",
    cta: "Ver YouTube ↗",
  },
  {
    name: "Zoop",
    handle: "Acceso fundador",
    text: "El espacio más cercano: avances antes que en redes, detrás de cámaras y prioridad para futuras pruebas.",
    link: "https://app.zoop.club/delfinmanny",
    cta: "Entrar a Zoop ↗",
  },
];

export default function BuildLog() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060912] px-6 py-16 text-white sm:py-24">
      {/* Ambient glow to echo the journey's enchanted atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 0%, rgba(30,206,206,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 100%, rgba(201,168,76,0.08) 0%, transparent 70%)",
        }}
      />

      <section className="relative z-10 mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-bold text-[#1ECECE] transition-opacity hover:opacity-80">
          ← Volver al inicio
        </Link>

        {/* Hero */}
        <ScrollReveal className="mt-14">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
              Detrás de Ximo
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Sé parte del camino que está dando vida a Ximo.
            </h1>
            <p className="mt-7 text-base leading-8 text-white/70 md:text-lg">
              Esta etapa es una invitación a entrar desde el inicio: ver cómo nace
              Ximo, acompañar las decisiones y ser parte de una plataforma hecha
              para que más atletas mexicanos encuentren su oportunidad.
            </p>
            <p className="mt-5 text-base leading-8 text-white/70 md:text-lg">
              El proceso también es parte de la historia. Todo se documenta en
              público, paso a paso.
            </p>
          </div>
        </ScrollReveal>

        {/* Platforms */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {platforms.map((platform, i) => (
            <ScrollReveal key={platform.name} delay={(i % 2) * 90} className="h-full">
              <a
                href={platform.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full rounded-3xl border border-white/10 bg-[rgba(8,11,22,0.65)] p-7 backdrop-blur-md transition hover:-translate-y-1 hover:border-[#1ECECE]/40 hover:shadow-[0_0_40px_rgba(30,206,206,0.15)] sm:p-8"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                      Sitio externo
                    </p>
                    <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">{platform.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-[#1ECECE]">{platform.handle}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white/85 transition group-hover:border-[#1ECECE]/50 group-hover:text-white">
                    {platform.cta}
                  </span>
                </div>
                <p className="mt-6 text-sm leading-7 text-white/65">{platform.text}</p>
              </a>
            </ScrollReveal>
          ))}
        </div>

        {/* Founder access */}
        <ScrollReveal className="mt-16" delay={60}>
          <div className={panel}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
              Acceso fundador
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight md:text-4xl">
              Sé parte del grupo que verá Ximo antes que todos.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/65">
              En Zoop compartimos el lado más cercano del proyecto: avances antes
              que en redes, detrás de cámaras, decisiones y prioridad para probar
              futuras versiones.
            </p>
            <a
              href="https://app.zoop.club/delfinmanny"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex rounded-xl bg-[#1ECECE] px-8 py-4 text-sm font-black uppercase tracking-wide text-[#06222a] shadow-[0_0_40px_rgba(30,206,206,0.35)] transition-transform hover:scale-[1.03]"
            >
              Entrar al acceso fundador ↗
            </a>
            <p className="mt-3 text-[11px] text-white/40">Zoop es una plataforma externa.</p>
          </div>
        </ScrollReveal>

        {/* Back to the journey */}
        <ScrollReveal className="mt-16 text-center" delay={80}>
          <Link
            href="/register"
            className="inline-block rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:border-[#1ECECE]/50"
          >
            Entrar al demo de Ximo →
          </Link>
        </ScrollReveal>
      </section>
    </main>
  );
}
