import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/getUser";

export interface CourseQuizStats {
  /** Average of each lesson's best quiz score (0–100), null when no attempts. */
  avgBestScore: number | null;
  totalAttempts: number;
  /** Latest lesson completion timestamp in the course, null when unknown. */
  completedAt: string | null;
}

/**
 * Quiz performance + completion date for one course of the signed-in user.
 * Degrades gracefully (nulls/zeros) when quiz_attempts doesn't exist yet or
 * there is no data — the certificate renders without these stats.
 */
export async function getCourseQuizStats(courseSlug: string): Promise<CourseQuizStats> {
  const empty: CourseQuizStats = { avgBestScore: null, totalAttempts: 0, completedAt: null };
  const supabase = await createClient();
  if (!supabase) return empty;
  const user = await getCurrentUser();
  if (!user) return empty;

  const [attemptsRes, progressRes] = await Promise.all([
    supabase
      .from("quiz_attempts")
      .select("score, lesson:lessons!inner(slug, course:courses!inner(slug))")
      .eq("user_id", user.id)
      .eq("lesson.course.slug", courseSlug),
    supabase
      .from("lesson_progress")
      .select("completed_at, lesson:lessons!inner(course:courses!inner(slug))")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .eq("lesson.course.slug", courseSlug),
  ]);

  let avgBestScore: number | null = null;
  let totalAttempts = 0;
  if (!attemptsRes.error && attemptsRes.data) {
    type AttemptRow = { score: number; lesson: { slug: string } | { slug: string }[] | null };
    const bestByLesson = new Map<string, number>();
    for (const row of (attemptsRes.data as unknown as AttemptRow[])) {
      const lesson = Array.isArray(row.lesson) ? row.lesson[0] : row.lesson;
      if (!lesson?.slug) continue;
      totalAttempts += 1;
      const prev = bestByLesson.get(lesson.slug) ?? -1;
      if (row.score > prev) bestByLesson.set(lesson.slug, row.score);
    }
    if (bestByLesson.size > 0) {
      const sum = [...bestByLesson.values()].reduce((a, b) => a + b, 0);
      avgBestScore = Math.round(sum / bestByLesson.size);
    }
  }

  let completedAt: string | null = null;
  if (!progressRes.error && progressRes.data) {
    for (const row of (progressRes.data as { completed_at: string | null }[])) {
      if (row.completed_at && (!completedAt || row.completed_at > completedAt)) completedAt = row.completed_at;
    }
  }

  return { avgBestScore, totalAttempts, completedAt };
}

/**
 * The set of completed lessons for the signed-in user, keyed as
 * `${courseSlug}/${lessonSlug}` so it lines up with the static catalogue
 * in app/app/cursos/courseData.ts (whose ids ARE the slugs).
 */
export async function getCompletedLessons(): Promise<Set<string>> {
  const supabase = await createClient();
  if (!supabase) return new Set();
  const user = await getCurrentUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("lesson_progress")
    .select("status, lesson:lessons(slug, course:courses(slug))")
    .eq("user_id", user.id)
    .eq("status", "completed");

  const set = new Set<string>();
  type Row = { lesson: { slug: string; course: { slug: string } | { slug: string }[] } | { slug: string; course: { slug: string } | { slug: string }[] }[] | null };
  for (const row of ((data ?? []) as unknown as Row[])) {
    const lesson = Array.isArray(row.lesson) ? row.lesson[0] : row.lesson;
    if (!lesson) continue;
    const course = Array.isArray(lesson.course) ? lesson.course[0] : lesson.course;
    if (course?.slug && lesson.slug) set.add(`${course.slug}/${lesson.slug}`);
  }
  return set;
}
