import {
  ageInYears,
  formatDate,
  formatPatientName,
  formatSex,
  formatStatus,
} from "./format";

describe("formatDate", () => {
  it("formats a calendar date without shifting it by time zone", () => {
    expect(formatDate("1943-10-01")).toBe("Oct 1, 1943");
    expect(formatDate("2016-12-31")).toBe("Dec 31, 2016");
  });
});

describe("ageInYears", () => {
  const on = (y: number, m: number, d: number) => new Date(y, m - 1, d);

  it("counts a birthday that has already happened this year", () => {
    expect(ageInYears("1990-03-15", on(2026, 11, 14))).toBe(36);
  });

  it("doesn't count a birthday later this year", () => {
    expect(ageInYears("1990-12-01", on(2026, 11, 14))).toBe(35);
  });

  it("counts the birthday itself", () => {
    expect(ageInYears("1990-11-14", on(2026, 11, 14))).toBe(36);
  });

  it("handles a 29 February birthday in a non-leap year", () => {
    expect(ageInYears("2000-02-29", on(2026, 2, 28))).toBe(25);
    expect(ageInYears("2000-02-29", on(2026, 3, 1))).toBe(26);
  });
});

describe("labels", () => {
  it("formats names family-first", () => {
    expect(formatPatientName({ givenName: "Maya", familyName: "Chen" })).toBe(
      "Chen, Maya",
    );
  });

  it("formats sex and status as words", () => {
    expect(formatSex("unknown")).toBe("Unknown");
    expect(formatStatus("inactive")).toBe("Inactive");
  });
});
