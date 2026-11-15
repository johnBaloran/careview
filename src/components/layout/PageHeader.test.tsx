import Button from "@mui/material/Button";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";

import { renderWithTheme } from "@/test/render";

import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  it("renders the title as the page's h1", () => {
    renderWithTheme(<PageHeader title="Patients" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Patients" }),
    ).toBeInTheDocument();
  });

  it("shows an optional description and actions", () => {
    renderWithTheme(
      <PageHeader
        title="Patients"
        description="Find a patient and open their chart."
        actions={<Button>Export</Button>}
      />,
    );
    expect(
      screen.getByText("Find a patient and open their chart."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderWithTheme(
      <PageHeader
        title="Patients"
        description="Directory"
        actions={<Button>Export</Button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
