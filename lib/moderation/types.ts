/**
 * Shared content-moderation types for Ximo's community feed.
 *
 * Mirrors the database enums in supabase/migrations/001_initial_ximo_schema.sql.
 * These are intentionally string-literal unions so they validate against the
 * text columns without extra tooling.
 */

/** Lifecycle status of any moderatable item (post, comment, media, ad). */
export type ModerationStatus =
  | "pending" // awaiting review (default for all new user content)
  | "approved" // visible in the public/community feed
  | "hidden" // taken out of public view (recoverable)
  | "rejected" // not allowed; never shown publicly
  | "flagged"; // auto/-user flagged, prioritised for review

/** Sensitive content categories the platform screens for. */
export type ModerationCategory =
  | "harassment" // harassment / bullying
  | "hate" // hateful content
  | "sexual" // sexual content
  | "self_harm" // self-harm or suicide-related
  | "violence" // graphic violence
  | "dangerous_behavior" // dangerous challenges / unsafe behavior
  | "spam"
  | "scam"
  | "personal_information" // doxxing / personal info
  | "suspicious_link";

/** Human-readable Spanish labels for the admin UI. */
export const CATEGORY_LABELS: Record<ModerationCategory, string> = {
  harassment: "Acoso / bullying",
  hate: "Contenido de odio",
  sexual: "Contenido sexual",
  self_harm: "Autolesión / suicidio",
  violence: "Violencia gráfica",
  dangerous_behavior: "Conductas peligrosas",
  spam: "Spam",
  scam: "Fraude / estafa",
  personal_information: "Información personal",
  suspicious_link: "Enlaces sospechosos",
};

/** Result of a local (non-AI) classification pass. */
export interface ClassificationResult {
  /** 0..1 confidence that the content needs human review. */
  score: number;
  /** Categories the local pass matched (may be empty). */
  categories: ModerationCategory[];
  /** Suggested initial status. New content always starts at "pending". */
  suggestedStatus: ModerationStatus;
}

/** What kind of object a report or queue item points at. */
export type ModerationTargetType = "post" | "comment" | "media" | "user" | "brand_ad";

/** Reasons a user can pick when reporting content. */
export type ReportReason =
  | "harassment"
  | "hate"
  | "sexual"
  | "self_harm"
  | "violence"
  | "dangerous_behavior"
  | "spam"
  | "scam"
  | "personal_information"
  | "suspicious_link"
  | "other";

export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";
