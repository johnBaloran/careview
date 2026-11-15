import { screen, within } from "@testing-library/react";
import { axe } from "jest-axe";

import { mockFetchByUrl } from "@/test/mockFetch";
import { renderWithTheme } from "@/test/render";

import { ChartSummary } from "./ChartSummary";

jest.mock("next/navigation", () => ({
  useParams: () => ({ patientId: "pt-001" }),
}));

const base = "/api/patients/pt-001";
const routes = () => ({
  [`${base}/conditions`]: {
    body: {
      items: [
        {
          id: "c1",
          display: "Asthma",
          clinicalStatus: "active",
          onsetDate: "2024-03-02",
        },
        {
          id: "c2",
          display: "Migraine",
          clinicalStatus: "resolved",
          onsetDate: "2021-07-19",
        },
      ],
    },
  },
  [`${base}/encounters`]: {
    body: {
      items: [
        {
          id: "e9",
          type: "Follow-up visit",
          status: "planned",
          date: "2026-12-01",
          reason: "Asthma",
        },
        {
          id: "e4",
          type: "Outpatient visit",
          status: "finished",
          date: "2026-10-01",
          reason: "Asthma",
        },
        {
          id: "e3",
          type: "Telehealth consultation",
          status: "finished",
          date: "2026-08-01",
          reason: "Asthma",
        },
        {
          id: "e2",
          type: "Physiotherapy session",
          status: "finished",
          date: "2026-06-01",
          reason: "Asthma",
        },
        {
          id: "e1",
          type: "Emergency visit",
          status: "finished",
          date: "2026-01-01",
          reason: "Asthma",
        },
      ],
    },
  },
  [`${base}/observations`]: {
    body: {
      items: [
        {
          id: "o3",
          code: "heart-rate",
          display: "Heart rate",
          value: 72,
          unit: "beats/min",
          date: "2026-10-01",
        },
        {
          id: "o2",
          code: "pain-score",
          display: "Pain score (0–10)",
          value: 3,
          unit: "/10",
          date: "2026-10-01",
        },
        {
          id: "o1",
          code: "heart-rate",
          display: "Heart rate",
          value: 80,
          unit: "beats/min",
          date: "2026-06-01",
        },
      ],
    },
  },
});

const card = (name: string) => screen.getByRole("region", { name });

describe("ChartSummary", () => {
  it("shows only active conditions", async () => {
    mockFetchByUrl(routes());
    renderWithTheme(<ChartSummary />);
    expect(
      await within(card("Active conditions")).findByText("Asthma"),
    ).toBeInTheDocument();
    expect(
      within(card("Active conditions")).queryByText("Migraine"),
    ).not.toBeInTheDocument();
  });

  it("shows the upcoming visit and the three most recent finished ones", async () => {
    mockFetchByUrl(routes());
    renderWithTheme(<ChartSummary />);
    const encounters = card("Encounters");
    await within(encounters).findByText("Follow-up visit");
    const items = within(encounters).getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual([
      expect.stringContaining("Follow-up visitDec 1, 2026 · AsthmaUpcoming"),
      expect.stringContaining("Outpatient visit"),
      expect.stringContaining("Telehealth consultation"),
      expect.stringContaining("Physiotherapy session"),
    ]);
  });

  it("shows the latest reading of each vital", async () => {
    mockFetchByUrl(routes());
    renderWithTheme(<ChartSummary />);
    const vitals = card("Latest vitals");
    expect(
      await within(vitals).findByText("Heart rate: 72 beats/min"),
    ).toBeInTheDocument();
    expect(
      within(vitals).getByText("Pain score (0–10): 3 /10"),
    ).toBeInTheDocument();
    expect(within(vitals).queryByText(/80 beats\/min/)).not.toBeInTheDocument();
  });

  it("keeps the other cards working when one request fails", async () => {
    mockFetchByUrl({
      ...routes(),
      [`${base}/observations`]: { status: 500, body: {} },
    });
    renderWithTheme(<ChartSummary />);
    expect(
      await within(card("Latest vitals")).findByRole("alert"),
    ).toHaveTextContent("Couldn't load observations");
    expect(
      await within(card("Active conditions")).findByText("Asthma"),
    ).toBeInTheDocument();
    expect(
      within(card("Encounters")).getByText("Outpatient visit"),
    ).toBeInTheDocument();
  });

  it("links each card to its full section", async () => {
    mockFetchByUrl(routes());
    renderWithTheme(<ChartSummary />);
    await within(card("Active conditions")).findByText("Asthma");
    expect(
      screen.getByRole("link", { name: "View all conditions" }),
    ).toHaveAttribute("href", "/patients/pt-001/conditions");
    expect(
      screen.getByRole("link", { name: "View all encounters" }),
    ).toHaveAttribute("href", "/patients/pt-001/encounters");
    expect(
      screen.getByRole("link", { name: "View all observations" }),
    ).toHaveAttribute("href", "/patients/pt-001/observations");
  });

  it("has no detectable accessibility violations", async () => {
    mockFetchByUrl(routes());
    const { container } = renderWithTheme(<ChartSummary />);
    await within(card("Latest vitals")).findByText("Heart rate: 72 beats/min");
    expect(await axe(container)).toHaveNoViolations();
  });
});
