import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getUser";
import { getOrCreateConversationId, getMessages, insertMessage } from "@/lib/data/support-chat";
import { getNextUpcomingAnnouncement } from "@/lib/data/announcements";
import { askXimoSupport, type ChatTurn } from "@/lib/ai/gemini";
import { formatInZone } from "@/lib/scheduling/timezone";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let message = "";
  try {
    const body = (await req.json()) as { message?: unknown };
    message = typeof body.message === "string" ? body.message.trim() : "";
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  if (!message) return NextResponse.json({ error: "empty message" }, { status: 400 });
  if (message.length > 4000) message = message.slice(0, 4000);

  const conversationId = await getOrCreateConversationId();
  if (!conversationId) return NextResponse.json({ error: "conversation unavailable" }, { status: 503 });

  const [history, next] = await Promise.all([getMessages(conversationId, 20), getNextUpcomingAnnouncement()]);
  const historyTurns: ChatTurn[] = history.map((m) => ({ role: m.role, content: m.content }));

  await insertMessage(conversationId, user.id, "user", message);

  const reply = await askXimoSupport(
    historyTurns,
    message,
    next ? { whenLabel: formatInZone(next.starts_at, next.timezone) } : null
  );

  await insertMessage(conversationId, user.id, "assistant", reply);

  return NextResponse.json({ reply });
}
