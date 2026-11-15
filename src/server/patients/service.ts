import "server-only";

import { PATIENTS } from "./fixtures";

import type {
  PatientListParams,
  PatientListResponse,
  PatientSort,
  PatientSummary,
} from "@/features/patients/types";

const collator = new Intl.Collator("en", { sensitivity: "base" });

function matchesQuery(patient: PatientSummary, query: string): boolean {
  const q = query.toLowerCase();
  const names = [
    `${patient.givenName} ${patient.familyName}`,
    `${patient.familyName} ${patient.givenName}`,
    `${patient.familyName}, ${patient.givenName}`,
  ];
  return (
    names.some((name) => name.toLowerCase().includes(q)) ||
    patient.mrn.toLowerCase().includes(q)
  );
}

function compare(
  a: PatientSummary,
  b: PatientSummary,
  sort: PatientSort,
): number {
  const direction = sort.startsWith("-") ? -1 : 1;
  const key = sort.replace(/^-/, "");
  const primary =
    key === "birthDate"
      ? a.birthDate.localeCompare(b.birthDate)
      : collator.compare(a.familyName, b.familyName) ||
        collator.compare(a.givenName, b.givenName);
  // Tie-break on id so paging is stable whatever the sort.
  return primary * direction || a.id.localeCompare(b.id);
}

// In-memory search over the synthetic fixtures: filter, then sort, then page.
export function listPatients(params: PatientListParams): PatientListResponse {
  const { q, status, page, pageSize, sort } = params;
  const filtered = PATIENTS.filter(
    (patient) =>
      (!status || patient.status === status) &&
      (!q || matchesQuery(patient, q)),
  );
  const sorted = [...filtered].sort((a, b) => compare(a, b, sort));
  const start = (page - 1) * pageSize;
  return {
    items: sorted.slice(start, start + pageSize),
    total: sorted.length,
    page,
    pageSize,
  };
}
