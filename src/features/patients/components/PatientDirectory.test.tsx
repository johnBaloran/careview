import { act, screen, waitFor, within } from "@testing-library/react";
import { axe } from "jest-axe";

import { renderWithTheme } from "@/test/render";

import { PatientDirectory } from "./PatientDirectory";

import type { PatientListResponse, PatientSummary } from "../types";

// --- next/navigation: the URL is a variable each test controls ---
let mockQuery = "";
const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(mockQuery),
  usePathname: () => "/patients",
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

// --- fetch: each call waits until the test responds ---
type Pending = {
  url: string;
  respond: (body: unknown, status?: number) => Promise<void>;
};
let pending: Pending[] = [];
beforeEach(() => {
  mockQuery = "";
  mockReplace.mockReset();
  mockPush.mockReset();
  pending = [];
  global.fetch = jest.fn(
    (url: string) =>
      new Promise((resolve) => {
        pending.push({
          url,
          respond: async (body, status = 200) => {
            await act(async () =>
              resolve({
                ok: status < 400,
                status,
                json: async () => body,
              } as Response),
            );
          },
        });
      }),
  ) as unknown as typeof fetch;
});

const patient = (overrides: Partial<PatientSummary>): PatientSummary => ({
  id: "pt-001",
  mrn: "SYN-100001",
  givenName: "Maya",
  familyName: "Chen",
  birthDate: "1943-10-01",
  sex: "female",
  status: "active",
  ...overrides,
});
const listOf = (
  items: PatientSummary[],
  extra: Partial<PatientListResponse> = {},
) => ({
  items,
  total: items.length,
  page: 1,
  pageSize: 20,
  ...extra,
});
const twoPatients = listOf(
  [
    patient({}),
    patient({
      id: "pt-002",
      mrn: "SYN-100002",
      givenName: "Daniel",
      familyName: "Okafor",
      sex: "male",
      status: "inactive",
    }),
  ],
  { total: 45 },
);

const latest = () => pending[pending.length - 1]!;

