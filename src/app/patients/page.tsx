import Typography from "@mui/material/Typography";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Patients" };

// Placeholder until the patient directory (M2).
export default function PatientsPage() {
  return (
    <Typography variant="h1" gutterBottom>
      Patients
    </Typography>
  );
}
