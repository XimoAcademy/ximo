import { getProgressEntries } from "@/lib/data/progress";
import ProgresoClient from "./ProgresoClient";

export const dynamic = "force-dynamic";

export default async function ProgresoPage() {
  const { swims } = await getProgressEntries();
  return <ProgresoClient initialSwims={swims} />;
}