describe("PatientDirectory", () => {
  it("shows a loading state, then the patients", async () => {
    renderWithTheme(<PatientDirectory />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading patients…");

    await latest().respond(twoPatients);
    const table = screen.getByRole("table", { name: "Patients" });
    const rows = within(table).getAllByRole("row");
    expect(rows).toHaveLength(3); // header + 2
    expect(rows[1]).toHaveTextContent("Chen, Maya");
    expect(rows[1]).toHaveTextContent("SYN-100001");
    expect(rows[1]).toHaveTextContent("Oct 1, 1943");
    expect(rows[2]).toHaveTextContent("Inactive");
  });

  it("requests the page, size, sort and status from the URL", () => {
    mockQuery = "status=inactive&page=2&pageSize=10&sort=-birthDate";
    renderWithTheme(<PatientDirectory />);
    expect(latest().url).toBe(
      "/api/patients?status=inactive&page=2&pageSize=10&sort=-birthDate",
    );
  });

  it("falls back to defaults for invalid URL values", () => {
    mockQuery = "page=abc&pageSize=7&sort=mrn&status=all";
    renderWithTheme(<PatientDirectory />);
    expect(latest().url).toBe("/api/patients?page=1&pageSize=20&sort=name");
  });

  it("links each name to the patient's chart, and opens it on row click", async () => {
    const { user } = renderWithTheme(<PatientDirectory />);
    await latest().respond(twoPatients);
    expect(screen.getByRole("link", { name: "Chen, Maya" })).toHaveAttribute(
      "href",
      "/patients/pt-001",
    );

    await user.click(screen.getByText("SYN-100002"));
    expect(mockPush).toHaveBeenCalledWith("/patients/pt-002");
  });

  describe("sorting", () => {
    it("sorts by date of birth when its header is clicked, back to page 1", async () => {
      mockQuery = "page=3";
      const { user } = renderWithTheme(<PatientDirectory />);
      await latest().respond({ ...twoPatients, page: 3 });
      await user.click(screen.getByRole("button", { name: "Date of birth" }));
      expect(mockReplace).toHaveBeenCalledWith("/patients?sort=birthDate", {
        scroll: false,
      });
    });

    it("flips the direction of the active column and marks it for assistive tech", async () => {
      const { user } = renderWithTheme(<PatientDirectory />);
      await latest().respond(twoPatients);
      expect(
        screen.getByRole("columnheader", { name: /Name/ }),
      ).toHaveAttribute("aria-sort", "ascending");
      await user.click(screen.getByRole("button", { name: /Name/ }));
      expect(mockReplace).toHaveBeenCalledWith("/patients?sort=-name", {
        scroll: false,
      });
    });
  });

  describe("paging", () => {
    it("goes to the next page", async () => {
      const { user } = renderWithTheme(<PatientDirectory />);
      await latest().respond(twoPatients);
      expect(screen.getByText("1–20 of 45")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Go to next page" }));
      expect(mockReplace).toHaveBeenCalledWith("/patients?page=2", {
        scroll: false,
      });
    });

    it("changes the page size and returns to page 1", async () => {
      mockQuery = "page=2";
      const { user } = renderWithTheme(<PatientDirectory />);
      await latest().respond({ ...twoPatients, page: 2 });
      await user.click(screen.getByRole("combobox", { name: /Rows per page/ }));
      await user.click(screen.getByRole("option", { name: "50" }));
      expect(mockReplace).toHaveBeenCalledWith("/patients?pageSize=50", {
        scroll: false,
      });
    });

    it("keeps the current rows visible while the next page loads", async () => {
      const { rerender } = renderWithTheme(<PatientDirectory />);
      await latest().respond(twoPatients);
      mockQuery = "page=2";
      rerender(<PatientDirectory />);
      expect(screen.getByRole("table", { name: "Patients" })).toHaveAttribute(
        "aria-busy",
        "true",
      );
      expect(
        screen.getByRole("progressbar", { name: "Loading patients" }),
      ).toBeInTheDocument();
      expect(screen.getByText("Chen, Maya")).toBeInTheDocument();
    });

    it("offers the first page when the URL points past the end", async () => {
      mockQuery = "page=9";
      const { user } = renderWithTheme(<PatientDirectory />);
      await latest().respond(listOf([], { total: 45, page: 9 }));
      expect(screen.getByRole("status")).toHaveTextContent(
        "No patients on this page",
      );
      await user.click(
        screen.getByRole("button", { name: "Go to the first page" }),
      );
      expect(mockReplace).toHaveBeenCalledWith("/patients", { scroll: false });
    });
  });

  it("shows an empty state when there are no patients", async () => {
    renderWithTheme(<PatientDirectory />);
    await latest().respond(listOf([]));
    expect(screen.getByRole("status")).toHaveTextContent("No patients found");
  });

  it("shows an error and recovers when the user retries", async () => {
    const { user } = renderWithTheme(<PatientDirectory />);
    await latest().respond(
      { error: { code: "INTERNAL", message: "boom" } },
      500,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Couldn't load patients",
    );

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(pending).toHaveLength(2);
    await latest().respond(twoPatients);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Chen, Maya")).toBeInTheDocument();
  });

  it("has no detectable accessibility violations once loaded", async () => {
    const { container } = renderWithTheme(<PatientDirectory />);
    await latest().respond(twoPatients);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("PatientDirectory search and status filter", () => {
  const searchBox = () =>
    screen.getByRole("searchbox", { name: "Search by name or MRN" });
  const requestsWithQuery = () => pending.filter((p) => p.url.includes("q="));

  it("searches once the user pauses typing, not on every keystroke", async () => {
    const { user } = renderWithTheme(<PatientDirectory />);
    await latest().respond(twoPatients);

    await user.type(searchBox(), "chen");
    await waitFor(() => expect(requestsWithQuery()).toHaveLength(1));
    expect(requestsWithQuery()[0]!.url).toBe(
      "/api/patients?q=chen&page=1&pageSize=20&sort=name",
    );
  });

  it("never puts the search text in the page URL", async () => {
    mockQuery = "page=2";
    const { user } = renderWithTheme(<PatientDirectory />);
    await latest().respond({ ...twoPatients, page: 2 });

    await user.type(searchBox(), "SYN-100001");
    await waitFor(() => expect(requestsWithQuery()).toHaveLength(1));
    // Typing resets to page 1, and the URL carries nothing identifying.
    expect(mockReplace).toHaveBeenCalledWith("/patients", { scroll: false });
    for (const [url] of mockReplace.mock.calls) {
      expect(url).not.toMatch(/SYN|q=/);
    }
  });

  it("clears the search with the clear button", async () => {
    const { user } = renderWithTheme(<PatientDirectory />);
    await latest().respond(twoPatients);
    await user.type(searchBox(), "chen");
    await waitFor(() => expect(requestsWithQuery()).toHaveLength(1));

    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(searchBox()).toHaveValue("");
    await waitFor(() =>
      expect(latest().url).toBe("/api/patients?page=1&pageSize=20&sort=name"),
    );
  });

  it("filters by status through the URL", async () => {
    mockQuery = "page=3";
    const { user } = renderWithTheme(<PatientDirectory />);
    await latest().respond({ ...twoPatients, page: 3 });
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Inactive" }));
    expect(mockReplace).toHaveBeenCalledWith("/patients?status=inactive", {
      scroll: false,
    });
  });

  it("shows the selected status from the URL", async () => {
    mockQuery = "status=active";
    renderWithTheme(<PatientDirectory />);
    await latest().respond(twoPatients);
    expect(screen.getByRole("button", { name: "Active" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("offers to clear search and filters when nothing matches", async () => {
    mockQuery = "status=inactive";
    const { user } = renderWithTheme(<PatientDirectory />);
    await latest().respond(twoPatients);
    await user.type(searchBox(), "zzzz");
    await waitFor(() => expect(requestsWithQuery()).toHaveLength(1));
    await latest().respond(listOf([]));

    expect(screen.getByRole("status")).toHaveTextContent("No patients match");
    await user.click(
      screen.getByRole("button", { name: "Clear search and filters" }),
    );
    expect(searchBox()).toHaveValue("");
    expect(mockReplace).toHaveBeenLastCalledWith("/patients", {
      scroll: false,
    });
  });

  it("announces the number of matching patients", async () => {
    renderWithTheme(<PatientDirectory />);
    await latest().respond(twoPatients);
    expect(screen.getByRole("status")).toHaveTextContent("45 patients");
  });
});

describe("PatientDirectory keyboard use", () => {
  it("reaches search, the status filter, sort controls and the first patient link with Tab", async () => {
    const { user } = renderWithTheme(<PatientDirectory />);
    await latest().respond(twoPatients);

    await user.tab();
    expect(
      screen.getByRole("searchbox", { name: "Search by name or MRN" }),
    ).toHaveFocus();
    // The status filter is one Tab stop (roving tabindex); arrow keys move within it.
    await user.tab();
    expect(screen.getByRole("button", { name: "All" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Active" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: /Name/ })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Date of birth" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "Chen, Maya" })).toHaveFocus();
  });

  it("sorts from the keyboard", async () => {
    const { user } = renderWithTheme(<PatientDirectory />);
    await latest().respond(twoPatients);
    screen.getByRole("button", { name: "Date of birth" }).focus();
    await user.keyboard("{Enter}");
    expect(mockReplace).toHaveBeenCalledWith("/patients?sort=birthDate", {
      scroll: false,
    });
  });
});
