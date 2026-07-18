"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/getUser";
import { parseTime, type Course, type Swim } from "@/lib/data/progress";

export interface AddResult {
  ok: boolean;
  error?: string;
  swim?: Swim;
}

export async function addProgressEntryAction(
  _prev: AddResult | null,
  formData: FormData
): Promise<AddResult> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  if (!userId) redirect("/login");

  const event = String(formData.get("event") ?? "").trim();
  const timeStr = String(formData.get("time") ?? "").trim();
  const courseRaw = String(formData.get("course") ?? "SCY").trim();
  const course = (["SCY", "LCM", "SCM"].includes(courseRaw) ? courseRaw : "SCY") as Course;
  const date = String(formData.get("date") ?? "").trim();
  const meet = String(formData.get("meet") ?? "").trim() || "Competencia";

  if (!event) return { ok: false, error: "Selecciona un evento." };
  const sec = parseTime(timeStr);
  if (sec === null) return { ok: false, error: "Formato de tiempo inválido. Usa 26.04 o 1:02.45" };
  if (!date) return { ok: false, error: "Selecciona la fecha de la competencia." };

  const { data, error } = await supabase
    .from("progress_entries")
    .insert({
      user_id: userId,
      sport: "Natación",
      event,
      result: timeStr,
      result_date: date,
      notes: meet,
      media_url: course,
    })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: "No se pudo guardar la marca." };

  revalidatePath("/app/progreso");
  revalidatePath("/app");
  return { ok: true, swim: { id: data.id as string, event, course, sec, date, meet } };
}

export async function deleteProgressEntryAction(id: string): Promise<{ ok: boolean }> {
  const { supabase, userId } = await requireUser();
  if (!supabase) return { ok: false };
  if (!userId) return { ok: false };
  await supabase.from("progress_entries").delete().eq("id", id).eq("user_id", userId);
  revalidatePath("/app/progreso");
  revalidatePath("/app");
  return { ok: true };
}
