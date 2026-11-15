"use client";

import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import type { PatientStatus } from "../types";

export type StatusFilter = PatientStatus | "all";

type PatientSearchFormProps = {
  query: string;
  onQueryChange: (query: string) => void;
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
};

// Presentational and controlled: the directory owns both values.
export function PatientSearchForm({
  query,
  onQueryChange,
  status,
  onStatusChange,
}: PatientSearchFormProps) {
  return (
    <Box
      component="form"
      role="search"
      aria-label="Patients"
      // Results update as the user types; Enter shouldn't reload the page.
      onSubmit={(event) => event.preventDefault()}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        mb: 2,
      }}
    >
      <TextField
        type="search"
        label="Search by name or MRN"
        size="small"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        autoComplete="off"
        sx={{ flex: "1 1 280px", maxWidth: 420 }}
        slotProps={{
          htmlInput: { maxLength: 100 },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: query ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Clear search"
                  edge="end"
                  size="small"
                  onClick={() => onQueryChange("")}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
      />
      <ToggleButtonGroup
        exclusive
        size="small"
        aria-label="Status"
        value={status}
        // Ignore a click on the selected button, which would otherwise unselect everything.
        onChange={(_event, value: StatusFilter | null) =>
          value && onStatusChange(value)
        }
      >
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="active">Active</ToggleButton>
        <ToggleButton value="inactive">Inactive</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
