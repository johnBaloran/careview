import { screen } from "@testing-library/react";

import { renderWithTheme } from "@/test/render";

import PatientsPage from "./page";

// Relative path: next/jest maps "@/" for imports but not for jest.mock() paths.
jest.mock("../../features/patients/components/PatientDirectory", () => ({
  PatientDirectory: () => <div>patient directory</div>,
}));

describe("PatientsPage", () => {
  it("has a 'Patients' heading above the directory", () => {
    renderWithTheme(<PatientsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Patients" }),
    ).toBeInTheDocument();
    expect(screen.getByText("patient directory")).toBeInTheDocument();
  });
});
