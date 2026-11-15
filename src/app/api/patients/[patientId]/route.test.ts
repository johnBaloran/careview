/** @jest-environment node */
import { NextRequest } from "next/server";

import { GET as getConditions } from "./conditions/route";
import { GET as getEncounters } from "./encounters/route";
import { GET as getMedications } from "./medications/route";
import { GET as getObservations } from "./observations/route";
import { GET as getPatient } from "./route";

// Each handler's context is typed to its own route; `never` lets one helper call them all.
type Handler = (request: NextRequest, ctx: never) => Promise<Response>;
const call = (handler: Handler, patientId: string) =>
  handler(new NextRequest(`http://localhost/api/patients/${patientId}`), {
    params: Promise.resolve({ patientId }),
  } as never);

describe("GET /api/patients/{id}", () => {
  it("returns the patient, uncached", async () => {
    const response = await call(getPatient, "pt-001");
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toMatchObject({
      id: "pt-001",
      mrn: "SYN-100001",
    });
  });

  it("answers 404 with the error envelope for an unknown patient", async () => {
    const response = await call(getPatient, "pt-999");
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: { code: "NOT_FOUND", message: "Patient not found" },
    });
  });
});

describe.each([
  ["conditions", getConditions],
  ["encounters", getEncounters],
  ["observations", getObservations],
  ["medications", getMedications],
] as const)("GET /api/patients/{id}/%s", (_name, handler) => {
  it("returns an items envelope, uncached", async () => {
    const response = await call(handler, "pt-001");
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    const body = await response.json();
    expect(Array.isArray(body.items)).toBe(true);
  });

  it("answers 404 for an unknown patient", async () => {
    expect((await call(handler, "pt-999")).status).toBe(404);
  });
});
