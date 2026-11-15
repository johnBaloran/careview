"use client";

import { useParams } from "next/navigation";

import { DataTable, type Column } from "@/components/data-display/DataTable";
import { SectionCard } from "@/components/data-display/SectionCard";

import { useChartResource, type ChartResourceName } from "../../hooks/useChart";

import { ResourceContent } from "./ResourceContent";

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

  return (
    <SectionCard title={title} headingId={`${resource}-heading`}>
      <ResourceContent
        status={status}
        items={rows}
        retry={retry}
        noun={title.toLowerCase()}
        emptyTitle={emptyTitle}
      >
        {(items) => <DataTable label={title} columns={columns} rows={items} />}
      </ResourceContent>
    </SectionCard>
  );
}
