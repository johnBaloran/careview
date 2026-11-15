import { screen, within } from "@testing-library/react";
import { axe } from "jest-axe";

import { renderWithTheme } from "@/test/render";

import { AppShell } from "./AppShell";

let mockPathname = "/patients";
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname }));

function renderShell() {
  return renderWithTheme(
    <AppShell>
      <h1>Page content</h1>
    </AppShell>,
  );
}

describe("AppShell", () => {
  beforeEach(() => {
    mockPathname = "/patients";
  });

  it("provides header, navigation and main landmarks", () => {
    renderShell();
    expect(screen.getByRole("banner")).toHaveTextContent("CareView");
    expect(
      screen.getByRole("navigation", { name: "Main navigation" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toContainElement(
      screen.getByRole("heading", { name: "Page content" }),
    );
  });

  it("labels the data as synthetic in the top bar", () => {
    renderShell();
    expect(screen.getByRole("banner")).toHaveTextContent("Synthetic data");
  });

  it("offers a skip link as the first focusable element, targeting main content", async () => {
    const { user } = renderShell();
    await user.tab();
    const skipLink = screen.getByRole("link", { name: "Skip to main content" });
    expect(skipLink).toHaveFocus();
    expect(skipLink).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  });

  it("marks the current section in the navigation", () => {
    mockPathname = "/patients/p-001";
    renderShell();
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(nav).getByRole("link", { name: "Patients" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("does not mark a section as current on other pages", () => {
    mockPathname = "/settings";
    renderShell();
    expect(screen.getByRole("link", { name: "Patients" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("opens and closes the navigation drawer from the menu button on narrow screens", async () => {
    const { user } = renderShell();
    const menuButton = screen.getByRole("button", { name: "Open navigation" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await user.click(menuButton);
    const drawer = await screen.findByRole("presentation");
    expect(
      within(drawer).getByRole("link", { name: "Patients" }),
    ).toBeInTheDocument();
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderShell();
    expect(await axe(container)).toHaveNoViolations();
  });
});
