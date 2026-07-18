import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/getUser";

export { COACH_STATUSES, COACH_PRIORITIES } from "./recruiting-constants";

export interface CoachRow {
  id: string;
  university_id: string | null;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  status: string | null;
  last_contact_at: string | null;
  next_follow_up_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  university?: { name: string } | null;
}

export interface UniversityOption {
  id: string;
  name: string;
}

export async function getUniversityOptions(): Promise<UniversityOption[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const user = await getCurrentUser();
  if (!user) return [];
  const { data } = await supabase
    .from("universities")
    .select("id,name")
    .eq("user_id", user.id)
    .order("name");
  return (data as UniversityOption[]) ?? [];
}

export async function getCoaches(): Promise<{ rows: CoachRow[]; configured: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { rows: [], configured: false };
  const user = await getCurrentUser();
  if (!user) return { rows: [], configured: true };

  const { data } = await supabase
    .from("coaches")
    .select("*, university:universities(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return { rows: (data as CoachRow[]) ?? [], configured: true };
}

export async function getCoach(id: string): Promise<CoachRow | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  const { data } = await supabase
    .from("coaches")
    .select("*, university:universities(name)")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  return (data as CoachRow) ?? null;
}
