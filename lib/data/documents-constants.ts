// Client-safe constants for the documents module (no server imports).
export const DOC_STATUSES = ["pendiente", "revisar", "listo"] as const;
export const DOC_IMPORTANCE = ["alta", "media", "baja"] as const;

export const DOC_STATUS_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  revisar: "Revisar",
  listo: "Listo",
};
