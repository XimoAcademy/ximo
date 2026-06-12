"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { classifyTextLocally, shouldSendToReview } from "@/lib/moderation/content-filter";
import { TAG_TO_TYPE, type CommunityTag } from "@/lib/data/community-constants";

export interface ActionResult {
  ok: boolean;
  error?: string;
  pending?: boolean;
}

async function requireUser() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, userId: null } as const;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, userId: user?.id ?? null } as const;
}

export async function createPostAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  if (!userId) redirect("/login");

  const body = String(formData.get("body") ?? "").trim();
  const tag = String(formData.get("tag") ?? "Meta") as CommunityTag;
  const title = String(formData.get("title") ?? "").trim() || null;

  if (!body) return { ok: false, error: "Escribe algo para publicar." };
  if (body.length > 1000) return { ok: false, error: "El texto es demasiado largo (máx. 1000)." };

  const type = TAG_TO_TYPE[tag] ?? "text";
  const classification = classifyTextLocally(`${title ?? ""} ${body}`);

  const { data: post, error } = await supabase
    .from("community_posts")
    .insert({
      user_id: userId,
      type,
      title,
      body,
      topic: tag,
      moderation_status: "pending",
      sensitive_score: classification.score,
      sensitive_categories: classification.categories,
    })
    .select("id")
    .single();

  if (error || !post) return { ok: false, error: "No se pudo publicar. Intenta de nuevo." };

  if (shouldSendToReview(classification)) {
    await supabase.from("moderation_queue").insert({
      target_type: "post",
      target_id: post.id,
      user_id: userId,
      reason: classification.categories.length ? classification.categories.join(", ") : "review",
      status: "pending",
    });
  }

  revalidatePath("/app/comunidad");
  return { ok: true, pending: true };
}

export async function toggleLikeAction(postId: string): Promise<{ ok: boolean; liked: boolean }> {
  const { supabase, userId } = await requireUser();
  if (!supabase || !userId) return { ok: false, liked: false };

  const { data: existing } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await supabase.from("post_likes").delete().eq("id", existing.id);
    revalidatePath("/app/comunidad");
    return { ok: true, liked: false };
  }
  await supabase.from("post_likes").insert({ post_id: postId, user_id: userId });
  revalidatePath("/app/comunidad");
  return { ok: true, liked: true };
}

export async function addCommentAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  if (!userId) redirect("/login");

  const postId = String(formData.get("post_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!postId || !body) return { ok: false, error: "Escribe un comentario." };
  if (body.length > 800) return { ok: false, error: "Comentario demasiado largo." };

  const classification = classifyTextLocally(body);

  const { data: comment, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: userId,
      body,
      moderation_status: "pending",
      sensitive_categories: classification.categories,
    })
    .select("id")
    .single();

  if (error || !comment) return { ok: false, error: "No se pudo comentar." };

  if (shouldSendToReview(classification)) {
    await supabase.from("moderation_queue").insert({
      target_type: "comment",
      target_id: comment.id,
      user_id: userId,
      reason: "review",
      status: "pending",
    });
  }

  revalidatePath(`/app/comunidad/post/${postId}`);
  return { ok: true, pending: true };
}

export async function reportContentAction(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireUser();
  if (!supabase || !userId) return;
  const targetType = String(formData.get("target_type") ?? "post");
  const targetId = String(formData.get("target_id") ?? "");
  const reason = String(formData.get("reason") ?? "other");
  const details = String(formData.get("details") ?? "").trim() || null;
  if (!targetId) return;

  await supabase.from("reports").insert({
    reporter_id: userId,
    target_type: targetType,
    target_id: targetId,
    reason,
    details,
    status: "open",
  });
  revalidatePath("/app/comunidad");
}

export async function deletePostAction(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireUser();
  if (!supabase || !userId) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabase.from("community_posts").delete().eq("id", id).eq("user_id", userId);
  revalidatePath("/app/comunidad");
}
