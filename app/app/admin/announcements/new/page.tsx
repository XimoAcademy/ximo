import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth/getUser";
import PageHeader from "../../../components/PageHeader";
import { GlassPanel, BackLink } from "../../../components/ui";
import AnnouncementForm from "../AnnouncementForm";
import { createAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewAnnouncementPage() {
  const profile = await getProfile();
  if (profile?.role !== "admin") redirect("/app");

  return (
    <div className="mx-auto max-w-[640px] space-y-5">
      <BackLink href="/app/admin/announcements">Anuncios</BackLink>
      <PageHeader title="Nuevo anuncio" subtitle="Crea una sesión de soporte en vivo por Discord." />
      <GlassPanel className="p-5">
        <AnnouncementForm action={createAction} />
      </GlassPanel>
    </div>
  );
}
