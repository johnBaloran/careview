import { act, renderHook } from "@testing-library/react";

import { useDebouncedValue } from "./useDebouncedValue";

describe("useDebouncedValue", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("updates only after the value has been stable for the delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      {
        initialProps: { value: "" },
      },
    );
    rerender({ value: "c" });
    act(() => jest.advanceTimersByTime(200));
    rerender({ value: "ch" });
    act(() => jest.advanceTimersByTime(200));
    expect(result.current).toBe(""); // still typing: the timer restarted

    act(() => jest.advanceTimersByTime(100));
    expect(result.current).toBe("ch");
  });
});
