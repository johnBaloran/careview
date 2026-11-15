import { json, patientNotFound } from "@/server/http";
import { getPatient } from "@/server/patients/chart";

import type { NextRequest } from "next/server";

// GET /api/patients/{patientId}
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/patients/[patientId]">,
) {
  const { patientId } = await ctx.params;
  const patient = getPatient(patientId);
  return patient ? json(patient) : patientNotFound();
}
