import { screen } from "@testing-library/react";
import { axe } from "jest-axe";

import { renderWithTheme } from "@/test/render";

import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("alerts with a default title and message", () => {
    renderWithTheme(<ErrorState />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Something went wrong");
    expect(alert).toHaveTextContent("The information couldn't be loaded.");
  });

  it("shows no retry button without onRetry", () => {
    renderWithTheme(<ErrorState />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onRetry when the user chooses to try again", async () => {
    const onRetry = jest.fn();
    const { user } = renderWithTheme(
      <ErrorState
        title="Couldn't load patients"
        message="Check your connection."
        onRetry={onRetry}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Couldn't load patients",
    );
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderWithTheme(<ErrorState onRetry={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
