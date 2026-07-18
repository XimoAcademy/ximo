"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { GlassPanel, InnerTile, BackLink, StatusBadge } from "../../../components/ui";
import { markLessonCompleteAction } from "../../actions";
import type { LessonResource, LessonStatus } from "../../courseData";
import type { Quiz } from "../../quizData";
import posthog from "posthog-js";

interface LessonLite {
  id: string;
  title: string;
  duration: string;
  description: string;
  videoUrl: string | null;
  thumbnail: string | null;
  status: LessonStatus;
  resources: LessonResource[];
}

interface Props {
  courseId: string;
  courseTitle: string;
  lessons: LessonLite[];
  lessonId: string;
  completedIds: string[];
  /** Present only when the lesson has real quiz data (see quizData.ts). */
  quiz: Quiz | null;
}

/** Embed URL for YouTube/Vimeo links; null → use a native <video> tag. */
function embedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export default function LessonPlayer({ courseId, courseTitle, lessons, lessonId, completedIds, quiz }: Props) {
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
    posthog.capture("lesson_completed", { course_id: courseId, lesson_id: lessonId, lesson_index: index + 1 });
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
          {/* Video: real player when published, placeholder otherwise */}
          <GlassPanel className="overflow-hidden">
            {lesson.status === "published" && lesson.videoUrl ? (
              embedUrl(lesson.videoUrl) ? (
                <iframe
                  src={embedUrl(lesson.videoUrl)!}
                  title={lesson.title}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={lesson.videoUrl}
                  poster={lesson.thumbnail ?? undefined}
                  controls
                  controlsList="nodownload"
                  disablePictureInPicture
                  className="aspect-video w-full"
                  style={{ background: "#0B1F33" }}
                />
              )
            ) : (
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
            )}
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

          {/* Quiz — only rendered when this lesson has real quiz data */}
          {quiz && quiz.questions.length > 0 && <LessonQuiz quiz={quiz} />}

          {/* Resources / notes — from the lesson registry; placeholders until loaded */}
          <GlassPanel className="p-5">
            <h2 className="mb-3 text-sm font-black" style={{ color: "var(--text)" }}>
              Recursos y notas
            </h2>
            <div className="space-y-2">
              {(lesson.resources.length > 0
                ? lesson.resources
                : [{ label: "Guía descargable de la lección" }, { label: "Plantilla de ejercicio" }, { label: "Lecturas recomendadas" }]
              ).map((r) =>
                r.url ? (
                  <a
                    key={r.label}
                    href={r.url}
                    target={r.url.startsWith("http") ? "_blank" : undefined}
                    rel={r.url.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="block"
                  >
                    <InnerTile className="flex items-center justify-between px-3.5 py-2.5 transition-colors hover:bg-[var(--teal-bg)]">
                      <span className="text-sm" style={{ color: "var(--text-2)" }}>{r.label}</span>
                      <span className="text-[11px] font-semibold" style={{ color: "var(--teal)" }}>
                        {r.url.startsWith("http") ? "Abrir ↗ (sitio externo)" : "Abrir →"}
                      </span>
                    </InnerTile>
                  </a>
                ) : (
                  <InnerTile key={r.label} className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="text-sm" style={{ color: "var(--text-2)" }}>{r.label}</span>
                    <span className="text-[11px] font-semibold" style={{ color: "var(--text-3)" }}>Próximamente</span>
                  </InnerTile>
                )
              )}
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

/**
 * Inline quiz. Rendered only when the lesson has quiz data in quizData.ts —
 * the score is client-side for now.
 * TODO(quizzes): persist attempts/score alongside lesson_progress when quizzes go live.
 */
function LessonQuiz({ quiz }: { quiz: Quiz }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const total = quiz.questions.length;
  const correct = quiz.questions.filter((q, i) => answers[i] === q.correctAnswer).length;
  const score = total ? Math.round((correct / total) * 100) : 0;
  const passed = score >= quiz.passingScore;
  const allAnswered = quiz.questions.every((_, i) => answers[i] !== undefined);

  return (
    <GlassPanel className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black" style={{ color: "var(--text)" }}>Quiz de la lección</h2>
        <StatusBadge tone="info">Para pasar: {quiz.passingScore}%</StatusBadge>
      </div>
      <div className="mt-4 space-y-4">
        {quiz.questions.map((q, qi) => (
          <div key={qi}>
            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
              {qi + 1}. {q.question}
            </p>
            <div className="mt-2 space-y-1.5">
              {q.options.map((opt, oi) => {
                const chosen = answers[qi] === oi;
                const isCorrect = submitted && oi === q.correctAnswer;
                const isWrongPick = submitted && chosen && oi !== q.correctAnswer;
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={submitted}
                    onClick={() => setAnswers((p) => ({ ...p, [qi]: oi }))}
                    className="block w-full rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors"
                    style={{
                      background: isCorrect ? "var(--success-bg)" : isWrongPick ? "rgba(239,68,68,0.1)" : chosen ? "var(--teal-bg)" : "var(--surface-hover)",
                      border: `1px solid ${isCorrect ? "var(--success)" : isWrongPick ? "var(--error)" : chosen ? "var(--teal-border)" : "var(--border-subtle)"}`,
                      color: "var(--text-2)",
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && q.explanation && (
              <p className="mt-2 text-[11px] leading-relaxed" style={{ color: "var(--text-label)" }}>
                {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t pt-4" style={{ borderColor: "var(--border)" }}>
        {!submitted ? (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={() => {
              setSubmitted(true);
              posthog.capture("quiz_submitted", { quiz_id: quiz.quizId, score, passed, total_questions: total });
            }}
            className="ximo-glass-btn teal text-sm disabled:opacity-50"
          >
            Calificar quiz
          </button>
        ) : (
          <>
            <StatusBadge tone={passed ? "success" : "error"}>
              {passed ? "Aprobado" : "Vuelve a intentarlo"} · {score}%
            </StatusBadge>
            <button
              type="button"
              onClick={() => { setAnswers({}); setSubmitted(false); }}
              className="ximo-glass-btn dark text-xs"
            >
              Reintentar
            </button>
          </>
        )}
      </div>
    </GlassPanel>
  );
}
