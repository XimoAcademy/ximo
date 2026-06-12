import { createClient } from "@/lib/supabase/server";

/**
 * The set of completed lessons for the signed-in user, keyed as
 * `${courseSlug}/${lessonSlug}` so it lines up with the static catalogue
 * in app/app/cursos/courseData.ts (whose ids ARE the slugs).
 */
export async function getCompletedLessons(): Promise<Set<string>> {
  const supabase = await createClient();
  if (!supabase) return new Set();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
