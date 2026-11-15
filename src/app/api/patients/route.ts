import { apiError, json } from "@/server/http";
import { listPatients } from "@/server/patients/service";

import { parseListParams } from "./parseListParams";

import type { NextRequest } from "next/server";

// GET /api/patients?q=&status=&page=&pageSize=&sort=
// Reading the query string makes this handler run per request (never prerendered at build).
export function GET(request: NextRequest) {
  const parsed = parseListParams(request.nextUrl.searchParams);
  if (!parsed.ok) return apiError("BAD_REQUEST", parsed.message, 400);
  return json(listPatients(parsed.params));
}
