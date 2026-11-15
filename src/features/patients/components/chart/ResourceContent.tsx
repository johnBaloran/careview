import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";

import type { RequestStatus } from "../../hooks/useFetchJson";
import type { ReactNode } from "react";

type ResourceContentProps<T> = {
  status: RequestStatus;
  items: T[] | undefined;
  retry: () => void;
  /** Lower-case plural for messages, e.g. "conditions". */
  noun: string;
  emptyTitle: string;
  children: (items: T[]) => ReactNode;
};

// The four request states for one chart resource, shared by the section tabs and summary cards.
export function ResourceContent<T>({
  status,
  items,
  retry,
  noun,
  emptyTitle,
  children,
}: ResourceContentProps<T>) {
  if (status === "error")
    return <ErrorState title={`Couldn't load ${noun}`} onRetry={retry} />;
  if (!items) return <LoadingState label={`Loading ${noun}…`} />;
  if (items.length === 0) return <EmptyState title={emptyTitle} />;
  return <>{children(items)}</>;
}
