import { notFound } from "next/navigation";
import { getCourse, getLesson, lessonKey } from "../../courseData";
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
  const completedIds = course.lessons
    .filter((l) => completedSet.has(lessonKey(course.id, l.id)))
    .map((l) => l.id);

  return (
    <LessonPlayer
      courseId={course.id}
      courseTitle={course.title}
      lessonId={lessonId}
      completedIds={completedIds}
      lessons={course.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        duration: l.duration,
        description: l.description,
      }))}
    />
  );
}
