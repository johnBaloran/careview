"use client";

import { StatusChip } from "@/components/data-display/StatusChip";

import { formatDate } from "../../utils/format";

import { ChartSection } from "./ChartSection";

import type { Column } from "@/components/data-display/DataTable";
import type { Condition, Encounter, MedicationRequest } from "../../types";

const conditionColumns: Column<Condition>[] = [
  { header: "Condition", render: (c) => c.display },
  {
    header: "Status",
    render: (c) => (
      <StatusChip
        label={c.clinicalStatus === "active" ? "Active" : "Resolved"}
        tone={c.clinicalStatus === "active" ? "positive" : "neutral"}
      />
    ),
  },
  { header: "Onset", render: (c) => formatDate(c.onsetDate) },
];

const encounterColumns: Column<Encounter>[] = [
  { header: "Date", render: (e) => formatDate(e.date) },
  { header: "Type", render: (e) => e.type },
  { header: "Reason", render: (e) => e.reason },
  {
    header: "Status",
    render: (e) => (
      <StatusChip
        label={e.status === "planned" ? "Planned" : "Finished"}
        tone={e.status === "planned" ? "info" : "neutral"}
      />
    ),
  },
];

const medicationColumns: Column<MedicationRequest>[] = [
  { header: "Medication", render: (m) => m.medication },
  { header: "Dosage", render: (m) => m.dosage },
  {
    header: "Status",
    render: (m) => (
      <StatusChip
        label={m.status === "active" ? "Active" : "Stopped"}
        tone={m.status === "active" ? "positive" : "neutral"}
      />
    ),
  },
  { header: "Started", render: (m) => formatDate(m.authoredOn) },
];

export const ConditionsSection = () => (
  <ChartSection
    title="Conditions"
    resource="conditions"
    columns={conditionColumns}
    emptyTitle="No recorded conditions"
  />
);
export const EncountersSection = () => (
  <ChartSection
    title="Encounters"
    resource="encounters"
    columns={encounterColumns}
    emptyTitle="No encounters"
  />
);
export const MedicationsSection = () => (
  <ChartSection
    title="Medications"
    resource="medications"
    columns={medicationColumns}
    emptyTitle="No medications"
  />
);
