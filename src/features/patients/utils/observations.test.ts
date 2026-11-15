import { latestByCode } from "./observations";

import type { Observation } from "../types";

const obs = (
  id: string,
  code: Observation["code"],
  date: string,
  value: number,
): Observation => ({
  id,
  code,
  display: code,
  value,
  unit: "",
  date,
});

describe("latestByCode", () => {
  it("picks the newest reading per type, in display order, regardless of input order", () => {
    const result = latestByCode([
      obs("1", "pain-score", "2025-01-01", 6),
      obs("2", "heart-rate", "2025-03-01", 70),
      obs("3", "pain-score", "2026-02-01", 3),
      obs("4", "heart-rate", "2024-12-01", 80),
    ]);
    expect(result.map((o) => o.id)).toEqual(["2", "3"]);
  });

  it("returns nothing for no readings", () => {
    expect(latestByCode([])).toEqual([]);
  });
});
