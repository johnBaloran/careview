import { redirect } from "next/navigation";

import HomePage from "./page";

jest.mock("next/navigation", () => ({ redirect: jest.fn() }));

describe("HomePage", () => {
  it("sends visitors to the patient directory", () => {
    HomePage();
    expect(redirect).toHaveBeenCalledWith("/patients");
  });
});
