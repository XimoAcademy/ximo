"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { gradeQuiz, type QuizGrade } from "@/lib/education/quiz";
import { getCourse, lessonIndex, lessonKey } from "./courseData";
import { getQuizForLesson } from "./quizData";
import { getCompletedLessons } from "@/lib/data/courses";

export interface LessonActionResult {
  ok: boolean;
  error?: string;
}

export interface QuizSubmitResult {
  ok: boolean;
  error?: string;
  grade?: QuizGrade;
  /** Answer key, revealed only after grading (the client never receives it upfront). */
  correctAnswers?: number[];
  /** True when this submission (or a previous one) completed the lesson. */
  lessonCompleted?: boolean;
}

async function resolveIds(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  courseSlug: string,
  lessonSlug: string
): Promise<{ courseId: string; lessonId: string } | null> {
  const { data: course } = await supabase.from("courses").select("id").eq("slug", courseSlug).maybeSingle();
  if (!course) return null;
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id")
    .eq("course_id", course.id)
    .eq("slug", lessonSlug)
    .maybeSingle();
  if (!lesson) return null;
  return { courseId: course.id as string, lessonId: lesson.id as string };
}

/**
 * Sequential gate: a lesson may only be completed when the previous lesson in
 * the course is already completed. First lesson is always allowed. Enforced
 * server-side so progress cannot be skipped by calling actions directly.
 */
function previousLessonCompleted(courseSlug: string, lessonSlug: string, completed: Set<string>): boolean {
  const course = getCourse(courseSlug);
  if (!course) return false;
  const idx = lessonIndex(course, lessonSlug);
  if (idx < 0) return false;
  if (idx === 0) return true;
  return completed.has(lessonKey(course.id, course.lessons[idx - 1].id));
}

async function completeLesson(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  userId: string,
  courseSlug: string,
  lessonSlug: string
): Promise<LessonActionResult> {
  const ids = await resolveIds(supabase, courseSlug, lessonSlug);
  if (!ids) return { ok: false, error: "Lección no encontrada." };

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: userId,
      course_id: ids.courseId,
      lesson_id: ids.lessonId,
      status: "completed",
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" }
  );
  if (error) return { ok: false, error: "No se pudo guardar el progreso." };

  revalidatePath(`/app/cursos/${courseSlug}`);
  revalidatePath(`/app/cursos/${courseSlug}/${lessonSlug}`);
  revalidatePath("/app/cursos");
  return { ok: true };
}

/**
 * Grade a quiz submission server-side. Passing the quiz is what completes a
 * lesson that has one; retries are unlimited and nothing is ever reset.
 * Attempts are recorded in quiz_attempts (best-effort: a storage failure
 * never blocks the student).
 */
export async function submitQuizAction(
  courseSlug: string,
  lessonSlug: string,
  answers: number[]
): Promise<QuizSubmitResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesión expirada." };

  const quiz = getQuizForLesson(courseSlug, lessonSlug);
  if (!quiz) return { ok: false, error: "Esta lección no tiene quiz." };

  const completed = await getCompletedLessons();
  const alreadyCompleted = completed.has(lessonKey(courseSlug, lessonSlug));

  // Sequential gate — practice retakes on completed lessons are always allowed.
  if (!alreadyCompleted && !previousLessonCompleted(courseSlug, lessonSlug, completed)) {
    return { ok: false, error: "Completa la lección anterior para desbloquear esta." };
  }

  const grade = gradeQuiz(quiz, answers);

  // Never store raw client input: normalize to one small int (or null) per
  // question, so an oversized/garbage payload can't bloat the table.
  const cleanAnswers = quiz.questions.map((_, i) => {
    const a = Array.isArray(answers) ? answers[i] : undefined;
    return typeof a === "number" && Number.isInteger(a) && a >= 0 && a < quiz.questions[i].options.length ? a : null;
  });

  // Record the attempt (best-effort; never blocks the student).
  const ids = await resolveIds(supabase, courseSlug, lessonSlug);
  if (ids) {
    const { error: attemptError } = await supabase.from("quiz_attempts").insert({
      user_id: user.id,
      lesson_id: ids.lessonId,
      quiz_id: quiz.quizId,
      score: grade.score,
      passed: grade.passed,
      answers: cleanAnswers,
    });
    if (attemptError) {
      // Table may not exist yet in this environment — degrade gracefully.
      console.error("quiz_attempts insert failed:", attemptError.message);
    }
  }

  const correctAnswers = quiz.questions.map((q) => q.correctAnswer);

  if (grade.passed && !alreadyCompleted) {
    const res = await completeLesson(supabase, user.id, courseSlug, lessonSlug);
    if (!res.ok) return { ok: false, error: res.error, grade, correctAnswers };
    return { ok: true, grade, correctAnswers, lessonCompleted: true };
  }

  return { ok: true, grade, correctAnswers, lessonCompleted: alreadyCompleted };
}

/**
 * Manual completion — only for lessons WITHOUT a quiz (legacy/fallback).
 * Lessons with a quiz must be completed by passing it (submitQuizAction).
 */
export async function markLessonCompleteAction(courseSlug: string, lessonSlug: string): Promise<LessonActionResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesión expirada." };

  if (getQuizForLesson(courseSlug, lessonSlug)) {
    return { ok: false, error: "Esta lección se completa aprobando su quiz." };
  }
  const completed = await getCompletedLessons();
  if (!previousLessonCompleted(courseSlug, lessonSlug, completed)) {
    return { ok: false, error: "Completa la lección anterior para desbloquear esta." };
  }

  return completeLesson(supabase, user.id, courseSlug, lessonSlug);
}

export async function markLessonIncompleteAction(courseSlug: string, lessonSlug: string): Promise<LessonActionResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesión expirada." };

  const ids = await resolveIds(supabase, courseSlug, lessonSlug);
  if (!ids) return { ok: false, error: "Lección no encontrada." };

  await supabase.from("lesson_progress").delete().eq("user_id", user.id).eq("lesson_id", ids.lessonId);
  revalidatePath(`/app/cursos/${courseSlug}`);
  revalidatePath("/app/cursos");
  return { ok: true };
}
