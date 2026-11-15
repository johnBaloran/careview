import { ChartSummary } from "@/features/patients/components/chart/ChartSummary";

import type { Metadata } from "next";

// Titles stay generic: a patient's name in the tab title would land in browser history.
export const metadata: Metadata = { title: "Patient chart" };

export default function PatientSummaryPage() {
  return <ChartSummary />;
}
