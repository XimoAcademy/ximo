import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/getUser";

export interface AdItem {
  id: string;
  title: string | null;
  body: string | null;
  media_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  review_status: "pending" | "approved" | "rejected";
  created_at: string;
  brand_name: string;
  budget: number | null;
  platform: string | null;
}

export interface AdQueue {
  isAdmin: boolean;
  items: AdItem[];
  counts: { pending: number; approved: number; rejected: number };
}

export async function getAdQueue(): Promise<AdQueue> {
  const supabase = await createClient();
  if (!supabase) return { isAdmin: false, items: [], counts: { pending: 0, approved: 0, rejected: 0 } };

  const profile = await getProfile();
  const isAdmin = profile?.role === "admin";
  if (!isAdmin) return { isAdmin: false, items: [], counts: { pending: 0, approved: 0, rejected: 0 } };

  const { data } = await supabase
    .from("brand_ads")
    .select("id,title,body,media_url,cta_label,cta_url,review_status,created_at,budget,platform,brand:brand_profiles(brand_name)")
    .order("created_at", { ascending: false })
    .limit(200);

  const items: AdItem[] = ((data ?? []) as Array<{
    id: string;
    title: string | null;
    body: string | null;
    media_url: string | null;
    cta_label: string | null;
    cta_url: string | null;
    review_status: string;
    created_at: string;
    budget: number | null;
    platform: string | null;
    brand: { brand_name: string } | { brand_name: string }[] | null;
  }>).map((a) => {
    const brand = Array.isArray(a.brand) ? a.brand[0] : a.brand;
    return {
      id: a.id,
      title: a.title,
      body: a.body,
      media_url: a.media_url,
      cta_label: a.cta_label,
      cta_url: a.cta_url,
      review_status: (a.review_status as AdItem["review_status"]) ?? "pending",
      created_at: a.created_at,
      brand_name: brand?.brand_name ?? "Marca",
      budget: a.budget,
      platform: a.platform,
    };
  });

  return {
    isAdmin: true,
    items,
    counts: {
      pending: items.filter((i) => i.review_status === "pending").length,
      approved: items.filter((i) => i.review_status === "approved").length,
      rejected: items.filter((i) => i.review_status === "rejected").length,
    },
  };
}
