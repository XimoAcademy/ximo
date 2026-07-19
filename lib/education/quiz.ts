/**
 * Pure quiz-grading logic, shared by the submit server action and tests.
 *
 * Passing rule (from the master curriculum): reach `passingScore` percent
 * AND answer every question marked `essential` correctly. Unanswered or
 * out-of-range answers count as wrong — the server never trusts the client
 * to pre-validate.
 */

export interface GradableQuestion {
  correctAnswer: number;
  options: string[];
  essential?: boolean;
}

export interface GradableQuiz {
  questions: GradableQuestion[];
  passingScore: number;
}

export interface QuizGrade {
  total: number;
  correct: number;
  /** 0–100, rounded. */
  score: number;
  passed: boolean;
  /** True when the score alone would pass but an essential question failed. */
  essentialMissed: boolean;
}

export function gradeQuiz(quiz: GradableQuiz, answers: unknown): QuizGrade {
  const total = quiz.questions.length;
  const arr = Array.isArray(answers) ? answers : [];
  let correct = 0;
  let essentialMissed = false;

  quiz.questions.forEach((q, i) => {
    const a = arr[i];
    const valid = typeof a === "number" && Number.isInteger(a) && a >= 0 && a < q.options.length;
    const isCorrect = valid && a === q.correctAnswer;
    if (isCorrect) correct += 1;
    else if (q.essential) essentialMissed = true;
  });

  const score = total ? Math.round((correct / total) * 100) : 0;
  const passed = total > 0 && score >= quiz.passingScore && !essentialMissed;
  return { total, correct, score, passed, essentialMissed };
}
