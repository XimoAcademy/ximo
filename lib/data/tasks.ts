import { createClient } from "@/lib/supabase/server";

export type TaskPriority = "alta" | "media" | "baja";
export type TaskStatus = "pendiente" | "en progreso" | "completada";

export interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  module: string | null;
  priority: TaskPriority | string | null;
  status: TaskStatus | string | null;
  due_date: string | null;
  related_university_id: string | null;
  related_coach_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TasksData {
  tasks: TaskRow[];
  byStatus: {
    pendiente: TaskRow[];
    "en progreso": TaskRow[];
    completada: TaskRow[];
  };
  counts: { total: number; pendiente: number; enProgreso: number; completada: number };
  configured: boolean;
}

const EMPTY: TasksData = {
  tasks: [],
  byStatus: { pendiente: [], "en progreso": [], completada: [] },
  counts: { total: 0, pendiente: 0, enProgreso: 0, completada: 0 },
  configured: false,
};

/** All of the signed-in athlete's tasks, grouped by status. */
export async function getTasks(): Promise<TasksData> {
  const supabase = await createClient();
  if (!supabase) return EMPTY;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ...EMPTY, configured: true };

  const { data } = await supabase
    .from("tasks")
    .select(
      "id,title,description,module,priority,status,due_date,related_university_id,related_coach_id,created_at,updated_at"
    )
    .eq("user_id", user.id)
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  const tasks = (data as TaskRow[]) ?? [];
  const pendiente = tasks.filter((t) => (t.status ?? "pendiente") === "pendiente");
  const enProgreso = tasks.filter((t) => t.status === "en progreso");
  const completada = tasks.filter((t) => t.status === "completada");

  return {
    tasks,
    byStatus: { pendiente, "en progreso": enProgreso, completada },
    counts: {
      total: tasks.length,
      pendiente: pendiente.length,
      enProgreso: enProgreso.length,
      completada: completada.length,
    },
    configured: true,
  };
}

export async function getTask(id: string): Promise<TaskRow | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  return (data as TaskRow) ?? null;
}
