# CareView: project plan

**Status:** approved 2026-11-14 (stack, architecture and scope). Changes need the human's approval.

## 1. Vision
CareView is a clinical patient-overview app built on synthetic data. A user searches a patient directory, opens a
patient chart, and reviews the patient's conditions, encounters, observations and medications in an interface
that feels like credible enterprise healthcare software.

It exists to demonstrate React Developer competency in a realistic domain. It is not a hospital information system.

## 2. Target users (demo personas)
- **Clinician:** finds a patient quickly and reviews their clinical picture.
- **Registration staff:** finds a patient and checks demographics and visit history.

Personas shape the UX only; there is no login or authorization in this release.

## 3. Essential features and acceptance criteria

### F1: Application shell
- Top bar with product name; side navigation with the current page indicated; page header with title.
- Desktop-first layout that stays usable at 375 px wide; navigation collapses on narrow screens.
- A skip-to-content link; visible keyboard focus; landmark regions (`header`, `nav`, `main`).
- Shared feedback components for loading, empty and error states.

### F2: Patient directory
- Search by name or MRN; filter by active / inactive.
- Pagination and sorting performed by the API (`page`, `pageSize`, `sort` parameters).
- Table columns: name, MRN, date of birth (with age), sex, status.
- Loading, empty ("no patients match"), error with retry, and success states.
- Page, sort and status filter live in the URL; search text (a name or MRN) does not.
- Activating a row (mouse or keyboard) opens that patient's chart.
- Tests cover search, filter, paging, sorting, each request state and navigation.

### F3: Patient chart
- Patient banner: name, MRN, date of birth/age, sex, status, shown on every chart tab.
- Tabs: Summary, Conditions, Encounters, Observations, Medications.
- Summary shows active conditions, the latest encounters and the latest vitals.
- Each section has its own loading, empty and error state; one failing section doesn't break the chart.
- Unknown patient ID shows a clear not-found page.
- Tests cover tab navigation, representative data, and empty/error/not-found states.

### F4: Observation trend
- Choose an observation type (e.g. heart rate, pain score) and see values over time.
- Units and dates labelled; a table view with the same data is available, so the chart is never the only way to read it.
- The data-shaping logic (sorting, grouping, gaps) is pure and unit-tested.

### F5: Quality
- TypeScript strict; lint and format clean; production build succeeds; CI runs all checks on every PR.
- Jest + React Testing Library tests of user-visible behaviour and API routes.
- Keyboard walk-through of the main flow (search → chart → observations) recorded as done.
- README with setup, architecture overview, screenshots, a short demo script and known limitations.

## 4. Non-goals (first release)
Database or ORM · Docker · login, Auth.js or SSO · real RBAC · external FHIR server · HL7 v2 parsing or ingestion ·
audit logging · admin pages · persistent user preferences · i18n · offline mode · Storybook · browser E2E tests ·
queues, microservices or any scaling infrastructure · real patient data · compliance claims ·
appointments, care plans, billing, messaging.

Deferred, not rejected: see `docs/PRIORITIES.md` for when each could return.

## 5. Milestones
| Milestone | Delivers | Exit criteria | Rough effort |
|---|---|---|---|
| **M0 Foundation** | Next.js scaffold, strict TS, ESLint + Prettier, Jest + RTL, CI workflow, placeholder page, git + GitHub | typecheck, lint, test and build pass locally and in CI | 2–3 h |
| **M1 Shell and design system** | MUI theme, F1 shell, PageHeader + Loading/Empty/Error components | shell is responsive, keyboard-usable and tested | 4–6 h |
| **M2 Patient directory** | Synthetic fixtures, patient service, `GET /api/patients`, F2 UI | the full search flow works through the API; F2 criteria met | 6–8 h |
| **M3 Patient chart** | `GET /api/patients/:id` (+ sub-resources the UI needs), F3 UI | user can go from search to a full chart; F3 criteria met | 6–8 h |
| **M4 Observations and polish** | F4, accessibility and responsive pass, README, demo script; optional Vercel deploy | all P0 criteria met; demo-ready | 4–6 h |
| *M5 Optional extension* | One of: FHIR-shaped mock adapter, or a single HL7 ADT^A04 import slice | only after M4 and with human approval | — |

Core release (M0–M4): roughly 22–31 focused hours. These are planning estimates, not promises.

## 6. Release gate
The first release is ready when the search → chart → observations flow works end to end, the UI is coherent and
accessible, every check passes, the README and demo script are done, and deferred work is clearly listed.
Attempting every feature does not make it ready.

## 7. Change control
A proposed feature or dependency must state: user or portfolio value, the competency it shows, its priority,
the smallest version, rough effort, and what it would delay. The human decides.
