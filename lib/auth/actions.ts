"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSubscriptionActive } from "@/lib/subscription/requireSubscription";
import { getPostHogClient } from "@/lib/posthog-server";
import { codeFromResidenceText } from "@/lib/intl/countries";

export type AuthState = { error?: string; sent?: boolean };

// Bump when the Aviso de Privacidad changes — stored with each consent record.
// Local (not exported): a "use server" module may only export async functions.
const PRIVACY_NOTICE_VERSION = "2026-06-14";

const NOT_CONFIGURED: AuthState = {
  error: "Supabase aún no está configurado. Agrega las variables de entorno.",
};

// Map common Supabase auth errors to friendly Spanish.
function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Correo o contraseña incorrectos.";
  if (m.includes("email not confirmed")) return "Confirma tu correo antes de iniciar sesión.";
  if (m.includes("user already registered") || m.includes("already been registered"))
    return "Ya existe una cuenta con este correo.";
  if (m.includes("password should be at least"))
    return "La contraseña debe tener al menos 8 caracteres.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Demasiados intentos. Espera un momento e inténtalo de nuevo.";
  if (m.includes("unable to validate email") || m.includes("invalid email"))
    return "Ingresa un correo válido.";
  return message;
}

async function originUrl(): Promise<string> {
  const h = await headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

// ── Sign in ───────────────────────────────────────────────────────────────
export async function signInAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Ingresa tu correo y contraseña." };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: translateAuthError(error.message) };

  const posthog = getPostHogClient();
  posthog.capture({ distinctId: data.user.id, event: "user_signed_in" });
  await posthog.flush();

  redirect("/account-status");
}

// ── Sign up ───────────────────────────────────────────────────────────────
export async function signUpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const country = String(formData.get("country") ?? "").trim();
  // ISO code stored alongside the display text (profiles.country_code,
  // migration 010). Null for "Otro"/unrecognised — never invented.
  const country_code = codeFromResidenceText(country);
  const gradYearRaw = String(formData.get("graduation_year") ?? "").trim();
  const graduation_year = gradYearRaw ? Number(gradYearRaw) : null;
  const privacyAccepted = formData.get("privacy_accepted") != null;
  // Optional, separate marketing consent (LFPDPPP: secondary purpose, opt-in).
  const marketingOptIn = formData.get("marketing_opt_in") != null;

  if (!email || !password) return { error: "Ingresa tu correo y una contraseña." };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };
  // LFPDPPP: consent must be given before collecting data, and the acceptance
  // (version + timestamp) is recorded in the user's auth metadata.
  if (!privacyAccepted) return { error: "Debes leer y aceptar el Aviso de Privacidad para crear tu cuenta." };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // handle_new_user() reads these to seed the profile.
      data: {
        full_name: fullName,
        sport: "Natación",
        country,
        country_code,
        graduation_year,
        privacy_accepted_at: new Date().toISOString(),
        privacy_notice_version: PRIVACY_NOTICE_VERSION,
        marketing_opt_in: marketingOptIn,
      },
      emailRedirectTo: `${await originUrl()}/auth/confirm?next=/account-status`,
    },
  });
  if (error) return { error: translateAuthError(error.message) };

  if (data.user) {
    const posthog = getPostHogClient();
    posthog.identify({ distinctId: data.user.id, properties: { sport: "Natación", country, country_code, graduation_year, marketing_opt_in: marketingOptIn } });
    posthog.capture({ distinctId: data.user.id, event: "user_registered", properties: { country, country_code, graduation_year, marketing_opt_in: marketingOptIn } });
    await posthog.flush();
  }

  // If email confirmation is OFF, a session exists immediately → go choose a plan.
  // If it's ON, no session yet → tell the user to verify their email.
  if (data.session) redirect("/subscribe");
  redirect("/verify-email");
}

// ── Resend confirmation email ──────────────────────────────────────────────
export async function resendConfirmationAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Ingresa tu correo electrónico." };

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${await originUrl()}/auth/confirm?next=/account-status` },
  });

  // Don't leak whether the email exists / is already confirmed — always report sent
  // (except on rate limiting, which is safe to surface).
  if (error && error.message.toLowerCase().includes("rate")) {
    return { error: "Demasiados intentos. Espera un momento e inténtalo de nuevo." };
  }
  return { sent: true };
}

// ── Sign out ──────────────────────────────────────────────────────────────
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/login");
}

// ── Forgot password ───────────────────────────────────────────────────────
export async function requestPasswordResetAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Ingresa tu correo electrónico." };

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await originUrl()}/auth/confirm?next=/reset-password`,
  });
  // Don't leak whether the email exists — always report "sent".
  if (error && !error.message.toLowerCase().includes("rate")) {
    return { sent: true };
  }
  if (error) return { error: translateAuthError(error.message) };
  return { sent: true };
}

// ── Update password (after reset link) ─────────────────────────────────────
export async function updatePasswordAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };
  if (password !== confirm) return { error: "Las contraseñas no coinciden." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: translateAuthError(error.message) };

  redirect("/login?reset=1");
}

// ── Activate a (mock) subscription plan ────────────────────────────────────
export async function activateSubscriptionAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  if (!supabase) redirect("/app"); // unconfigured: don't block the prototype

  const {
    data: { user },
  } = await supabase!.auth.getUser();
  if (!user) redirect("/login");

  const plan = String(formData.get("plan") ?? "monthly");
  await supabase!.rpc("activate_subscription", { p_plan: plan === "annual" ? "annual" : "monthly" });

  redirect("/app");
}

// ── Access check for the validation screen ─────────────────────────────────
export type AccessState = "unauthenticated" | "inactive" | "active";

export async function checkAccessAction(): Promise<{ state: AccessState }> {
  const supabase = await createClient();
  if (!supabase) return { state: "active" }; // unconfigured: don't block

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { state: "unauthenticated" };

  return { state: (await isSubscriptionActive()) ? "active" : "inactive" };
}
