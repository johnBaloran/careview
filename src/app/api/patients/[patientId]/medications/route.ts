import { json, patientNotFound } from "@/server/http";
import { getMedications } from "@/server/patients/chart";

import type { NextRequest } from "next/server";

// GET /api/patients/{patientId}/medications
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/patients/[patientId]/medications">,
) {
  const { patientId } = await ctx.params;
  const items = getMedications(patientId);
  return items ? json({ items }) : patientNotFound();
}
