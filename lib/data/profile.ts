import { createClient } from "@/lib/supabase/server";

export interface ProfileRow {
  id: string;
  full_name: string | null;
  username: string | null;
  country: string | null;
  sport: string | null;
  graduation_year: number | null;
  avatar_url: string | null;
  bio: string | null;
  subscription_status: string;
  plan_type: string | null;
}

export interface AthleteRow {
  primary_event: string | null;
  secondary_event: string | null;
  target_division: string | null;
  recruiting_goal: string | null;
  academic_goal: string | null;
  gpa: string | null;
  sat_score: string | null;
  toefl_score: string | null;
}

export interface FullProfile {
  profile: ProfileRow | null;
  athlete: AthleteRow | null;
}

export async function getFullProfile(): Promise<FullProfile> {
  const supabase = await createClient();
  if (!supabase) return { profile: null, athlete: null };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { profile: null, athlete: null };

  const [{ data: profile }, { data: athlete }] = await Promise.all([
    supabase.from("profiles").select("id,full_name,username,country,sport,graduation_year,avatar_url,bio,subscription_status,plan_type").eq("id", user.id).maybeSingle(),
    supabase.from("athlete_profiles").select("primary_event,secondary_event,target_division,recruiting_goal,academic_goal,gpa,sat_score,toefl_score").eq("user_id", user.id).maybeSingle(),
  ]);

  return { profile: (profile as ProfileRow) ?? null, athlete: (athlete as AthleteRow) ?? null };
}
