import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT,
  PAGE_SIZES,
  PATIENT_SORTS,
  type PageSize,
  type PatientSort,
  type PatientStatus,
} from "../types";

export type DirectoryParams = {
  page: number;
  pageSize: PageSize;
  sort: PatientSort;
  status?: PatientStatus;
};

type ReadableParams = { get(name: string): string | null };

// The page URL holds only non-identifying list state. Hand-edited or stale values fall back to
// defaults instead of producing an error page (the API itself rejects them strictly).
export function readDirectoryParams(
  searchParams: ReadableParams,
): DirectoryParams {
  const page = Number(searchParams.get("page"));
  const pageSize = Number(searchParams.get("pageSize"));
  const sort = searchParams.get("sort");
  const status = searchParams.get("status");
  return {
    page: Number.isInteger(page) && page >= 1 ? page : 1,
    pageSize: PAGE_SIZES.includes(pageSize as PageSize)
      ? (pageSize as PageSize)
      : DEFAULT_PAGE_SIZE,
    sort: PATIENT_SORTS.includes(sort as PatientSort)
      ? (sort as PatientSort)
      : DEFAULT_SORT,
    status: status === "active" || status === "inactive" ? status : undefined,
  };
}
