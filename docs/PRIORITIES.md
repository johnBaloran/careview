# CareView: priorities and scope control

## 1. Decision principle
Optimize for React competency shown, implementation quality, how well it demos and explains in an interview, and
time to a finished app. Do not optimize for feature count, novelty or number of technologies.

## 2. Priority levels
| Level | Meaning | Rule |
|---|---|---|
| **P0** | Core of the React portfolio demonstration | Finish before anything else |
| **P1** | Clearly improves quality or relevance | After P0, unless the human approves otherwise |
| **P2** | Optional extension | Needs explicit approval |
| **P3** | Out of scope | Needs a new project decision |

## 3. Current classification
**P0:** Next.js/React/TypeScript foundation · app shell · patient directory (search, filter, API pagination and
sorting) · patient chart · loading/empty/error/success states · REST integration through custom Hooks ·
Jest + RTL tests · typecheck, lint, build, CI · README and demo script.

**P1:** visual polish of the MUI theme (including dark mode) · responsive and accessibility refinements beyond the
acceptance criteria · observation trend chart (F4) · performance work backed by a measured problem · Vercel deploy.

**P2:** FHIR-shaped mock adapter behind the existing API contract · one HL7 v2 (ADT^A04) import slice ·
demo role switcher (UI-only role-aware views) · persisted user preferences.

**P3:** database, Docker, real authentication/SSO/SMART on FHIR, external FHIR server, multiple HL7 message types,
MLLP, audit infrastructure, queues/microservices, observability platforms, compliance work.

## 4. Library adoption triggers (deferred until the trigger occurs)
| Library | Adopt only when |
|---|---|
| MUI X DataGrid | the hand-built table needs features that would take longer than a day to build well (column resizing, virtualization) |
| TanStack Query | caching, background refetch or request de-duplication becomes a real need (decision point at M3) |
| zod | query/response validation grows beyond a few hand-written, tested parse functions |
| MSW | mocking `fetch` in component tests becomes repetitive across many tests |
| Chart library | at M4, when building F4: MUI X Charts or Recharts, whichever renders an accessible chart with less code |
| jest-axe | at M1 if automated a11y checks add signal beyond the manual keyboard walk-through |

## 5. Before accepting any task
1. Which acceptance criterion does it satisfy?
2. Which React competency does it demonstrate?
3. Is it needed for the current milestone?
4. What is the smallest implementation?
5. Can the framework, browser or an existing dependency already do it?
6. What does deferring it cost?
7. Does it delay higher-priority work?
8. How will it be verified?

Weak answers to 1–3 → recommend defer or remove.

## 6. Anti-overengineering rules
- No abstraction without a second real use or a clear reduction in complexity.
- No global state or Context for local state; no Context just to show Context.
- No memoization by default.
- No generic API client or data-access layer for two endpoints.
- No database, Docker or auth provider until persistence or login is an approved requirement.
- No real external services in tests.
- No backend feature that doesn't serve an approved UI flow.
- No tooling side quests: custom lint plugins, coverage thresholds or process documents need a stated problem first.

## 7. Milestone review
At the end of each milestone: review what shipped and its evidence; mark each remaining item KEEP, SIMPLIFY,
DEFER or REMOVE; note any React competencies still under-demonstrated; propose changes and wait for approval.
Don't keep work just because an earlier plan listed it.
