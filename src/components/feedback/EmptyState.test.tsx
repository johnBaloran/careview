import Button from "@mui/material/Button";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";

import { renderWithTheme } from "@/test/render";

import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("announces the title and shows the description", () => {
    renderWithTheme(
      <EmptyState
        title="No patients match"
        description="Try a different name or MRN."
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("No patients match");
    expect(
      screen.getByText("Try a different name or MRN."),
    ).toBeInTheDocument();
  });

  it("renders an optional action that the user can trigger", async () => {
    const onClear = jest.fn();
    const { user } = renderWithTheme(
      <EmptyState
        title="No patients match"
        action={<Button onClick={onClear}>Clear filters</Button>}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderWithTheme(
      <EmptyState title="No patients match" description="Try again" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
