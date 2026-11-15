"use client";

import { StatusChip } from "@/components/data-display/StatusChip";

import { formatDate } from "../../utils/format";

import { ChartSection } from "./ChartSection";

import type { Column } from "@/components/data-display/DataTable";
import type {
  Condition,
  Encounter,
  MedicationRequest,
  Observation,
} from "../../types";

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

const observationColumns: Column<Observation>[] = [
  { header: "Date", render: (o) => formatDate(o.date) },
  { header: "Measurement", render: (o) => o.display },
  { header: "Value", render: (o) => `${o.value} ${o.unit}` },
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
export const ObservationsSection = () => (
  <ChartSection
    title="Observations"
    resource="observations"
    columns={observationColumns}
    emptyTitle="No observations"
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
