"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import NextLink from "next/link";
import { useParams } from "next/navigation";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";

import { usePatient } from "../../hooks/useChart";

import { ChartSectionNav } from "./ChartSectionNav";
import { PatientBanner } from "./PatientBanner";

import type { ReactNode } from "react";

// Wraps every chart tab: loads the patient once (the layout persists across tab changes) and
// renders the sections only once the patient is known.
export function PatientChartLayout({ children }: { children: ReactNode }) {
  const { patientId } = useParams<{ patientId: string }>();
  const { status, data: patient, httpStatus, retry } = usePatient(patientId);

  const backLink = (
    <Button
      component={NextLink}
      href="/patients"
      startIcon={<ArrowBackIcon />}
      sx={{ mb: 1 }}
    >
      All patients
    </Button>
  );

  if (status === "error" && httpStatus === 404) {
    return (
      <EmptyState
        title="Patient not found"
        description="This patient doesn't exist or is no longer available."
        action={
          <Button component={NextLink} href="/patients" variant="outlined">
            Back to patients
          </Button>
        }
      />
    );
  }

  if (status === "error") {
    return (
      <>
        {backLink}
        <ErrorState
          title="Couldn't load this patient"
          message="Check your connection and try again."
          onRetry={retry}
        />
      </>
    );
  }

  if (!patient) {
    return <LoadingState label="Loading patient…" />;
  }

  return (
    <>
      {backLink}
      <PatientBanner patient={patient} />
      <ChartSectionNav patientId={patient.id} />
      {children}
    </>
  );
}
