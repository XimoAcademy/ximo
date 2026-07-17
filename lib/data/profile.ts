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
  // International / education timeline (migration 011). All optional.
  date_of_birth: string | null;
  nationality_code: string | null;
  education_country_code: string | null;
  hs_graduation_term: string | null;
  hs_graduation_month: number | null;
  hs_graduation_status: string | null;
  gap_year_status: string | null;
  gap_year_count: number | null;
  gap_full_time_enroll: boolean | null;
  gap_competition: boolean | null;
  intended_college_year: number | null;
  intended_college_term: string | null;
  first_full_time_enrollment: boolean | null;
  prior_enrollment_type: string | null;
  first_enrollment_year: number | null;
  first_enrollment_term: string | null;
  recruiting_status: string | null;
}

/** Columns of athlete_profiles the profile screen reads. Explicit list so we
 * never accidentally over-select. date_of_birth stays owner-only via RLS. */
const ATHLETE_COLUMNS =
  "primary_event,secondary_event,target_division,recruiting_goal,academic_goal,gpa,sat_score,toefl_score," +
  "date_of_birth,nationality_code,education_country_code,hs_graduation_term,hs_graduation_month,hs_graduation_status," +
  "gap_year_status,gap_year_count,gap_full_time_enroll,gap_competition,intended_college_year,intended_college_term," +
  "first_full_time_enrollment,prior_enrollment_type,first_enrollment_year,first_enrollment_term,recruiting_status";

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
    supabase.from("athlete_profiles").select(ATHLETE_COLUMNS).eq("user_id", user.id).maybeSingle(),
  ]);

  return { profile: (profile as ProfileRow) ?? null, athlete: (athlete as unknown as AthleteRow) ?? null };
}
