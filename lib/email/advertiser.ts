import { sendEmail } from "./resend";
import { renderEmail } from "./templates";

/**
 * Advertiser-flow emails (manual ad review).
 *
 * These go to external advertiser addresses (not app users), so they don't
 * pass through the user notification-preference check in lib/email/notify.ts.
 * All sends are null-safe: without RESEND_API_KEY/EMAIL_FROM they no-op.
 *
 * Env:
 *   XIMO_REVIEW_EMAIL        — inbox that receives new ad submissions
 *                              (defaults to ximoacademy@gmail.com)
 *   PAYMENT_LINK_PLACEHOLDER — optional external payment link used in the
 *                              approval email when Stripe isn't configured.
 *                              TODO: remove once the payment provider is live.
 */

const REVIEW_EMAIL_FALLBACK = "ximoacademy@gmail.com";

// Why-you-got-this footers (the default template footer talks about app
// notification settings, which doesn't apply to advertisers or the reviewer).
const ADVERTISER_FOOTER =
  "Recibes este correo porque enviaste una solicitud de anuncio a Ximo. Puedes seguir su estado en la app, en Promocionar → Estado de revisión.";
const REVIEWER_FOOTER =
  "Recibes este correo porque eres el contacto de revisión de anuncios de Ximo.";

export function reviewInboxAddress(): string {
  return process.env.XIMO_REVIEW_EMAIL || REVIEW_EMAIL_FALLBACK;
}

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export interface AdSubmissionSummary {
  brandName: string;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  website: string | null;
  category: string | null;
  format: string | null;
  title: string | null;
  description: string;
  destinationUrl: string | null;
  audience: string | null;
  budgetRange: string | null;
  preferredDates: string | null;
  mediaUrl: string | null;
}

/** Notify the Ximo review inbox that a new ad request arrived. */
export async function emailReviewInbox(ad: AdSubmissionSummary): Promise<void> {
  const lines = [
    `Marca: ${ad.brandName}`,
    ad.contactName ? `Contacto: ${ad.contactName}` : null,
    ad.contactEmail ? `Correo: ${ad.contactEmail}` : null,
    ad.contactPhone ? `Teléfono: ${ad.contactPhone}` : null,
    ad.website ? `Sitio/red social: ${ad.website}` : null,
    ad.category ? `Categoría: ${ad.category}` : null,
    ad.format ? `Formato: ${ad.format}` : null,
    ad.title ? `Título de campaña: ${ad.title}` : null,
    `Descripción: ${ad.description}`,
    ad.destinationUrl ? `Link de destino: ${ad.destinationUrl}` : null,
    ad.audience ? `Audiencia: ${ad.audience}` : null,
    ad.budgetRange ? `Rango de presupuesto: ${ad.budgetRange}` : null,
    ad.preferredDates ? `Fechas preferidas: ${ad.preferredDates}` : null,
    ad.mediaUrl ? `Archivo del anuncio: ${ad.mediaUrl}` : "Archivo del anuncio: (no adjuntado)",
  ].filter((l): l is string => Boolean(l));

  const { html, text } = renderEmail({
    preview: `Nueva solicitud de anuncio de ${ad.brandName}`,
    heading: "Nueva solicitud de anuncio",
    body: [
      "Una marca envió una solicitud de anuncio a revisión. Detalles:",
      ...lines,
      `Revisa y decide desde el panel: ${appUrl()}/app/admin/ads`,
    ],
    ctaLabel: "Abrir panel de anuncios",
    ctaUrl: `${appUrl()}/app/admin/ads`,
    footer: REVIEWER_FOOTER,
  });

  await sendEmail({
    to: reviewInboxAddress(),
    subject: `Nueva solicitud de anuncio — ${ad.brandName}`,
    html,
    text,
  });
}

