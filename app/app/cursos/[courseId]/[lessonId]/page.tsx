import { notFound } from "next/navigation";
import { getCourse, getLesson, lessonKey, sortedLessons } from "../../courseData";
import { getQuiz, getQuizForLesson, toPublicQuiz } from "../../quizData";
import { getLessonAction } from "../../lessonActions";
import { getCompletedLessons } from "@/lib/data/courses";
import { getIdentity } from "@/lib/data/identity";
import ProtectedContent from "../../../components/ProtectedContent";
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

  const [completedSet, identity] = await Promise.all([
    getCompletedLessons(),
    getIdentity(),
  ]);
  const ordered = sortedLessons(course);
  const completedIds = ordered
    .filter((l) => completedSet.has(lessonKey(course.id, l.id)))
    .map((l) => l.id);

  // Quiz UI only renders when real quiz data exists for this lesson.
  const quiz = getQuiz(lesson.quizId) ?? getQuizForLesson(course.id, lessonId);

  // Watermark: name + email so screenshots/recordings identify the viewer.
  const watermark = identity
    ? [identity.name, identity.email].filter(Boolean).join(" · ")
    : null;

  return (
    <ProtectedContent watermark={watermark}>
      <LessonPlayer
        courseId={course.id}
        courseTitle={course.title}
        lessonId={lessonId}
        completedIds={completedIds}
        quiz={quiz ? toPublicQuiz(quiz) : null}
        action={getLessonAction(course.id, lessonId) ?? null}
        lessons={ordered.map((l, i) => {
          // Server-side lock check: locked lessons never ship their video URL
          // to the client, so the sequence cannot be bypassed from devtools.
          const isUnlocked =
            i === 0 ||
            completedSet.has(lessonKey(course.id, l.id)) ||
            completedSet.has(lessonKey(course.id, ordered[i - 1].id));
          return {
            id: l.id,
            title: l.title,
            duration: l.duration,
            description: l.description,
            videoUrl: isUnlocked ? l.videoUrl ?? null : null,
            thumbnail: l.thumbnail ?? null,
            status: l.status ?? "coming_soon",
            resources: isUnlocked ? l.resources ?? [] : [],
          };
        })}
      />
    </ProtectedContent>
  );
}
