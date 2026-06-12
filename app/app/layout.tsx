import AppShell from "./components/AppShell";
import { requireSubscription } from "@/lib/subscription/requireSubscription";
import { getIdentity } from "@/lib/data/identity";
import { getProfile } from "@/lib/auth/getUser";
import { getUnreadCount } from "@/lib/data/notifications";
import { touchDailyStreak } from "@/lib/data/streak";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Gate the whole dashboard: requires a signed-in user with an active
  // subscription. No-op when Supabase isn't configured (keeps static preview),
  // redirects to /login (no user) or /subscribe (inactive) otherwise.
  await requireSubscription();

  const [identity, profile, unreadCount, streak] = await Promise.all([
    getIdentity(),
    getProfile(),
    getUnreadCount(),
    touchDailyStreak(),
  ]);

  return (
    <AppShell
      isAdmin={profile?.role === "admin"}
      unreadCount={unreadCount}
      streak={streak.current}
      identity={
        identity
          ? {
              name: identity.name,
              initials: identity.initials,
              sport: identity.sport,
              gradYear: identity.gradYear,
              country: identity.country,
            }
          : null
      }
    >
      {children}
    </AppShell>
  );
}
