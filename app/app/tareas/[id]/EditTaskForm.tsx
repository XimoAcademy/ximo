"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { updateTaskAction, deleteTaskAction, type ActionResult } from "../actions";
import type { TaskRow } from "@/lib/data/tasks";

const MODULES = ["Recruiting", "Universidades", "Coaches", "Documentos", "Correos", "Progreso", "Cursos", "General"];

export default function EditTaskForm({ task }: { task: TaskRow }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    updateTaskAction,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={task.id} />

      <label className="block">
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Título</span>
        <input name="title" required defaultValue={task.title} className="ximo-input" />
      </label>

      <label className="block">
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Descripción</span>
        <textarea name="description" rows={4} defaultValue={task.description ?? ""} className="ximo-input resize-none" placeholder="Detalles, contexto o recordatorios…" />
      </label>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Módulo</span>
          <select name="module" className="ximo-input" defaultValue={task.module ?? "General"}>
            {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Prioridad</span>
          <select name="priority" className="ximo-input" defaultValue={task.priority ?? "media"}>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Estado</span>
          <select name="status" className="ximo-input" defaultValue={task.status ?? "pendiente"}>
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En progreso</option>
            <option value="completada">Completada</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Fecha límite</span>
          <input type="date" name="due_date" defaultValue={task.due_date ?? ""} className="ximo-input" />
        </label>
      </div>

      {state?.ok && <p className="text-xs font-semibold" style={{ color: "var(--success)" }}>Cambios guardados.</p>}
      {state?.error && <p className="text-xs font-semibold" style={{ color: "var(--error)" }}>{state.error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button type="submit" disabled={pending} className="ximo-glass-btn teal text-xs disabled:opacity-50">
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={async () => {
            if (!confirm("¿Eliminar esta tarea?")) return;
            const fd = new FormData();
            fd.set("id", task.id);
            await deleteTaskAction(fd);
            router.push("/app/tareas");
          }}
          className="ximo-text-btn"
        >
          Eliminar tarea
        </button>
      </div>
    </form>
  );
}
