import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * Comunidad Ximo — Discord entry page.
 *
 * The former in-app social feed was replaced by the official Ximo Discord
 * server: the community now lives on Discord, and this page is the door.
 *
 * Config:
 *   NEXT_PUBLIC_DISCORD_INVITE_URL — overrides the default invite link below.
 *   If both are empty the join button renders disabled ("Discord invite
 *   pendiente"). /public/discord-qr.png — QR image for the same invite.
 */

// Official "Ximo" server invite (also encoded in /public/discord-qr.png).
// If the invite is ever rotated, update the env var AND regenerate the QR.
const DEFAULT_INVITE_URL = "https://discord.gg/fbz3Zyryf9";

export const metadata = { title: "Comunidad Ximo en Discord" };

function hasQrImage(): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", "discord-qr.png"));
  } catch {
    return false;
  }
}

export default function ComunidadPage() {
  const inviteUrl = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || DEFAULT_INVITE_URL || null;
  const qrAvailable = hasQrImage();

  return (
    <div className="mx-auto flex max-w-[560px] flex-col items-center py-6 text-center">
      <span
        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
        style={{ borderColor: "var(--teal-border)", background: "var(--teal-bg)", color: "var(--teal)" }}
      >
        ◉ Comunidad
      </span>

      <h1 className="mt-4 text-3xl font-black sm:text-4xl" style={{ color: "var(--text)" }}>
        Comunidad Ximo en Discord
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
        Únete al canal donde atletas comparten dudas, avances, experiencias y oportunidades.
      </p>

      {/* QR area */}
      <div
        className="mt-8 flex w-full max-w-[320px] flex-col items-center rounded-3xl p-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
      >
        <div
          className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl"
          style={{ background: "#fff", border: "1px solid var(--border-subtle)" }}
        >
          {qrAvailable ? (
            <Image
              src="/discord-qr.png"
              alt="Código QR para unirte al Discord de Ximo"
              width={280}
              height={280}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 px-6 text-center">
              <span className="text-3xl" aria-hidden>▦</span>
              <p className="text-xs font-bold" style={{ color: "#0B1F33" }}>Código QR próximamente</p>
              {/* TODO: subir el QR del invite a /public/discord-qr.png */}
              <p className="text-[10px]" style={{ color: "#5b7079" }}>
                Mientras tanto, usa el botón de abajo.
              </p>
            </div>
          )}
        </div>
        <p className="mt-3 text-[11px]" style={{ color: "var(--text-label)" }}>
          Escanea el código con tu teléfono para entrar directo.
        </p>
      </div>

      {/* Join button */}
      {inviteUrl ? (
        <a
          href={inviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ximo-glass-btn teal mt-7 inline-block w-full max-w-[320px] text-center text-sm"
        >
          Entrar al Discord de Ximo ↗
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="ximo-glass-btn dark mt-7 inline-block w-full max-w-[320px] cursor-not-allowed text-center text-sm opacity-60"
        >
          Discord invite pendiente
        </button>
      )}
      {inviteUrl && (
        <p className="mt-2 text-[10px]" style={{ color: "var(--text-3)" }}>
          Se abre en una pestaña nueva · sitio externo
        </p>
      )}

      {/* External-platform note */}
      <p className="mt-8 max-w-sm text-[11px] leading-relaxed" style={{ color: "var(--text-label)" }}>
        Discord es una plataforma externa. Al entrar, aplican sus propios términos, privacidad y reglas de comunidad.
      </p>
      <p className="mt-2 max-w-sm text-[11px] leading-relaxed" style={{ color: "var(--text-3)" }}>
        Dentro del servidor también aplican las{" "}
        <a href="/reglas-comunidad" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2" style={{ color: "var(--teal)" }}>
          reglas de la comunidad Ximo
        </a>
        . Sé respetuoso y no compartas datos personales sensibles.
      </p>
    </div>
  );
}
