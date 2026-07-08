"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { emailReviewInbox } from "@/lib/email/advertiser";

export interface BrandResult {
  ok: boolean;
  error?: string;
}

const FORMAT_MAP: Record<string, string> = {
  Foto: "photo",
  Video: "video",
  Texto: "text",
  Oferta: "offer",
  Producto: "product",
};

export async function submitBrandAdAction(
  _prev: BrandResult | null,
  formData: FormData
): Promise<BrandResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const brandName = String(formData.get("brand_name") ?? "").trim();
  const contactName = String(formData.get("contact_name") ?? "").trim() || null;
  const contactEmail = String(formData.get("contact_email") ?? "").trim() || null;
  const contactPhone = String(formData.get("contact_phone") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "").trim() || null;
  const formatLabel = String(formData.get("format") ?? "Texto").trim();
  const format = FORMAT_MAP[formatLabel] ?? "text";
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim() || null;
  const destinationUrl = String(formData.get("destination_url") ?? "").trim() || null;
  const budgetRange = String(formData.get("budget_range") ?? "").trim() || null;
  const audience = String(formData.get("audience") ?? "").trim() || null;
  const preferredDates = String(formData.get("preferred_dates") ?? "").trim() || null;
  const adMediaUrl = String(formData.get("ad_media_url") ?? "").trim() || null;
  const rightsConfirmed = formData.get("rights_confirmed") === "on";

  if (!brandName) return { ok: false, error: "Escribe el nombre de tu marca." };
  if (!contactName) return { ok: false, error: "Escribe la persona de contacto." };
  if (!contactEmail || !contactEmail.includes("@")) return { ok: false, error: "Escribe un correo de contacto válido." };
  if (!title) return { ok: false, error: "Escribe el título de tu campaña." };
  if (!description) return { ok: false, error: "Describe tu anuncio." };
  if (!rightsConfirmed) return { ok: false, error: "Debes confirmar que tienes derechos sobre el anuncio." };

  // Find or create the brand profile for this user.
  let brandId: string | null = null;
  const { data: existing } = await supabase
    .from("brand_profiles")
    .select("id")
    .eq("user_id", user.id)
    .eq("brand_name", brandName)
    .maybeSingle();

  if (existing) {
    brandId = existing.id as string;
    // Keep the contact info current for the review flow.
    await supabase
      .from("brand_profiles")
      .update({ contact_name: contactName, contact_email: contactEmail, contact_phone: contactPhone, website, category })
      .eq("id", brandId);
  } else {
    const { data: created, error: bErr } = await supabase
      .from("brand_profiles")
      .insert({
        user_id: user.id,
        brand_name: brandName,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        website,
        category,
      })
      .select("id")
      .single();
    if (bErr || !created) return { ok: false, error: "No se pudo registrar la marca." };
    brandId = created.id as string;
  }

  const { error: adErr } = await supabase.from("brand_ads").insert({
    brand_id: brandId,
    title,
    body: description,
    format,
    target_audience: audience,
    media_url: adMediaUrl,
    cta_url: destinationUrl,
    budget_range: budgetRange,
    preferred_dates: preferredDates,
    rights_confirmed_at: new Date().toISOString(),
    review_status: "pending", // PENDING_REVIEW — nothing publishes or charges without manual approval
  });
  if (adErr) return { ok: false, error: "No se pudo enviar el anuncio." };

  // Notify the manual-review inbox (null-safe: skipped if email isn't configured).
  await emailReviewInbox({
    brandName,
    contactName,
    contactEmail,
    contactPhone,
    website,
    category,
    format: formatLabel,
    title,
    description,
    destinationUrl,
    audience,
    budgetRange,
    preferredDates,
    mediaUrl: adMediaUrl,
  });

  revalidatePath("/app/promocionar");
  redirect("/app/promocionar/revision?sent=1");
}
