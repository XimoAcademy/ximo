import { redirect, notFound } from "next/navigation";
import { getProfile } from "@/lib/auth/getUser";
import PageHeader from "../../../../components/PageHeader";
import { GlassPanel, BackLink } from "../../../../components/ui";
import { getAnnouncementById } from "@/lib/data/announcements";
import { zonedDateTimeParts } from "@/lib/scheduling/timezone";
import AnnouncementForm from "../../AnnouncementForm";
import { updateAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await getProfile();
  if (profile?.role !== "admin") redirect("/app");

  const { id } = await params;
  const a = await getAnnouncementById(id);
  if (!a) notFound();

  const { date, time } = zonedDateTimeParts(a.starts_at, a.timezone);

  return (
    <div className="mx-auto max-w-[640px] space-y-5">
      <BackLink href="/app/admin/announcements">Anuncios</BackLink>
      <PageHeader title="Editar anuncio" subtitle={a.title} />
      <GlassPanel className="p-5">
        <AnnouncementForm
          action={updateAction}
          hiddenId={a.id}
          defaults={{
            title: a.title,
            description: a.description,
            date,
            time,
            timezone: a.timezone,
            discord_link: a.discord_link,
          }}
        />
      </GlassPanel>
    </div>
  );
}
