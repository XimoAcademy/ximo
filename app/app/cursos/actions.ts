"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface LessonActionResult {
  ok: boolean;
  error?: string;
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

export async function markLessonCompleteAction(courseSlug: string, lessonSlug: string): Promise<LessonActionResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesión expirada." };

  const ids = await resolveIds(supabase, courseSlug, lessonSlug);
  if (!ids) return { ok: false, error: "Lección no encontrada." };

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
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
