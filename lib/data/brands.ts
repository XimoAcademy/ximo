import { createClient } from "@/lib/supabase/server";

export interface BrandAd {
  id: string;
  title: string | null;
  body: string | null;
  format: string | null;
  target_audience: string | null;
  media_url: string | null;
  brandName: string;
  category: string | null;
}

const FORMAT_LABEL: Record<string, string> = {
  photo: "Foto",
  video: "Video",
  text: "Anuncio",
  offer: "Oferta",
  product: "Producto",
};

export function formatLabel(f: string | null): string {
  return f ? FORMAT_LABEL[f] ?? f : "Oportunidad";
}

export interface UserBrandAd {
  id: string;
  title: string | null;
  brandName: string;
  category: string | null;
  format: string | null;
  review_status: "pending" | "approved" | "rejected";
  created_at: string;
}

export async function getUserBrandAds(): Promise<UserBrandAd[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: brands } = await supabase
    .from("brand_profiles")
    .select("id,brand_name,category")
    .eq("user_id", user.id);
  if (!brands || brands.length === 0) return [];

  const brandIds = (brands as Array<{ id: string; brand_name: string; category: string | null }>).map((b) => b.id);
  const brandMap = new Map(
    (brands as Array<{ id: string; brand_name: string; category: string | null }>).map((b) => [
      b.id,
      { brandName: b.brand_name, category: b.category },
    ])
  );

  const { data } = await supabase
    .from("brand_ads")
    .select("id,title,format,review_status,created_at,brand_id")
    .in("brand_id", brandIds)
    .order("created_at", { ascending: false });

  return (
    (
      data as Array<{
        id: string;
        title: string | null;
        format: string | null;
        review_status: string;
        created_at: string;
        brand_id: string;
      }>
    ) ?? []
  ).map((a) => {
    const bInfo = brandMap.get(a.brand_id);
    return {
      id: a.id,
      title: a.title,
      brandName: bInfo?.brandName ?? "Marca",
      category: bInfo?.category ?? null,
      format: a.format,
      review_status: (a.review_status as "pending" | "approved" | "rejected") ?? "pending",
      created_at: a.created_at,
    };
  });
}

export async function getApprovedBrandAds(): Promise<BrandAd[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("brand_ads")
    .select("id,title,body,format,target_audience,media_url,brand:brand_profiles(brand_name,category)")
    .eq("review_status", "approved")
    .order("created_at", { ascending: false })
    .limit(50);

  return ((data as Array<{ id: string; title: string | null; body: string | null; format: string | null; target_audience: string | null; media_url: string | null; brand: unknown }>) ?? []).map((a) => {
    const brand = Array.isArray(a.brand) ? a.brand[0] : (a.brand as { brand_name: string; category: string | null } | null);
    return {
      id: a.id,
      title: a.title,
      body: a.body,
      format: a.format,
      target_audience: a.target_audience,
      media_url: a.media_url,
      brandName: brand?.brand_name ?? "Marca",
      category: brand?.category ?? null,
    };
  });
}
