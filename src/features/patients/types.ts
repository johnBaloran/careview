// Shared by the API route (server) and the patient UI (client). Types and constants only.

export type PatientSex = "female" | "male" | "other" | "unknown";
export type PatientStatus = "active" | "inactive";

export type PatientSummary = {
  /** Opaque ID, safe to use in URLs. */
  id: string;
  /** Medical record number. Identifying: never put it in a URL or a log. */
  mrn: string;
  givenName: string;
  familyName: string;
  /** Calendar date, YYYY-MM-DD (no time zone). */
  birthDate: string;
  sex: PatientSex;
  status: PatientStatus;
};

export const PATIENT_SORTS = [
  "name",
  "-name",
  "birthDate",
  "-birthDate",
] as const;
export type PatientSort = (typeof PATIENT_SORTS)[number];

export const PAGE_SIZES = [10, 20, 50] as const;
export type PageSize = (typeof PAGE_SIZES)[number];

export const DEFAULT_PAGE_SIZE: PageSize = 20;
export const DEFAULT_SORT: PatientSort = "name";
export const MAX_QUERY_LENGTH = 100;

export type PatientListParams = {
  /** Name or MRN fragment. Sent to the API only; never stored in the page URL. */
  q?: string;
  status?: PatientStatus;
  page: number;
  pageSize: PageSize;
  sort: PatientSort;
};

export type PatientListResponse = {
  items: PatientSummary[];
  total: number;
  page: number;
  pageSize: number;
};

export type ApiErrorCode = "BAD_REQUEST" | "NOT_FOUND" | "INTERNAL";

export type ApiErrorResponse = {
  error: { code: ApiErrorCode; message: string };
};
