import Link from "next/link";
import Emblem from "./Emblem";
import ScrollReveal from "./ScrollReveal";
import ThemeToggleButton from "./ThemeToggleButton";

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export default function LegalShell({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string[];
  sections: LegalSection[];
}) {
  return (
    <div className="relative min-h-screen px-5 py-12 sm:py-16">
      <ThemeToggleButton className="absolute right-4 top-4 z-30" />

      <div className="mx-auto w-full max-w-[760px]">
        <Link href="/" className="mb-8 inline-flex items-center gap-2">
          <Emblem size={40} />
          <span className="font-display text-xl font-bold" style={{ color: "var(--text)" }}>Ximo</span>
        </Link>

        <h1 className="text-3xl font-black sm:text-4xl" style={{ color: "var(--text)" }}>{title}</h1>
        <p className="mt-2 text-xs" style={{ color: "var(--text-label)" }}>Última actualización: {updated}</p>

        <div className="mt-7 space-y-4">
          {intro.map((p, i) => (
            <p key={i} className="text-[15px] leading-relaxed" style={{ color: "var(--text-2)" }}>{p}</p>
          ))}
        </div>

        <div className="mt-8 space-y-8">
          {sections.map((s, i) => (
            <ScrollReveal key={i} as="section">
              <h2 className="text-lg font-black sm:text-xl" style={{ color: "var(--text)" }}>
                {i + 1}. {s.heading}
              </h2>
              {s.paragraphs?.map((p, j) => (
                <p key={j} className="mt-2.5 text-[15px] leading-relaxed" style={{ color: "var(--text-2)" }}>{p}</p>
              ))}
              {s.list && (
                <ul className="mt-3 space-y-2">
                  {s.list.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-[15px] leading-relaxed" style={{ color: "var(--text-2)" }}>
                      <span className="mt-1 shrink-0" style={{ color: "var(--teal)" }}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollReveal>
          ))}
        </div>

        {/* TODO(legal-review): retirar o ajustar esta nota cuando un abogado
            titulado haya validado el documento para el lanzamiento comercial. */}
        <div className="mt-12 rounded-2xl px-5 py-4" style={{ background: "var(--surface-hover)", border: "1px dashed var(--border-strong)" }}>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>
            Este documento fue redactado de forma original con base en la legislación mexicana aplicable
            (incluida la LFPDPPP y la Ley Federal de Protección al Consumidor) y refleja la operación actual
            de Ximo en fase demo. Antes del lanzamiento comercial será revisado por un profesional del derecho.
            Si tienes dudas, escríbenos a ximoacademy@gmail.com.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t pt-6 text-xs" style={{ borderColor: "var(--border)", color: "var(--text-label)" }}>
          <Link href="/terminos" className="font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--teal)" }}>Términos</Link>
          <Link href="/privacidad" className="font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--teal)" }}>Privacidad</Link>
          <Link href="/cookies" className="font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--teal)" }}>Cookies</Link>
          <Link href="/politica-de-anuncios" className="font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--teal)" }}>Anuncios</Link>
          <Link href="/terminos-anunciantes" className="font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--teal)" }}>Anunciantes</Link>
          <Link href="/reglas-comunidad" className="font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--teal)" }}>Comunidad</Link>
          <Link href="/" className="transition-opacity hover:opacity-70">Inicio</Link>
        </div>
      </div>
    </div>
  );
}
