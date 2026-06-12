import Link from "next/link";
import PageHeader from "../components/PageHeader";
import { GlassPanel, ProgressPill, StatusBadge } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";
import { COURSES, CATEGORIES, courseProgress, currentLesson } from "./courseData";
import { getCompletedLessons } from "@/lib/data/courses";

export const dynamic = "force-dynamic";

export default async function CursosPage() {
  const completed = await getCompletedLessons();
  const started = COURSES.filter((c) => courseProgress(c, completed).done > 0).length;

  return (
    <>
      <PageHeader title="Cursos" subtitle="Aprende el proceso que muchos atletas tienen que descubrir solos." />

      {/* Continue banner */}
      <ScrollReveal>
        <GlassPanel tone="gold" className="mb-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black" style={{ color: "var(--gold)" }}>
                Continúa donde lo dejaste
              </p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                Vas {started} de {COURSES.length} cursos en progreso. Cada lección se desbloquea al completar la anterior.
              </p>
            </div>
            {(() => {
              const c = COURSES[0];
              const lesson = currentLesson(c, completed);
              return (
                <Link href={`/app/cursos/${c.id}/${lesson.id}`} className="ximo-glass-btn gold shiny text-xs">
                  Continuar curso →
                </Link>
              );
            })()}
          </div>
        </GlassPanel>
      </ScrollReveal>

      {/* Category chips */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <span key={cat} className="ximo-glass-chip rounded-full px-3 py-1.5 text-[11px] font-bold">
            {cat}
          </span>
        ))}
      </div>

      {/* Course grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {COURSES.map((c, i) => {
          const p = courseProgress(c, completed);
          const started = p.done > 0;
          const lesson = currentLesson(c, completed);
          return (
            <ScrollReveal key={c.id} delay={i * 50}>
              <Link href={`/app/cursos/${c.id}`} className="block h-full">
                <GlassPanel className="flex h-full flex-col p-5">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <StatusBadge tone="info">{c.category}</StatusBadge>
                    {started ? (
                      <StatusBadge tone="success">{p.pct}% completado</StatusBadge>
                    ) : (
                      <StatusBadge tone="neutral">Nuevo</StatusBadge>
                    )}
                  </div>

                  <h2 className="text-base font-black leading-snug" style={{ color: "var(--text)" }}>
                    {c.title}
                  </h2>
                  <p className="mt-1.5 mb-4 flex-1 text-sm leading-relaxed" style={{ color: "var(--text-3)" }}>
                    {c.summary}
                  </p>

                  <div className="mb-3">
                    <ProgressPill value={p.pct} label={`${p.done}/${p.total} lecciones`} />
                  </div>

                  <span className="ximo-glass-btn teal text-center text-xs">
                    {started ? `Continuar · ${lesson.title}` : "Empezar curso"}
                  </span>
                </GlassPanel>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>

      <p className="mt-6 text-center text-[10px]" style={{ color: "var(--text-3)" }}>
        Agregamos nuevas lecciones y videos cada mes.
      </p>
    </>
  );
}
