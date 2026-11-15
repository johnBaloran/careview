import { ObservationsSection } from "@/features/patients/components/chart/sections";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Observations" };

export default function PatientObservationsPage() {
  return <ObservationsSection />;
}
