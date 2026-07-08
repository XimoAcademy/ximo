/**
 * Quiz registry for Ximo courses.
 *
 * A lesson gets a quiz by setting `quizId` in courseData.ts to the id of an
 * entry here. The lesson player only renders the quiz UI when the id resolves
 * to real data — no quiz data, no quiz UI.
 *
 * TODO(Manuel): add real quizzes here when the lesson videos are ready.
 * Example (uncomment and adapt):
 *
 * {
 *   quizId: "recruiting-basics-l1",
 *   lessonId: "recruiting-basics/lesson-1",
 *   passingScore: 70,
 *   questions: [
 *     {
 *       question: "¿Cuál división de la NCAA ofrece becas atléticas completas?",
 *       options: ["D1", "D3", "Ninguna", "Todas"],
 *       correctAnswer: 0,
 *       explanation: "D1 (y D2 parcialmente) ofrecen becas atléticas; D3 no.",
 *     },
 *   ],
 * },
 */

export interface QuizQuestion {
  question: string;
  options: string[];
  /** Index into `options`. */
  correctAnswer: number;
  /** Shown after answering, to reinforce the concept. */
  explanation: string;
}

export interface Quiz {
  quizId: string;
  /** `${courseId}/${lessonId}` — matches the lesson-progress key format. */
  lessonId: string;
  questions: QuizQuestion[];
  /** Percentage (0–100) needed to pass. */
  passingScore: number;
}

export const QUIZZES: Quiz[] = [
  // Intentionally empty: quizzes ship later. See the TODO above.
];

export function getQuiz(quizId: string | null | undefined): Quiz | undefined {
  if (!quizId) return undefined;
  return QUIZZES.find((q) => q.quizId === quizId);
}

export function getQuizForLesson(courseId: string, lessonId: string): Quiz | undefined {
  return QUIZZES.find((q) => q.lessonId === `${courseId}/${lessonId}`);
}
