"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
  const contactEmail = String(formData.get("contact_email") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "").trim() || null;
  const formatLabel = String(formData.get("format") ?? "Texto").trim();
  const format = FORMAT_MAP[formatLabel] ?? "text";
  const opportunity = String(formData.get("opportunity") ?? "").trim();
  const product = String(formData.get("product") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim() || null;
  const audience = String(formData.get("audience") ?? "").trim() || null;
  const adMediaUrl = String(formData.get("ad_media_url") ?? "").trim() || null;

  if (!brandName) return { ok: false, error: "Escribe el nombre de tu marca." };
  if (!description) return { ok: false, error: "Describe tu anuncio." };

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
  } else {
    const { data: created, error: bErr } = await supabase
      .from("brand_profiles")
      .insert({ user_id: user.id, brand_name: brandName, contact_email: contactEmail, website, category })
      .select("id")
      .single();
    if (bErr || !created) return { ok: false, error: "No se pudo registrar la marca." };
    brandId = created.id as string;
  }

  const body = [opportunity ? `Oportunidad: ${opportunity}` : null, description].filter(Boolean).join("\n\n");

  const { error: adErr } = await supabase.from("brand_ads").insert({
    brand_id: brandId,
    title: product || brandName,
    body,
    format,
    target_audience: audience,
    media_url: adMediaUrl,
    review_status: "pending",
  });
  if (adErr) return { ok: false, error: "No se pudo enviar el anuncio." };

  revalidatePath("/app/promocionar");
  redirect("/app/promocionar/revision?sent=1");
}
