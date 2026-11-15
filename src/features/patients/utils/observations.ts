import {
  OBSERVATION_CODES,
  type Observation,
  type ObservationCode,
} from "../types";

/** The most recent reading for each observation type, in a fixed display order. */
export function latestByCode(observations: Observation[]): Observation[] {
  return OBSERVATION_CODES.flatMap((code) => {
    const latest = observations
      .filter((o) => o.code === code)
      .reduce<Observation | undefined>(
        (best, o) => (!best || o.date > best.date ? o : best),
        undefined,
      );
    return latest ? [latest] : [];
  });
}

export type TrendSeries = {
  code: ObservationCode;
  display: string;
  unit: string;
  /** Oldest first, as a trend reads left to right. */
  points: { id: string; date: string; value: number }[];
};

/** Observation types the patient actually has readings for, in display order. */
export function availableCodes(observations: Observation[]): ObservationCode[] {
  return OBSERVATION_CODES.filter((code) =>
    observations.some((o) => o.code === code),
  );
}

/** One observation type as a chronological series; undefined if there are no readings. */
export function toTrendSeries(
  observations: Observation[],
  code: ObservationCode,
): TrendSeries | undefined {
  const readings = observations.filter((o) => o.code === code);
  const first = readings[0];
  if (!first) return undefined;
  return {
    code,
    display: first.display,
    unit: first.unit,
    points: readings
      .map(({ id, date, value }) => ({ id, date, value }))
      .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)),
  };
}
