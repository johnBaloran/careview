import { json, patientNotFound } from "@/server/http";
import { getEncounters } from "@/server/patients/chart";

import type { NextRequest } from "next/server";

// GET /api/patients/{patientId}/encounters
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/patients/[patientId]/encounters">,
) {
  const { patientId } = await ctx.params;
  const items = getEncounters(patientId);
  return items ? json({ items }) : patientNotFound();
}
