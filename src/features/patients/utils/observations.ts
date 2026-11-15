import { OBSERVATION_CODES, type Observation } from "../types";

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
