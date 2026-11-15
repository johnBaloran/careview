"use client";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useParams } from "next/navigation";

import { DataTable, type Column } from "@/components/data-display/DataTable";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";

import { useChartResource, type ChartResourceName } from "../../hooks/useChart";

import type { ListResponse } from "../../types";

type ChartSectionProps<
  R extends ChartResourceName,
  T extends { id: string },
> = {
  title: string;
  resource: R;
  columns: Column<T>[];
  emptyTitle: string;
};

// One chart tab: its own request and its own loading, empty and error states, so a failing
// section never breaks the rest of the chart.
export function ChartSection<
  R extends ChartResourceName,
  T extends { id: string },
>({ title, resource, columns, emptyTitle }: ChartSectionProps<R, T>) {
  const { patientId } = useParams<{ patientId: string }>();
  const { status, data, retry } = useChartResource(patientId, resource);
  const rows = (data as ListResponse<T> | undefined)?.items;

  let content;
  if (status === "error") {
    content = (
      <ErrorState
        title={`Couldn't load ${title.toLowerCase()}`}
        onRetry={retry}
      />
    );
  } else if (!rows) {
    content = <LoadingState label={`Loading ${title.toLowerCase()}…`} />;
  } else if (rows.length === 0) {
    content = <EmptyState title={emptyTitle} />;
  } else {
    content = <DataTable label={title} columns={columns} rows={rows} />;
  }

  return (
    <Paper
      component="section"
      variant="outlined"
      aria-labelledby={`${resource}-heading`}
      sx={{ p: 2 }}
    >
      <Typography variant="h2" id={`${resource}-heading`} sx={{ mb: 1 }}>
        {title}
      </Typography>
      {content}
    </Paper>
  );
}
