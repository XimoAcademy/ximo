"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { GlassPanel, InnerTile, BackLink, StatusBadge } from "../../../components/ui";
import { markLessonCompleteAction } from "../../actions";

interface LessonLite {
  id: string;
  title: string;
  duration: string;
  description: string;
}

interface Props {
  courseId: string;
  courseTitle: string;
  lessons: LessonLite[];
  lessonId: string;
  completedIds: string[];
}

export default function LessonPlayer({ courseId, courseTitle, lessons, lessonId, completedIds }: Props) {
  const [done, setDone] = useState<string[]>(completedIds);
  const [, startTransition] = useTransition();

  const index = lessons.findIndex((l) => l.id === lessonId);
  const lesson = lessons[index];

  const isDone = (id: string) => done.includes(id);
  const unlocked = (i: number) => i <= 0 || isDone(lessons[i - 1].id) || isDone(lessons[i].id);

  const currentUnlocked = unlocked(index);
  const next = lessons[index + 1];
  const nextUnlocked = !!next && isDone(lessonId);

  const markComplete = () => {
    if (done.includes(lessonId)) return;
    setDone((prev) => [...prev, lessonId]);
    startTransition(async () => {
      await markLessonCompleteAction(courseId, lessonId);
    });
  };

  if (!lesson) return null;

  // Locked guard — reached via direct URL before unlocking.
  if (!currentUnlocked) {
    return (
      <div className="mx-auto max-w-[920px] space-y-5">
        <BackLink href={`/app/cursos/${courseId}`}>{courseTitle}</BackLink>
        <GlassPanel className="px-6 py-14 text-center">
          <p className="text-3xl">🔒</p>
          <p className="mt-3 text-base font-black" style={{ color: "var(--text)" }}>
            Lección bloqueada
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed" style={{ color: "var(--text-label)" }}>
            Bloqueada hasta completar la anterior. Termina la lección previa para desbloquear esta.
          </p>
          <Link href={`/app/cursos/${courseId}`} className="ximo-glass-btn teal mt-5 inline-block text-sm">
            Volver al curso
          </Link>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <BackLink href={`/app/cursos/${courseId}`}>{courseTitle}</BackLink>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="space-y-5">
          {/* Video placeholder */}
          <GlassPanel className="overflow-hidden">
            <div
              className="relative flex aspect-video w-full items-center justify-center"
              style={{ background: "linear-gradient(135deg, #0B1F33 0%, #143845 60%, #1F5F66 100%)" }}
            >
              <div className="ximo-soft-grid pointer-events-none absolute inset-0 opacity-30" />
              <div className="relative flex flex-col items-center gap-3 text-center">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full ximo-glow-teal"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid var(--teal-border)" }}
                >
                  <span className="ml-1 text-2xl" style={{ color: "#fff" }}>▶</span>
                </div>
                <p className="text-sm font-bold" style={{ color: "#F2F6F4" }}>
                  Video de la lección
                </p>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  El video se publicará pronto
                </p>
              </div>
            </div>
          </GlassPanel>

          {/* Lesson info */}
          <GlassPanel className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone="info">Lección {index + 1} de {lessons.length}</StatusBadge>
              <StatusBadge tone="neutral">{lesson.duration}</StatusBadge>
              {isDone(lessonId) && <StatusBadge tone="success">Completada</StatusBadge>}
            </div>
            <h1 className="mt-3 text-xl font-black sm:text-2xl" style={{ color: "var(--text)" }}>
              {lesson.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
              {lesson.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t pt-4" style={{ borderColor: "var(--border)" }}>
              <button
                type="button"
                onClick={markComplete}
                disabled={isDone(lessonId)}
                className={`ximo-glass-btn ${isDone(lessonId) ? "gold" : "teal"} text-sm`}
              >
                {isDone(lessonId) ? "Completada ✓" : "Marcar como completada"}
              </button>

              {next ? (
                nextUnlocked ? (
                  <Link href={`/app/cursos/${courseId}/${next.id}`} className="ximo-glass-btn dark text-sm">
                    Siguiente lección →
                  </Link>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold"
                    style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)", color: "var(--text-3)" }}
                  >
                    🔒 Completa esta lección para continuar
                  </span>
                )
              ) : isDone(lessonId) ? (
                <Link href={`/app/cursos/${courseId}/certificado`} className="ximo-glass-btn gold shiny text-sm">
                  Ver certificado →
                </Link>
              ) : null}
            </div>
          </GlassPanel>

          {/* Resources / notes */}
          <GlassPanel className="p-5">
            <h2 className="mb-3 text-sm font-black" style={{ color: "var(--text)" }}>
              Recursos y notas
            </h2>
            <div className="space-y-2">
              {["Guía descargable de la lección", "Plantilla de ejercicio", "Lecturas recomendadas"].map((r) => (
                <InnerTile key={r} className="flex items-center justify-between px-3.5 py-2.5">
                  <span className="text-sm" style={{ color: "var(--text-2)" }}>{r}</span>
                  <span className="text-[11px] font-semibold" style={{ color: "var(--text-3)" }}>Próximamente</span>
                </InnerTile>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Sidebar lesson list */}
        <GlassPanel className="h-fit p-4">
          <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
            {courseTitle}
          </p>
          <ol className="space-y-1.5">
            {lessons.map((l, i) => {
              const u = unlocked(i);
              const active = l.id === lessonId;
              const completed = isDone(l.id);
              const row = (
                <div
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
                  style={
                    active
                      ? { background: "var(--teal-bg)", border: "1px solid var(--teal-border)" }
                      : { background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }
                  }
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-black"
                    style={
                      completed
                        ? { background: "var(--success-bg)", color: "var(--success)" }
                        : u
                        ? { background: "var(--surface-2)", color: "var(--teal)" }
                        : { background: "var(--surface-2)", color: "var(--text-3)" }
                    }
                  >
                    {completed ? "✓" : u ? i + 1 : "🔒"}
                  </span>
                  <span
                    className="flex-1 truncate text-[13px] font-semibold"
                    style={{ color: u ? (active ? "var(--text)" : "var(--text-2)") : "var(--text-3)" }}
                  >
                    {l.title}
                  </span>
                </div>
              );
              return (
                <li key={l.id}>
                  {u ? <Link href={`/app/cursos/${courseId}/${l.id}`}>{row}</Link> : <div className="opacity-70">{row}</div>}
                </li>
              );
            })}
          </ol>
        </GlassPanel>
      </div>
    </div>
  );
}