/** Approval email: invites the advertiser to continue with payment. */
export async function emailAdvertiserApproved(opts: {
  to: string;
  brandName: string;
  adTitle: string | null;
  stripeConfigured: boolean;
}): Promise<void> {
  // With Stripe configured, payment happens inside the app (campaign page).
  // Otherwise fall back to an external payment link if one is provided.
  // TODO: replace PAYMENT_LINK_PLACEHOLDER with the real payment provider link.
  const paymentUrl = opts.stripeConfigured
    ? `${appUrl()}/app/promocionar/campana`
    : process.env.PAYMENT_LINK_PLACEHOLDER || null;

  // Wording mirrors the "Aprobado · pendiente de pago" card in
  // /app/promocionar/revision so email and app always tell the same story.
  const body = [
    `Hola${opts.brandName ? ` ${opts.brandName}` : ""},`,
    `Buenas noticias: tu anuncio${opts.adTitle ? ` “${opts.adTitle}”` : ""} fue aprobado. Ahora puedes configurar presupuesto y duración, y completar el pago.`,
    "Tras confirmarse el pago, el equipo Ximo activa la publicación. Te avisaremos cuando tu anuncio esté visible en Marcas y oportunidades.",
    ...(paymentUrl
      ? []
      : [
          "En breve te contactaremos con las instrucciones para completar el pago. No se realizará ningún cargo sin tu confirmación.",
        ]),
    "Si tienes dudas, responde a este correo.",
  ];

  const { html, text } = renderEmail({
    preview: "Tu anuncio fue aprobado en Ximo",
    heading: "Aprobado · pendiente de pago",
    body,
    ...(paymentUrl ? { ctaLabel: "Configurar campaña y pagar", ctaUrl: paymentUrl } : {}),
    footer: ADVERTISER_FOOTER,
  });

  await sendEmail({ to: opts.to, subject: "Tu anuncio fue aprobado en Ximo", html, text });
}

/** Publication email: the paid ad is now live in Marcas y oportunidades. */
export async function emailAdvertiserPublished(opts: {
  to: string;
  brandName: string;
  adTitle: string | null;
}): Promise<void> {
  // Wording mirrors the "Publicado" card in /app/promocionar/revision.
  const { html, text } = renderEmail({
    preview: "Tu anuncio ya está publicado en Ximo",
    heading: "Tu anuncio está publicado",
    body: [
      `Hola${opts.brandName ? ` ${opts.brandName}` : ""},`,
      `Tu anuncio${opts.adTitle ? ` “${opts.adTitle}”` : ""} está publicado en la sección Marcas y oportunidades, etiquetado como publicidad.`,
      "Puedes ver cómo lo ven los atletas en Marcas y oportunidades.",
      "Si tienes dudas, responde a este correo.",
    ],
    ctaLabel: "Ver en Marcas y oportunidades",
    ctaUrl: `${appUrl()}/app/marcas`,
    footer: ADVERTISER_FOOTER,
  });

  await sendEmail({ to: opts.to, subject: "Tu anuncio ya está publicado en Ximo", html, text });
}

/** Rejection email: polite, no payment required. */
export async function emailAdvertiserRejected(opts: {
  to: string;
  brandName: string;
  adTitle: string | null;
}): Promise<void> {
  // Wording mirrors the "No aprobado" card in /app/promocionar/revision.
  const { html, text } = renderEmail({
    preview: "Resultado de revisión de anuncio en Ximo",
    heading: "Resultado de la revisión",
    body: [
      `Hola${opts.brandName ? ` ${opts.brandName}` : ""},`,
      `Gracias por tu interés en promocionarte con Ximo. Después de revisarlo manualmente, tu anuncio${opts.adTitle ? ` “${opts.adTitle}”` : ""} no fue aprobado en esta ocasión.`,
      "No se requiere ningún pago y no se realizará ningún cargo.",
      "Revisa la política de anuncios y envía una nueva propuesta alineada con atletas estudiantes cuando quieras.",
      "Si tienes dudas sobre la decisión, responde a este correo.",
    ],
    ctaLabel: "Ver política de anuncios",
    ctaUrl: `${appUrl()}/politica-de-anuncios`,
    footer: ADVERTISER_FOOTER,
  });

  await sendEmail({ to: opts.to, subject: "Resultado de revisión de anuncio en Ximo", html, text });
}
