/**
 * Local content filter — Phase 1 (no external AI yet).
 *
 * DESIGN / SAFETY:
 * - This stub never embeds harmful, graphic, or explicit examples.
 * - It only detects *objective, non-sensitive* signals locally: links and
 *   basic spam shape (excessive caps / repetition / many links).
 * - The sensitive human-harm categories (harassment, hate, sexual, self_harm,
 *   violence, dangerous_behavior, scam, personal_information) are NOT pattern
 *   matched here. Those rely on:
 *     (a) every new item defaulting to "pending" review, and
 *     (b) user reports + the human moderation queue.
 * - A real classifier (Supabase Edge Function / moderation API) plugs in later
 *   behind `classifyTextLocally` without changing call sites.
 *
 * Net effect for now: ALL new posts/comments/media start as "pending" and only
 * become publicly visible once approved.
 */

import type { ClassificationResult, ModerationCategory } from "./types";

const URL_REGEX = /\bhttps?:\/\/[^\s]+/gi;
// Bare domains like "example.com/..." without a scheme.
const BARE_DOMAIN_REGEX = /\b[a-z0-9-]+\.(?:com|net|org|io|co|app|link|xyz|info|biz)\b/gi;

function countMatches(text: string, regex: RegExp): number {
  const m = text.match(regex);
  return m ? m.length : 0;
}

function capsRatio(text: string): number {
  const letters = text.replace(/[^a-zA-ZÀ-ÿ]/g, "");
  if (letters.length < 12) return 0; // too short to judge
  const upper = letters.replace(/[^A-ZÀ-Þ]/g, "").length;
  return upper / letters.length;
}

function hasExcessiveRepetition(text: string): boolean {
  // e.g. the same word repeated many times, or long runs of one character.
  if (/(.)\1{9,}/.test(text)) return true;
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length < 6) return false;
  const counts = new Map<string, number>();
  for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
  const maxRepeat = Math.max(...counts.values());
  return maxRepeat / words.length > 0.4;
}

/**
 * Classify text locally. Returns a conservative result; new content should
 * still be created with status "pending" regardless of the score.
 */
export function classifyTextLocally(text: string): ClassificationResult {
  const categories = new Set<ModerationCategory>();
  const input = (text ?? "").trim();

  const linkCount = countMatches(input, URL_REGEX) + countMatches(input, BARE_DOMAIN_REGEX);
  if (linkCount > 0) categories.add("suspicious_link");

  const spammy =
    linkCount >= 3 ||
    capsRatio(input) > 0.7 ||
    hasExcessiveRepetition(input);
  if (spammy) categories.add("spam");

  // Score: a soft heuristic only used to *prioritise* the review queue. It is
  // never used to auto-approve anything.
  let score = 0.1; // baseline: everything gets reviewed
  if (categories.has("suspicious_link")) score += 0.2 + Math.min(linkCount, 5) * 0.05;
  if (categories.has("spam")) score += 0.3;
  score = Math.min(score, 1);

  return {
    score: Number(score.toFixed(2)),
    categories: Array.from(categories),
    // New user content is ALWAYS pending until a human/admin (or a future AI
    // pass) approves it. We never auto-approve here.
    suggestedStatus: "pending",
  };
}

/**
 * Whether an item should enter the moderation review queue.
 *
 * Phase 1 policy: everything goes to review (return true). Kept as a function
 * so a future phase can make this smarter (e.g. trusted users skip review)
 * without touching call sites.
 */
export function shouldSendToReview(_result: ClassificationResult): boolean {
  void _result;
  return true;
}
