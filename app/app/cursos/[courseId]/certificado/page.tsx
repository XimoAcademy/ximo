import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { GlassPanel, BackLink } from "../../../components/ui";
import ScrollReveal from "../../../../components/ScrollReveal";
import { getCourse, courseProgress } from "../../courseData";
import { getCompletedLessons } from "@/lib/data/courses";
import { getIdentity } from "@/lib/data/identity";

export const dynamic = "force-dynamic";

export default async function CertificadoPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  const [completedSet, identity] = await Promise.all([getCompletedLessons(), getIdentity()]);
  const p = courseProgress(course, completedSet);
  // Only issue the certificate when the course is actually complete.
  if (p.pct < 100) redirect(`/app/cursos/${course.id}`);

  const STUDENT = identity?.name ?? "Atleta Ximo";
  const date = new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });

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
