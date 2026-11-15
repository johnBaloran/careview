/** @jest-environment node */
import { NextRequest } from "next/server";

import { GET } from "./route";

const get = (query: string) =>
  GET(new NextRequest(`http://localhost/api/patients${query}`));

describe("GET /api/patients", () => {
  it("returns a page of patients with metadata and no-store caching", async () => {
    const response = get("?pageSize=10&page=2&sort=name");
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    const body = await response.json();
    expect(body).toMatchObject({ page: 2, pageSize: 10, total: 60 });
    expect(body.items).toHaveLength(10);
    expect(Object.keys(body.items[0]).sort()).toEqual(
      [
        "birthDate",
        "familyName",
        "givenName",
        "id",
        "mrn",
        "sex",
        "status",
      ].sort(),
    );
  });

  it("applies search and filter", async () => {
    const body = await get("?q=chen&status=active").json();
    expect(body.items.map((p: { mrn: string }) => p.mrn)).toEqual([
      "SYN-100001",
    ]);
  });

  it("rejects invalid parameters with a 400 error envelope", async () => {
    const response = get("?pageSize=7");
    expect(response.status).toBe(400);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({
      error: {
        code: "BAD_REQUEST",
        message: "pageSize must be one of 10, 20, 50",
      },
    });
  });

  it("never echoes the search text in an error", async () => {
    const name = "Maya".repeat(30);
    const response = get(`?q=${name}`);
    expect(response.status).toBe(400);
    expect(await response.text()).not.toContain("Maya");
  });
});
