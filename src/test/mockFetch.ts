type MockResponse = { status?: number; body: unknown };

/**
 * Replaces global fetch with one that answers by URL from `routes` (mutable, so a test can change
 * a response between calls, e.g. to test retry). Unknown URLs answer 404. Returns the jest mock.
 */
export function mockFetchByUrl(routes: Record<string, MockResponse>) {
  const fetchMock = jest.fn(async (url: string) => {
    const route = routes[url] ?? {
      status: 404,
      body: { error: { code: "NOT_FOUND", message: "No mock" } },
    };
    const status = route.status ?? 200;
    return {
      ok: status < 400,
      status,
      json: async () => route.body,
    } as Response;
  });
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}
