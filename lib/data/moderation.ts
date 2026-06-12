import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/getUser";

export interface ModItem {
  id: string;
  targetType: "post" | "comment" | "brand_ad";
  author: string;
  preview: string;
  status: string;
  categories: string[];
  reportedCount: number;
}

export interface ModerationQueue {
  isAdmin: boolean;
  items: ModItem[];
  counts: { pending: number; flagged: number };
}

function nameOf(author: { full_name: string | null; username: string | null } | { full_name: string | null; username: string | null }[] | null): string {
  const a = Array.isArray(author) ? author[0] : author;
  return a?.full_name || a?.username || "Atleta Ximo";
}

export async function getModerationQueue(): Promise<ModerationQueue> {
  const supabase = await createClient();
  if (!supabase) return { isAdmin: false, items: [], counts: { pending: 0, flagged: 0 } };

  const profile = await getProfile();
  const isAdmin = profile?.role === "admin";
  if (!isAdmin) return { isAdmin: false, items: [], counts: { pending: 0, flagged: 0 } };

  const [posts, comments, ads, reports] = await Promise.all([
    supabase
      .from("community_posts")
      .select("id,body,title,moderation_status,sensitive_categories,author:profiles(full_name,username)")
      .in("moderation_status", ["pending", "flagged"])
      .order("created_at", { ascending: true })
      .limit(100),
    supabase
      .from("comments")
      .select("id,body,moderation_status,sensitive_categories,author:profiles(full_name,username)")
      .in("moderation_status", ["pending", "flagged"])
      .order("created_at", { ascending: true })
      .limit(100),
    supabase
      .from("brand_ads")
      .select("id,title,body,review_status,brand:brand_profiles(brand_name)")
      .eq("review_status", "pending")
      .order("created_at", { ascending: true })
      .limit(100),
    supabase.from("reports").select("target_id").eq("status", "open"),
  ]);

  const reportCounts = new Map<string, number>();
  for (const r of (reports.data as { target_id: string }[]) ?? []) {
    reportCounts.set(r.target_id, (reportCounts.get(r.target_id) ?? 0) + 1);
  }

  const items: ModItem[] = [];

  for (const p of (posts.data as Array<{ id: string; body: string | null; title: string | null; moderation_status: string; sensitive_categories: string[] | null; author: unknown }>) ?? []) {
    items.push({
      id: p.id,
      targetType: "post",
      author: nameOf(p.author as never),
      preview: p.title ? `${p.title} — ${p.body ?? ""}` : p.body ?? "(sin texto)",
      status: p.moderation_status,
      categories: p.sensitive_categories ?? [],
      reportedCount: reportCounts.get(p.id) ?? 0,
    });
  }
  for (const c of (comments.data as Array<{ id: string; body: string; moderation_status: string; sensitive_categories: string[] | null; author: unknown }>) ?? []) {
    items.push({
      id: c.id,
      targetType: "comment",
      author: nameOf(c.author as never),
      preview: c.body,
      status: c.moderation_status,
      categories: c.sensitive_categories ?? [],
      reportedCount: reportCounts.get(c.id) ?? 0,
    });
  }
  for (const a of (ads.data as Array<{ id: string; title: string | null; body: string | null; review_status: string; brand: unknown }>) ?? []) {
    const brand = Array.isArray(a.brand) ? a.brand[0] : (a.brand as { brand_name: string } | null);
    items.push({
      id: a.id,
      targetType: "brand_ad",
      author: brand?.brand_name ?? "Marca",
      preview: a.title ? `${a.title} — ${a.body ?? ""}` : a.body ?? "(sin descripción)",
      status: "pending",
      categories: [],
      reportedCount: 0,
    });
  }

  return {
    isAdmin: true,
    items,
    counts: {
      pending: items.filter((i) => i.status === "pending").length,
      flagged: items.filter((i) => i.status === "flagged").length,
    },
  };
}
