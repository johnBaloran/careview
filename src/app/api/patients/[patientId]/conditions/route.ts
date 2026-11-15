import { json, patientNotFound } from "@/server/http";
import { getConditions } from "@/server/patients/chart";

import type { NextRequest } from "next/server";

// GET /api/patients/{patientId}/conditions
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/patients/[patientId]/conditions">,
) {
  const { patientId } = await ctx.params;
  const items = getConditions(patientId);
  return items ? json({ items }) : patientNotFound();
}
