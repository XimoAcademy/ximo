import Link from "next/link";
import ScrollReveal from "../../components/ScrollReveal";
import { EmptyState, StatusBadge } from "../components/ui";
import { getTasks, type TaskRow } from "@/lib/data/tasks";
import AddTaskForm from "./AddTaskForm";
import { setTaskStatusAction, deleteTaskAction } from "./actions";

export const dynamic = "force-dynamic";

const PRIORITY: Record<string, { tone: "error" | "warning" | "info"; label: string }> = {
  alta: { tone: "error", label: "Alta" },
  media: { tone: "warning", label: "Media" },
  baja: { tone: "info", label: "Baja" },
};

function dueLabel(due: string | null): { text: string; overdue: boolean } | null {
  if (!due) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(due + "T00:00:00");
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return { text: `Vencida hace ${Math.abs(diff)}d`, overdue: true };
  if (diff === 0) return { text: "Vence hoy", overdue: false };
  if (diff === 1) return { text: "Vence mañana", overdue: false };
  return { text: d.toLocaleDateString("es-MX", { day: "numeric", month: "short" }), overdue: false };
}

function TaskCard({ task }: { task: TaskRow }) {
  const p = PRIORITY[task.priority ?? "media"] ?? PRIORITY.media;
  const due = dueLabel(task.due_date);
  const done = task.status === "completada";

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl p-4 ximo-card-3d"
      style={{ background: "var(--surface)", border: "1px solid var(--border)", opacity: done ? 0.72 : 1 }}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <StatusBadge tone={p.tone}>{p.label}</StatusBadge>
        {task.module && <StatusBadge tone="neutral">{task.module}</StatusBadge>}
        {due && (
          <StatusBadge tone={due.overdue ? "error" : "gold"}>{due.text}</StatusBadge>
        )}
      </div>

      <Link href={`/app/tareas/${task.id}`} className="group">
        <p
          className="text-sm font-bold leading-snug transition-colors group-hover:text-[var(--teal)]"
          style={{ color: "var(--text)", textDecoration: done ? "line-through" : "none" }}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-1 line-clamp-2 text-[12px] leading-snug" style={{ color: "var(--text-label)" }}>
            {task.description}
          </p>
        )}
      </Link>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        {!done && task.status !== "en progreso" && (
          <form action={setTaskStatusAction}>
            <input type="hidden" name="id" value={task.id} />
            <input type="hidden" name="status" value="en progreso" />
            <button className="ximo-glass-chip rounded-full px-3 py-1 text-[11px] font-semibold" style={{ color: "var(--teal)" }}>
              Empezar
            </button>
          </form>
        )}
        {!done && (
          <form action={setTaskStatusAction}>
            <input type="hidden" name="id" value={task.id} />
            <input type="hidden" name="status" value="completada" />
            <button className="ximo-glass-chip rounded-full px-3 py-1 text-[11px] font-semibold" style={{ color: "var(--success)" }}>
              ✓ Completar
            </button>
          </form>
        )}
        {done && (
          <form action={setTaskStatusAction}>
            <input type="hidden" name="id" value={task.id} />
            <input type="hidden" name="status" value="pendiente" />
            <button className="ximo-glass-chip rounded-full px-3 py-1 text-[11px] font-semibold" style={{ color: "var(--text-label)" }}>
              Reabrir
            </button>
          </form>
        )}
        <form action={deleteTaskAction} className="ml-auto">
          <input type="hidden" name="id" value={task.id} />
          <button className="ximo-text-btn">Eliminar</button>
        </form>
      </div>
    </div>
  );
}

function Column({ title, tasks, accent }: { title: string; tasks: TaskRow[]; accent: string }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-base font-black" style={{ color: "var(--text)" }}>{title}</h2>
        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "var(--border)", color: accent }}>
          {tasks.length}
        </span>
      </div>
      {tasks.length === 0 ? (
        <div className="rounded-2xl px-4 py-8 text-center text-[12px]" style={{ background: "var(--surface-hover)", border: "1px dashed var(--border)", color: "var(--text-3)" }}>
          Nada por aquí.
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((t) => <TaskCard key={t.id} task={t} />)}
        </div>
      )}
    </section>
  );
}

export default async function TareasPage() {
  const { byStatus, counts } = await getTasks();
  const hasAny = counts.total > 0;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="ximo-fade-up flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>Tareas</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
            Tu centro diario. Convierte cada pendiente en un paso hacia tu beca.
          </p>
        </div>
        <AddTaskForm />
      </div>

      {/* Focus banner with real counts */}
      <section className="ximo-fade-up delay-75">
        <div
          className="relative overflow-hidden rounded-2xl p-6 sm:p-7"
          style={{ background: "var(--hero-bg)", border: "1px solid var(--border-strong)", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}
        >
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full ximo-glow-pulse"
            style={{ background: "radial-gradient(circle, rgba(30,206,206,0.18) 0%, transparent 70%)", filter: "blur(32px)" }} />
          <div className="relative">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--teal-dim)" }}>Hoy</p>
            <h2 className="text-lg font-black leading-snug sm:text-xl" style={{ color: "var(--text)", maxWidth: "40ch" }}>
              Pequeñas acciones diarias crean grandes oportunidades.
            </h2>
            <div className="mt-5 flex flex-wrap gap-7">
              {[
                { label: "Pendientes", value: counts.pendiente },
                { label: "En progreso", value: counts.enProgreso },
                { label: "Completadas", value: counts.completada },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-black" style={{ color: "var(--text)" }}>{s.value}</p>
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-2)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {!hasAny ? (
        <EmptyState
          title="Aún no tienes tareas"
          text="Crea tu primera tarea para organizar tu proceso de reclutamiento: un correo a un coach, subir tu transcript o registrar tus tiempos."
        />
      ) : (
        <ScrollReveal>
          <div className="grid gap-5 lg:grid-cols-3">
            <Column title="Pendiente" tasks={byStatus.pendiente} accent="var(--text-label)" />
            <Column title="En progreso" tasks={byStatus["en progreso"]} accent="var(--teal)" />
            <Column title="Completada" tasks={byStatus.completada} accent="var(--success)" />
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
