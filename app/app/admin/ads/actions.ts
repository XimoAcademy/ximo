"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/getUser";
import { emailAdvertiserApproved, emailAdvertiserRejected, emailAdvertiserPublished } from "@/lib/email/advertiser";
import { emailUserViaService, type MailContent } from "@/lib/email/notify";
import { isStripeConfigured } from "@/lib/stripe/server";
import { discordAdsMode, postAdToDiscord } from "@/lib/discord/ads";

async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) return null;
  const profile = await getProfile();
  if (profile?.role !== "admin") return null;
  return supabase;
}

type BrandJoin = { brand_name: string; contact_email: string | null; user_id: string | null };

interface AdWithBrand {
  id: string;
  title: string | null;
  review_status: string;
  brand: BrandJoin | BrandJoin[] | null;
}

async function getAdWithBrand(supabase: NonNullable<Awaited<ReturnType<typeof requireAdmin>>>, id: string) {
  const { data } = await supabase
    .from("brand_ads")
    .select("id,title,review_status,brand:brand_profiles(brand_name,contact_email,user_id)")
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
    ownerUserId: brand?.user_id ?? null,
  };
}

/**
 * In-app notification + account email for the app user who submitted the ad.
 * The advertiser contact address gets its own email separately; to avoid
 * duplicates, the account email is only sent when it differs from the contact.
 * No-ops gracefully without a service-role key.
 */
async function notifyAdOwner(opts: {
  ownerUserId: string | null;
  contactEmail: string | null;
  notification: { title: string; body: string };
  email: MailContent | null;
}): Promise<void> {
  if (!opts.ownerUserId) return;
  const service = createServiceRoleClient();
  if (!service) return;

  await service.from("notifications").insert({
    user_id: opts.ownerUserId,
    title: opts.notification.title,
    body: opts.notification.body,
    type: "ads",
  });

  if (!opts.email) return;
  const { data } = await service.auth.admin.getUserById(opts.ownerUserId);
  const accountEmail = data?.user?.email?.toLowerCase() ?? null;
  const contact = opts.contactEmail?.toLowerCase() ?? null;
  if (accountEmail && accountEmail !== contact) {
    await emailUserViaService(service, opts.ownerUserId, opts.email);
  }
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

  // Notify the advertiser contact (null-safe if email isn't configured).
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

  // Notify the app user who submitted it (in-app always; email if their account
  // address differs from the advertiser contact). Copy mirrors /app/promocionar/revision.
  await notifyAdOwner({
    ownerUserId: ad.ownerUserId,
    contactEmail: ad.contactEmail,
    notification:
      decision === "approved"
        ? {
            title: "Tu anuncio fue aprobado",
            body: `${ad.title ?? ad.brandName}: aprobado · pendiente de pago. Configura tu campaña y paga; tras confirmarse el pago, el equipo Ximo activa la publicación.`,
          }
        : {
            title: "Resultado de la revisión de tu anuncio",
            body: `${ad.title ?? ad.brandName}: no fue aprobado y no se requiere ningún pago. Revisa la política de anuncios y envía una nueva propuesta.`,
          },
    email:
      decision === "approved"
        ? {
            subject: "Tu anuncio fue aprobado en Ximo",
            heading: "Aprobado · pendiente de pago",
            body: [
              `Buenas noticias: tu anuncio${ad.title ? ` “${ad.title}”` : ""} fue aprobado. Ahora puedes configurar presupuesto y duración, y completar el pago.`,
              "Tras confirmarse el pago, el equipo Ximo activa la publicación. Te avisaremos cuando tu anuncio esté visible en Marcas y oportunidades.",
            ],
            ctaLabel: "Configurar campaña y pagar",
            ctaPath: "/app/promocionar/campana",
          }
        : {
            subject: "Resultado de revisión de anuncio en Ximo",
            heading: "Resultado de la revisión",
            body: [
              `Tu anuncio${ad.title ? ` “${ad.title}”` : ""} no fue aprobado en esta ocasión. No se requiere ningún pago y no se realizará ningún cargo.`,
              "Revisa la política de anuncios y envía una nueva propuesta alineada con atletas estudiantes cuando quieras.",
            ],
            ctaLabel: "Ver estado de revisión",
            ctaPath: "/app/promocionar/revision",
          },
  });

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

  // The app promises "te avisaremos cuando tu anuncio esté visible" — keep it.
  if (ad.contactEmail) {
    await emailAdvertiserPublished({ to: ad.contactEmail, brandName: ad.brandName, adTitle: ad.title });
  }
  await notifyAdOwner({
    ownerUserId: ad.ownerUserId,
    contactEmail: ad.contactEmail,
    notification: {
      title: "Tu anuncio está publicado",
      body: `${ad.title ?? ad.brandName} ya está visible en Marcas y oportunidades, etiquetado como publicidad.`,
    },
    email: {
      subject: "Tu anuncio ya está publicado en Ximo",
      heading: "Tu anuncio está publicado",
      body: [
        `Tu anuncio${ad.title ? ` “${ad.title}”` : ""} está publicado en la sección Marcas y oportunidades, etiquetado como publicidad.`,
        "Puedes ver cómo lo ven los atletas en Marcas y oportunidades.",
      ],
      ctaLabel: "Ver en Marcas y oportunidades",
      ctaPath: "/app/marcas",
    },
  });

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
