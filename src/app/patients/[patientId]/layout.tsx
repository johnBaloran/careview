import { Suspense } from "react";

import { LoadingState } from "@/components/feedback/LoadingState";
import { PatientChartLayout } from "@/features/patients/components/chart/PatientChartLayout";

// The chart reads the patient id with useParams (request-time data), so it renders inside Suspense.
export default function PatientChartRouteLayout({
  children,
}: LayoutProps<"/patients/[patientId]">) {
  return (
    <Suspense fallback={<LoadingState label="Loading patient…" />}>
      <PatientChartLayout>{children}</PatientChartLayout>
    </Suspense>
  );
}
