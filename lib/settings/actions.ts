"use server";

import { redirect } from "next/navigation";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

export interface UserSettings {
  theme: string;
  language: string;
  email_notifications: boolean;
  community_notifications: boolean;
}

/** Load the signed-in user's settings, or null when unconfigured / signed out. */
export async function getUserSettings(): Promise<UserSettings | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_settings")
    .select("theme,language,email_notifications,community_notifications")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data as UserSettings;
}

/** Real account summary for the Settings page (name, email, plan, status). */
export async function getAccountSummary(): Promise<{
  name: string;
  email: string;
  plan: string;
  status: string;
} | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, subscription_status, plan_type")
    .eq("id", user.id)
    .maybeSingle();

  const name = profile?.full_name || user.email?.split("@")[0] || "Atleta";
  const plan = profile?.plan_type === "annual" ? "Anual" : profile?.plan_type === "monthly" ? "Mensual" : "—";
  const statusMap: Record<string, string> = {
    active: "Activa",
    manual_active: "Activa",
    trialing: "Prueba",
    past_due: "Pago pendiente",
    canceled: "Cancelada",
    inactive: "Inactiva",
  };
  const status = statusMap[profile?.subscription_status ?? "inactive"] ?? "—";
  return { name, email: user.email ?? "—", plan, status };
}

/** Persist a partial settings update for the signed-in user. */
export async function saveUserSettings(
  input: Partial<UserSettings>
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { error } = await supabase
    .from("user_settings")
    .upsert(
      { user_id: user.id, ...input, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );

  return { ok: !error };
}

/**
 * Permanently delete the signed-in user's account and all their data (ARCO /
 * LFPDPPP right to cancellation). Deleting the auth user cascades to `profiles`
 * and every owned table via ON DELETE CASCADE. Requires the service-role key.
 * Private storage files become inaccessible immediately (RLS owner check) and
 * can be purged by a retention job.
 */
export async function deleteAccountAction(): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const svc = createServiceRoleClient();
  if (!svc) {
    return {
      ok: false,
      error:
        "La eliminación de cuenta no está disponible en este momento. Escríbenos a ximoacademy@gmail.com y la procesaremos manualmente.",
    };
  }

  const { error } = await svc.auth.admin.deleteUser(user.id);
  if (error) return { ok: false, error: "No se pudo eliminar la cuenta. Intenta de nuevo o contacta a soporte." };

  await supabase.auth.signOut();
  redirect("/login?deleted=1");
}

/**
 * Export all of the signed-in user's data as a JSON-serializable object (ARCO /
 * LFPDPPP right of access). Reads only the user's own rows via RLS.
 */
export async function exportMyDataAction(): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesión expirada." };

  const own = (table: string) => supabase.from(table).select("*").eq("user_id", user.id);

  const [
    profile,
    athlete,
    settings,
    universities,
    coaches,
    recruitingEvents,
    emails,
    documents,
    tasks,
    progress,
    posts,
    comments,
    subscriptions,
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("athlete_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle(),
    own("universities"),
    own("coaches"),
    own("recruiting_events"),
    own("emails"),
    own("documents"),
    own("tasks"),
    own("progress_entries"),
    own("community_posts"),
    own("comments"),
    own("subscriptions"),
  ]);

  return {
    ok: true,
    data: {
      exportedAt: new Date().toISOString(),
      account: { id: user.id, email: user.email },
      profile: profile.data ?? null,
      athleteProfile: athlete.data ?? null,
      settings: settings.data ?? null,
      universities: universities.data ?? [],
      coaches: coaches.data ?? [],
      recruitingEvents: recruitingEvents.data ?? [],
      emails: emails.data ?? [],
      documents: documents.data ?? [],
      tasks: tasks.data ?? [],
      progressEntries: progress.data ?? [],
      communityPosts: posts.data ?? [],
      comments: comments.data ?? [],
      subscriptions: subscriptions.data ?? [],
    },
  };
}
