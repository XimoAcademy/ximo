import { createClient } from "@/lib/supabase/server";
import type { UniversityRow } from "./universities";
import type { CoachRow } from "./coaches";

export interface RecruitingData {
  universities: UniversityRow[];
  coaches: CoachRow[];
  upcomingTasks: { id: string; title: string; due_date: string | null; priority: string | null; module: string | null }[];
  stats: {
    universities: number;
    contacted: number;
    responded: number;
    interest: number;
    offers: number;
  };
  configured: boolean;
}

const EMPTY: RecruitingData = {
  universities: [],
  coaches: [],
  upcomingTasks: [],
  stats: { universities: 0, contacted: 0, responded: 0, interest: 0, offers: 0 },
  configured: false,
};

export async function getRecruitingData(): Promise<RecruitingData> {
  const supabase = await createClient();
  if (!supabase) return EMPTY;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ...EMPTY, configured: true };

  const [uniRes, coachRes, taskRes] = await Promise.all([
    supabase.from("universities").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("coaches").select("*, university:universities(name)").eq("user_id", user.id).order("next_follow_up_at", { ascending: true, nullsFirst: false }),
    supabase
      .from("tasks")
      .select("id,title,due_date,priority,module")
      .eq("user_id", user.id)
      .neq("status", "completada")
      .in("module", ["Recruiting", "Universidades", "Coaches", "Correos", "Documentos"])
      .order("due_date", { ascending: true, nullsFirst: false })
      .limit(6),
  ]);

  const universities = (uniRes.data as UniversityRow[]) ?? [];
  const coaches = (coachRes.data as CoachRow[]) ?? [];

  const contacted = universities.filter((u) => u.recruiting_stage && u.recruiting_stage !== "Investigando").length;
  const interest = universities.filter((u) => ["Interesado", "Oferta", "Comprometido"].includes(u.recruiting_stage ?? "")).length;
  const offers = universities.filter((u) => ["Oferta", "Comprometido"].includes(u.recruiting_stage ?? "")).length;
  const responded = coaches.filter((c) => ["Respondió", "Interés alto", "Interés confirmado", "Llamada agendada"].includes(c.status ?? "")).length;

  return {
    universities,
    coaches,
    upcomingTasks: (taskRes.data as RecruitingData["upcomingTasks"]) ?? [],
    stats: { universities: universities.length, contacted, responded, interest, offers },
    configured: true,
  };
}
