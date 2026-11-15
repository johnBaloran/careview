# CareView: architecture

**Status:** approved 2026-11-14. Exact versions are chosen at scaffold time (current stable, checked for compatibility).

## 1. Goals
- React behaviour and component design are easy to inspect and explain.
- UI is separated from data access; the browser talks only to the app's own REST API.
- Realistic API interactions (search, filter, paging, sorting, errors) without production infrastructure.
- Deterministic, offline tests.

## 2. Stack and why each piece is needed
| Area | Choice | Why |
|---|---|---|
| Framework | Next.js, App Router | Routing and nested layouts, plus Route Handlers that give a real REST API in the same app |
| Language | React + TypeScript (strict) | The target role; explicit component and API contracts |
| UI | MUI (core) | Accessible enterprise components and theming without hand-building primitives |
| Table | MUI `Table` with our own pagination/sort controls | Building server-driven paging and sorting by hand shows the React skill a grid would hide |
| Data fetching | `fetch` + small custom Hooks on a shared `useFetchJson` (AbortController, derived status, opt-in `keepPreviousData`) | Shows Hooks, effects, cleanup and async states; TanStack Query reviewed at M3 and not needed (no caching need) |
| List state | URL search params (page, pageSize, sort, status) | Shareable and survives refresh; identifying search text stays out of the URL |
| API validation | Typed parse functions at the route boundary | A handful of params; simple and testable |
| Data | Static synthetic fixtures in a server-only module | Deterministic tests and screenshots; no database |
| Charts | MUI X Charts, pinned to 9.17.0 | Uses the MUI theme; 9.18.0's vendor package was published without its CommonJS files |
| Tests | Jest (`next/jest`) + React Testing Library + user-event + jest-dom + jest-axe | Common in job postings; tests user behaviour and accessibility |
| Quality | ESLint (Next config) + Prettier; GitHub Actions CI | Consistent code; checks visible on every PR |
| Runtime | Node 24 LTS, npm | Current LTS |

Deferred libraries and their adoption triggers: `docs/PRIORITIES.md` §4.

## 3. Request flow
```
Browser: React client component
   └─ custom Hook (usePatients / usePatient / useChartResource → useFetchJson): fetch, AbortController, loading/error/retry
        └─ GET /api/patients…   (Next.js Route Handler: parse + validate query, map errors)
             └─ src/server/patients/service.ts   (filter, sort, paginate in memory)
                  └─ src/server/patients/fixtures.ts   (synthetic data, import 'server-only')
```
Client components never import fixtures or server modules. `import 'server-only'` in `src/server/**` makes the
build fail if they try.

## 4. Source layout
```
src/
  app/
    layout.tsx                      root: theme provider, shell
    page.tsx                        redirects or links to /patients
    patients/page.tsx               directory (F2)
    patients/[patientId]/…          chart (F3, F4)
    api/patients/route.ts           GET list
    api/patients/[patientId]/…      GET detail (+ sub-resources the UI needs)
  components/                       shared UI, only once reused: layout/, feedback/, data-display/
  features/patients/                components/, hooks/, utils/, types.ts
  server/patients/                  service.ts, fixtures.ts
  test/                             render helper
  theme.ts                          MUI theme (palette, typography, shape); 'use client'
```
Folders are created when code needs them; no empty layers.

## 5. Components
- **Pages** (`app/**/page.tsx`) compose feature components and read route/URL params.
- **Feature components** (`features/patients/components`) own one piece of UI each, e.g. `PatientSearchForm`,
  `PatientTable`, `PatientBanner`, `ConditionsSection`.
- **Shared components** (`components/`) are generic and data-agnostic: `PageHeader`, `LoadingState`, `EmptyState`,
  `ErrorState` (with retry), `SectionCard`. A component moves here only when a second feature uses it.
- Styling goes through the MUI theme and `sx`; no hard-coded colours.

## 6. State management
| State | Owner |
|---|---|
| Form input (search text) | Local `useState` in the form; submitted value lifted to the directory page |
| Page, page size, sort, status filter | URL search params |
| Server data (patients, chart sections) | The custom Hook that fetched it; not copied into other state |
| Active chart tab | The route (one segment per tab) or local state; decided at M3 |
| Theme mode | MUI theme; Context only if a toggle needs to reach distant components |

No global store. Context is used only for genuinely shared, distant state, with the reason documented in code.

## 7. API
- `GET /api/patients?q=&status=active|inactive&page=1&pageSize=20&sort=name|-name|birthDate|-birthDate`
  → `200 { items: PatientSummary[], total, page, pageSize }`
- `GET /api/patients/:patientId` → `200 PatientDetail` or `404`
- Chart sub-resources (`/conditions`, `/encounters`, `/observations`, `/medications`) only when a section needs them.
- Errors: `{ error: { code: 'BAD_REQUEST' | 'NOT_FOUND' | 'INTERNAL', message } }`, with matching status codes.
- Response types live in `features/patients/types.ts` and are shared by the routes and the Hooks.
- Search is sent in the query string to the API only (not reflected in the page URL); responses use `Cache-Control: no-store`.

## 8. Data
FHIR-*inspired* DTOs (Patient, Condition, Encounter, Observation, MedicationRequest fields a clinician would see),
not full FHIR resources. About 60 fictional patients with plausible but invented names, clearly synthetic MRNs
(`SYN-100001`…) and a "Synthetic data" badge in the top bar; deterministic and committed.

## 9. Testing
| Layer | What |
|---|---|
| Pure logic | Service filtering/sorting/paging; observation data shaping |
| API routes | Valid/invalid params, paging metadata, 404, error shape |
| Components | User flows via RTL: search, filter, sort, page, row navigation, tabs, every request state |
| Hooks | Through the components that use them; directly only when behaviour is subtle (abort on unmount) |

`fetch` is mocked at the boundary in component tests. No snapshots, and no coverage thresholds at the start.

## 10. Accessibility and responsiveness
Semantic HTML and landmarks; labelled inputs; full keyboard use; visible focus; status never shown by colour alone;
a table alternative for the chart; checks at desktop and 375 px. Automated checks supplement, not replace, a manual walk-through.

## 11. Changing the architecture
Propose: requirement, current limitation, simplest option, trade-offs, recommendation, migration impact. Wait for approval.
