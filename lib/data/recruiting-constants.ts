// Client-safe constants & shared types for the recruiting modules.
// IMPORTANT: this file must NOT import any server-only code (no next/headers,
// no supabase server client) so it can be imported by client components.

export const RECRUITING_STAGES = [
  "Investigando",
  "Contactado",
  "En conversación",
  "Interesado",
  "Oferta",
  "Comprometido",
  "Descartado",
] as const;

export const PRIORITIES = ["Alta", "Media", "Baja"] as const;

export const COACH_STATUSES = [
  "Sin contactar",
  "Contactado",
  "Esperando respuesta",
  "Respondió",
  "Interés alto",
  "Interés confirmado",
  "Llamada agendada",
  "Descartado",
] as const;

export const COACH_PRIORITIES = ["Alta", "Media", "Baja"] as const;
