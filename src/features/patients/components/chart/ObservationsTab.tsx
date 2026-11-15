"use client";

import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { LineChart } from "@mui/x-charts/LineChart";
import { useParams } from "next/navigation";
import { useState } from "react";

import { DataTable, type Column } from "@/components/data-display/DataTable";
import { SectionCard } from "@/components/data-display/SectionCard";

import { useChartResource } from "../../hooks/useChart";
import { formatDate } from "../../utils/format";
import {
  availableCodes,
  toTrendSeries,
  type TrendSeries,
} from "../../utils/observations";

import { ResourceContent } from "./ResourceContent";

import type { Observation, ObservationCode } from "../../types";

type View = "chart" | "table";
type Point = TrendSeries["points"][number];

const allColumns: Column<Observation>[] = [
  { header: "Date", render: (o) => formatDate(o.date) },
  { header: "Measurement", render: (o) => o.display },
  { header: "Value", render: (o) => `${o.value} ${o.unit}` },
];

const toUtcDate = (isoDate: string) => new Date(`${isoDate}T00:00:00Z`);

/** One-sentence summary used as the chart's accessible name. */
function describeTrend(series: TrendSeries): string {
  const first = series.points[0]!;
  const last = series.points[series.points.length - 1]!;
  const count = series.points.length;
  return `${series.display} over time: ${count} ${count === 1 ? "reading" : "readings"} from ${formatDate(first.date)} to ${formatDate(last.date)}, latest ${last.value} ${series.unit}.`;
}

function TrendChart({ series }: { series: TrendSeries }) {
  // role="img" with a text summary: screen readers get the gist; the table view has every value.
  return (
    <Box role="img" aria-label={describeTrend(series)}>
      <LineChart
        height={280}
        xAxis={[
          {
            scaleType: "utc",
            data: series.points.map((p) => toUtcDate(p.date)),
            valueFormatter: (value: Date) =>
              formatDate(value.toISOString().slice(0, 10)),
          },
        ]}
        yAxis={[{ label: series.unit }]}
        series={[
          {
            data: series.points.map((p) => p.value),
            label: series.display,
            showMark: true,
          },
        ]}
        hideLegend
      />
    </Box>
  );
}

function ObservationsView({ observations }: { observations: Observation[] }) {
  const codes = availableCodes(observations);
  const [selected, setSelected] = useState<ObservationCode>(codes[0]!);
  const [view, setView] = useState<View>("chart");
  const code = codes.includes(selected) ? selected : codes[0]!;
  const series = toTrendSeries(observations, code)!;

  const valueColumns: Column<Point>[] = [
    { header: "Date", render: (p) => formatDate(p.date) },
    { header: series.display, render: (p) => `${p.value} ${series.unit}` },
  ];

  return (
    <>
      <SectionCard title="Trend" headingId="trend-heading">
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <ToggleButtonGroup
            exclusive
            size="small"
            aria-label="Measurement"
            value={code}
            onChange={(_event, value: ObservationCode | null) =>
              value && setSelected(value)
            }
          >
            {codes.map((c) => (
              <ToggleButton key={c} value={c}>
                {toTrendSeries(observations, c)!.display}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <ToggleButtonGroup
            exclusive
            size="small"
            aria-label="View"
            value={view}
            onChange={(_event, value: View | null) => value && setView(value)}
          >
            <ToggleButton value="chart">Chart</ToggleButton>
            <ToggleButton value="table">Table</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {view === "chart" ? (
          <TrendChart series={series} />
        ) : (
          <DataTable
            label={`${series.display} readings`}
            columns={valueColumns}
            rows={[...series.points].reverse()}
          />
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {series.points.length} readings · unit: {series.unit}
        </Typography>
      </SectionCard>
      <SectionCard title="All observations" headingId="observations-heading">
        <DataTable
          label="Observations"
          columns={allColumns}
          rows={observations}
        />
      </SectionCard>
    </>
  );
}

// Fetches observations once for both the trend and the full list.
export function ObservationsTab() {
  const { patientId } = useParams<{ patientId: string }>();
  const { status, data, retry } = useChartResource(patientId, "observations");
  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <ResourceContent
        status={status}
        items={data?.items}
        retry={retry}
        noun="observations"
        emptyTitle="No observations"
      >
        {(items) => <ObservationsView observations={items} />}
      </ResourceContent>
    </Box>
  );
}
