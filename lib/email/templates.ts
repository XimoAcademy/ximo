/**
 * Branded transactional email HTML. Email clients require inline styles and a
 * light background, so this is a self-contained light theme with Ximo accents
 * (teal #1b8a96 / gold #b8902e tuned for contrast on white). No external CSS.
 */

const TEAL = "#147884";
const GOLD = "#9a7717";
const INK = "#0f2630";
const MUTED = "#5b7079";
const BG = "#eef4f1";
const CARD = "#ffffff";
const BORDER = "#dbe7e4";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const DEFAULT_FOOTER =
  "Recibes este correo porque tienes una cuenta en Ximo. Puedes ajustar tus notificaciones en la app, en Notificaciones.";

export function renderEmail(opts: {
  preview?: string;
  heading: string;
  /** Paragraphs of body text (plain strings; rendered as <p>). */
  body: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  /** Why-you-got-this line. Defaults to the app-account wording; advertiser and
   *  review-inbox mails pass their own so the reason is always accurate. */
  footer?: string;
}): { html: string; text: string } {
  const { heading, body, ctaLabel, ctaUrl, preview } = opts;
  const footer = opts.footer ?? DEFAULT_FOOTER;

  const paragraphs = body
    .map(
      (p) =>
        `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${INK};">${escapeHtml(p)}</p>`
    )
    .join("");

  const cta =
    ctaLabel && ctaUrl
      ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 4px;">
           <tr><td style="border-radius:10px;background:${TEAL};">
             <a href="${ctaUrl}" style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;">${escapeHtml(ctaLabel)}</a>
           </td></tr>
         </table>`
      : "";

  const previewLine = preview
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preview)}</div>`
    : "";

  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BG};">
  ${previewLine}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:28px 14px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${CARD};border:1px solid ${BORDER};border-radius:16px;overflow:hidden;">
        <tr><td style="padding:22px 28px 0;">
          <span style="font-size:20px;font-weight:800;letter-spacing:-0.02em;color:${TEAL};">Ximo</span>
          <span style="font-size:11px;font-weight:700;color:${GOLD};margin-left:8px;text-transform:uppercase;letter-spacing:0.12em;">México primero</span>
        </td></tr>
        <tr><td style="padding:18px 28px 26px;">
          <h1 style="margin:0 0 14px;font-size:20px;line-height:1.3;color:${INK};font-weight:800;">${escapeHtml(heading)}</h1>
          ${paragraphs}
          ${cta}
        </td></tr>
        <tr><td style="padding:16px 28px 22px;border-top:1px solid ${BORDER};">
          <p style="margin:0;font-size:12px;line-height:1.5;color:${MUTED};">${escapeHtml(footer)}</p>
        </td></tr>
      </table>
      <p style="margin:14px 0 0;font-size:11px;color:${MUTED};">Ximo · Live the Dream</p>
    </td></tr>
  </table>
</body></html>`;

  const text = `${heading}\n\n${body.join("\n\n")}${ctaUrl ? `\n\n${ctaLabel}: ${ctaUrl}` : ""}\n\n— Ximo`;

  return { html, text };
}
