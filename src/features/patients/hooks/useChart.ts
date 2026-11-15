"use client";

import { useFetchJson } from "./useFetchJson";

import type {
  Condition,
  Encounter,
  ListResponse,
  MedicationRequest,
  Observation,
  PatientSummary,
} from "../types";

export const usePatient = (patientId: string) =>
  useFetchJson<PatientSummary>(
    `/api/patients/${encodeURIComponent(patientId)}`,
  );

export type ChartResourceName =
  "conditions" | "encounters" | "observations" | "medications";

type ChartResourceItem = {
  conditions: Condition;
  encounters: Encounter;
  observations: Observation;
  medications: MedicationRequest;
};

export function useChartResource<R extends ChartResourceName>(
  patientId: string,
  resource: R,
) {
  return useFetchJson<ListResponse<ChartResourceItem[R]>>(
    `/api/patients/${encodeURIComponent(patientId)}/${resource}`,
  );
}
