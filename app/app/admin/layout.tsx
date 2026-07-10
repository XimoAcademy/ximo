import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth/getUser";

/**
 * Hard gate for EVERYTHING under /app/admin (ads review, moderation, and any
 * future admin page): only profiles with role = 'admin' get past this layout.
 * Individual pages keep their own checks as defense in depth, and the server
 * actions re-verify the role on every mutation.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  if (profile?.role !== "admin") redirect("/app");
  return <>{children}</>;
}
