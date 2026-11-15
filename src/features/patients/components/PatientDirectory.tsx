"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";

import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { usePatients } from "../hooks/usePatients";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT,
  type PageSize,
  type PatientSort,
} from "../types";
import {
  readDirectoryParams,
  type DirectoryParams,
} from "../utils/directoryParams";

import { PatientSearchForm, type StatusFilter } from "./PatientSearchForm";
import { PatientTable } from "./PatientTable";

// Explicit px: in MUI's sx a number <= 1 is a fraction (width: 1 would mean 100%).
const visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  margin: "-1px",
  padding: 0,
  border: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;

// Owns the directory's list state:
// - page, page size, sort and status live in the URL (shareable, survive refresh);
// - search text lives here only, because a name or MRN must never appear in a URL;
// - fetched data lives only in usePatients.
export function PatientDirectory() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const urlParams = readDirectoryParams(searchParams);

  const [searchText, setSearchText] = useState("");
  const q = useDebouncedValue(searchText.trim(), 300) || undefined;
  const { status, data, retry } = usePatients({ ...urlParams, q });

  const updateUrl = (changes: Partial<DirectoryParams>) => {
    const next = { ...urlParams, ...changes };
    const query = new URLSearchParams();
    // Defaults stay out of the URL so it remains short and readable.
    if (next.status) query.set("status", next.status);
    if (next.page > 1) query.set("page", String(next.page));
    if (next.pageSize !== DEFAULT_PAGE_SIZE)
      query.set("pageSize", String(next.pageSize));
    if (next.sort !== DEFAULT_SORT) query.set("sort", next.sort);
    const search = query.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, {
      scroll: false,
    });
  };

  const handleQueryChange = (value: string) => {
    setSearchText(value);
    // A new search starts from the first page.
    if (urlParams.page > 1) updateUrl({ page: 1 });
  };

  const clearSearchAndFilters = () => {
    setSearchText("");
    updateUrl({ status: undefined, page: 1 });
  };

  const isFiltered = Boolean(q || urlParams.status);

  let content;
  if (status === "error") {
    content = (
      <ErrorState
        title="Couldn't load patients"
        message="Check your connection and try again."
        onRetry={retry}
      />
    );
  } else if (!data) {
    content = <LoadingState label="Loading patients…" />;
  } else if (data.total === 0) {
    content = isFiltered ? (
      <EmptyState
        title="No patients match"
        description="Try a different name or MRN, or clear the search and filters."
        action={
          <Button onClick={clearSearchAndFilters}>
            Clear search and filters
          </Button>
        }
      />
    ) : (
      <EmptyState title="No patients found" />
    );
  } else if (data.items.length === 0) {
    content = (
      <EmptyState
        title="No patients on this page"
        description="The list is shorter than this page number."
        action={
          <Button onClick={() => updateUrl({ page: 1 })}>
            Go to the first page
          </Button>
        }
      />
    );
  } else {
    content = (
      <>
        {status === "success" ? (
          <Box role="status" sx={visuallyHidden}>
            {data.total === 1 ? "1 patient" : `${data.total} patients`}
          </Box>
        ) : null}
        <PatientTable
          rows={data.items}
          total={data.total}
          page={data.page}
          pageSize={data.pageSize as PageSize}
          sort={urlParams.sort}
          refreshing={status === "loading"}
          onSortChange={(sort: PatientSort) => updateUrl({ sort, page: 1 })}
          onPageChange={(page) => updateUrl({ page })}
          onPageSizeChange={(pageSize) => updateUrl({ pageSize, page: 1 })}
          onOpenPatient={(id) => router.push(`/patients/${id}`)}
        />
      </>
    );
  }

  return (
    <>
      <PatientSearchForm
        query={searchText}
        onQueryChange={handleQueryChange}
        status={urlParams.status ?? "all"}
        onStatusChange={(value: StatusFilter) =>
          updateUrl({ status: value === "all" ? undefined : value, page: 1 })
        }
      />
      {content}
    </>
  );
}
