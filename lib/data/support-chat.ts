import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/getUser";

export interface SupportMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

/**
 * Get-or-create the signed-in user's single support conversation (1:1,
 * enforced by the unique(user_id) constraint on support_conversations —
 * see supabase/migrations/014_support_chat.sql). Race-safe: if two
 * requests insert concurrently, the loser reads back the winner's row.
 */
export async function getOrCreateConversationId(): Promise<string | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: existing } = await supabase
    .from("support_conversations")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) return existing.id as string;

  const { data: created, error } = await supabase
    .from("support_conversations")
    .insert({ user_id: user.id })
    .select("id")
    .maybeSingle();
  if (created) return created.id as string;

  if (error && (error as { code?: string }).code === "23505") {
    const { data: retry } = await supabase
      .from("support_conversations")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    return (retry?.id as string) ?? null;
  }
  return null;
}

export async function getMessages(conversationId: string, limit = 50): Promise<SupportMessage[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("support_messages")
    .select("id,role,content,created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit);
  return (data as SupportMessage[]) ?? [];
}

/**
 * Cuántos mensajes ha enviado el usuario en los últimos `minutos`. Sirve para
 * limitar el ritmo: la cuota gratuita de Gemini es diaria y compartida entre
 * todos los atletas, así que un solo usuario no debe poder agotarla.
 */
export async function countRecentUserMessages(conversationId: string, minutos: number): Promise<number> {
  const supabase = await createClient();
  if (!supabase) return 0;
  const desde = new Date(Date.now() - minutos * 60_000).toISOString();
  const { count } = await supabase
    .from("support_messages")
    .select("*", { count: "exact", head: true })
    .eq("conversation_id", conversationId)
    .eq("role", "user")
    .gte("created_at", desde);
  return count ?? 0;
}

export async function insertMessage(
  conversationId: string,
  userId: string,
  role: "user" | "assistant",
  content: string
): Promise<void> {
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("support_messages").insert({ conversation_id: conversationId, user_id: userId, role, content });
  await supabase
    .from("support_conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);
}
