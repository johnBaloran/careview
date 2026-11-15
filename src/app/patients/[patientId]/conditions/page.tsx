import { ConditionsSection } from "@/features/patients/components/chart/sections";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Conditions" };

export default function PatientConditionsPage() {
  return <ConditionsSection />;
}
