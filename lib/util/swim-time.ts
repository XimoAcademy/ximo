/**
 * Pure swim-time helpers (no I/O, no framework deps) so they're safe to import
 * from both server and client code — and easy to unit test.
 */

/** Parse "26.04" or "1:02.45" → seconds. Returns null if the format is invalid. */
export function parseTime(s: string): number | null {
  const t = s.trim();
  const m = t.match(/^(?:(\d+):)?([0-5]?\d(?:\.\d{1,2})?)$/);
  if (!m) return null;
  const min = m[1] ? parseInt(m[1], 10) : 0;
  const sec = parseFloat(m[2]);
  return min * 60 + sec;
}

/** Format seconds → "26.04" or "1:02.45". */
export function fmtTime(sec: number): string {
  if (sec >= 60) {
    const m = Math.floor(sec / 60);
    const s = sec - m * 60;
    return `${m}:${s.toFixed(2).padStart(5, "0")}`;
  }
  return sec.toFixed(2);
}
