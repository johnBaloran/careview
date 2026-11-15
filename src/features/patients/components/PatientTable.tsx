"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import MuiLink from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import NextLink from "next/link";

import {
  PAGE_SIZES,
  type PageSize,
  type PatientSort,
  type PatientSummary,
} from "../types";
import {
  ageInYears,
  formatBirthDate,
  formatPatientName,
  formatSex,
  formatStatus,
} from "../utils/format";

import type { MouseEvent } from "react";

type SortKey = "name" | "birthDate";

type PatientTableProps = {
  rows: PatientSummary[];
  total: number;
  page: number;
  pageSize: PageSize;
  sort: PatientSort;
  /** True while a newer page is loading; the current rows stay visible. */
  refreshing: boolean;
  onSortChange: (sort: PatientSort) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: PageSize) => void;
  onOpenPatient: (id: string) => void;
};

function SortableHeader(props: {
  label: string;
  sortKey: SortKey;
  sort: PatientSort;
  onSortChange: (sort: PatientSort) => void;
}) {
  const { label, sortKey, sort, onSortChange } = props;
  const active = sort.replace(/^-/, "") === sortKey;
  const direction = active && sort.startsWith("-") ? "desc" : "asc";
  // Clicking the active column flips it; clicking another column sorts it ascending.
  const next: PatientSort =
    active && direction === "asc" ? `-${sortKey}` : sortKey;
  return (
    <TableCell sortDirection={active ? direction : false}>
      <TableSortLabel
        active={active}
        direction={direction}
        onClick={() => onSortChange(next)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
}

export function PatientTable(props: PatientTableProps) {
  const { rows, total, page, pageSize, sort, refreshing, onSortChange } = props;
  const today = new Date();

  // Mouse convenience: clicking anywhere on a row opens the chart. Keyboard and screen-reader
  // users get a real link on the patient's name; clicks on that link are left to the link.
  const handleRowClick = (
    event: MouseEvent<HTMLTableRowElement>,
    id: string,
  ) => {
    if ((event.target as HTMLElement).closest("a")) return;
    props.onOpenPatient(id);
  };

  return (
    <Paper variant="outlined">
      <Box sx={{ height: 4 }}>
        {refreshing ? <LinearProgress aria-label="Loading patients" /> : null}
      </Box>
      <TableContainer>
        <Table size="small" aria-label="Patients" aria-busy={refreshing}>
          <TableHead>
            <TableRow>
              <SortableHeader
                label="Name"
                sortKey="name"
                sort={sort}
                onSortChange={onSortChange}
              />
              <TableCell>MRN</TableCell>
              <SortableHeader
                label="Date of birth"
                sortKey="birthDate"
                sort={sort}
                onSortChange={onSortChange}
              />
              <TableCell>Sex</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((patient) => (
              <TableRow
                key={patient.id}
                hover
                onClick={(event) => handleRowClick(event, patient.id)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>
                  <MuiLink
                    component={NextLink}
                    href={`/patients/${patient.id}`}
                    underline="hover"
                  >
                    {formatPatientName(patient)}
                  </MuiLink>
                </TableCell>
                <TableCell sx={{ fontFamily: "monospace" }}>
                  {patient.mrn}
                </TableCell>
                <TableCell>
                  {formatBirthDate(patient.birthDate)} (
                  {ageInYears(patient.birthDate, today)} y)
                </TableCell>
                <TableCell>{formatSex(patient.sex)}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    variant="outlined"
                    color={patient.status === "active" ? "success" : "default"}
                    label={formatStatus(patient.status)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[...PAGE_SIZES]}
        onPageChange={(_event, zeroBasedPage) =>
          props.onPageChange(zeroBasedPage + 1)
        }
        onRowsPerPageChange={(event) =>
          props.onPageSizeChange(Number(event.target.value) as PageSize)
        }
      />
    </Paper>
  );
}
