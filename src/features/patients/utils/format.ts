import type { PatientSex, PatientStatus, PatientSummary } from "../types";

const dateFormat = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function parseDate(isoDate: string): {
  year: number;
  month: number;
  day: number;
} {
  const [year, month, day] = isoDate.split("-").map(Number);
  return { year: year ?? NaN, month: month ?? NaN, day: day ?? NaN };
}

/** "1943-10-01" → "Oct 1, 1943". Clinical dates here are calendar dates, so they're formatted in
 * UTC and can't shift a day in any viewer's time zone. */
export function formatDate(isoDate: string): string {
  return dateFormat.format(new Date(`${isoDate}T00:00:00Z`));
}

/** Whole years between a birth date and `today` (the viewer's local calendar date). */
export function ageInYears(isoBirthDate: string, today: Date): number {
  const birth = parseDate(isoBirthDate);
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const hadBirthday =
    month > birth.month || (month === birth.month && day >= birth.day);
  return year - birth.year - (hadBirthday ? 0 : 1);
}

/** "Chen, Maya": family name first, as clinical lists usually show it. */
export function formatPatientName(
  patient: Pick<PatientSummary, "givenName" | "familyName">,
) {
  return `${patient.familyName}, ${patient.givenName}`;
}

const SEX_LABELS: Record<PatientSex, string> = {
  female: "Female",
  male: "Male",
  other: "Other",
  unknown: "Unknown",
};
export const formatSex = (sex: PatientSex) => SEX_LABELS[sex];

export const formatStatus = (status: PatientStatus) =>
  status === "active" ? "Active" : "Inactive";
