import { readDirectoryParams } from "./directoryParams";

const read = (query: string) => readDirectoryParams(new URLSearchParams(query));

describe("readDirectoryParams", () => {
  it("uses defaults for an empty URL", () => {
    expect(read("")).toEqual({
      page: 1,
      pageSize: 20,
      sort: "name",
      status: undefined,
    });
  });

  it("reads valid values", () => {
    expect(read("page=3&pageSize=50&sort=-birthDate&status=inactive")).toEqual({
      page: 3,
      pageSize: 50,
      sort: "-birthDate",
      status: "inactive",
    });
  });

  it("falls back to defaults for invalid values", () => {
    expect(read("page=-2&pageSize=7&sort=mrn&status=all")).toEqual({
      page: 1,
      pageSize: 20,
      sort: "name",
      status: undefined,
    });
  });
});
