import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale).ncaa;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: "/resources/ncaa-division-i-eligibility" },
  };
}

export default async function NcaaEligibilityPage() {
  const locale = await getLocale();
  const t = getDictionary(locale).ncaa;

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:py-16" style={{ color: "var(--text)" }}>
      {/* Breadcrumb + back */}
      <div className="mb-6 flex items-center justify-between gap-3 text-xs" style={{ color: "var(--text-label)" }}>
        <span className="font-bold uppercase tracking-widest">{t.breadcrumb}</span>
        <Link
          href="/app/perfil"
          className="font-semibold underline underline-offset-2"
          style={{ color: "var(--teal)" }}
        >
          ← {t.backLink}
        </Link>
      </div>

      {/* Title + summary */}
      <header className="ximo-fade-up">
        <h1 className="text-3xl font-black leading-tight sm:text-4xl">{t.title}</h1>
        <p className="mt-4 text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-2)" }}>
          {t.summary}
        </p>
        <p className="mt-3 text-[11px]" style={{ color: "var(--text-3)" }}>
          {t.lastReviewedLabel}: {t.lastReviewed}
        </p>
      </header>

      {/* Visual timeline (accessible HTML/CSS) */}
      <section aria-label={t.timeline.heading} className="ximo-fade-up mt-10">
        <h2 className="mb-4 text-sm font-black uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
          {t.timeline.heading}
        </h2>
        <ol className="grid gap-3 sm:grid-cols-4">
          {t.timeline.steps.map((step, i) => (
            <li
              key={step.label}
              className="relative rounded-2xl p-4"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black"
                style={{ background: "var(--teal-bg)", color: "var(--teal)", border: "1px solid var(--teal-border)" }}
              >
                {i + 1}
              </span>
              <p className="mt-2 text-sm font-bold">{step.label}</p>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Content sections */}
      <div className="mt-10 space-y-8">
        {t.sections.map((s) => (
          <section key={s.heading} className="ximo-fade-up">
            <h2 className="text-lg font-black sm:text-xl">{s.heading}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i} className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                {p}
              </p>
            ))}
            {s.bullets && (
              <ul className="mt-3 space-y-2">
                {s.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--teal)" }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {/* Examples */}
      <section className="ximo-fade-up mt-10">
        <h2 className="text-lg font-black sm:text-xl">{t.examples.heading}</h2>
        <p className="mt-1 text-[11px] italic" style={{ color: "var(--text-3)" }}>
          {t.examples.note}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {t.examples.items.map((ex) => (
            <div
              key={ex.title}
              className="rounded-2xl p-4"
              style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)" }}
            >
              <p className="text-sm font-bold">{ex.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>
                {ex.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Exceptions */}
      <section className="ximo-fade-up mt-10 rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <h2 className="text-base font-black">{t.exceptions.heading}</h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
          {t.exceptions.intro}
        </p>
        <ul className="mt-3 space-y-2">
          {t.exceptions.items.map((it) => (
            <li key={it} className="flex gap-2.5 text-sm" style={{ color: "var(--text-2)" }}>
              <span aria-hidden style={{ color: "var(--gold)" }}>•</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
          {t.exceptions.caveat}
        </p>
      </section>

      {/* Scope */}
      <section className="ximo-fade-up mt-10">
        <h2 className="text-lg font-black sm:text-xl">{t.scope.heading}</h2>
        <ul className="mt-3 space-y-2">
          {t.scope.items.map((it) => (
            <li key={it} className="flex gap-2.5 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--text-3)" }} />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Disclaimer */}
      <aside
        className="ximo-fade-up mt-10 rounded-2xl p-5"
        style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}
        role="note"
      >
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>
          {t.disclaimer}
        </p>
      </aside>

      {/* Sources */}
      <section className="ximo-fade-up mt-8">
        <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
          {t.sources.heading}
        </h2>
        <ul className="mt-3 space-y-2">
          {t.sources.items.map((src) => (
            <li key={src.url}>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold underline underline-offset-2"
                style={{ color: "var(--teal)" }}
              >
                {src.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 border-t pt-6" style={{ borderColor: "var(--border-subtle)" }}>
        <Link href="/app/perfil" className="ximo-glass-btn dark inline-block text-sm">
          ← {t.backLink}
        </Link>
      </div>
    </main>
  );
}
