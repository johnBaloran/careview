import { act, renderHook, waitFor } from "@testing-library/react";

import { toPatientsQuery, usePatients } from "./usePatients";

import type { PatientListParams, PatientListResponse } from "../types";

const params: PatientListParams = { page: 1, pageSize: 20, sort: "name" };
const page = (total: number): PatientListResponse => ({
  items: [],
  total,
  page: 1,
  pageSize: 20,
});

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

describe("toPatientsQuery", () => {
  it("builds a stable query string and omits empty filters", () => {
    expect(toPatientsQuery(params)).toBe("page=1&pageSize=20&sort=name");
    expect(toPatientsQuery({ ...params, q: "chen", status: "active" })).toBe(
      "q=chen&status=active&page=1&pageSize=20&sort=name",
    );
  });
});

describe("usePatients", () => {
  it("loads, then exposes the data", async () => {
    const { result } = renderHook(() => usePatients(params));
    expect(result.current.status).toBe("loading");
    expect(pending[0]?.url).toBe("/api/patients?page=1&pageSize=20&sort=name");

    await act(async () => pending[0]!.resolve(page(60)));
    expect(result.current).toMatchObject({
      status: "success",
      data: { total: 60 },
    });
  });

  it("aborts the previous request when params change and ignores its late response", async () => {
    const { result, rerender } = renderHook(
      (p: PatientListParams) => usePatients(p),
      {
        initialProps: params,
      },
    );
    rerender({ ...params, page: 2 });
    expect(pending).toHaveLength(2);
    expect(pending[0]!.signal.aborted).toBe(true);

    await act(async () => pending[1]!.resolve({ ...page(60), page: 2 }));
    await act(async () => pending[0]!.resolve(page(999)));
    expect(result.current.data).toMatchObject({ page: 2, total: 60 });
  });

  it("keeps the previous page while the next one loads", async () => {
    const { result, rerender } = renderHook(
      (p: PatientListParams) => usePatients(p),
      {
        initialProps: params,
      },
    );
    await act(async () => pending[0]!.resolve(page(60)));
    rerender({ ...params, page: 2 });
    expect(result.current.status).toBe("loading");
    expect(result.current.data).toMatchObject({ total: 60 });
  });

  it("reports an error for a failed response, and retry fetches again", async () => {
    const { result } = renderHook(() => usePatients(params));
    await act(async () => pending[0]!.resolve({ error: {} }, 500));
    expect(result.current.status).toBe("error");

    act(() => result.current.retry());
    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(pending).toHaveLength(2));
    await act(async () => pending[1]!.resolve(page(60)));
    expect(result.current.status).toBe("success");
  });

  it("aborts the request on unmount", () => {
    const { unmount } = renderHook(() => usePatients(params));
    unmount();
    expect(pending[0]!.signal.aborted).toBe(true);
  });
});
