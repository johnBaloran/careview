import { availableCodes, latestByCode, toTrendSeries } from "./observations";

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

describe("availableCodes", () => {
  it("lists only types with readings, in display order", () => {
    expect(
      availableCodes([
        obs("1", "pain-score", "2025-01-01", 6),
        obs("2", "heart-rate", "2025-01-01", 70),
      ]),
    ).toEqual(["heart-rate", "pain-score"]);
  });
});

describe("toTrendSeries", () => {
  it("returns one type's readings oldest first, with its label and unit", () => {
    const series = toTrendSeries(
      [
        {
          ...obs("3", "heart-rate", "2026-02-01", 72),
          display: "Heart rate",
          unit: "beats/min",
        },
        obs("1", "pain-score", "2025-01-01", 6),
        {
          ...obs("2", "heart-rate", "2025-03-01", 80),
          display: "Heart rate",
          unit: "beats/min",
        },
      ],
      "heart-rate",
    );
    expect(series).toEqual({
      code: "heart-rate",
      display: "Heart rate",
      unit: "beats/min",
      points: [
        { id: "2", date: "2025-03-01", value: 80 },
        { id: "3", date: "2026-02-01", value: 72 },
      ],
    });
  });

  it("returns undefined when there are no readings of that type", () => {
    expect(
      toTrendSeries([obs("1", "pain-score", "2025-01-01", 6)], "body-weight"),
    ).toBeUndefined();
  });
});
