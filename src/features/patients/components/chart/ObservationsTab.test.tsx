import { screen, within } from "@testing-library/react";
import { axe } from "jest-axe";

import { mockFetchByUrl } from "@/test/mockFetch";
import { renderWithTheme } from "@/test/render";

import { ObservationsTab } from "./ObservationsTab";

jest.mock("next/navigation", () => ({
  useParams: () => ({ patientId: "pt-001" }),
}));

const url = "/api/patients/pt-001/observations";
const hr = (id: string, date: string, value: number) => ({
  id,
  code: "heart-rate",
  display: "Heart rate",
  value,
  unit: "beats/min",
  date,
});
const pain = (id: string, date: string, value: number) => ({
  id,
  code: "pain-score",
  display: "Pain score (0–10)",
  value,
  unit: "/10",
  date,
});
// API order: newest first.
const items = [
  hr("o4", "2026-10-01", 72),
  pain("o3", "2026-10-01", 3),
  hr("o2", "2026-03-15", 80),
  pain("o1", "2026-03-15", 6),
];

describe("ObservationsTab", () => {
  it("shows a chart of the first measurement with an accessible summary", async () => {
    mockFetchByUrl({ [url]: { body: { items } } });
    renderWithTheme(<ObservationsTab />);
    expect(
      await screen.findByRole("img", {
        name: "Heart rate over time: 2 readings from Mar 15, 2026 to Oct 1, 2026, latest 72 beats/min.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Heart rate" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("offers only measurements the patient has (no body weight here)", async () => {
    mockFetchByUrl({ [url]: { body: { items } } });
    renderWithTheme(<ObservationsTab />);
    const group = await screen.findByRole("group", { name: "Measurement" });
    expect(
      within(group)
        .getAllByRole("button")
        .map((b) => b.textContent),
    ).toEqual(["Heart rate", "Pain score (0–10)"]);
  });

  it("switches measurement", async () => {
    mockFetchByUrl({ [url]: { body: { items } } });
    const { user } = renderWithTheme(<ObservationsTab />);
    await user.click(
      await screen.findByRole("button", { name: "Pain score (0–10)" }),
    );
    expect(
      screen.getByRole("img", {
        name: /^Pain score \(0–10\) over time: 2 readings .* latest 3 \/10\.$/,
      }),
    ).toBeInTheDocument();
  });

  it("offers a table view with every reading, newest first", async () => {
    mockFetchByUrl({ [url]: { body: { items } } });
    const { user } = renderWithTheme(<ObservationsTab />);
    await user.click(await screen.findByRole("button", { name: "Table" }));
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    const rows = within(
      screen.getByRole("table", { name: "Heart rate readings" }),
    ).getAllByRole("row");
    expect(rows.slice(1).map((r) => r.textContent)).toEqual([
      "Oct 1, 202672 beats/min",
      "Mar 15, 202680 beats/min",
    ]);
  });

  it("lists all observations below the trend", async () => {
    mockFetchByUrl({ [url]: { body: { items } } });
    renderWithTheme(<ObservationsTab />);
    const table = await screen.findByRole("table", { name: "Observations" });
    expect(within(table).getAllByRole("row")).toHaveLength(5);
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent(
      "Oct 1, 2026Heart rate72 beats/min",
    );
  });

  it("shows an empty state when there are no observations", async () => {
    mockFetchByUrl({ [url]: { body: { items: [] } } });
    renderWithTheme(<ObservationsTab />);
    expect(await screen.findByText("No observations")).toBeInTheDocument();
  });

  it("has no detectable accessibility violations (chart and table views)", async () => {
    mockFetchByUrl({ [url]: { body: { items } } });
    const { container, user } = renderWithTheme(<ObservationsTab />);
    await screen.findByRole("img");
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole("button", { name: "Table" }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
