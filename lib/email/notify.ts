import type { SupabaseClient } from "@supabase/supabase-js";
import { sendEmail } from "./resend";
import { renderEmail } from "./templates";

function siteUrl(): string {
  // Same fallback chain as lib/stripe/server.ts appUrl(): explicit env vars
  // first, then the per-deployment VERCEL_URL so Preview email links work.
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export interface MailContent {
  subject: string;
  heading: string;
  body: string[];
  ctaLabel?: string;
  /** App-relative path, e.g. "/app/notifications". Turned into an absolute URL. */
  ctaPath?: string;
}

function build(content: MailContent) {
  const ctaUrl = content.ctaPath ? `${siteUrl()}${content.ctaPath}` : undefined;
  const { html, text } = renderEmail({
    preview: content.body[0],
    heading: content.heading,
    body: content.body,
    ctaLabel: content.ctaLabel,
    ctaUrl,
  });
  return { html, text };
}

async function emailsEnabled(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("user_settings")
    .select("email_notifications")
    .eq("user_id", userId)
    .maybeSingle();
  // Default to enabled when there's no settings row yet.
  return data?.email_notifications ?? true;
}

/**
 * Email the CURRENTLY signed-in user (uses their own session: email from
 * auth.getUser(), settings via RLS). Safe no-op if email isn't configured or the
 * user disabled email notifications.
 */
export async function emailCurrentUser(supabase: SupabaseClient, content: MailContent): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return;
  if (!(await emailsEnabled(supabase, user.id))) return;
  const { html, text } = build(content);
  await sendEmail({ to: user.email, subject: content.subject, html, text });
}

/**
 * Email ANY user by id using the service-role client (reads their email via the
 * admin API + settings with RLS bypassed). Safe no-op if email/service role
 * aren't configured or the user disabled email notifications.
 */
export async function emailUserViaService(
  svc: SupabaseClient,
  userId: string,
  content: MailContent
): Promise<void> {
  if (!(await emailsEnabled(svc, userId))) return;
  const { data, error } = await svc.auth.admin.getUserById(userId);
  const email = data?.user?.email;
  if (error || !email) return;
  const { html, text } = build(content);
  await sendEmail({ to: email, subject: content.subject, html, text });
}
