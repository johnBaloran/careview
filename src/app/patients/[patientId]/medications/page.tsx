import { MedicationsSection } from "@/features/patients/components/chart/sections";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Medications" };

export default function PatientMedicationsPage() {
  return <MedicationsSection />;
}
