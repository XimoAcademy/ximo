import { createClient } from "@/lib/supabase/server";
import { getIdentity, type Identity } from "./identity";

export interface DashboardCounts {
  universities: number;
  coaches: number;
  documents: number;
  documentsReady: number;
  tasks: number;
  progress: number;
}

export interface UpcomingTask {
  id: string;
  title: string;
  due_date: string | null;
  priority: string | null;
}

export interface DashboardData {
  identity: Identity | null;
  counts: DashboardCounts;
  upcomingTasks: UpcomingTask[];
  /** True when the athlete has no recruiting/academic data yet (fresh account). */
  isEmpty: boolean;
}

const EMPTY: DashboardCounts = {
  universities: 0,
  coaches: 0,
  documents: 0,
  documentsReady: 0,
  tasks: 0,
  progress: 0,
};

/**
 * Real dashboard data for the signed-in user. Returns null when Supabase isn't
 * configured. Counts use head-only queries (no rows transferred).
 */
export async function getDashboardData(): Promise<DashboardData | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { identity: null, counts: EMPTY, upcomingTasks: [], isEmpty: true };

  const identity = await getIdentity();

  const countOwned = async (table: string) => {
    const { count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    return count ?? 0;
  };

  const [universities, coaches, documents, tasks, progress] = await Promise.all([
    countOwned("universities"),
    countOwned("coaches"),
    countOwned("documents"),
    countOwned("tasks"),
    countOwned("progress_entries"),
  ]);

  const { count: documentsReady } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "listo");

  const { data: upcoming } = await supabase
    .from("tasks")
    .select("id,title,due_date,priority")
    .eq("user_id", user.id)
    .neq("status", "completada")
    .order("due_date", { ascending: true })
    .limit(4);

  const counts: DashboardCounts = {
    universities,
    coaches,
    documents,
    documentsReady: documentsReady ?? 0,
    tasks,
    progress,
  };

  return {
    identity,
    counts,
    upcomingTasks: (upcoming as UpcomingTask[]) ?? [],
    isEmpty: universities + coaches + documents + tasks + progress === 0,
  };
}
