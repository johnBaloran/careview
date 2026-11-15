import { EmptyState } from "@/components/feedback/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { LinkButton } from "@/components/navigation/LinkButton";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <PageHeader title="Page not found" />
      <EmptyState
        title="This page doesn't exist"
        description="Check the address, or go back to the patient list."
        action={
          <LinkButton href="/patients" variant="outlined">
            Go to patients
          </LinkButton>
        }
      />
    </>
  );
}
