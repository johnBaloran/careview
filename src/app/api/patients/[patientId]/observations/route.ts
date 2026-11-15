import { json, patientNotFound } from "@/server/http";
import { getObservations } from "@/server/patients/chart";

import type { NextRequest } from "next/server";

// GET /api/patients/{patientId}/observations
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/patients/[patientId]/observations">,
) {
  const { patientId } = await ctx.params;
  const items = getObservations(patientId);
  return items ? json({ items }) : patientNotFound();
}
