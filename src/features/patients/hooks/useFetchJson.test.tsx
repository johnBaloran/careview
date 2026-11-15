import { act, renderHook } from "@testing-library/react";

import { useFetchJson } from "./useFetchJson";

type Pending = {
  url: string;
  signal: AbortSignal;
  resolve: (body: unknown, status?: number) => void;
};
let pending: Pending[] = [];

beforeEach(() => {
  pending = [];
  global.fetch = jest.fn(
    (url: string, init: RequestInit) =>
      new Promise((resolve) => {
        pending.push({
          url,
          signal: init.signal as AbortSignal,
          resolve: (body, status = 200) =>
            resolve({
              ok: status < 400,
              status,
              json: async () => body,
            } as Response),
        });
      }),
  ) as unknown as typeof fetch;
});

describe("useFetchJson", () => {
  it("reports the HTTP status of a failure, so callers can tell 404 from other errors", async () => {
    const { result } = renderHook(() => useFetchJson("/api/patients/pt-999"));
    await act(async () =>
      pending[0]!.resolve({ error: { code: "NOT_FOUND" } }, 404),
    );
    expect(result.current).toMatchObject({
      status: "error",
      httpStatus: 404,
      data: undefined,
    });
  });

  it("by default shows no data while a different URL loads (no wrong-patient display)", async () => {
    const { result, rerender } = renderHook(
      (url: string) => useFetchJson(url),
      {
        initialProps: "/api/patients/pt-001",
      },
    );
    await act(async () => pending[0]!.resolve({ id: "pt-001" }));
    expect(result.current.data).toEqual({ id: "pt-001" });

    rerender("/api/patients/pt-002");
    expect(result.current).toMatchObject({
      status: "loading",
      data: undefined,
    });
  });

  it("keeps the previous data while loading when asked to", async () => {
    const { result, rerender } = renderHook(
      (url: string) => useFetchJson(url, { keepPreviousData: true }),
      { initialProps: "/api/patients?page=1" },
    );
    await act(async () => pending[0]!.resolve({ page: 1 }));
    rerender("/api/patients?page=2");
    expect(result.current).toMatchObject({
      status: "loading",
      data: { page: 1 },
    });
  });

  it("ignores a response that arrives after its request was aborted", async () => {
    const { result, rerender } = renderHook(
      (url: string) => useFetchJson(url),
      {
        initialProps: "/a",
      },
    );
    rerender("/b");
    expect(pending[0]!.signal.aborted).toBe(true);
    await act(async () => pending[1]!.resolve("b"));
    await act(async () => pending[0]!.resolve("a"));
    expect(result.current.data).toBe("b");
  });
});
