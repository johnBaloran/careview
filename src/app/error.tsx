"use client";

import { ErrorState } from "@/components/feedback/ErrorState";
import { PageHeader } from "@/components/layout/PageHeader";

// App-wide error boundary for unexpected render errors. The error itself is never shown or logged
// here: its message could contain patient data. (Next.js only forwards a digest from the server.)
export default function AppError({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <>
      <PageHeader title="Something went wrong" />
      <ErrorState
        title="This page couldn't be displayed"
        message="Try again. If the problem continues, reload the page."
        onRetry={retry}
      />
    </>
  );
}
