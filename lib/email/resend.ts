import { Resend } from "resend";

/**
 * Null-safe transactional email via Resend. Returns `{ ok:false, skipped:true }`
 * when not configured, so the app (and `next build`) works with email disabled —
 * in-app notifications still function regardless.
 *
 * Configure with:
 *   RESEND_API_KEY=re_...
 *   EMAIL_FROM="Ximo <hola@tudominio.com>"   (a verified Resend domain/sender)
 */
// Memoize on a const holder (mutating a property, not reassigning a module
// binding) so we don't trip @next/next/no-assign-module-variable.
const cache: { client: Resend | null } = { client: null };

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cache.client) cache.client = new Resend(key);
  return cache.client;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && (process.env.EMAIL_FROM ?? "").length > 0);
}

export interface SendEmailResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<SendEmailResult> {
  const resend = getResend();
  const from = process.env.EMAIL_FROM;
  if (!resend || !from) return { ok: false, skipped: true };
  if (!opts.to) return { ok: false, error: "missing recipient" };

  try {
    const { error } = await resend.emails.send({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      ...(opts.text ? { text: opts.text } : {}),
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "send failed" };
  }
}
