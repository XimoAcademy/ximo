import { describe, expect, it } from "vitest";
import { describeTimeUntil, nextDueReminder, type ReminderWindow } from "./reminders";

const NOW = new Date("2026-08-14T12:00:00.000Z");
const inMinutes = (m: number) => new Date(NOW.getTime() + m * 60_000);

describe("nextDueReminder — normal punctual schedule", () => {
  it("owes nothing while the event is further out than 24h", () => {
    expect(nextDueReminder(inMinutes(25 * 60), NOW)).toBeNull();
  });

  it("owes the 24h reminder once inside the 24h mark", () => {
    const due = nextDueReminder(inMinutes(24 * 60 - 2), NOW);
    expect(due?.window).toBe("24h");
    expect(due?.covers).toEqual(["24h"]);
  });

  it("owes the 1h reminder after 24h was sent", () => {
    const due = nextDueReminder(inMinutes(58), NOW, ["24h"]);
    expect(due?.window).toBe("1h");
    expect(due?.covers).toEqual(["1h"]);
  });

  it("owes the 10m reminder after 24h and 1h were sent", () => {
    const due = nextDueReminder(inMinutes(8), NOW, ["24h", "1h"]);
    expect(due?.window).toBe("10m");
  });

  it("owes nothing once every window has been sent", () => {
    expect(nextDueReminder(inMinutes(5), NOW, ["24h", "1h", "10m"])).toBeNull();
  });
});

describe("nextDueReminder — tolerates a late scheduler (the whole point)", () => {
  it("still delivers the 1h reminder when the run is 25 minutes late", () => {
    // Punctual run would have fired at 60m; this run happens at 35m left.
    const due = nextDueReminder(inMinutes(35), NOW, ["24h"]);
    expect(due?.window).toBe("1h");
    // ...and tells the truth about the real time left.
    expect(due?.label).toBe("en 35 minutos");
  });

  it("still delivers the final reminder when the run is very late", () => {
    const due = nextDueReminder(inMinutes(3), NOW, ["24h", "1h"]);
    expect(due?.window).toBe("10m");
    expect(due?.label).toBe("en 3 minutos");
  });
});

describe("nextDueReminder — announcement published close to the event", () => {
  it("sends only the most urgent window, never a stale '24 hours' notice", () => {
    // Published 20 minutes before it starts: nothing sent yet.
    const due = nextDueReminder(inMinutes(20), NOW, []);
    expect(due?.window).toBe("1h");
    expect(due?.label).toBe("en 20 minutos");
    // Both windows are recorded, so 24h can never fire afterwards.
    expect(due?.covers).toEqual(["24h", "1h"]);
  });

  it("published 5 minutes before: one reminder covering all three windows", () => {
    const due = nextDueReminder(inMinutes(5), NOW, []);
    expect(due?.window).toBe("10m");
    expect(due?.covers).toEqual(["24h", "1h", "10m"]);
  });
});

describe("nextDueReminder — event already started", () => {
  it("owes nothing exactly at start time", () => {
    expect(nextDueReminder(NOW, NOW, [])).toBeNull();
  });

  it("owes nothing after it started", () => {
    expect(nextDueReminder(inMinutes(-30), NOW, [])).toBeNull();
  });
});

describe("describeTimeUntil", () => {
  const cases: Array<[number, string]> = [
    [24 * 60, "en 24 horas"],
    [23 * 60, "en 23 horas"],
    [120, "en 2 horas"],
    [60, "en 1 hora"],
    [35, "en 35 minutos"],
    [10, "en 10 minutos"],
    [1, "en unos momentos"],
  ];
  it.each(cases)("%i minutos -> %s", (minutes, expected) => {
    expect(describeTimeUntil(minutes)).toBe(expected);
  });
});

describe("full lifecycle of one announcement", () => {
  it("sends exactly three reminders across the event's life", () => {
    const startsAt = inMinutes(48 * 60); // published 2 days ahead
    const sent: ReminderWindow[] = [];
    const fired: string[] = [];

    // Simulate the scheduler running every 5 minutes for 2 days, with jitter.
    for (let elapsed = 0; elapsed < 48 * 60; elapsed += 5) {
      const now = new Date(NOW.getTime() + elapsed * 60_000);
      const due = nextDueReminder(startsAt, now, sent);
      if (due) {
        fired.push(due.window);
        sent.push(...due.covers);
      }
    }

    expect(fired).toEqual(["24h", "1h", "10m"]);
  });
});
