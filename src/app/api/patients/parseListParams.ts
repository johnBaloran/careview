import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT,
  MAX_QUERY_LENGTH,
  PAGE_SIZES,
  PATIENT_SORTS,
  type PageSize,
  type PatientListParams,
  type PatientSort,
  type PatientStatus,
} from "@/features/patients/types";

export type ParseResult =
  { ok: true; params: PatientListParams } | { ok: false; message: string };

const STATUSES: readonly PatientStatus[] = ["active", "inactive"];

// Validates the list query string. Error messages describe the rule, never the submitted value,
// because `q` may contain a patient's name or MRN.
export function parseListParams(searchParams: URLSearchParams): ParseResult {
  const q = searchParams.get("q")?.trim() || undefined;
  if (q && q.length > MAX_QUERY_LENGTH) {
    return {
      ok: false,
      message: `q must be at most ${MAX_QUERY_LENGTH} characters`,
    };
  }

  const rawStatus = searchParams.get("status");
  if (rawStatus !== null && !STATUSES.includes(rawStatus as PatientStatus)) {
    return { ok: false, message: "status must be 'active' or 'inactive'" };
  }

  const rawPage = searchParams.get("page") ?? "1";
  if (!/^[1-9]\d{0,5}$/.test(rawPage)) {
    return { ok: false, message: "page must be a whole number from 1" };
  }

  const rawPageSize = searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE);
  const pageSize = Number(rawPageSize);
  if (!PAGE_SIZES.includes(pageSize as PageSize)) {
    return {
      ok: false,
      message: `pageSize must be one of ${PAGE_SIZES.join(", ")}`,
    };
  }

  const sort = searchParams.get("sort") ?? DEFAULT_SORT;
  if (!PATIENT_SORTS.includes(sort as PatientSort)) {
    return {
      ok: false,
      message: `sort must be one of ${PATIENT_SORTS.join(", ")}`,
    };
  }

  return {
    ok: true,
    params: {
      q,
      status: (rawStatus as PatientStatus | null) ?? undefined,
      page: Number(rawPage),
      pageSize: pageSize as PageSize,
      sort: sort as PatientSort,
    },
  };
}
