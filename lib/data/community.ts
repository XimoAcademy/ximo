import { createClient } from "@/lib/supabase/server";

export interface Author {
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  sport: string | null;
  graduation_year: number | null;
}

export interface FeedPost {
  id: string;
  user_id: string;
  type: string;
  title: string | null;
  body: string | null;
  topic: string | null;
  moderation_status: string;
  created_at: string;
  author: Author | null;
  displayName: string;
  initials: string;
  subline: string;
  likes: number;
  likedByMe: boolean;
  comments: number;
  isMine: boolean;
  isOfficial: boolean;
}

export interface CommunityComment {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  moderation_status: string;
  author: Author | null;
  isMine: boolean;
}

function initialsFrom(a: Author | null, userId: string): string {
  const name = a?.full_name || a?.username || "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return userId.slice(0, 2).toUpperCase();
}

export function authorInitials(a: Author | null, userId: string): string {
  return initialsFrom(a, userId);
}

export function authorName(a: Author | null): string {
  return a?.full_name || a?.username || "Atleta Ximo";
}

export function authorSubline(a: Author | null): string {
  return [a?.sport || "Natación", a?.graduation_year ? `Clase ${a.graduation_year}` : null].filter(Boolean).join(" · ");
}

async function decoratePosts(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  rows: Array<{ id: string; user_id: string; type: string; title: string | null; body: string | null; topic: string | null; moderation_status: string; created_at: string; author: Author | Author[] | null }>,
  myId: string | null
): Promise<FeedPost[]> {
  const ids = rows.map((r) => r.id);
  if (ids.length === 0) return [];

  const [{ data: likes }, { data: comments }] = await Promise.all([
    supabase.from("post_likes").select("post_id,user_id").in("post_id", ids),
    supabase.from("comments").select("post_id,moderation_status,user_id").in("post_id", ids),
  ]);

  const likeCount = new Map<string, number>();
  const likedByMe = new Set<string>();
  for (const l of (likes as { post_id: string; user_id: string }[]) ?? []) {
    likeCount.set(l.post_id, (likeCount.get(l.post_id) ?? 0) + 1);
    if (myId && l.user_id === myId) likedByMe.add(l.post_id);
  }
  const commentCount = new Map<string, number>();
  for (const c of (comments as { post_id: string; moderation_status: string; user_id: string }[]) ?? []) {
    if (c.moderation_status === "approved" || (myId && c.user_id === myId)) {
      commentCount.set(c.post_id, (commentCount.get(c.post_id) ?? 0) + 1);
    }
  }

  return rows.map((r) => {
    const author = (Array.isArray(r.author) ? r.author[0] : r.author) ?? null;
    return {
      id: r.id,
      user_id: r.user_id,
      type: r.type,
      title: r.title,
      body: r.body,
      topic: r.topic,
      moderation_status: r.moderation_status,
      created_at: r.created_at,
      author,
      displayName: authorName(author),
      initials: initialsFrom(author, r.user_id),
      subline: authorSubline(author),
      likes: likeCount.get(r.id) ?? 0,
      likedByMe: likedByMe.has(r.id),
      comments: commentCount.get(r.id) ?? 0,
      isMine: myId === r.user_id,
      isOfficial: false,
    };
  });
}

const POST_SELECT =
  "id,user_id,type,title,body,topic,moderation_status,created_at,author:profiles(full_name,username,avatar_url,sport,graduation_year)";

export async function getFeed(topic?: string): Promise<{ posts: FeedPost[]; configured: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { posts: [], configured: false };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const myId = user?.id ?? null;

  let query = supabase.from("community_posts").select(POST_SELECT).order("created_at", { ascending: false }).limit(60);
  if (topic) query = query.ilike("topic", topic);

  const { data } = await query;
  const posts = await decoratePosts(supabase, (data as Parameters<typeof decoratePosts>[1]) ?? [], myId);
  return { posts, configured: true };
}

export async function getPost(id: string): Promise<{ post: FeedPost; comments: CommunityComment[] } | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const myId = user?.id ?? null;

  const { data: row } = await supabase.from("community_posts").select(POST_SELECT).eq("id", id).maybeSingle();
  if (!row) return null;

  const [post] = await decoratePosts(supabase, [row as Parameters<typeof decoratePosts>[1][number]], myId);

  const { data: cmts } = await supabase
    .from("comments")
    .select("id,user_id,body,created_at,moderation_status,author:profiles(full_name,username,avatar_url,sport,graduation_year)")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  const comments: CommunityComment[] = ((cmts as Array<{ id: string; user_id: string; body: string; created_at: string; moderation_status: string; author: Author | Author[] | null }>) ?? []).map((c) => ({
    id: c.id,
    user_id: c.user_id,
    body: c.body,
    created_at: c.created_at,
    moderation_status: c.moderation_status,
    author: (Array.isArray(c.author) ? c.author[0] : c.author) ?? null,
    isMine: myId === c.user_id,
  }));

  return { post, comments };
}

export async function getTrendingTopics(): Promise<{ topic: string; count: number }[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("community_posts")
    .select("topic")
    .eq("moderation_status", "approved")
    .not("topic", "is", null)
    .limit(500);
  const counts = new Map<string, number>();
  for (const r of (data as { topic: string | null }[]) ?? []) {
    if (!r.topic) continue;
    counts.set(r.topic, (counts.get(r.topic) ?? 0) + 1);
  }
  return [...counts.entries()].map(([topic, count]) => ({ topic, count })).sort((a, b) => b.count - a.count).slice(0, 6);
}

export async function getCommunityStats(): Promise<{ athletes: number; postsToday: number; posts: number }> {
  const supabase = await createClient();
  if (!supabase) return { athletes: 0, postsToday: 0, posts: 0 };
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const [{ count: athletes }, { count: posts }, { count: postsToday }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("community_posts").select("*", { count: "exact", head: true }).eq("moderation_status", "approved"),
    supabase.from("community_posts").select("*", { count: "exact", head: true }).eq("moderation_status", "approved").gte("created_at", startOfDay.toISOString()),
  ]);
  return { athletes: athletes ?? 0, postsToday: postsToday ?? 0, posts: posts ?? 0 };
}
