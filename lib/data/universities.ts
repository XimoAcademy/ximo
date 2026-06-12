import { createClient } from "@/lib/supabase/server";

export { RECRUITING_STAGES, PRIORITIES } from "./recruiting-constants";

export interface UniversityRow {
  id: string;
  name: string;
  division: string | null;
  location: string | null;
  website: string | null;
  fit_type: string | null;
  priority: string | null;
  recruiting_stage: string | null;
  scholarship_clarity: string | null;
  cost_notes: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export async function getUniversities(): Promise<{ rows: UniversityRow[]; configured: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { rows: [], configured: false };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { rows: [], configured: true };

  const { data } = await supabase
    .from("universities")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return { rows: (data as UniversityRow[]) ?? [], configured: true };
}

export interface UniversityDetail {
  university: UniversityRow;
  coaches: { id: string; name: string; role: string | null; email: string | null; status: string | null }[];
  emails: { id: string; subject: string | null; status: string | null; created_at: string }[];
}

export async function getUniversity(id: string): Promise<UniversityDetail | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: university } = await supabase
    .from("universities")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!university) return null;

  const [{ data: coaches }, { data: emails }] = await Promise.all([
    supabase
      .from("coaches")
      .select("id,name,role,email,status")
      .eq("user_id", user.id)
      .eq("university_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("emails")
      .select("id,subject,status,created_at")
      .eq("user_id", user.id)
      .eq("university_id", id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return {
    university: university as UniversityRow,
    coaches: (coaches as UniversityDetail["coaches"]) ?? [],
    emails: (emails as UniversityDetail["emails"]) ?? [],
  };
}
