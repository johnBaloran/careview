import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { StatusChip } from "@/components/data-display/StatusChip";

import {
  ageInYears,
  formatDate,
  formatPatientName,
  formatSex,
  formatStatus,
} from "../../utils/format";

import type { PatientSummary } from "../../types";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" component="dt">
        {label}
      </Typography>
      <Typography component="dd" sx={{ m: 0, fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  );
}

// Shown on every chart tab so the clinician always knows whose chart is open.
export function PatientBanner({ patient }: { patient: PatientSummary }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h1">{formatPatientName(patient)}</Typography>
        <StatusChip
          label={formatStatus(patient.status)}
          tone={patient.status === "active" ? "positive" : "neutral"}
        />
      </Box>
      <Box
        component="dl"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 2, sm: 4 },
          mt: 1.5,
          mb: 0,
        }}
      >
        <Detail label="MRN" value={patient.mrn} />
        <Detail
          label="Date of birth"
          value={`${formatDate(patient.birthDate)} (${ageInYears(patient.birthDate, new Date())} y)`}
        />
        <Detail label="Sex" value={formatSex(patient.sex)} />
      </Box>
    </Paper>
  );
}
