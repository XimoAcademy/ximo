import { notFound } from "next/navigation";
import { getCourse, getLesson, lessonKey, sortedLessons } from "../../courseData";
import { getQuiz, getQuizForLesson } from "../../quizData";
import { getCompletedLessons } from "@/lib/data/courses";
import LessonPlayer from "./LessonPlayer";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();
  const lesson = getLesson(course, lessonId);
  if (!lesson) notFound();

  const completedSet = await getCompletedLessons();
  const ordered = sortedLessons(course);
  const completedIds = ordered
    .filter((l) => completedSet.has(lessonKey(course.id, l.id)))
    .map((l) => l.id);

  // Quiz UI only renders when real quiz data exists for this lesson.
  const quiz = getQuiz(lesson.quizId) ?? getQuizForLesson(course.id, lessonId);

  return (
    <LessonPlayer
      courseId={course.id}
      courseTitle={course.title}
      lessonId={lessonId}
      completedIds={completedIds}
      quiz={quiz ?? null}
      lessons={ordered.map((l) => ({
        id: l.id,
        title: l.title,
        duration: l.duration,
        description: l.description,
        videoUrl: l.videoUrl ?? null,
        thumbnail: l.thumbnail ?? null,
        status: l.status ?? "coming_soon",
        resources: l.resources ?? [],
      }))}
    />
  );
}
