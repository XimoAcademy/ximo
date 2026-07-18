import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/getUser";

export { DOC_STATUSES, DOC_IMPORTANCE } from "./documents-constants";

/** Standard recruiting document checklist seeded for new athletes. */
export const STANDARD_DOCS: { title: string; type: string; notes: string }[] = [
  { title: "Transcript académico", type: "alta", notes: "Versión traducida al inglés y certificada." },
  { title: "Perfil atlético", type: "alta", notes: "Mejores tiempos, logros y datos de contacto." },
  { title: "Video deportivo", type: "alta", notes: "Clip corto (60–90s) de tus mejores pruebas." },
  { title: "Historial de tiempos", type: "alta", notes: "PBs por curso (SCY / LCM) actualizados." },
  { title: "SAT", type: "alta", notes: "Resultado oficial o de práctica." },
  { title: "TOEFL", type: "alta", notes: "Resultado o fecha de examen programada." },
  { title: "Pasaporte", type: "media", notes: "Vigente para todo el periodo de estudios." },
  { title: "Cartas de recomendación", type: "media", notes: "Coach actual y director académico." },
  { title: "Lista de universidades", type: "media", notes: "Programas curados con prioridades." },
  { title: "Información financiera", type: "baja", notes: "FAFSA prep y estimado de ayuda." },
];

export interface DocumentRow {
  id: string;
  title: string;
  type: string | null;
  status: string | null;
  file_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export async function getDocuments(): Promise<{ rows: DocumentRow[]; configured: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { rows: [], configured: false };
  const user = await getCurrentUser();
  if (!user) return { rows: [], configured: true };

  const { data } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return { rows: (data as DocumentRow[]) ?? [], configured: true };
}

export async function getDocument(id: string): Promise<DocumentRow | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  const { data } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  return (data as DocumentRow) ?? null;
}
