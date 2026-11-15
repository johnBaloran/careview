import { screen, within } from "@testing-library/react";
import { axe } from "jest-axe";

import { mockFetchByUrl } from "@/test/mockFetch";
import { renderWithTheme } from "@/test/render";

import {
  ConditionsSection,
  EncountersSection,
  MedicationsSection,
} from "./sections";

jest.mock("next/navigation", () => ({
  useParams: () => ({ patientId: "pt-001" }),
}));

const base = "/api/patients/pt-001";

describe("chart sections", () => {
  it("lists conditions with status in words and the onset date", async () => {
    mockFetchByUrl({
      [`${base}/conditions`]: {
        body: {
          items: [
            {
              id: "c1",
              display: "Essential hypertension",
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
    });
    renderWithTheme(<ConditionsSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Conditions" }),
    ).toBeInTheDocument();
    const table = await screen.findByRole("table", { name: "Conditions" });
    const rows = within(table).getAllByRole("row");
    expect(rows[1]).toHaveTextContent(
      "Essential hypertensionActiveMar 2, 2024",
    );
    expect(rows[2]).toHaveTextContent("MigraineResolvedJul 19, 2021");
  });

  it("shows an empty state when there's nothing recorded", async () => {
    mockFetchByUrl({ [`${base}/conditions`]: { body: { items: [] } } });
    renderWithTheme(<ConditionsSection />);
    // Wait for the empty state itself: the loading state is also role="status".
    expect(
      await screen.findByText("No recorded conditions"),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "No recorded conditions",
    );
  });

  it("shows its own error with retry, and recovers", async () => {
    const routes = { [`${base}/medications`]: { status: 500, body: {} } };
    mockFetchByUrl(routes);
    const { user } = renderWithTheme(<MedicationsSection />);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Couldn't load medications",
    );

    routes[`${base}/medications`] = {
      status: 200,
      body: {
        items: [
          {
            id: "m1",
            medication: "Amlodipine 5 mg tablet",
            dosage: "1 tablet by mouth once daily",
            status: "active",
            authoredOn: "2024-04-01",
          },
        ],
      },
    };
    await user.click(screen.getByRole("button", { name: "Try again" }));
    const table = await screen.findByRole("table", { name: "Medications" });
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent(
      "Amlodipine 5 mg tablet1 tablet by mouth once dailyActiveApr 1, 2024",
    );
  });

  it("marks planned encounters", async () => {
    mockFetchByUrl({
      [`${base}/encounters`]: {
        body: {
          items: [
            {
              id: "e2",
              type: "Follow-up visit",
              status: "planned",
              date: "2026-12-01",
              reason: "Asthma",
            },
            {
              id: "e1",
              type: "Outpatient visit",
              status: "finished",
              date: "2026-05-10",
              reason: "Asthma",
            },
          ],
        },
      },
    });
    renderWithTheme(<EncountersSection />);
    const rows = within(
      await screen.findByRole("table", { name: "Encounters" }),
    ).getAllByRole("row");
    expect(rows[1]).toHaveTextContent(
      "Dec 1, 2026Follow-up visitAsthmaPlanned",
    );
    expect(rows[2]).toHaveTextContent("Finished");
  });

  it("has no detectable accessibility violations", async () => {
    mockFetchByUrl({
      [`${base}/conditions`]: {
        body: {
          items: [
            {
              id: "c1",
              display: "Asthma",
              clinicalStatus: "active",
              onsetDate: "2024-03-02",
            },
          ],
        },
      },
    });
    const { container } = renderWithTheme(<ConditionsSection />);
    await screen.findByRole("table", { name: "Conditions" });
    expect(await axe(container)).toHaveNoViolations();
  });
});
