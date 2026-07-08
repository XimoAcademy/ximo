/**
 * SERVER-ONLY MODULE — import exclusively from server actions / route handlers.
 * (The env vars below have no NEXT_PUBLIC_ prefix, so Next.js never inlines
 * them into client bundles; do not re-export anything from client components.)
 *
 * Admin-only Discord publishing for APPROVED + PAID ads.
 *
 * IMPORTANT: Claude cannot manage Discord without a configured bot/webhook and
 * permissions. Until one of the env vars below is set, the admin panel shows
 * manual-post instructions instead of a publish button.
 *
 * Env (SERVER-ONLY — never expose these client-side):
 *   DISCORD_ADS_WEBHOOK_URL — simplest path: a channel webhook URL created in
 *     Discord (canal de anuncios → Integraciones → Webhooks → Nuevo webhook).
 *   DISCORD_BOT_TOKEN + DISCORD_ADS_CHANNEL_ID — alternative path via a bot
 *     with permission to post in the ads channel.
 *
 * Publishing is ALWAYS a manual admin action: nothing posts automatically.
 */

export type DiscordAdsMode = "webhook" | "bot" | null;

export function discordAdsMode(): DiscordAdsMode {
  if (process.env.DISCORD_ADS_WEBHOOK_URL) return "webhook";
  if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_ADS_CHANNEL_ID) return "bot";
  return null;
}

export interface DiscordAdPayload {
  brandName: string;
  title: string | null;
  body: string | null;
  destinationUrl: string | null;
  mediaUrl: string | null;
}

/** Message clearly labeled as advertising, per the ads policy. */
function buildMessage(ad: DiscordAdPayload) {
  const lines = [
    `**Publicidad** · ${ad.brandName}`,
    ad.title ? `**${ad.title}**` : null,
    ad.body ? ad.body.slice(0, 1500) : null,
    ad.destinationUrl ? `Más información: ${ad.destinationUrl}` : null,
    "_Anuncio enviado por una marca externa y revisado por Ximo. Ximo no garantiza resultados relacionados con este anuncio._",
  ].filter(Boolean);

  return {
    content: lines.join("\n\n"),
    // Embed the creative when it's an image URL; Discord renders it inline.
    ...(ad.mediaUrl && /\.(png|jpe?g|gif|webp)(\?|$)/i.test(ad.mediaUrl)
      ? { embeds: [{ image: { url: ad.mediaUrl } }] }
      : {}),
  };
}

export interface DiscordPostResult {
  ok: boolean;
  error?: string;
}

export async function postAdToDiscord(ad: DiscordAdPayload): Promise<DiscordPostResult> {
  const mode = discordAdsMode();
  const message = buildMessage(ad);

  try {
    if (mode === "webhook") {
      const res = await fetch(process.env.DISCORD_ADS_WEBHOOK_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
      if (!res.ok) return { ok: false, error: `Discord respondió ${res.status}` };
      return { ok: true };
    }
    if (mode === "bot") {
      const res = await fetch(
        `https://discord.com/api/v10/channels/${process.env.DISCORD_ADS_CHANNEL_ID}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          },
          body: JSON.stringify(message),
        }
      );
      if (!res.ok) return { ok: false, error: `Discord respondió ${res.status}` };
      return { ok: true };
    }
    return { ok: false, error: "Discord no está configurado (sin webhook ni bot)." };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "No se pudo publicar en Discord." };
  }
}
