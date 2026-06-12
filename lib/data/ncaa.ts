import { createClient } from "@/lib/supabase/server";

export interface NcaaProgram {
  id: string;
  slug: string;
  name: string;
  division: string;
  sport: string;
  conference: string | null;
  location: string | null;
  website: string | null;
  coaches_url: string | null;
}

export interface NcaaCoach {
  id: string;
  name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
}

export async function getPrograms(search?: string): Promise<NcaaProgram[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  let q = supabase
    .from("ncaa_programs")
    .select("id,slug,name,division,sport,conference,location,website,coaches_url")
    .order("name");
  if (search && search.trim()) q = q.ilike("name", `%${search.trim()}%`);
  const { data } = await q;
  return (data as NcaaProgram[]) ?? [];
}

export async function getProgram(
  slug: string
): Promise<{ program: NcaaProgram; coaches: NcaaCoach[] } | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: program } = await supabase
    .from("ncaa_programs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!program) return null;

  const { data: coaches } = await supabase
    .from("ncaa_coaches")
    .select("id,name,title,email,phone")
    .eq("program_id", program.id)
    .order("sort_order");

  return { program: program as NcaaProgram, coaches: (coaches as NcaaCoach[]) ?? [] };
}

export async function programCount(): Promise<{ programs: number; withCoaches: number }> {
  const supabase = await createClient();
  if (!supabase) return { programs: 0, withCoaches: 0 };
  const { count: programs } = await supabase
    .from("ncaa_programs")
    .select("*", { count: "exact", head: true });
  // distinct programs that have at least one coach
  const { data } = await supabase.from("ncaa_coaches").select("program_id");
  const withCoaches = new Set((data ?? []).map((r: { program_id: string }) => r.program_id)).size;
  return { programs: programs ?? 0, withCoaches };
}
