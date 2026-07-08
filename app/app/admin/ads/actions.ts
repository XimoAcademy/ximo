"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/getUser";
import { emailAdvertiserApproved, emailAdvertiserRejected } from "@/lib/email/advertiser";
import { isStripeConfigured } from "@/lib/stripe/server";

async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) return null;
  const profile = await getProfile();
  if (profile?.role !== "admin") return null;
  return supabase;
}

interface AdWithBrand {
  id: string;
  title: string | null;
  review_status: string;
  brand: { brand_name: string; contact_email: string | null } | { brand_name: string; contact_email: string | null }[] | null;
}

async function getAdWithBrand(supabase: NonNullable<Awaited<ReturnType<typeof requireAdmin>>>, id: string) {
  const { data } = await supabase
    .from("brand_ads")
    .select("id,title,review_status,brand:brand_profiles(brand_name,contact_email)")
    .eq("id", id)
    .maybeSingle();
  const ad = data as AdWithBrand | null;
  if (!ad) return null;
  const brand = Array.isArray(ad.brand) ? ad.brand[0] : ad.brand;
  return {
    id: ad.id,
    title: ad.title,
    review_status: ad.review_status,
    brandName: brand?.brand_name ?? "Marca",
    contactEmail: brand?.contact_email ?? null,
  };
}

/**
 * Manual review decision. Approving moves the ad to `approved_pending_payment`
 * (the advertiser is emailed a payment link); it does NOT publish the ad.
 * Rejecting moves it to `rejected` (the advertiser is emailed; no payment).
 */
export async function reviewAdAction(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? ""); // approved | rejected
  if (!id || !["approved", "rejected"].includes(decision)) return;

  const ad = await getAdWithBrand(supabase, id);
  if (!ad || ad.review_status !== "pending") return;

  const nextStatus = decision === "approved" ? "approved_pending_payment" : "rejected";
  const { error } = await supabase.from("brand_ads").update({ review_status: nextStatus }).eq("id", id);
  if (error) return;

  // Notify the advertiser (null-safe if email isn't configured).
  if (ad.contactEmail) {
    if (decision === "approved") {
      await emailAdvertiserApproved({
        to: ad.contactEmail,
        brandName: ad.brandName,
        adTitle: ad.title,
        stripeConfigured: isStripeConfigured(),
      });
    } else {
      await emailAdvertiserRejected({ to: ad.contactEmail, brandName: ad.brandName, adTitle: ad.title });
    }
  }

  revalidatePath("/app/admin/ads");
  revalidatePath("/app/promocionar");
  revalidatePath("/app/promocionar/revision");
}

/**
 * Final manual publication: only a paid ad (`paid_ready_to_publish`) can be
 * published. Sets `approved`, which is the only status visible to athletes.
 */
export async function publishAdAction(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const ad = await getAdWithBrand(supabase, id);
  if (!ad || ad.review_status !== "paid_ready_to_publish") return;

  await supabase.from("brand_ads").update({ review_status: "approved" }).eq("id", id);

  // Activate the campaign row created at payment time.
  await supabase.from("brand_campaigns").update({ status: "active" }).eq("ad_id", id).eq("status", "scheduled");

  revalidatePath("/app/admin/ads");
  revalidatePath("/app/marcas");
  revalidatePath("/app/promocionar/revision");
}
