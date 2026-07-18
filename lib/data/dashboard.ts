import { createClient } from "@/lib/supabase/server";
import { getIdentity, type Identity } from "./identity";
import { getCurrentUser } from "@/lib/auth/getUser";

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

  const user = await getCurrentUser();
  if (!user) return { identity: null, counts: EMPTY, upcomingTasks: [], isEmpty: true };

  const identity = await getIdentity();

  const countOwned = async (table: string) => {
    const { count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    return count ?? 0;
  };

  // All seven dashboard queries fire in ONE parallel batch — no waterfall.
  const [universities, coaches, documents, tasks, progress, readyRes, upcomingRes] =
    await Promise.all([
      countOwned("universities"),
      countOwned("coaches"),
      countOwned("documents"),
      countOwned("tasks"),
      countOwned("progress_entries"),
      supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "listo"),
      supabase
        .from("tasks")
        .select("id,title,due_date,priority")
        .eq("user_id", user.id)
        .neq("status", "completada")
        .order("due_date", { ascending: true })
        .limit(4),
    ]);
  const documentsReady = readyRes.count;
  const upcoming = upcomingRes.data;

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
