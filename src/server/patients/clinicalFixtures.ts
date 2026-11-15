import "server-only";

import { PATIENTS } from "./fixtures";

import type {
  Condition,
  Encounter,
  MedicationRequest,
  Observation,
  PatientSummary,
} from "@/features/patients/types";

// Synthetic clinical records, generated from a fixed seed per patient. Same output on every run
// (and in every test), without committing ~1,800 hand-written rows. All values are invented.

/** Records are dated relative to this fixed day, not the real clock. */
export const DATA_AS_OF = "2026-11-01";

export type ClinicalRecord = {
  conditions: Condition[];
  encounters: Encounter[];
  observations: Observation[];
  medications: MedicationRequest[];
};

// mulberry32: tiny deterministic PRNG.
function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CONDITIONS: {
  display: string;
  medication?: Omit<MedicationRequest, "id" | "status" | "authoredOn">;
}[] = [
  {
    display: "Essential hypertension",
    medication: {
      medication: "Amlodipine 5 mg tablet",
      dosage: "1 tablet by mouth once daily",
    },
  },
  {
    display: "Type 2 diabetes mellitus",
    medication: {
      medication: "Metformin 500 mg tablet",
      dosage: "1 tablet by mouth twice daily with meals",
    },
  },
  {
    display: "Hyperlipidemia",
    medication: {
      medication: "Atorvastatin 20 mg tablet",
      dosage: "1 tablet by mouth at bedtime",
    },
  },
  {
    display: "Asthma",
    medication: {
      medication: "Salbutamol 100 mcg inhaler",
      dosage: "2 puffs as needed for wheeze",
    },
  },
  {
    display: "Hypothyroidism",
    medication: {
      medication: "Levothyroxine 75 mcg tablet",
      dosage: "1 tablet by mouth every morning",
    },
  },
  {
    display: "Migraine",
    medication: {
      medication: "Sumatriptan 50 mg tablet",
      dosage: "1 tablet at onset of migraine, max 2 per day",
    },
  },
  {
    display: "Generalized anxiety disorder",
    medication: {
      medication: "Sertraline 50 mg tablet",
      dosage: "1 tablet by mouth once daily",
    },
  },
  {
    display: "Osteoarthritis of knee",
    medication: {
      medication: "Naproxen 250 mg tablet",
      dosage: "1 tablet by mouth twice daily with food",
    },
  },
  {
    display: "Chronic low back pain",
    medication: {
      medication: "Acetaminophen 500 mg tablet",
      dosage: "1–2 tablets every 6 hours as needed",
    },
  },
  {
    display: "Atrial fibrillation",
    medication: {
      medication: "Apixaban 5 mg tablet",
      dosage: "1 tablet by mouth twice daily",
    },
  },
  { display: "Rotator cuff tear" },
  { display: "Chronic kidney disease, stage 3" },
];

const ENCOUNTER_TYPES = [
  "Outpatient visit",
  "Follow-up visit",
  "Physiotherapy session",
  "Telehealth consultation",
  "Emergency visit",
] as const;

const DAY_MS = 86_400_000;
const toIso = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const asOfMs = Date.parse(`${DATA_AS_OF}T00:00:00Z`);

function seedFor(id: string): number {
  return [...id].reduce(
    (hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619),
    2166136261,
  );
}

