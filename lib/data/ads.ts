import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/getUser";

/**
 * Manual ad-review flow:
 *   pending → approved_pending_payment → paid_ready_to_publish → approved
 *                                      ↘ rejected
 * Only 'approved' ads are visible to athletes (RLS + feed queries).
 */
export type AdReviewStatus =
  | "pending"
  | "approved_pending_payment"
  | "paid_ready_to_publish"
  | "approved"
  | "rejected";

export const AD_STATUSES: AdReviewStatus[] = [
  "pending",
  "approved_pending_payment",
  "paid_ready_to_publish",
  "approved",
  "rejected",
];

export interface AdItem {
  id: string;
  title: string | null;
  body: string | null;
  media_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  review_status: AdReviewStatus;
  created_at: string;
  brand_name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  target_audience: string | null;
  budget: number | null;
  budget_range: string | null;
  preferred_dates: string | null;
  platform: string | null;
}

export type AdCounts = Record<AdReviewStatus, number>;

export interface AdQueue {
  isAdmin: boolean;
  items: AdItem[];
  counts: AdCounts;
}

const ZERO_COUNTS: AdCounts = {
  pending: 0,
  approved_pending_payment: 0,
  paid_ready_to_publish: 0,
  approved: 0,
  rejected: 0,
};

function asStatus(s: string | null): AdReviewStatus {
  return (AD_STATUSES as string[]).includes(s ?? "") ? (s as AdReviewStatus) : "pending";
}

export async function getAdQueue(): Promise<AdQueue> {
  const empty: AdQueue = { isAdmin: false, items: [], counts: { ...ZERO_COUNTS } };
  const supabase = await createClient();
  if (!supabase) return empty;

  const profile = await getProfile();
  const isAdmin = profile?.role === "admin";
  if (!isAdmin) return empty;

  const { data } = await supabase
    .from("brand_ads")
    .select(
      "id,title,body,media_url,cta_label,cta_url,review_status,created_at,budget,budget_range,preferred_dates,platform,target_audience,brand:brand_profiles(brand_name,contact_name,contact_email,contact_phone,website)"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  type BrandJoin = {
    brand_name: string;
    contact_name: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    website: string | null;
  };

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
    budget_range: string | null;
    preferred_dates: string | null;
    platform: string | null;
    target_audience: string | null;
    brand: BrandJoin | BrandJoin[] | null;
  }>).map((a) => {
    const brand = Array.isArray(a.brand) ? a.brand[0] : a.brand;
    return {
      id: a.id,
      title: a.title,
      body: a.body,
      media_url: a.media_url,
      cta_label: a.cta_label,
      cta_url: a.cta_url,
      review_status: asStatus(a.review_status),
      created_at: a.created_at,
      brand_name: brand?.brand_name ?? "Marca",
      contact_name: brand?.contact_name ?? null,
      contact_email: brand?.contact_email ?? null,
      contact_phone: brand?.contact_phone ?? null,
      website: brand?.website ?? null,
      target_audience: a.target_audience,
      budget: a.budget,
      budget_range: a.budget_range,
      preferred_dates: a.preferred_dates,
      platform: a.platform,
    };
  });

  const counts = { ...ZERO_COUNTS };
  for (const i of items) counts[i.review_status] += 1;

  return { isAdmin: true, items, counts };
}
