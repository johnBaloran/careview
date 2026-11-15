/** @jest-environment node */
import { CLINICAL_RECORDS, DATA_AS_OF } from "./clinicalFixtures";
import { PATIENTS } from "./fixtures";

const records = [...CLINICAL_RECORDS.entries()];

describe("synthetic clinical records", () => {
  it("are identical every time the module loads (deterministic)", () => {
    let reloaded: typeof CLINICAL_RECORDS | undefined;
    jest.isolateModules(() => {
      reloaded = (
        jest.requireActual(
          "./clinicalFixtures",
        ) as typeof import("./clinicalFixtures")
      ).CLINICAL_RECORDS;
    });
    expect(reloaded).not.toBe(CLINICAL_RECORDS);
    expect([...reloaded!.entries()]).toEqual(records);
  });

  it("exist for every patient", () => {
    expect(records.map(([id]) => id)).toEqual(PATIENTS.map((p) => p.id));
  });

  it("use unique ids across all resources", () => {
    const ids = records.flatMap(([, r]) =>
      [
        ...r.conditions,
        ...r.encounters,
        ...r.observations,
        ...r.medications,
      ].map((x) => x.id),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("never date anything before the patient's birth", () => {
    for (const patient of PATIENTS) {
      const r = CLINICAL_RECORDS.get(patient.id)!;
      const dates = [
        ...r.conditions.map((c) => c.onsetDate),
        ...r.encounters.map((e) => e.date),
        ...r.observations.map((o) => o.date),
        ...r.medications.map((m) => m.authoredOn),
      ];
      for (const date of dates) expect(date > patient.birthDate).toBe(true);
    }
  });

  it("only plan encounters after DATA_AS_OF, and record observations at finished encounters", () => {
    for (const [, r] of records) {
      for (const e of r.encounters) {
        expect(
          e.status === "planned" ? e.date > DATA_AS_OF : e.date <= DATA_AS_OF,
        ).toBe(true);
      }
      const finishedDates = new Set(
        r.encounters.filter((e) => e.status === "finished").map((e) => e.date),
      );
      for (const o of r.observations)
        expect(finishedDates.has(o.date)).toBe(true);
    }
  });

  it("keep observation values in plausible ranges", () => {
    const all = records.flatMap(([, r]) => r.observations);
    const values = (code: string) =>
      all.filter((o) => o.code === code).map((o) => o.value);
    expect(Math.min(...values("heart-rate"))).toBeGreaterThanOrEqual(50);
    expect(Math.max(...values("heart-rate"))).toBeLessThanOrEqual(100);
    expect(values("pain-score").every((v) => v >= 0 && v <= 10)).toBe(true);
    expect(values("body-weight").every((v) => v > 40 && v < 110)).toBe(true);
  });

  it("include empty-state examples: some patients have no conditions or no medications", () => {
    expect(records.some(([, r]) => r.conditions.length === 0)).toBe(true);
    expect(records.some(([, r]) => r.medications.length === 0)).toBe(true);
  });

  it("link medications to conditions: active only while a condition is active", () => {
    for (const [, r] of records) {
      const activeCount = r.conditions.filter(
        (c) => c.clinicalStatus === "active",
      ).length;
      expect(
        r.medications.filter((m) => m.status === "active").length,
      ).toBeLessThanOrEqual(activeCount);
    }
  });
});
