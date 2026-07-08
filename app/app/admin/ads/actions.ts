"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/getUser";
import { emailAdvertiserApproved, emailAdvertiserRejected } from "@/lib/email/advertiser";
import { isStripeConfigured } from "@/lib/stripe/server";
import { discordAdsMode, postAdToDiscord } from "@/lib/discord/ads";

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

/**
 * Manual, admin-only Discord post for a PUBLISHED (approved + paid) ad.
 * Nothing posts automatically; this runs only when the admin clicks the button.
 * NOTE: Claude cannot manage Discord without a configured bot/webhook and
 * permissions — without them the UI shows manual-post instructions instead.
 */
export async function postAdToDiscordAction(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) return;
  if (!discordAdsMode()) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { data } = await supabase
    .from("brand_ads")
    .select("id,title,body,media_url,cta_url,review_status,brand:brand_profiles(brand_name)")
    .eq("id", id)
    .maybeSingle();
  const ad = data as {
    id: string;
    title: string | null;
    body: string | null;
    media_url: string | null;
    cta_url: string | null;
    review_status: string;
    brand: { brand_name: string } | { brand_name: string }[] | null;
  } | null;
  // Only ads that already passed review AND payment can go to Discord.
  if (!ad || ad.review_status !== "approved") return;
  const brand = Array.isArray(ad.brand) ? ad.brand[0] : ad.brand;

  const res = await postAdToDiscord({
    brandName: brand?.brand_name ?? "Marca",
    title: ad.title,
    body: ad.body,
    destinationUrl: ad.cta_url,
    mediaUrl: ad.media_url,
  });

  if (res.ok) {
    // Reuse the (previously unused) platform column to record the Discord post.
    await supabase.from("brand_ads").update({ platform: "discord" }).eq("id", id);
  } else {
    console.error("[discord-ads] post failed:", res.error);
  }

  revalidatePath("/app/admin/ads");
}
