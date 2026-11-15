"use client";

import { useFetchJson } from "./useFetchJson";

import type { PatientListParams, PatientListResponse } from "../types";

export function toPatientsQuery(params: PatientListParams): string {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.status) query.set("status", params.status);
  query.set("page", String(params.page));
  query.set("pageSize", String(params.pageSize));
  query.set("sort", params.sort);
  return query.toString();
}

/** One page of the patient directory. The previous page stays visible while the next loads. */
export function usePatients(params: PatientListParams) {
  const { status, data, retry } = useFetchJson<PatientListResponse>(
    `/api/patients?${toPatientsQuery(params)}`,
    { keepPreviousData: true },
  );
  return { status, data, retry };
}
