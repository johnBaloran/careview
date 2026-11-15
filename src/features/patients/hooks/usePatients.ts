"use client";

import { useEffect, useState } from "react";

import type { PatientListParams, PatientListResponse } from "../types";

export type PatientsRequestStatus = "loading" | "success" | "error";

type Result = { key: string; data?: PatientListResponse; failed?: boolean };

export function toPatientsQuery(params: PatientListParams): string {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.status) query.set("status", params.status);
  query.set("page", String(params.page));
  query.set("pageSize", String(params.pageSize));
  query.set("sort", params.sort);
  return query.toString();
}

/**
 * Fetches one page of patients for the given params.
 * - A newer request aborts the previous one, so a slow, stale response can never overwrite newer data.
 * - While a new page loads, the previous page stays available (`data`) so the table doesn't flash.
 * - `status` is derived (is the stored result for the current request?) rather than set at the
 *   start of the effect.
 */
export function usePatients(params: PatientListParams) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const query = toPatientsQuery(params);
  const requestKey = `${query}#${attempt}`;

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/patients?${query}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok)
          throw new Error(`Request failed with status ${response.status}`);
        return (await response.json()) as PatientListResponse;
      })
      .then((data) => {
        // A response can still arrive after abort (e.g. mid-body); never let it overwrite newer data.
        if (!controller.signal.aborted) setResult({ key: requestKey, data });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setResult({ key: requestKey, failed: true });
      });
    return () => controller.abort();
  }, [query, requestKey]);

  const isCurrent = result?.key === requestKey;
  const status: PatientsRequestStatus = !isCurrent
    ? "loading"
    : result.failed
      ? "error"
      : "success";

  return {
    status,
    /** The latest successful page; during "loading" it's the previous page (or undefined). */
    data: result?.data,
    retry: () => setAttempt((count) => count + 1),
  };
}
