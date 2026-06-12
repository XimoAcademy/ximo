"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/getUser";
import { emailUserViaService } from "@/lib/email/notify";

async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) return null;
  const profile = await getProfile();
  if (profile?.role !== "admin") return null;
  return supabase;
}

/**
 * Moderate a queue item. For posts/comments this updates moderation_status
 * (allowed for admins by the guard trigger + RLS); for brand ads it updates
 * review_status. Also resolves any open reports on the target.
 */
export async function moderateAction(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  const targetType = String(formData.get("target_type") ?? "");
  const decision = String(formData.get("decision") ?? ""); // approved | hidden | rejected
  if (!id || !targetType || !decision) return;

  let authorId: string | null = null;
  if (targetType === "post") {
    const { data } = await supabase.from("community_posts").update({ moderation_status: decision }).eq("id", id).select("user_id").maybeSingle();
    authorId = (data?.user_id as string) ?? null;
  } else if (targetType === "comment") {
    const { data } = await supabase.from("comments").update({ moderation_status: decision }).eq("id", id).select("user_id").maybeSingle();
    authorId = (data?.user_id as string) ?? null;
  } else if (targetType === "brand_ad") {
    const review = decision === "approved" ? "approved" : "rejected";
    await supabase.from("brand_ads").update({ review_status: review }).eq("id", id);
  }

  // Notify the author when their content is approved (requires service role to
  // write a notification for another user; no-ops gracefully if not configured).
  if (authorId && decision === "approved") {
    const service = createServiceRoleClient();
    if (service) {
      const title = targetType === "post" ? "Tu publicación fue aprobada" : "Tu comentario fue aprobado";
      await service.from("notifications").insert({
        user_id: authorId,
        title,
        body: "Ya es visible para la comunidad Ximo.",
        type: "community",
      });
      await emailUserViaService(service, authorId, {
        subject: title,
        heading: title,
        body: [
          "Buenas noticias: tu contenido pasó la revisión y ya es visible para toda la comunidad Ximo.",
          "Sigue compartiendo tus avances, metas y dudas. La comunidad avanza cuando todos participan.",
        ],
        ctaLabel: "Ver la comunidad",
        ctaPath: "/app/comunidad",
      });
    }
  }

  // Resolve any open reports + queue entries pointing at this target.
  await supabase.from("reports").update({ status: "resolved", resolved_at: new Date().toISOString() }).eq("target_id", id).eq("status", "open");
  await supabase.from("moderation_queue").update({ status: decision === "approved" ? "approved" : decision }).eq("target_id", id).eq("status", "pending");

  revalidatePath("/app/admin/moderation");
  revalidatePath("/app/comunidad");
}
