/** @jest-environment node */
import { PATIENTS } from "./fixtures";
import { listPatients } from "./service";

import type { PatientListParams } from "@/features/patients/types";

const defaults: PatientListParams = { page: 1, pageSize: 50, sort: "name" };
const fullName = (p: { givenName: string; familyName: string }) =>
  `${p.givenName} ${p.familyName}`;

describe("listPatients", () => {
  it("returns the first page of all patients with paging metadata", () => {
    const result = listPatients({ ...defaults, pageSize: 20 });
    expect(result.total).toBe(PATIENTS.length);
    expect(result.items).toHaveLength(20);
    expect(result).toMatchObject({ page: 1, pageSize: 20 });
  });

  describe("search", () => {
    it("matches part of a name, case-insensitively", () => {
      const result = listPatients({ ...defaults, q: "CHEN" });
      expect(result.items.map(fullName)).toEqual(["Maya Chen"]);
    });

    it("matches 'Family, Given' order", () => {
      expect(
        listPatients({ ...defaults, q: "chen, maya" }).items.map(fullName),
      ).toEqual(["Maya Chen"]);
    });

    it("matches an MRN", () => {
      const result = listPatients({ ...defaults, q: "syn-100001" });
      expect(result.items.map((p) => p.mrn)).toEqual(["SYN-100001"]);
    });

    it("returns no items (and total 0) when nothing matches", () => {
      expect(listPatients({ ...defaults, q: "zzzz" })).toMatchObject({
        items: [],
        total: 0,
      });
    });
  });

  it("filters by status", () => {
    const inactive = listPatients({ ...defaults, status: "inactive" });
    expect(inactive.total).toBe(
      PATIENTS.filter((p) => p.status === "inactive").length,
    );
    expect(inactive.items.every((p) => p.status === "inactive")).toBe(true);
  });

  it("combines search and status filter", () => {
    const result = listPatients({ ...defaults, q: "an", status: "active" });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((p) => p.status === "active")).toBe(true);
  });

  describe("sorting", () => {
    it("sorts by family name, then given name", () => {
      const { items } = listPatients({
        ...defaults,
        sort: "name",
        pageSize: 50,
      });
      expect(fullName(items[0]!)).toBe("Esther Adeyemi");
      const keys = items.map((p) =>
        `${p.familyName}|${p.givenName}`.toLowerCase(),
      );
      expect(keys).toEqual([...keys].sort((a, b) => a.localeCompare(b, "en")));
    });

    it("sorts by name descending", () => {
      expect(
        fullName(listPatients({ ...defaults, sort: "-name" }).items[0]!),
      ).toBe("Wei Zhang");
    });

    it("sorts by birth date, oldest first or youngest first", () => {
      expect(
        fullName(listPatients({ ...defaults, sort: "birthDate" }).items[0]!),
      ).toBe("Tariq Hussain");
      expect(
        fullName(listPatients({ ...defaults, sort: "-birthDate" }).items[0]!),
      ).toBe("Margot Girard");
    });
  });

  describe("paging", () => {
    it("returns consecutive, non-overlapping pages", () => {
      const page1 = listPatients({
        ...defaults,
        pageSize: 10,
        page: 1,
      }).items.map((p) => p.id);
      const page2 = listPatients({
        ...defaults,
        pageSize: 10,
        page: 2,
      }).items.map((p) => p.id);
      const all = listPatients({ ...defaults, pageSize: 50 }).items.map(
        (p) => p.id,
      );
      expect(page1).toEqual(all.slice(0, 10));
      expect(page2).toEqual(all.slice(10, 20));
    });

    it("returns an empty page past the end, with the real total", () => {
      expect(
        listPatients({ ...defaults, pageSize: 50, page: 3 }),
      ).toMatchObject({
        items: [],
        total: PATIENTS.length,
        page: 3,
      });
    });
  });
});
