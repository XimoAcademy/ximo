import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassPanel, InnerTile, BackLink, StatusBadge, ProgressPill } from "../../components/ui";
import ScrollReveal from "../../../components/ScrollReveal";
import { getCourse, courseProgress, isLessonUnlocked, isLessonCompleted, currentLesson } from "../courseData";
import { getCompletedLessons } from "@/lib/data/courses";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  const completedSet = await getCompletedLessons();
  const p = courseProgress(course, completedSet);
  const next = currentLesson(course, completedSet);
  const isComplete = p.pct === 100;

  return (
    <div className="mx-auto max-w-[920px] space-y-5">
      <BackLink href="/app/cursos">Cursos</BackLink>

      {/* Hero */}
      <ScrollReveal>
        <GlassPanel className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="info">{course.category}</StatusBadge>
            <StatusBadge tone="neutral">{course.level}</StatusBadge>
            <StatusBadge tone="gold">{course.lessons.length} lecciones</StatusBadge>
          </div>
          <h1 className="mt-3 text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>
            {course.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
            {course.description}
          </p>

          <div className="mt-5 max-w-sm">
            <ProgressPill value={p.pct} label={`${p.done} de ${p.total} completadas`} />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/app/cursos/${course.id}/${next.id}`} className="ximo-glass-btn teal text-sm">
              {p.done > 0 ? "Continuar curso" : "Empezar curso"}
            </Link>
            {isComplete && (
              <Link href={`/app/cursos/${course.id}/certificado`} className="ximo-glass-btn gold shiny text-sm">
                Ver certificado
              </Link>
            )}
          </div>
        </GlassPanel>
      </ScrollReveal>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        {/* Lesson list */}
        <ScrollReveal delay={60}>
          <GlassPanel className="p-5">
            <h2 className="mb-4 text-base font-black" style={{ color: "var(--text)" }}>
              Contenido del curso
            </h2>
            <ol className="space-y-2.5">
              {course.lessons.map((lesson, i) => {
                const unlocked = isLessonUnlocked(course, i, completedSet);
                const lessonDone = isLessonCompleted(course, lesson, completedSet);
                const inner = (
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black"
                      style={
                        lessonDone
                          ? { background: "var(--success-bg)", color: "var(--success)" }
                          : unlocked
                          ? { background: "var(--teal-bg)", color: "var(--teal)" }
                          : { background: "var(--surface-2)", color: "var(--text-3)" }
                      }
                    >
                      {lessonDone ? "✓" : unlocked ? i + 1 : "🔒"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold" style={{ color: unlocked ? "var(--text)" : "var(--text-3)" }}>
                        {lesson.title}
                      </p>
                      <p className="text-[11px]" style={{ color: "var(--text-label)" }}>
                        {unlocked ? `${lesson.duration} · Lección` : "Bloqueada hasta completar la anterior"}
                      </p>
                    </div>
                    {lessonDone ? (
                      <StatusBadge tone="success">Completada</StatusBadge>
                    ) : unlocked ? (
                      <span className="text-xs font-semibold" style={{ color: "var(--teal)" }}>
                        Ver →
                      </span>
                    ) : (
                      <StatusBadge tone="neutral">Bloqueada</StatusBadge>
                    )}
                  </div>
                );
                return (
                  <li key={lesson.id}>
                    {unlocked ? (
                      <Link href={`/app/cursos/${course.id}/${lesson.id}`}>
                        <InnerTile className="px-3.5 py-3">{inner}</InnerTile>
                      </Link>
                    ) : (
                      <InnerTile className="px-3.5 py-3 opacity-70">{inner}</InnerTile>
                    )}
                  </li>
                );
              })}
            </ol>
          </GlassPanel>
        </ScrollReveal>

        {/* What you'll learn */}
        <ScrollReveal delay={100}>
          <GlassPanel className="p-5">
            <h2 className="mb-4 text-base font-black" style={{ color: "var(--text)" }}>
              Qué vas a aprender
            </h2>
            <ul className="space-y-3">
              {course.whatYouLearn.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <span className="mt-0.5 shrink-0 text-xs" style={{ color: "var(--teal)" }}>
                    ✓
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </GlassPanel>
        </ScrollReveal>
      </div>
    </div>
  );
}
