import { screen, within } from "@testing-library/react";
import { axe } from "jest-axe";

import { mockFetchByUrl } from "@/test/mockFetch";
import { renderWithTheme } from "@/test/render";

import { PatientChartLayout } from "./PatientChartLayout";

let mockParams = { patientId: "pt-001" };
let mockPathname = "/patients/pt-001/conditions";
jest.mock("next/navigation", () => ({
  useParams: () => mockParams,
  usePathname: () => mockPathname,
}));

const maya = {
  id: "pt-001",
  mrn: "SYN-100001",
  givenName: "Maya",
  familyName: "Chen",
  birthDate: "1943-10-01",
  sex: "female",
  status: "active",
};

function renderChart() {
  return renderWithTheme(
    <PatientChartLayout>
      <p>section content</p>
    </PatientChartLayout>,
  );
}

describe("PatientChartLayout", () => {
  beforeEach(() => {
    mockParams = { patientId: "pt-001" };
    mockPathname = "/patients/pt-001/conditions";
    jest.useFakeTimers({
      now: new Date(2026, 10, 14),
      doNotFake: [
        "queueMicrotask",
        "nextTick",
        "setImmediate",
        "setTimeout",
        "setInterval",
      ],
    });
  });
  afterEach(() => jest.useRealTimers());

  it("shows a loading state, then the banner, section navigation and content", async () => {
    mockFetchByUrl({ "/api/patients/pt-001": { body: maya } });
    renderChart();
    expect(screen.getByRole("status")).toHaveTextContent("Loading patient…");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Chen, Maya" }),
    ).toBeInTheDocument();
    expect(screen.getByText("SYN-100001")).toBeInTheDocument();
    expect(screen.getByText("Oct 1, 1943 (83 y)")).toBeInTheDocument();
    expect(screen.getByText("section content")).toBeInTheDocument();
  });

  it("marks the current section and links every section for this patient", async () => {
    mockFetchByUrl({ "/api/patients/pt-001": { body: maya } });
    renderChart();
    const nav = await screen.findByRole("navigation", {
      name: "Patient chart sections",
    });
    const links = within(nav).getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "/patients/pt-001",
      "/patients/pt-001/conditions",
      "/patients/pt-001/encounters",
      "/patients/pt-001/observations",
      "/patients/pt-001/medications",
    ]);
    expect(
      within(nav).getByRole("link", { name: "Conditions" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(nav).getByRole("link", { name: "Summary" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("links back to the patient list", async () => {
    mockFetchByUrl({ "/api/patients/pt-001": { body: maya } });
    renderChart();
    expect(
      await screen.findByRole("link", { name: "All patients" }),
    ).toHaveAttribute("href", "/patients");
  });

  it("shows 'Patient not found' for an unknown patient, without rendering the sections", async () => {
    mockParams = { patientId: "pt-999" };
    mockFetchByUrl({});
    renderChart();
    expect(await screen.findByText("Patient not found")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to patients" }),
    ).toHaveAttribute("href", "/patients");
    expect(screen.queryByText("section content")).not.toBeInTheDocument();
  });

  it("shows an error with retry for other failures, and recovers", async () => {
    const routes = { "/api/patients/pt-001": { status: 500, body: {} } };
    const fetchMock = mockFetchByUrl(routes);
    renderChart();
    const { user } = {
      user: (await import("@testing-library/user-event")).default.setup({
        advanceTimers: jest.advanceTimersByTime,
      }),
    };
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Couldn't load this patient",
    );

    routes["/api/patients/pt-001"] = { status: 200, body: maya };
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(
      await screen.findByRole("heading", { level: 1, name: "Chen, Maya" }),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("has no detectable accessibility violations", async () => {
    mockFetchByUrl({ "/api/patients/pt-001": { body: maya } });
    const { container } = renderChart();
    await screen.findByRole("heading", { level: 1 });
    jest.useRealTimers();
    expect(await axe(container)).toHaveNoViolations();
  });
});
