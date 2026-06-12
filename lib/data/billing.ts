import { createClient } from "@/lib/supabase/server";

export interface BillingInfo {
  status: string;
  planType: string | null;
  currentPeriodEnd: string | null;
  currentPeriodStart: string | null;
  provider: string | null;
  email: string | null;
}

export async function getBillingInfo(): Promise<BillingInfo | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: sub }, { data: profile }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("status,plan_type,current_period_end,current_period_start,provider")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("profiles").select("subscription_status,plan_type").eq("id", user.id).maybeSingle(),
  ]);

  return {
    status: (sub?.status as string) || (profile?.subscription_status as string) || "inactive",
    planType: (sub?.plan_type as string) ?? (profile?.plan_type as string) ?? null,
    currentPeriodEnd: (sub?.current_period_end as string) ?? null,
    currentPeriodStart: (sub?.current_period_start as string) ?? null,
    provider: (sub?.provider as string) ?? null,
    email: user.email ?? null,
  };
}
