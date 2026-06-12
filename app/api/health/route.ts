// Lightweight health check for uptime monitoring. No auth, no data, no secrets.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  return Response.json({ status: "ok", time: new Date().toISOString() });
}
