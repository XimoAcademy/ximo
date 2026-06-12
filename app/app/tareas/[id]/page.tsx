import { notFound } from "next/navigation";
import { GlassPanel, BackLink, StatusBadge } from "../../components/ui";
import ScrollReveal from "../../../components/ScrollReveal";
import { getTask } from "@/lib/data/tasks";
import EditTaskForm from "./EditTaskForm";

export const dynamic = "force-dynamic";

const PRIORITY: Record<string, { tone: "error" | "warning" | "info"; label: string }> = {
  alta: { tone: "error", label: "Alta" },
  media: { tone: "warning", label: "Media" },
  baja: { tone: "info", label: "Baja" },
};
const STATUS: Record<string, { tone: "neutral" | "info" | "success"; label: string }> = {
  pendiente: { tone: "neutral", label: "Pendiente" },
  "en progreso": { tone: "info", label: "En progreso" },
  completada: { tone: "success", label: "Completada" },
};

export default async function TareaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const task = await getTask(id);
  if (!task) notFound();

  const p = PRIORITY[task.priority ?? "media"] ?? PRIORITY.media;
  const s = STATUS[task.status ?? "pendiente"] ?? STATUS.pendiente;

  return (
    <div className="mx-auto max-w-[760px] space-y-5">
      <BackLink href="/app/tareas">Tareas</BackLink>

      <ScrollReveal>
        <GlassPanel className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={p.tone}>Prioridad {p.label.toLowerCase()}</StatusBadge>
            <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
            {task.module && <StatusBadge tone="info">{task.module}</StatusBadge>}
          </div>
          <h1 className="mt-3 text-2xl font-black" style={{ color: "var(--text)" }}>{task.title}</h1>
        </GlassPanel>
      </ScrollReveal>

      <ScrollReveal delay={60}>
        <GlassPanel className="p-5 sm:p-6">
          <h2 className="mb-4 text-base font-black" style={{ color: "var(--text)" }}>Editar tarea</h2>
          <EditTaskForm task={task} />
        </GlassPanel>
      </ScrollReveal>
    </div>
  );
}
