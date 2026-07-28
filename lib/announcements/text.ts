/**
 * Texto de los avisos de directo — SIEMPRE el mismo.
 *
 * El admin solo elige fecha y hora: no escribe título, descripción ni link.
 * Los atletas ya saben cómo entrar a la comunidad de Discord, así que el
 * aviso no lleva enlace; solo recuerda que habrá directo, cuándo, y dónde
 * verlo. Todo el texto vive aquí para que cambiarlo sea un solo edit.
 */

export const DIRECTO_TITULO = "Directo para resolver dudas";
export const DIRECTO_DONDE = "Te esperamos en la comunidad de Discord.";

export interface AvisoTexto {
  title: string;
  body: string;
}

/** Aviso que reciben todos los usuarios al publicar el directo. */
export function avisoPublicado(cuandoLabel: string): AvisoTexto {
  return { title: `🔴 ${DIRECTO_TITULO} · ${cuandoLabel}`, body: DIRECTO_DONDE };
}

/**
 * Recordatorio automático. `faltaLabel` viene de describeTimeUntil() en
 * lib/scheduling/reminders.ts, así que siempre dice el tiempo real restante.
 */
export function avisoRecordatorio(faltaLabel: string, cuandoLabel: string): AvisoTexto {
  return { title: `⏰ El directo empieza ${faltaLabel} · ${cuandoLabel}`, body: DIRECTO_DONDE };
}
