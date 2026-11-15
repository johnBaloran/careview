import { Suspense } from "react";

import { LoadingState } from "@/components/feedback/LoadingState";
import { PageHeader } from "@/components/layout/PageHeader";
import { PatientDirectory } from "@/features/patients/components/PatientDirectory";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Patients" };

export default function PatientsPage() {
  return (
    <>
      <PageHeader
        title="Patients"
        description="Find a patient and open their chart."
      />
      {/* PatientDirectory reads the URL's search params, so it renders inside Suspense. */}
      <Suspense fallback={<LoadingState label="Loading patients…" />}>
        <PatientDirectory />
      </Suspense>
    </>
  );
}
