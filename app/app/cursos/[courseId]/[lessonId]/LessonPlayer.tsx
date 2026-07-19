"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { GlassPanel, InnerTile, BackLink, StatusBadge } from "../../../components/ui";
import { markLessonCompleteAction, submitQuizAction } from "../../actions";
import type { LessonResource, LessonStatus } from "../../courseData";
import type { PublicQuiz } from "../../quizData";
import type { QuizGrade } from "@/lib/education/quiz";
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
  quiz: PublicQuiz | null;
  /** "Acción dentro de Ximo" — the practical exercise for this lesson. */
  action: string | null;
}

/** Embed URL for YouTube/Vimeo links; null → use a native <video> tag. */
function embedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export default function LessonPlayer({ courseId, courseTitle, lessons, lessonId, completedIds, quiz, action }: Props) {
  const [done, setDone] = useState<string[]>(completedIds);
  const [, startTransition] = useTransition();

  const index = lessons.findIndex((l) => l.id === lessonId);
  const lesson = lessons[index];

  const isDone = (id: string) => done.includes(id);
  const unlocked = (i: number) => i <= 0 || isDone(lessons[i - 1].id) || isDone(lessons[i].id);

  const currentUnlocked = unlocked(index);
  const next = lessons[index + 1];
  const nextUnlocked = !!next && isDone(lessonId);
  const hasQuiz = !!quiz && quiz.questions.length > 0;

  const markCompleted = (id: string) => {
    setDone((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  // Manual completion — only offered for lessons without a quiz.
  const markComplete = () => {
    if (done.includes(lessonId)) return;
    markCompleted(lessonId);
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
            Completa la lección anterior para desbloquear este contenido.
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
              {hasQuiz ? (
                isDone(lessonId) ? (
                  <StatusBadge tone="success">Completada ✓ · quiz aprobado</StatusBadge>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold"
                    style={{ background: "var(--teal-bg)", border: "1px solid var(--teal-border)", color: "var(--teal)" }}
                  >
                    Aprueba el quiz para completar esta lección ↓
                  </span>
                )
              ) : (
                <button
                  type="button"
                  onClick={markComplete}
                  disabled={isDone(lessonId)}
                  className={`ximo-glass-btn ${isDone(lessonId) ? "gold" : "teal"} text-sm`}
                >
                  {isDone(lessonId) ? "Completada ✓" : "Marcar como completada"}
                </button>
              )}

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

          {/* Acción dentro de Ximo — the practical exercise of the lesson */}
          {action && (
            <GlassPanel className="p-5">
              <div className="flex items-center gap-2">
                <span className="text-base">🎯</span>
                <h2 className="text-sm font-black" style={{ color: "var(--text)" }}>
                  Acción en Ximo
                </h2>
              </div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                {action}
              </p>
            </GlassPanel>
          )}

          {/* Quiz — gates completion when present */}
          {hasQuiz && (
            <LessonQuiz
              quiz={quiz!}
              courseId={courseId}
              lessonId={lessonId}
              alreadyDone={isDone(lessonId)}
              nextHref={next ? `/app/cursos/${courseId}/${next.id}` : `/app/cursos/${courseId}/certificado`}
              nextLabel={next ? "Continuar a la siguiente lección →" : "Ver certificado del curso →"}
              onLessonCompleted={() => {
                markCompleted(lessonId);
                posthog.capture("lesson_completed", {
                  course_id: courseId,
                  lesson_id: lessonId,
                  lesson_index: index + 1,
                  via: "quiz",
                });
              }}
            />
          )}

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
 * Inline quiz. Grading is authoritative on the server (submitQuizAction):
 * passing the quiz is what completes the lesson and unlocks the next one.
 * Retries are unlimited; completed lessons keep the quiz as practice.
 */
function LessonQuiz({
  quiz,
  courseId,
  lessonId,
  alreadyDone,
  nextHref,
  nextLabel,
  onLessonCompleted,
}: {
  quiz: PublicQuiz;
  courseId: string;
  lessonId: string;
  alreadyDone: boolean;
  nextHref: string;
  nextLabel: string;
  onLessonCompleted: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [grade, setGrade] = useState<QuizGrade | null>(null);
  const [answerKey, setAnswerKey] = useState<number[] | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [pending, startTransition] = useTransition();

  const submitted = grade !== null;
  const allAnswered = quiz.questions.every((_, i) => answers[i] !== undefined);

  const submit = () => {
    if (!allAnswered || pending) return;
    setServerError(null);
    const payload = quiz.questions.map((_, i) => answers[i]);
    startTransition(async () => {
      const res = await submitQuizAction(courseId, lessonId, payload);
      if (!res.ok || !res.grade) {
        setServerError(res.error ?? "No se pudo calificar el quiz. Intenta de nuevo.");
        return;
      }
      setGrade(res.grade);
      setAnswerKey(res.correctAnswers ?? null);
      posthog.capture("quiz_submitted", {
        quiz_id: quiz.quizId,
        score: res.grade.score,
        passed: res.grade.passed,
        total_questions: res.grade.total,
        practice: alreadyDone,
      });
      if (res.grade.passed && res.lessonCompleted && !alreadyDone) {
        setJustUnlocked(true);
        onLessonCompleted();
      }
    });
  };

  const retry = () => {
    setAnswers({});
    setGrade(null);
    setAnswerKey(null);
    setServerError(null);
  };

  return (
    <GlassPanel className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-black" style={{ color: "var(--text)" }}>Quiz de la lección</h2>
        <div className="flex items-center gap-2">
          {alreadyDone && <StatusBadge tone="neutral">Modo práctica</StatusBadge>}
          <StatusBadge tone="info">Para pasar: {quiz.passingScore}%</StatusBadge>
        </div>
      </div>
      {alreadyDone && (
        <p className="mt-2 text-[11px]" style={{ color: "var(--text-label)" }}>
          Ya completaste esta lección — puedes repetir el quiz cuantas veces quieras sin perder tu progreso.
        </p>
      )}

      <div className="mt-4 space-y-4">
        {quiz.questions.map((q, qi) => (
          <div key={qi}>
            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
              {qi + 1}. {q.question}
              {q.essential && (
                <span
                  className="ml-2 inline-block rounded-full px-2 py-0.5 align-middle text-[9px] font-bold uppercase tracking-wider"
                  style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)", color: "var(--gold)" }}
                >
                  Esencial
                </span>
              )}
            </p>
            <div className="mt-2 space-y-1.5">
              {q.options.map((opt, oi) => {
                const chosen = answers[qi] === oi;
                const correctOption = answerKey?.[qi];
                const isCorrect = submitted && correctOption !== undefined && oi === correctOption;
                const isWrongPick = submitted && chosen && correctOption !== undefined && oi !== correctOption;
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={submitted || pending}
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

      {serverError && (
        <p className="mt-4 text-xs font-semibold" style={{ color: "var(--error)" }}>
          {serverError}
        </p>
      )}

      <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--border)" }}>
        {!submitted ? (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!allAnswered || pending}
              onClick={submit}
              className="ximo-glass-btn teal text-sm disabled:opacity-50"
            >
              {pending ? "Calificando…" : "Calificar quiz"}
            </button>
            {!allAnswered && (
              <span className="text-[11px]" style={{ color: "var(--text-label)" }}>
                Responde todas las preguntas para calificar.
              </span>
            )}
          </div>
        ) : grade!.passed ? (
          justUnlocked ? (
            <div
              className="ximo-zoom-enter rounded-2xl px-5 py-6 text-center"
              style={{ background: "var(--success-bg)", border: "1px solid var(--success)" }}
            >
              <p className="text-3xl">🎉</p>
              <p className="mt-2 text-lg font-black" style={{ color: "var(--text)" }}>
                ¡Felicidades!
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
                Aprobaste con {grade!.score}% y desbloqueaste la siguiente lección.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Link href={nextHref} className="ximo-glass-btn gold shiny text-sm">
                  {nextLabel}
                </Link>
                <button type="button" onClick={retry} className="ximo-glass-btn dark text-xs">
                  Repetir quiz
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone="success">Aprobado · {grade!.score}%</StatusBadge>
              <button type="button" onClick={retry} className="ximo-glass-btn dark text-xs">
                Repetir quiz
              </button>
            </div>
          )
        ) : (
          <div
            className="ximo-fade-in rounded-2xl px-5 py-5"
            style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}
          >
            <p className="text-sm font-black" style={{ color: "var(--text)" }}>
              Casi lo logras · {grade!.score}%
            </p>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
              {grade!.essentialMissed && grade!.score >= quiz.passingScore
                ? "Tu puntaje alcanza, pero la pregunta esencial debe estar correcta. Repasa esa idea y vuelve a intentarlo."
                : "Repasa la lección y vuelve a intentarlo. Estás muy cerca."}
            </p>
            <p className="mt-1 text-[11px]" style={{ color: "var(--text-label)" }}>
              Puedes intentarlo todas las veces que necesites — tu progreso nunca se pierde.
            </p>
            <button type="button" onClick={retry} className="ximo-glass-btn teal mt-3 text-sm">
              Reintentar
            </button>
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
