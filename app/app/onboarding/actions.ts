"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STANDARD_DOCS } from "@/lib/data/documents";
import { emailCurrentUser } from "@/lib/email/notify";
import { getPostHogClient } from "@/lib/posthog-server";

export interface OnboardingResult {
  ok: boolean;
  error?: string;
}

export async function completeOnboardingAction(
  _prev: OnboardingResult | null,
  formData: FormData
): Promise<OnboardingResult> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const primaryEvent = String(formData.get("primary_event") ?? "").trim() || null;
  const bestTime = String(formData.get("best_time") ?? "").trim() || null;
  const gradYearRaw = String(formData.get("graduation_year") ?? "").trim();
  const graduation_year = gradYearRaw ? parseInt(gradYearRaw, 10) : null;
  const goal = String(formData.get("goal") ?? "").trim() || null;
  const targetDivision = String(formData.get("target_division") ?? "").trim() || null;
  const universities = [1, 2, 3]
    .map((i) => String(formData.get(`university_${i}`) ?? "").trim())
    .filter(Boolean);
  const seedDocs = String(formData.get("seed_docs") ?? "") === "on";

  // 1. Profile basics
  if (graduation_year && Number.isFinite(graduation_year)) {
    await supabase.from("profiles").update({ graduation_year, sport: "Natación" }).eq("id", user.id);
  }

  // 2. Athlete profile
  if (primaryEvent || goal || targetDivision) {
    await supabase.from("athlete_profiles").upsert(
      {
        user_id: user.id,
        primary_event: primaryEvent,
        recruiting_goal: goal,
        target_division: targetDivision,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
  }

  // 3. Universities of interest (deduped by name)
  for (const name of universities) {
    const { data: existing } = await supabase
      .from("universities")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", name)
      .maybeSingle();
    if (!existing) {
      await supabase.from("universities").insert({
        user_id: user.id,
        name,
        recruiting_stage: "Investigando",
        priority: "Media",
      });
    }
  }

  // 4. Document checklist (only if requested and none yet)
  if (seedDocs) {
    const { count } = await supabase.from("documents").select("*", { count: "exact", head: true }).eq("user_id", user.id);
    if ((count ?? 0) === 0) {
      await supabase.from("documents").insert(
        STANDARD_DOCS.map((d) => ({ user_id: user.id, title: d.title, type: d.type, status: "pendiente", notes: d.notes }))
      );
    }
  }

  // 5. First progress entry, if a best time was given
  if (primaryEvent && bestTime) {
    await supabase.from("progress_entries").insert({
      user_id: user.id,
      sport: "Natación",
      event: primaryEvent,
      result: bestTime,
      result_date: new Date().toISOString().slice(0, 10),
      notes: "Marca inicial",
      media_url: "SCY",
    });
  }

  // 6. A starter task to get going
  await supabase.from("tasks").insert({
    user_id: user.id,
    title: universities.length ? `Investigar y contactar a ${universities[0]}` : "Definir tus 3 universidades objetivo",
    description: "Tu primer paso de recruiting. Investiga el programa, encuentra al coach y prepara un primer correo.",
    module: "Recruiting",
    priority: "alta",
    status: "pendiente",
  });

  // 7. Welcome notification (in-app) + welcome email (best-effort)
  await supabase.from("notifications").insert({
    user_id: user.id,
    title: "¡Bienvenido a Ximo!",
    body: "Tu plan de acción está listo. Empieza por tu primera tarea y agrega más universidades cuando quieras.",
    type: "recruiting",
  });

  await emailCurrentUser(supabase, {
    subject: "¡Bienvenido a Ximo! 🏊",
    heading: "Live the Dream empieza hoy",
    body: [
      "Tu cuenta está lista y tu primer plan de acción ya está en tu dashboard.",
      "Empieza por tu primera tarea, agrega las universidades que te interesen desde el directorio NCAA, y registra tus tiempos en Progreso.",
      "Cada acción pequeña te acerca a tu beca. Estamos contigo en el proceso.",
    ],
    ctaLabel: "Ir a mi dashboard",
    ctaPath: "/app",
  });

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: user.id,
    event: "onboarding_completed",
    properties: {
      primary_event: primaryEvent,
      goal,
      target_division: targetDivision,
      universities_count: universities.length,
      seed_docs: seedDocs,
    },
  });
  await posthog.flush();

  revalidatePath("/app");
  revalidatePath("/app/notifications");
  redirect("/app?onboarded=1");
}
