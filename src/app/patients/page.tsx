import { PageHeader } from "@/components/layout/PageHeader";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Patients" };

// Placeholder until the patient directory (M2).
export default function PatientsPage() {
  return <PageHeader title="Patients" />;
}
