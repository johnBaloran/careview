/** @jest-environment node */
import { parseListParams } from "./parseListParams";

const parse = (query: string) => parseListParams(new URLSearchParams(query));

describe("parseListParams", () => {
  it("applies defaults when nothing is given", () => {
    expect(parse("")).toEqual({
      ok: true,
      params: {
        q: undefined,
        status: undefined,
        page: 1,
        pageSize: 20,
        sort: "name",
      },
    });
  });

  it("accepts every valid parameter", () => {
    expect(
      parse("q=chen&status=inactive&page=3&pageSize=50&sort=-birthDate"),
    ).toEqual({
      ok: true,
      params: {
        q: "chen",
        status: "inactive",
        page: 3,
        pageSize: 50,
        sort: "-birthDate",
      },
    });
  });

  it("trims the search and treats a blank search as none", () => {
    expect(parse("q=%20%20chen%20")).toMatchObject({
      ok: true,
      params: { q: "chen" },
    });
    expect(parse("q=%20%20")).toMatchObject({
      ok: true,
      params: { q: undefined },
    });
  });

  it.each([
    ["status=all", "status must be 'active' or 'inactive'"],
    ["page=0", "page must be a whole number from 1"],
    ["page=1.5", "page must be a whole number from 1"],
    ["page=abc", "page must be a whole number from 1"],
    ["pageSize=25", "pageSize must be one of 10, 20, 50"],
    ["sort=mrn", "sort must be one of name, -name, birthDate, -birthDate"],
  ])("rejects %s", (query, message) => {
    expect(parse(query)).toEqual({ ok: false, message });
  });

  it("rejects an over-long search without echoing it", () => {
    const longQuery = "Chen".repeat(30);
    const result = parse(`q=${longQuery}`);
    expect(result).toEqual({
      ok: false,
      message: "q must be at most 100 characters",
    });
  });
});
