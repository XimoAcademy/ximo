"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/getUser";

export async function markAllReadAction(): Promise<void> {
  const { supabase, userId } = await requireUser();
  if (!supabase || !userId) return;
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);
  revalidatePath("/app/notifications");
}

export async function markReadAction(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireUser();
  if (!supabase || !userId) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id).eq("user_id", userId);
  revalidatePath("/app/notifications");
}

export async function saveNotificationPrefsAction(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireUser();
  if (!supabase || !userId) return;
  await supabase.from("user_settings").upsert(
    {
      user_id: userId,
      email_notifications: formData.get("email_notifications") === "on",
      community_notifications: formData.get("community_notifications") === "on",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  revalidatePath("/app/notifications");
}