function generateRecord(patient: PatientSummary): ClinicalRecord {
  const random = seededRandom(seedFor(patient.id));
  const int = (min: number, max: number) =>
    min + Math.floor(random() * (max - min + 1));
  const pick = <T>(items: readonly T[]): T => items[int(0, items.length - 1)]!;

  const birthMs = Date.parse(`${patient.birthDate}T00:00:00Z`);
  // History starts no earlier than age 1, and no earlier than six years before DATA_AS_OF.
  const historyStart = Math.max(
    birthMs + 365 * DAY_MS,
    asOfMs - 6 * 365 * DAY_MS,
  );
  const dateBetween = (from: number, to: number) =>
    from + Math.floor(random() * Math.max(to - from, DAY_MS));
  const ageAt = (ms: number) => (ms - birthMs) / (365.25 * DAY_MS);

  // Conditions: 0–4, distinct. About one in eight patients has none (an empty-state example).
  const conditionCount = random() < 0.12 ? 0 : int(1, 4);
  // Fisher–Yates with the seeded PRNG (sorting with a random comparator isn't stable across engines).
  const shuffled = [...CONDITIONS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = int(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  const chosen = shuffled.slice(0, conditionCount);
  const conditions: Condition[] = chosen.map((condition, index) => ({
    id: `${patient.id}-cond-${index + 1}`,
    display: condition.display,
    clinicalStatus: random() < 0.8 ? "active" : "resolved",
    onsetDate: toIso(dateBetween(historyStart, asOfMs - 120 * DAY_MS)),
  }));

  // Encounters: 3–10 finished visits, plus an upcoming planned one for some patients.
  const reasons = conditions.length
    ? conditions.map((c) => c.display)
    : ["Routine check-up"];
  const finishedCount = int(3, 10);
  const encounters: Encounter[] = [];
  for (let index = 0; index < finishedCount; index++) {
    encounters.push({
      id: `${patient.id}-enc-${index + 1}`,
      type: pick(ENCOUNTER_TYPES),
      status: "finished",
      date: toIso(dateBetween(historyStart, asOfMs - DAY_MS)),
      reason: pick(reasons),
    });
  }
  if (random() < 0.3) {
    encounters.push({
      id: `${patient.id}-enc-${finishedCount + 1}`,
      type: "Follow-up visit",
      status: "planned",
      date: toIso(asOfMs + int(7, 60) * DAY_MS),
      reason: pick(reasons),
    });
  }

  // Observations recorded at finished encounters: heart rate always; pain score at in-person
  // visits; body weight for adults at about half the visits.
  const baseHeartRate = int(62, 84);
  const basePain = int(3, 7);
  const baseWeight = int(55, 98);
  const observations: Observation[] = [];
  const finished = encounters
    .filter((encounter) => encounter.status === "finished")
    .sort((a, b) => a.date.localeCompare(b.date));
  finished.forEach((encounter, index) => {
    const at = Date.parse(`${encounter.date}T00:00:00Z`);
    const add = (
      code: Observation["code"],
      display: string,
      value: number,
      unit: string,
    ) =>
      observations.push({
        id: `${patient.id}-obs-${observations.length + 1}`,
        code,
        display,
        value,
        unit,
        date: encounter.date,
      });
    add("heart-rate", "Heart rate", baseHeartRate + int(-8, 8), "beats/min");
    if (encounter.type !== "Telehealth consultation") {
      // Pain tends to ease over the course of care.
      add(
        "pain-score",
        "Pain score (0–10)",
        Math.max(
          0,
          Math.min(10, basePain - Math.floor(index / 3) + int(-1, 1)),
        ),
        "/10",
      );
    }
    if (ageAt(at) >= 18 && random() < 0.5) {
      add(
        "body-weight",
        "Body weight",
        Math.round((baseWeight + (random() - 0.5) * 4) * 10) / 10,
        "kg",
      );
    }
  });

  // Medications follow conditions: active while the condition is active.
  const medications: MedicationRequest[] = [];
  chosen.forEach((condition, index) => {
    const linked = conditions[index]!;
    if (!condition.medication) return;
    medications.push({
      id: `${patient.id}-med-${medications.length + 1}`,
      ...condition.medication,
      status: linked.clinicalStatus === "active" ? "active" : "stopped",
      authoredOn: toIso(
        dateBetween(
          Date.parse(`${linked.onsetDate}T00:00:00Z`),
          asOfMs - DAY_MS,
        ),
      ),
    });
  });

  return { conditions, encounters, observations, medications };
}

export const CLINICAL_RECORDS: ReadonlyMap<string, ClinicalRecord> = new Map(
  PATIENTS.map((patient) => [patient.id, generateRecord(patient)]),
);
