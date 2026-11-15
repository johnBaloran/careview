import { screen } from "@testing-library/react";

import { renderWithTheme } from "@/test/render";

import PatientsPage from "./page";

describe("PatientsPage", () => {
  it('has a "Patients" page heading', () => {
    renderWithTheme(<PatientsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Patients" }),
    ).toBeInTheDocument();
  });
});
