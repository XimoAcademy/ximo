// Client-safe community constants (no server imports).

export type CommunityTag = "Meta" | "Avance" | "Logro" | "Duda" | "Recruiting" | "Entrenamiento";

export const COMMUNITY_TAGS: CommunityTag[] = ["Meta", "Avance", "Logro", "Duda", "Recruiting", "Entrenamiento"];

/** Spanish tag → DB `type` enum value. */
export const TAG_TO_TYPE: Record<CommunityTag, string> = {
  Meta: "text",
  Avance: "progress",
  Logro: "achievement",
  Duda: "question",
  Recruiting: "recruiting",
  Entrenamiento: "training",
};

export const TAG_STYLE: Record<string, { bg: string; color: string }> = {
  Meta: { bg: "rgba(30,206,206,0.12)", color: "var(--teal)" },
  Avance: { bg: "rgba(5,150,105,0.12)", color: "#6ee7b7" },
  Logro: { bg: "rgba(201,168,76,0.12)", color: "var(--gold)" },
  Duda: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24" },
  Recruiting: { bg: "rgba(139,92,246,0.12)", color: "#c4b5fd" },
  Entrenamiento: { bg: "rgba(127,175,178,0.1)", color: "rgba(127,175,178,0.8)" },
  Oficial: { bg: "rgba(201,168,76,0.2)", color: "var(--gold)" },
};
