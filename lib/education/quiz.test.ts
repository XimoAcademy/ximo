import { describe, expect, it } from "vitest";
import { gradeQuiz, type GradableQuiz } from "./quiz";

const q = (correctAnswer: number, essential = false): GradableQuiz["questions"][number] => ({
  correctAnswer,
  options: ["a", "b", "c", "d"],
  essential,
});

const QUIZ: GradableQuiz = {
  passingScore: 80,
  questions: [q(1), q(2), q(0), q(3), q(1, true)],
};

describe("gradeQuiz", () => {
  it("passes with all answers correct", () => {
    const g = gradeQuiz(QUIZ, [1, 2, 0, 3, 1]);
    expect(g).toEqual({ total: 5, correct: 5, score: 100, passed: true, essentialMissed: false });
  });

  it("passes at exactly the passing score (4/5 = 80)", () => {
    const g = gradeQuiz(QUIZ, [1, 2, 0, 0, 1]);
    expect(g.score).toBe(80);
    expect(g.passed).toBe(true);
  });

  it("fails below the passing score", () => {
    const g = gradeQuiz(QUIZ, [1, 2, 3, 0, 1]);
    expect(g.score).toBe(60);
    expect(g.passed).toBe(false);
    expect(g.essentialMissed).toBe(false);
  });

  it("fails when the essential question is wrong even with a passing score", () => {
    const g = gradeQuiz(QUIZ, [1, 2, 0, 3, 0]);
    expect(g.score).toBe(80);
    expect(g.passed).toBe(false);
    expect(g.essentialMissed).toBe(true);
  });

  it("counts unanswered questions as wrong", () => {
    const g = gradeQuiz(QUIZ, [1, 2, 0]);
    expect(g.correct).toBe(3);
    expect(g.passed).toBe(false);
  });

  it("rejects out-of-range and non-integer answers without throwing", () => {
    const g = gradeQuiz(QUIZ, [99, -1, 0.5, "2", null]);
    expect(g.correct).toBe(0);
    expect(g.passed).toBe(false);
  });

  it("handles non-array input without throwing", () => {
    for (const bad of [null, undefined, "abc", { 0: 1 }]) {
      const g = gradeQuiz(QUIZ, bad);
      expect(g.correct).toBe(0);
      expect(g.passed).toBe(false);
    }
  });

  it("essential missed also reported when score itself fails", () => {
    const g = gradeQuiz(QUIZ, [0, 0, 1, 0, 0]);
    expect(g.score).toBe(0);
    expect(g.essentialMissed).toBe(true);
    expect(g.passed).toBe(false);
  });

  it("empty quiz never passes", () => {
    const g = gradeQuiz({ passingScore: 80, questions: [] }, []);
    expect(g.passed).toBe(false);
    expect(g.score).toBe(0);
  });
});
