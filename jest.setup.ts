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
