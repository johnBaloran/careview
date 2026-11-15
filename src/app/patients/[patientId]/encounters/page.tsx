import { EncountersSection } from "@/features/patients/components/chart/sections";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Encounters" };

export default function PatientEncountersPage() {
  return <EncountersSection />;
}
