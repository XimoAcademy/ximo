import PageHeader from "../components/PageHeader";
import { GlassPanel } from "../components/ui";
import { getOrCreateConversationId, getMessages } from "@/lib/data/support-chat";
import SupportChat from "./SupportChat";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const conversationId = await getOrCreateConversationId();
  const messages = conversationId ? await getMessages(conversationId) : [];

  return (
    <div className="mx-auto flex max-w-[760px] flex-col space-y-5">
      <PageHeader
        title="Ximo Support AI"
        subtitle="Pregunta lo que necesites sobre la plataforma. Gratis, sin límite de uso, disponible siempre."
      />
      <GlassPanel className="flex h-[72vh] min-h-[480px] flex-col overflow-hidden p-0">
        <SupportChat initialMessages={messages} />
      </GlassPanel>
    </div>
  );
}
