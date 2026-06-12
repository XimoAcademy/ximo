import { describe, it, expect } from "vitest";
import {
  strokeOf,
  distanceOf,
  buildStrokeStats,
  overallIndex,
  sprintDistanceProfile,
  STROKE_AXES,
  type StrokeSwim,
} from "./swim-stats";

describe("strokeOf", () => {
  it("classifies each stroke from the event name", () => {
    expect(strokeOf("100 mariposa")).toBe("Mariposa");
    expect(strokeOf("100 dorso")).toBe("Dorso");
    expect(strokeOf("100 pecho")).toBe("Pecho");
    expect(strokeOf("200 combinado")).toBe("Combinado");
    expect(strokeOf("200 IM")).toBe("Combinado");
    expect(strokeOf("50 libre")).toBe("Libre");
    expect(strokeOf("algo raro")).toBe("Libre"); // default
  });
});

describe("distanceOf", () => {
  it("extracts the leading distance", () => {
    expect(distanceOf("50 libre")).toBe(50);
    expect(distanceOf("200 combinado")).toBe(200);
    expect(distanceOf("1500 libre")).toBe(1500);
    expect(distanceOf("libre")).toBe(0);
  });
});

describe("buildStrokeStats", () => {
  it("returns all five axes in order", () => {
    const stats = buildStrokeStats([]);
    expect(stats.map((s) => s.stroke)).toEqual(STROKE_AXES);
    expect(stats.every((s) => s.score === null)).toBe(true);
  });

  // Inject explicit goal times so these tests verify the scoring math without
  // depending on the live TARGETS table (which is tuned over time).
  const goals = { "50 libre|SCY": 25.2, "100 libre|SCY": 56.5, "100 pecho|SCY": 70 };

  it("scores best-vs-goal, clamped to 100, only counting SCY", () => {
    const swims: StrokeSwim[] = [
      { event: "50 libre", course: "SCY", sec: 25.2 }, // exactly goal → 100
      { event: "50 libre", course: "SCY", sec: 30 }, // slower; best wins
      { event: "50 libre", course: "LCM", sec: 10 }, // ignored (not SCY)
    ];
    const libre = buildStrokeStats(swims, "SCY", goals).find((s) => s.stroke === "Libre")!;
    expect(libre.score).toBe(100);
    expect(libre.events).toBe(1);
  });

  it("caps faster-than-goal at 100 and averages multiple events per stroke", () => {
    const swims: StrokeSwim[] = [
      { event: "50 libre", course: "SCY", sec: 12.6 }, // 2x goal → would be 200, clamped 100
      { event: "100 libre", course: "SCY", sec: 113 }, // goal 56.5 → ~50
    ];
    const libre = buildStrokeStats(swims, "SCY", goals).find((s) => s.stroke === "Libre")!;
    // mean of 100 and round(56.5/113*100)=50 → 75
    expect(libre.score).toBe(75);
    expect(libre.events).toBe(2);
  });

  it("ignores events without a defined goal time", () => {
    const stats = buildStrokeStats([{ event: "400 libre", course: "SCY", sec: 240 }]);
    expect(stats.find((s) => s.stroke === "Libre")!.score).toBeNull();
  });
});

describe("overallIndex", () => {
  it("averages scored strokes and ignores nulls", () => {
    const goals = { "50 libre|SCY": 25.2, "100 pecho|SCY": 70 };
    const swims: StrokeSwim[] = [
      { event: "50 libre", course: "SCY", sec: 25.2 }, // 100
      { event: "100 pecho", course: "SCY", sec: 140 }, // goal 70 → 50
    ];
    expect(overallIndex(buildStrokeStats(swims, "SCY", goals))).toBe(75);
  });

  it("returns null with no scored strokes", () => {
    expect(overallIndex(buildStrokeStats([]))).toBeNull();
  });
});

describe("sprintDistanceProfile", () => {
  it("labels a sprinter", () => {
    const p = sprintDistanceProfile([
      { event: "50 libre", course: "SCY", sec: 25 },
      { event: "100 libre", course: "SCY", sec: 55 },
    ]);
    expect(p.sprintN).toBe(2);
    expect(p.distN).toBe(0);
    expect(p.profile).toBe("Velocista");
  });

  it("labels a distance swimmer", () => {
    const p = sprintDistanceProfile([
      { event: "200 libre", course: "SCY", sec: 120 },
      { event: "500 libre", course: "SCY", sec: 320 },
    ]);
    expect(p.distN).toBe(2);
    expect(p.profile).toBe("Fondista");
  });

  it("labels balanced and defaults to 0.5 with no races", () => {
    const balanced = sprintDistanceProfile([
      { event: "50 libre", course: "SCY", sec: 25 },
      { event: "200 libre", course: "SCY", sec: 120 },
    ]);
    expect(balanced.profile).toBe("Equilibrado");
    const none = sprintDistanceProfile([]);
    expect(none.profile).toBeNull();
    expect(none.distFrac).toBe(0.5);
  });
});
