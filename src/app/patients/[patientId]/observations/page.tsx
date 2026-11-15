import { ObservationsTab } from "@/features/patients/components/chart/ObservationsTab";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Observations" };

export default function PatientObservationsPage() {
  return <ObservationsTab />;
}
