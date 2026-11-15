import { screen } from "@testing-library/react";
import { axe } from "jest-axe";

import { renderWithTheme } from "@/test/render";

import { PatientSearchForm } from "./PatientSearchForm";

const noop = () => {};

describe("PatientSearchForm", () => {
  it("is a labelled search landmark with a controlled search box", async () => {
    const onQueryChange = jest.fn();
    const { user } = renderWithTheme(
      <PatientSearchForm
        query=""
        onQueryChange={onQueryChange}
        status="all"
        onStatusChange={noop}
      />,
    );
    expect(
      screen.getByRole("search", { name: "Patients" }),
    ).toBeInTheDocument();
    await user.type(
      screen.getByRole("searchbox", { name: "Search by name or MRN" }),
      "c",
    );
    expect(onQueryChange).toHaveBeenCalledWith("c");
  });

  it("shows a clear button only when there is text", () => {
    const { rerender } = renderWithTheme(
      <PatientSearchForm
        query=""
        onQueryChange={noop}
        status="all"
        onStatusChange={noop}
      />,
    );
    expect(
      screen.queryByRole("button", { name: "Clear search" }),
    ).not.toBeInTheDocument();
    rerender(
      <PatientSearchForm
        query="chen"
        onQueryChange={noop}
        status="all"
        onStatusChange={noop}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Clear search" }),
    ).toBeInTheDocument();
  });

  it("ignores a click on the already-selected status", async () => {
    const onStatusChange = jest.fn();
    const { user } = renderWithTheme(
      <PatientSearchForm
        query=""
        onQueryChange={noop}
        status="active"
        onStatusChange={onStatusChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Active" }));
    expect(onStatusChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Inactive" }));
    expect(onStatusChange).toHaveBeenCalledWith("inactive");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderWithTheme(
      <PatientSearchForm
        query="chen"
        onQueryChange={noop}
        status="all"
        onStatusChange={noop}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
