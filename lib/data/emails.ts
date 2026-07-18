import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/getUser";

export { EMAIL_STATUSES, EMAIL_TEMPLATES } from "./email-templates";
export type { EmailTemplate } from "./email-templates";

export interface EmailRow {
  id: string;
  coach_id: string | null;
  university_id: string | null;
  subject: string | null;
  body: string | null;
  status: string | null;
  sent_at: string | null;
  reply_status: string | null;
  created_at: string;
  coach?: { name: string; email: string | null } | null;
  university?: { name: string } | null;
}

export interface CoachOption {
  id: string;
  name: string;
  university_id: string | null;
}

export async function getCoachOptions(): Promise<CoachOption[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const user = await getCurrentUser();
  if (!user) return [];
  const { data } = await supabase
    .from("coaches")
    .select("id,name,university_id")
    .eq("user_id", user.id)
    .order("name");
  return (data as CoachOption[]) ?? [];
}

export async function getEmails(): Promise<{ rows: EmailRow[]; configured: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { rows: [], configured: false };
  const user = await getCurrentUser();
  if (!user) return { rows: [], configured: true };

  const { data } = await supabase
    .from("emails")
    .select("*, coach:coaches(name,email), university:universities(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return { rows: (data as EmailRow[]) ?? [], configured: true };
}
