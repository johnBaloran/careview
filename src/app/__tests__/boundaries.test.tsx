import { screen } from "@testing-library/react";
import { axe } from "jest-axe";

import { renderWithTheme } from "@/test/render";

import AppError from "../error";
import NotFound from "../not-found";

describe("NotFound page", () => {
  it("explains the page doesn't exist and links to the patient list", async () => {
    const { container } = renderWithTheme(<NotFound />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Page not found" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Go to patients" }),
    ).toHaveAttribute("href", "/patients");
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("AppError boundary", () => {
  it("offers a retry and never shows the error's message", async () => {
    const retry = jest.fn();
    const { user } = renderWithTheme(
      <AppError
        error={new Error("Chen, Maya SYN-100001 failed")}
        retry={retry}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "This page couldn't be displayed",
    );
    expect(document.body).not.toHaveTextContent("SYN-100001");
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
