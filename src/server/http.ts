import "server-only";

import { NextResponse } from "next/server";

import type { ApiErrorCode, ApiErrorResponse } from "@/features/patients/types";

// Patient data must never be cached by browsers or proxies.
const NO_STORE = { "Cache-Control": "no-store" };

export function json<T>(body: T, status = 200) {
  return NextResponse.json<T>(body, { status, headers: NO_STORE });
}

/** Error envelope. `message` must describe the problem, never echo request data (it may be PHI). */
export function apiError(code: ApiErrorCode, message: string, status: number) {
  return json<ApiErrorResponse>({ error: { code, message } }, status);
}

export const patientNotFound = () =>
  apiError("NOT_FOUND", "Patient not found", 404);
