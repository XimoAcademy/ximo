import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { GlassPanel, BackLink, StatCard } from "../../../components/ui";
import ScrollReveal from "../../../../components/ScrollReveal";
import { COURSES, getCourse, courseProgress } from "../../courseData";
import { getCompletedLessons, getCourseQuizStats } from "@/lib/data/courses";
import { getIdentity } from "@/lib/data/identity";

export const dynamic = "force-dynamic";

/** Sum of the course's lesson durations, e.g. "68 min". */
function courseMinutes(courseId: string): number {
  const course = getCourse(courseId);
  if (!course) return 0;
  return course.lessons.reduce((acc, l) => acc + (parseInt(l.duration) || 0), 0);
}

export default async function CertificadoPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  const [completedSet, identity, quizStats] = await Promise.all([
    getCompletedLessons(),
    getIdentity(),
    getCourseQuizStats(courseId),
  ]);
  const p = courseProgress(course, completedSet);
  // Only issue the certificate when the course is actually complete.
  if (p.pct < 100) redirect(`/app/cursos/${course.id}`);

  const STUDENT = identity?.name ?? "Atleta Ximo";
  const completionDate = quizStats.completedAt ? new Date(quizStats.completedAt) : new Date();
  const date = completionDate.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });

  // Next course in catalogue order (first one not yet completed), for the CTA.
  const idx = COURSES.findIndex((c) => c.id === course.id);
  const nextCourse =
    COURSES.slice(idx + 1).find((c) => courseProgress(c, completedSet).pct < 100) ??
    COURSES.find((c) => c.id !== course.id && courseProgress(c, completedSet).pct < 100) ??
    null;

  const minutes = courseMinutes(course.id);

  return (
    <div className="mx-auto max-w-[760px] space-y-5">
      <BackLink href={`/app/cursos/${course.id}`}>{course.title}</BackLink>

      <ScrollReveal>
        <GlassPanel tone="gold" className="overflow-hidden p-0">
          {/* Certificate */}
          <div
            className="relative px-6 py-10 text-center sm:px-12 sm:py-14"
            style={{ background: "linear-gradient(160deg, rgba(232,206,78,0.10) 0%, var(--surface) 55%)" }}
          >
            <div className="ximo-soft-grid pointer-events-none absolute inset-0 opacity-20" />
            <div className="relative">
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ximo-float"
                style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}
              >
                🏅
              </div>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--gold)" }}>
                Curso completado
              </p>
              <p className="mt-4 text-xs" style={{ color: "var(--text-label)" }}>
                Este certificado reconoce que
              </p>
              <p className="mt-1 font-display text-3xl font-black" style={{ color: "var(--text)" }}>
                {STUDENT}
              </p>
              <p className="mt-3 text-xs" style={{ color: "var(--text-label)" }}>
                completó exitosamente el curso
              </p>
              <p className="mt-1 text-lg font-black" style={{ color: "var(--text)" }}>
                {course.title}
              </p>

              <div className="mx-auto mt-7 flex max-w-sm items-center justify-between border-t pt-4" style={{ borderColor: "var(--border)" }}>
                <div className="text-left">
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>
                    Fecha
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                    {date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>
                    Emitido por
                  </p>
                  <p className="font-display text-base font-bold" style={{ color: "var(--text)" }}>
                    Ximo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>
      </ScrollReveal>

      {/* Course stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Completado" value="100%" accent="gold" />
        <StatCard label="Lecciones" value={`${p.done}/${p.total}`} hint="completadas" />
        <StatCard
          label="Quizzes"
          value={quizStats.avgBestScore !== null ? `${quizStats.avgBestScore}%` : "—"}
          hint={
            quizStats.totalAttempts > 0
              ? `promedio · ${quizStats.totalAttempts} ${quizStats.totalAttempts === 1 ? "intento" : "intentos"}`
              : "sin intentos registrados"
          }
        />
        <StatCard label="Tiempo invertido" value={`~${minutes} min`} hint="en video y práctica" accent="text" />
      </div>

      {/* Next step */}
      {nextCourse ? (
        <GlassPanel className="p-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
            Tu siguiente paso
          </p>
          <p className="mt-1.5 text-base font-black" style={{ color: "var(--text)" }}>
            {nextCourse.title}
          </p>
          <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>
            {nextCourse.summary}
          </p>
          <Link href={`/app/cursos/${nextCourse.id}`} className="ximo-glass-btn gold shiny mt-4 inline-block text-sm">
            Continuar al siguiente curso →
          </Link>
        </GlassPanel>
      ) : (
        <GlassPanel className="p-5 text-center">
          <p className="text-base font-black" style={{ color: "var(--text)" }}>
            Completaste toda la academia 🎓
          </p>
          <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>
            Ahora tienes el mapa completo del recruiting. Vuelve a cualquier lección cuando necesites repasarla.
          </p>
        </GlassPanel>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/app/cursos" className="ximo-glass-btn teal text-sm">
          Volver a cursos
        </Link>
        <Link href={`/app/cursos/${course.id}`} className="ximo-glass-btn dark text-sm">
          Repasar el curso
        </Link>
      </div>

      <p className="text-center text-[10px]" style={{ color: "var(--text-3)" }}>
        Certificado emitido por Ximo
      </p>
    </div>
  );
}
