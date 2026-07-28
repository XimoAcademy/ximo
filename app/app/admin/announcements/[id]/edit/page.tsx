import { redirect, notFound } from "next/navigation";
import { getProfile } from "@/lib/auth/getUser";
import PageHeader from "../../../../components/PageHeader";
import { GlassPanel, BackLink } from "../../../../components/ui";
import { getAnnouncementById } from "@/lib/data/announcements";
import { zonedDateTimeParts } from "@/lib/scheduling/timezone";
import AnnouncementForm from "../../AnnouncementForm";
import { updateAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditAnnouncementPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const profile = await getProfile();
  if (profile?.role !== "admin") redirect("/app");

  const { id } = await params;
  const { error } = await searchParams;
  const a = await getAnnouncementById(id);
  if (!a) notFound();

  const { date, time } = zonedDateTimeParts(a.starts_at, a.timezone);

  return (
    <div className="mx-auto max-w-[640px] space-y-5">
      <BackLink href="/app/admin/announcements">Directos</BackLink>
      <PageHeader title="Cambiar fecha del directo" subtitle="Solo puedes cambiar cuándo: el texto del aviso es fijo." />
      <GlassPanel className="p-5">
        <AnnouncementForm
          action={updateAction}
          hiddenId={a.id}
          defaults={{ date, time, timezone: a.timezone }}
          error={error}
        />
      </GlassPanel>
    </div>
  );
}
