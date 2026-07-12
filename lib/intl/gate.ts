import type { SupabaseClient } from "@supabase/supabase-js";
import { codeFromResidenceText, paidFlowsAllowedForCountry } from "./countries";

/**
 * Server-side country gate for PAID flows (P2-3 of the expansion plan).
 *
 * Reads the user's declared residence from profiles (ISO country_code when
 * migration 010 has run, else mapped from the legacy free-text country) and
 * applies the fail-safe policy in paidFlowsAllowedForCountry:
 *   - kill switches off (default) → always allowed (today's behaviour);
 *   - switches on → MX/US and legacy/unmapped users allowed, expansion
 *     countries only at paid_launch_enabled.
 *
 * Must be called from SERVER code only (server actions / route handlers),
 * with the caller's own Supabase client so RLS applies. If the profile can't
 * be read (e.g. 010 not applied yet), the user is treated as legacy/unmapped —
 * the master switch remains the real safety, and it defaults OFF.
 */
export async function paidFlowsAllowedForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  let code: string | null = null;
  try {
    const { data } = await supabase
      .from("profiles")
      .select("country_code, country")
      .eq("id", userId)
      .maybeSingle();
    const row = data as { country_code?: string | null; country?: string | null } | null;
    code = row?.country_code ?? codeFromResidenceText(row?.country);
  } catch {
    code = null; // unreadable profile → legacy/unmapped path
  }
  return paidFlowsAllowedForCountry(code);
}

/** Standard Spanish error for a gated country — shared by all paid entry points. */
export const PAID_FLOWS_BLOCKED_ERROR =
  "Los pagos aún no están disponibles en tu país. Te avisaremos cuando se habiliten.";
