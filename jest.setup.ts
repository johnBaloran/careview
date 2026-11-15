import v8 from "node:v8";

import "@testing-library/jest-dom";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// jsdom has no IntersectionObserver. Without one, next/link falls back to a timer that
// updates state outside act() and floods the output with warnings. This inert stub keeps
// next/link on its observer path; prefetching itself isn't under test.
class InertIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
globalThis.IntersectionObserver =
  InertIntersectionObserver as unknown as typeof IntersectionObserver;

// jsdom has no ResizeObserver; charts use it to measure their container. Inert stub.
class InertResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver =
  InertResizeObserver as unknown as typeof ResizeObserver;

// jsdom doesn't expose structuredClone (browsers and Node do); MUI X Charts' gesture handling uses
// it. Node's v8 serializer implements the same structured-clone algorithm.
if (typeof globalThis.structuredClone !== "function") {
  globalThis.structuredClone = ((value: unknown) =>
    v8.deserialize(v8.serialize(value))) as typeof structuredClone;
}
