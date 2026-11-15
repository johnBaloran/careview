"use client";

import Button from "@mui/material/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";

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

import { PatientTable } from "./PatientTable";

// Owns the directory's list state. Page, page size, sort and status live in the URL (shareable,
// survive refresh); the fetched data lives only in usePatients.
export function PatientDirectory() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = readDirectoryParams(searchParams);
  const { status, data, retry } = usePatients(params);

  const updateUrl = (changes: Partial<DirectoryParams>) => {
    const next = { ...params, ...changes };
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

  if (status === "error") {
    return (
      <ErrorState
        title="Couldn't load patients"
        message="Check your connection and try again."
        onRetry={retry}
      />
    );
  }

  if (!data) {
    return <LoadingState label="Loading patients…" />;
  }

  if (data.total === 0) {
    return <EmptyState title="No patients found" />;
  }

  if (data.items.length === 0) {
    return (
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
  }

  return (
    <PatientTable
      rows={data.items}
      total={data.total}
      page={data.page}
      pageSize={data.pageSize as PageSize}
      sort={params.sort}
      refreshing={status === "loading"}
      onSortChange={(sort: PatientSort) => updateUrl({ sort, page: 1 })}
      onPageChange={(page) => updateUrl({ page })}
      onPageSizeChange={(pageSize) => updateUrl({ pageSize, page: 1 })}
      onOpenPatient={(id) => router.push(`/patients/${id}`)}
    />
  );
}
