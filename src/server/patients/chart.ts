import "server-only";

import { CLINICAL_RECORDS } from "./clinicalFixtures";
import { PATIENTS } from "./fixtures";

import type {
  Condition,
  Encounter,
  MedicationRequest,
  Observation,
  PatientSummary,
} from "@/features/patients/types";

const newestFirst =
  <T>(dateOf: (item: T) => string) =>
  (a: T, b: T) =>
    dateOf(b).localeCompare(dateOf(a));

export function getPatient(id: string): PatientSummary | undefined {
  return PATIENTS.find((patient) => patient.id === id);
}

// Each getter returns undefined for an unknown patient, so routes can answer 404.

export function getConditions(patientId: string): Condition[] | undefined {
  const record = CLINICAL_RECORDS.get(patientId);
  if (!record) return undefined;
  // Active first, then most recent onset.
  return [...record.conditions].sort(
    (a, b) =>
      Number(b.clinicalStatus === "active") -
        Number(a.clinicalStatus === "active") ||
      b.onsetDate.localeCompare(a.onsetDate),
  );
}

export function getEncounters(patientId: string): Encounter[] | undefined {
  const record = CLINICAL_RECORDS.get(patientId);
  return record
    ? [...record.encounters].sort(newestFirst((e) => e.date))
    : undefined;
}

export function getObservations(patientId: string): Observation[] | undefined {
  const record = CLINICAL_RECORDS.get(patientId);
  return record
    ? [...record.observations].sort(newestFirst((o) => o.date))
    : undefined;
}

export function getMedications(
  patientId: string,
): MedicationRequest[] | undefined {
  const record = CLINICAL_RECORDS.get(patientId);
  if (!record) return undefined;
  return [...record.medications].sort(
    (a, b) =>
      Number(b.status === "active") - Number(a.status === "active") ||
      b.authoredOn.localeCompare(a.authoredOn),
  );
}
