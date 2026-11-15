"use client";

import { useEffect, useState } from "react";

export type RequestStatus = "loading" | "success" | "error";

type Result<T> = {
  key: string;
  data?: T;
  httpStatus?: number;
  failed?: boolean;
};

type Options = {
  /**
   * Keep showing the last successful data while a new URL loads (e.g. the next page of a list).
   * Off by default: on a patient chart, the previous patient's data must never appear while
   * another patient loads.
   */
  keepPreviousData?: boolean;
};

/**
 * GET a JSON resource for the current `url`.
 * - A newer request aborts the previous one, and a response that arrives after abort is ignored,
 *   so stale data can never overwrite newer data.
 * - `status` is derived (is the stored result for the current request?) rather than set at the
 *   start of the effect.
 * - `httpStatus` lets callers tell "not found" (404) from other failures.
 */
export function useFetchJson<T>(
  url: string,
  { keepPreviousData = false }: Options = {},
) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result<T> | null>(null);
  const requestKey = `${url}#${attempt}`;

  useEffect(() => {
    const controller = new AbortController();
    let httpStatus: number | undefined;
    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        httpStatus = response.status;
        if (!response.ok)
          throw new Error(`Request failed with status ${response.status}`);
        return (await response.json()) as T;
      })
      .then((data) => {
        if (!controller.signal.aborted)
          setResult({ key: requestKey, data, httpStatus });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setResult({ key: requestKey, failed: true, httpStatus });
      });
    return () => controller.abort();
  }, [url, requestKey]);

  const isCurrent = result?.key === requestKey;
  const status: RequestStatus = !isCurrent
    ? "loading"
    : result.failed
      ? "error"
      : "success";

  return {
    status,
    data: isCurrent || keepPreviousData ? result?.data : undefined,
    httpStatus: isCurrent ? result.httpStatus : undefined,
    retry: () => setAttempt((count) => count + 1),
  };
}
