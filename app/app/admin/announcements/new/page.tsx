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
      <BackLink href="/app/admin/announcements">Directos</BackLink>
      <PageHeader title="Programar directo" subtitle="Elige la fecha y la hora; el texto del aviso ya está definido." />
      <GlassPanel className="p-5">
        <AnnouncementForm action={createAction} />
      </GlassPanel>
    </div>
  );
}
