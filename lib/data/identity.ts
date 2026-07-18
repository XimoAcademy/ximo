import { getProfile, getCurrentUser } from "@/lib/auth/getUser";
import { computeInitials } from "@/lib/util/initials";

export { computeInitials } from "@/lib/util/initials";

/**
 * The signed-in user's display identity, used by the app shell and dashboard.
 * Null-safe: returns null when Supabase isn't configured or nobody is signed in,
 * so the static preview keeps working.
 */
export interface Identity {
  name: string;
  initials: string;
  sport: string;
  gradYear: number | null;
  country: string | null;
  email: string | null;
}


export async function getIdentity(): Promise<Identity | null> {
  // getCurrentUser() is null when Supabase is unconfigured OR signed out —
  // covers both cases without needing a client here.
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await getProfile();
  const email = user.email ?? null;
  const name =
    (profile?.full_name && profile.full_name.trim()) ||
    (email ? email.split("@")[0] : "") ||
    "Atleta";

  return {
    name,
    initials: computeInitials(name),
    sport: profile?.sport || "Natación",
    gradYear: profile?.graduation_year ?? null,
    country: profile?.country ?? null,
    email,
  };
}
