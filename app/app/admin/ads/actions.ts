"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/getUser";

async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) return null;
  const profile = await getProfile();
  if (profile?.role !== "admin") return null;
  return supabase;
}

export async function reviewAdAction(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? ""); // approved | rejected
  if (!id || !["approved", "rejected"].includes(decision)) return;

  await supabase
    .from("brand_ads")
    .update({ review_status: decision })
    .eq("id", id);

  revalidatePath("/app/admin/ads");
  revalidatePath("/app/promocionar");
}
