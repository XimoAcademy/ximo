import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/getUser";

export interface NotificationRow {
  id: string;
  title: string | null;
  body: string | null;
  type: string | null;
  read_at: string | null;
  created_at: string;
}

/** Lightweight unread count for the nav badge (head-only, no rows transferred). */
export async function getUnreadCount(): Promise<number> {
  const supabase = await createClient();
  if (!supabase) return 0;
  const user = await getCurrentUser();
  if (!user) return 0;
  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .is("read_at", null);
  return count ?? 0;
}

export async function getNotifications(): Promise<{ rows: NotificationRow[]; unread: number }> {
  const supabase = await createClient();
  if (!supabase) return { rows: [], unread: 0 };
  const user = await getCurrentUser();
  if (!user) return { rows: [], unread: 0 };

  const { data } = await supabase
    .from("notifications")
    .select("id,title,body,type,read_at,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const rows = (data as NotificationRow[]) ?? [];
  return { rows, unread: rows.filter((n) => !n.read_at).length };
}
