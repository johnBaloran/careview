import Typography from "@mui/material/Typography";

import type { Metadata } from "next";

// Titles stay generic: a patient's name in the tab title would land in browser history.
export const metadata: Metadata = { title: "Patient chart" };

// Placeholder until the summary section (M3c).
export default function PatientSummaryPage() {
  return (
    <Typography color="text.secondary">Choose a section above.</Typography>
  );
}
