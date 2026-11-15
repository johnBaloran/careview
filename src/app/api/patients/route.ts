import { NextResponse, type NextRequest } from "next/server";

import { listPatients } from "@/server/patients/service";

import { parseListParams } from "./parseListParams";

import type {
  ApiErrorResponse,
  PatientListResponse,
} from "@/features/patients/types";

// Patient data must never be cached by browsers or proxies.
const NO_STORE = { "Cache-Control": "no-store" };

// GET /api/patients?q=&status=&page=&pageSize=&sort=
// Reading the query string makes this handler run per request (never prerendered at build).
export function GET(request: NextRequest) {
  const parsed = parseListParams(request.nextUrl.searchParams);
  if (!parsed.ok) {
    return NextResponse.json<ApiErrorResponse>(
      { error: { code: "BAD_REQUEST", message: parsed.message } },
      { status: 400, headers: NO_STORE },
    );
  }
  return NextResponse.json<PatientListResponse>(listPatients(parsed.params), {
    headers: NO_STORE,
  });
}
