import { screen } from "@testing-library/react";
import { axe } from "jest-axe";

import { renderWithTheme } from "@/test/render";

import { LoadingState } from "./LoadingState";

describe("LoadingState", () => {
  it("announces a default loading message politely", () => {
    renderWithTheme(<LoadingState />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Loading…");
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  it("uses a custom label", () => {
    renderWithTheme(<LoadingState label="Loading patients…" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading patients…");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderWithTheme(<LoadingState />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
