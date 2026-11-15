/** @jest-environment node */
import {
  getConditions,
  getEncounters,
  getMedications,
  getObservations,
  getPatient,
} from "./chart";

const isSortedDesc = (dates: string[]) =>
  dates.every((d, i) => i === 0 || dates[i - 1]! >= d);

describe("chart service", () => {
  it("finds a patient by id, and returns undefined for an unknown id", () => {
    expect(getPatient("pt-001")).toMatchObject({
      givenName: "Maya",
      familyName: "Chen",
    });
    expect(getPatient("pt-999")).toBeUndefined();
  });

  it.each([getConditions, getEncounters, getObservations, getMedications])(
    "%p returns undefined for an unknown patient",
    (getter) => {
      expect(getter("pt-999")).toBeUndefined();
    },
  );

  it("lists encounters and observations newest first", () => {
    expect(isSortedDesc(getEncounters("pt-001")!.map((e) => e.date))).toBe(
      true,
    );
    expect(isSortedDesc(getObservations("pt-001")!.map((o) => o.date))).toBe(
      true,
    );
  });

  it("lists active conditions and medications first", () => {
    for (let n = 1; n <= 60; n++) {
      const id = `pt-${String(n).padStart(3, "0")}`;
      const statuses = getConditions(id)!.map((c) => c.clinicalStatus);
      expect(statuses).toEqual([...statuses].sort()); // "active" < "resolved"
      const meds = getMedications(id)!.map((m) => m.status);
      expect(meds).toEqual([...meds].sort()); // "active" < "stopped"
    }
  });
});
