"use client";

import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { useParams } from "next/navigation";

import { SectionCard } from "@/components/data-display/SectionCard";
import { StatusChip } from "@/components/data-display/StatusChip";

import { useChartResource } from "../../hooks/useChart";
import { formatDate } from "../../utils/format";
import { latestByCode } from "../../utils/observations";

import { ResourceContent } from "./ResourceContent";

import type { ReactNode } from "react";

function ViewAll({ href, label }: { href: string; label: string }) {
  return (
    <MuiLink
      component={NextLink}
      href={href}
      variant="body2"
      aria-label={label}
    >
      View all
    </MuiLink>
  );
}

function ItemList({ children }: { children: ReactNode }) {
  return (
    <Box
      component="ul"
      sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.25 }}
    >
      {children}
    </Box>
  );
}

function Item({
  primary,
  secondary,
  extra,
}: {
  primary: string;
  secondary: string;
  extra?: ReactNode;
}) {
  return (
    <Box
      component="li"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 500 }}>{primary}</Typography>
        <Typography variant="body2" color="text.secondary">
          {secondary}
        </Typography>
      </Box>
      {extra}
    </Box>
  );
}

// Each card makes its own request, so one failing card never hides the others.
function ActiveConditionsCard({
  base,
  patientId,
}: {
  base: string;
  patientId: string;
}) {
  const { status, data, retry } = useChartResource(patientId, "conditions");
  const active = data?.items.filter((c) => c.clinicalStatus === "active");
  return (
    <SectionCard
      title="Active conditions"
      headingId="summary-conditions-heading"
      action={
        <ViewAll href={`${base}/conditions`} label="View all conditions" />
      }
    >
      <ResourceContent
        status={status}
        items={active}
        retry={retry}
        noun="conditions"
        emptyTitle="No active conditions"
      >
        {(items) => (
          <ItemList>
            {items.map((c) => (
              <Item
                key={c.id}
                primary={c.display}
                secondary={`Since ${formatDate(c.onsetDate)}`}
              />
            ))}
          </ItemList>
        )}
      </ResourceContent>
    </SectionCard>
  );
}

function RecentEncountersCard({
  base,
  patientId,
}: {
  base: string;
  patientId: string;
}) {
  const { status, data, retry } = useChartResource(patientId, "encounters");
  // The API lists newest first: show any upcoming visit, then the last three finished ones.
  const visible = data && [
    ...data.items.filter((e) => e.status === "planned").reverse(),
    ...data.items.filter((e) => e.status === "finished").slice(0, 3),
  ];
  return (
    <SectionCard
      title="Encounters"
      headingId="summary-encounters-heading"
      action={
        <ViewAll href={`${base}/encounters`} label="View all encounters" />
      }
    >
      <ResourceContent
        status={status}
        items={visible}
        retry={retry}
        noun="encounters"
        emptyTitle="No encounters"
      >
        {(items) => (
          <ItemList>
            {items.map((e) => (
              <Item
                key={e.id}
                primary={e.type}
                secondary={`${formatDate(e.date)} · ${e.reason}`}
                extra={
                  e.status === "planned" ? (
                    <StatusChip label="Upcoming" tone="info" />
                  ) : undefined
                }
              />
            ))}
          </ItemList>
        )}
      </ResourceContent>
    </SectionCard>
  );
}

function LatestVitalsCard({
  base,
  patientId,
}: {
  base: string;
  patientId: string;
}) {
  const { status, data, retry } = useChartResource(patientId, "observations");
  const latest = data && latestByCode(data.items);
  return (
    <SectionCard
      title="Latest vitals"
      headingId="summary-vitals-heading"
      action={
        <ViewAll href={`${base}/observations`} label="View all observations" />
      }
    >
      <ResourceContent
        status={status}
        items={latest}
        retry={retry}
        noun="observations"
        emptyTitle="No observations"
      >
        {(items) => (
          <ItemList>
            {items.map((o) => (
              <Item
                key={o.id}
                primary={`${o.display}: ${o.value} ${o.unit}`}
                secondary={formatDate(o.date)}
              />
            ))}
          </ItemList>
        )}
      </ResourceContent>
    </SectionCard>
  );
}

export function ChartSummary() {
  const { patientId } = useParams<{ patientId: string }>();
  const base = `/patients/${patientId}`;
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", lg: "repeat(3, 1fr)" },
      }}
    >
      <ActiveConditionsCard base={base} patientId={patientId} />
      <RecentEncountersCard base={base} patientId={patientId} />
      <LatestVitalsCard base={base} patientId={patientId} />
    </Box>
  );
}
