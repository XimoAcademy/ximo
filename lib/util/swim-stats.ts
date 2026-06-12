/**
 * Pure swim-analytics logic. No framework deps → unit-testable.
 */

export type Stroke = "Libre" | "Mariposa" | "Dorso" | "Pecho" | "Combinado";
export type Course = "SCY" | "LCM" | "SCM";

/** Radar axes in conventional order. */
export const STROKE_AXES: Stroke[] = ["Libre", "Dorso", "Pecho", "Mariposa", "Combinado"];

/** All events per course. SCY uses yards (500/1000/1650); metric uses 400/800/1500. */
export const EVENTS_BY_COURSE: Record<Course, string[]> = {
  SCY: [
    "50 libre", "100 libre", "200 libre", "500 libre", "1000 libre", "1650 libre",
    "100 dorso", "200 dorso",
    "100 pecho", "200 pecho",
    "100 mariposa", "200 mariposa",
    "200 combinado", "400 combinado",
  ],
  LCM: [
    "50 libre", "100 libre", "200 libre", "400 libre", "800 libre", "1500 libre",
    "50 dorso", "100 dorso", "200 dorso",
    "50 pecho", "100 pecho", "200 pecho",
    "50 mariposa", "100 mariposa", "200 mariposa",
    "200 combinado", "400 combinado",
  ],
  SCM: [
    "50 libre", "100 libre", "200 libre", "400 libre", "800 libre", "1500 libre",
    "50 dorso", "100 dorso", "200 dorso",
    "50 pecho", "100 pecho", "200 pecho",
    "50 mariposa", "100 mariposa", "200 mariposa",
    "200 combinado", "400 combinado",
  ],
};

/** Reference/goal times (seconds) per event+course. Approximate NCAA D1 qualifying level. */
export const TARGETS: Record<string, number> = {
  // ── SCY ──────────────────────────────────────────────────
  "50 libre|SCY": 20.5,
  "100 libre|SCY": 45.0,
  "200 libre|SCY": 98.5,
  "500 libre|SCY": 268.0,
  "1000 libre|SCY": 548.0,
  "1650 libre|SCY": 912.0,
  "100 dorso|SCY": 49.0,
  "200 dorso|SCY": 106.0,
  "100 pecho|SCY": 57.0,
  "200 pecho|SCY": 124.0,
  "100 mariposa|SCY": 50.0,
  "200 mariposa|SCY": 109.0,
  "200 combinado|SCY": 105.0,
  "400 combinado|SCY": 224.0,

  // ── LCM ──────────────────────────────────────────────────
  "50 libre|LCM": 24.5,
  "100 libre|LCM": 54.0,
  "200 libre|LCM": 118.0,
  "400 libre|LCM": 255.0,
  "800 libre|LCM": 530.0,
  "1500 libre|LCM": 1010.0,
  "50 dorso|LCM": 27.0,
  "100 dorso|LCM": 57.5,
  "200 dorso|LCM": 124.0,
  "50 pecho|LCM": 30.5,
  "100 pecho|LCM": 67.0,
  "200 pecho|LCM": 148.0,
  "50 mariposa|LCM": 26.0,
  "100 mariposa|LCM": 59.0,
  "200 mariposa|LCM": 129.0,
  "200 combinado|LCM": 122.0,
  "400 combinado|LCM": 268.0,

  // ── SCM ──────────────────────────────────────────────────
  "50 libre|SCM": 23.5,
  "100 libre|SCM": 51.5,
  "200 libre|SCM": 113.0,
  "400 libre|SCM": 244.0,
  "800 libre|SCM": 508.0,
  "1500 libre|SCM": 966.0,
  "50 dorso|SCM": 26.0,
  "100 dorso|SCM": 55.0,
  "200 dorso|SCM": 119.0,
  "50 pecho|SCM": 29.5,
  "100 pecho|SCM": 64.0,
  "200 pecho|SCM": 142.0,
  "50 mariposa|SCM": 25.0,
  "100 mariposa|SCM": 56.5,
  "200 mariposa|SCM": 124.0,
  "200 combinado|SCM": 117.0,
  "400 combinado|SCM": 257.0,
};

export interface StrokeSwim {
  event: string;
  course: string;
  sec: number;
}

export interface StrokeStat {
  stroke: Stroke;
  score: number | null;
  events: number;
}

export function strokeOf(event: string): Stroke {
  const e = event.toLowerCase();
  if (e.includes("mariposa")) return "Mariposa";
  if (e.includes("dorso")) return "Dorso";
  if (e.includes("pecho")) return "Pecho";
  if (e.includes("combinado") || e.includes("im")) return "Combinado";
  return "Libre";
}

export function distanceOf(event: string): number {
  const m = event.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

/**
 * Build stroke-strength stats for a given course.
 * score = (target / best) × 100, clamped 0–100; 100 = at/beyond the goal time.
 */
export function buildStrokeStats(
  swims: StrokeSwim[],
  course: Course = "SCY",
  targets: Record<string, number> = TARGETS
): StrokeStat[] {
  const bestByEvent = new Map<string, number>();
  for (const s of swims) {
    if (s.course !== course) continue;
    const cur = bestByEvent.get(s.event);
    if (cur === undefined || s.sec < cur) bestByEvent.set(s.event, s.sec);
  }

  const acc = new Map<Stroke, { scores: number[]; events: number }>();
  for (const [event, best] of bestByEvent) {
    const target = targets[`${event}|${course}`];
    if (!target) continue;
    const score = Math.max(0, Math.min(100, Math.round((target / best) * 100)));
    const k = strokeOf(event);
    const cur = acc.get(k) ?? { scores: [], events: 0 };
    cur.scores.push(score);
    cur.events += 1;
    acc.set(k, cur);
  }

  return STROKE_AXES.map((stroke) => {
    const e = acc.get(stroke);
    const score = e && e.scores.length ? Math.round(e.scores.reduce((a, b) => a + b, 0) / e.scores.length) : null;
    return { stroke, score, events: e?.events ?? 0 };
  });
}

export function overallIndex(stats: StrokeStat[]): number | null {
  const scored = stats.filter((d) => d.score !== null) as { score: number }[];
  if (scored.length === 0) return null;
  return Math.round(scored.reduce((a, d) => a + d.score, 0) / scored.length);
}

export interface SprintDistanceProfile {
  sprintN: number;
  distN: number;
  distFrac: number;
  profile: "Velocista" | "Fondista" | "Equilibrado" | null;
}

export function sprintDistanceProfile(swims: StrokeSwim[]): SprintDistanceProfile {
  let sprintN = 0;
  let distN = 0;
  for (const s of swims) {
    const d = distanceOf(s.event);
    if (d > 0 && d <= 100) sprintN += 1;
    else if (d >= 200) distN += 1;
  }
  const total = sprintN + distN;
  const distFrac = total ? distN / total : 0.5;
  const profile = total === 0 ? null : distFrac < 0.4 ? "Velocista" : distFrac > 0.6 ? "Fondista" : "Equilibrado";
  return { sprintN, distN, distFrac, profile };
}
