"use client";

import { useEffect, useState } from "react";

/** Returns `value` once it has stopped changing for `delayMs`. Used so typing in the search box
 * sends one request when the user pauses, not one per keystroke. */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}
