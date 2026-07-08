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

  const body = [
    `Hola${opts.brandName ? ` ${opts.brandName}` : ""},`,
    `Buenas noticias: tu anuncio${opts.adTitle ? ` “${opts.adTitle}”` : ""} fue revisado y aprobado por el equipo de Ximo.`,
    "El siguiente paso es configurar tu campaña y completar el pago. Tu anuncio se publicará después de confirmarse el pago y de una activación final por parte del equipo Ximo.",
    ...(paymentUrl
      ? []
      : [
          "En breve te contactaremos con las instrucciones para completar el pago. No se realizará ningún cargo sin tu confirmación.",
        ]),
    "Si tienes dudas, responde a este correo.",
  ];

  const { html, text } = renderEmail({
    preview: "Tu anuncio fue aprobado en Ximo",
    heading: "Tu anuncio fue aprobado",
    body,
    ...(paymentUrl ? { ctaLabel: "Continuar con el pago", ctaUrl: paymentUrl } : {}),
  });

  await sendEmail({ to: opts.to, subject: "Tu anuncio fue aprobado en Ximo", html, text });
}

/** Rejection email: polite, no payment required. */
export async function emailAdvertiserRejected(opts: {
  to: string;
  brandName: string;
  adTitle: string | null;
}): Promise<void> {
  const { html, text } = renderEmail({
    preview: "Resultado de revisión de anuncio en Ximo",
    heading: "Resultado de la revisión",
    body: [
      `Hola${opts.brandName ? ` ${opts.brandName}` : ""},`,
      `Gracias por tu interés en promocionarte con Ximo. Después de revisarlo manualmente, tu anuncio${opts.adTitle ? ` “${opts.adTitle}”` : ""} no fue aprobado en esta ocasión.`,
      "No se requiere ningún pago y no se realizará ningún cargo.",
      "Puedes revisar nuestra política de anuncios y enviar una nueva propuesta alineada con atletas estudiantes cuando quieras.",
      "Si tienes dudas sobre la decisión, responde a este correo.",
    ],
    ctaLabel: "Ver política de anuncios",
    ctaUrl: `${appUrl()}/politica-de-anuncios`,
  });

  await sendEmail({ to: opts.to, subject: "Resultado de revisión de anuncio en Ximo", html, text });
}
