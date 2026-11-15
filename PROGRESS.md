# CareView: progress

**Current milestone:** M4 Observations and polish
**Active task:** M4b accessibility and responsive polish, branch `feat/m4-a11y-polish`
**Next task:** M4c README and demo script
**Last verified commit:** `72c0cef` on `main` (PR #10; CI green on main)

## Milestones
| Milestone | Status |
|---|---|
| M0 Foundation | done (PR #1) |
| M1 Shell and design system | done (PRs #2, #3) |
| M2 Patient directory | done (PRs #4–#6) |
| M3 Patient chart | done (PRs #7–#9) |
| M4 Observations and polish | in progress |
| M5 Optional extension | deferred (needs approval after M4) |

## Completed
- 2026-11-14: stack, architecture and scope approved; project documents created (`fc6494c` on `main`).
- 2026-11-14: M0 implemented on `chore/m0-foundation`: Next 16.4.6, React 19.3.1, TS 5.9 strict + noUncheckedIndexedAccess,
  ESLint 9 (Next config) + Prettier, Jest 30 + RTL, CI workflow. Locally: lint, typecheck, format:check, test (1 passed) and build all exit 0;
  the test fails when the heading is broken (negative check). CI on PR #1: all steps passed (run 43656963901).
- 2026-11-14: M0 merged (`ae65b2c`); CI on `main` passed (run 43657543627).
- 2026-11-14: M1 approved: split into M1a (theme + shell) and M1b (PageHeader + feedback); MUI 9.5, icons, jest-axe; theme in `src/theme.ts`.
- 2026-11-14: M1a implemented on `feat/m1-theme-shell`: MUI 9.5 theme (AA-checked palette, Inter via next/font), responsive AppShell
  (permanent nav ≥ md, drawer below; skip link; aria-current), `/` → `/patients` redirect, patients placeholder, jest-axe.
  Locally: lint, typecheck, format:check, test (8 passed, no warnings) and build exit 0; `next start`: `/` → 307 `/patients`,
  landmarks/skip link/aria-current present in HTML. jest-axe caught a real bug (links not in `<li>`), fixed.
  Visual check passed (human, 2026-11-14): desktop nav, 375 px drawer, skip link. Merged as `a83e657` (PR #2); CI on `main` passed.
- 2026-11-14: M1b implemented on `feat/m1-feedback-components`: PageHeader, LoadingState (polite status), EmptyState (status + optional action),
  ErrorState (alert + optional retry); patients page uses PageHeader. Locally: lint, typecheck, format:check, test (21 passed, no warnings)
  and build exit 0; removing the retry handler fails its test (negative check).
  `next dev` auto-generated AGENTS.md (Next 16 does this under AI agents) and it was committed by mistake; removed, and
  `agentRules: false` set in next.config.ts (human decision). Restarted `next dev` did not recreate it.
- 2026-11-14: M1b merged (`754007b`, PR #3); CI on `main` passed. M1 complete.
- 2026-11-14: M2 approved: split M2a (data + API), M2b (table, URL state), M2c (search + filter). Keep `cacheComponents` and
  `partialPrefetching` (Next docs: both become the default in the next major). Names: plausible fictional names, `SYN-` MRNs,
  "Synthetic data" badge in the top bar.
- 2026-11-14: M2a implemented on `feat/m2-patient-api`: 60 synthetic patients (fixed seed, committed), `listPatients` service
  (search name/MRN, status filter, name/birth-date sort with stable tie-break, paging), `GET /api/patients` with validated params,
  400 error envelope (never echoes `q`) and `Cache-Control: no-store`; "Synthetic data" badge. Locally: lint, typecheck,
  format:check, test (48 passed) and build exit 0. Build marks `/api/patients` dynamic (ƒ); negative check: a handler that
  ignores the request is prerendered (○). Live `next dev`: `?q=chen` → 200 with 1 patient; `?pageSize=7` → 400, no-store.
- 2026-11-14: M2a merged (`0481f13`, PR #4); CI on `main` passed.
- 2026-11-14: M2b implemented on `feat/m2-directory-table`: `usePatients` (AbortController, derived status, keeps previous page,
  retry), `PatientTable` (sortable Name/DOB with aria-sort, paging, name links, row click, text status chip), `PatientDirectory`
  (page/size/sort/status in the URL, lenient parsing), date/age formatting. Locally: lint, typecheck, format:check, test (77 passed,
  no warnings) and build exit 0. The race test failed on a real bug first (a late response from an aborted request overwrote newer
  data); fixed by checking the abort signal. UNVERIFIED: visual check of the table (desktop + 375 px).
- 2026-11-14: M2b merged (`5440490`, PR #5); CI on `main` passed.
- 2026-11-14: Human: no further approvals or browser checks needed; build, PR, CI and merge each task in turn through M4.
- 2026-11-14: M2c implemented on `feat/m2-search-filter`: debounced (300 ms) name/MRN search kept out of the URL, Clear button,
  All/Active/Inactive status filter in the URL, "No patients match" with "Clear search and filters", announced result count.
  Locally: lint, typecheck, format:check, test (89 passed, no warnings) and build exit 0. Negative check: without the debounce,
  typing "chen" sends 4 requests and the test fails.
- 2026-11-14: M2c merged (`bce51d6`, PR #6); CI on `main` passed. M2 complete.
- 2026-11-14: M3 split: M3a clinical data + API, M3b chart layout/banner/tabs, M3c summary.
- 2026-11-14: M3a implemented on `feat/m3-chart-api`: seeded clinical records per patient (conditions, encounters, observations:
  heart rate/pain/weight at finished visits, medications tied to conditions), chart service, `GET /api/patients/{id}` and
  `/{id}/conditions|encounters|observations|medications` (404 envelope, no-store), shared `server/http.ts` (list route now uses it).
  Locally: lint, typecheck, format:check, test (114 passed) and build exit 0; build marks all six API routes dynamic (ƒ).
  Negative check: injecting Math.random into the generator fails the determinism test. One local Jest run stalled ~11 min
  (Jest's estimate); reruns take ~4 s; cause not identified.
- 2026-11-14: M3a merged (`c13ab8f`, PR #7); CI on `main` passed.
- 2026-11-14: M3b implemented on `feat/m3-chart-ui`: shared `useFetchJson` (usePatients now wraps it; its 6 tests still pass) with
  keepPreviousData off by default (no wrong-patient display), chart layout (patient loaded once, not-found and error states),
  banner, section navigation (links + aria-current), four section tabs with their own states, generic page titles (no names in
  history). Fixed: AppShell read usePathname outside Suspense, which fails the build on dynamic routes; the nav now renders in
  Suspense with a non-highlighted fallback. Locally: lint, typecheck, format:check, test (130 passed, no warnings) and build exit 0;
  chart routes are partially prerendered (◐). Negative check: flipping keepPreviousData's default fails the wrong-patient test.
  Known: unknown patient IDs show "Patient not found" in the browser but the page responds HTTP 200 (client-side fetch).
- 2026-11-14: M3b merged (`26ed6ab`, PR #8); CI on `main` passed.
- 2026-11-14: M3c implemented on `feat/m3-chart-summary`: Summary tab with three independent cards (active conditions, upcoming +
  last three encounters, latest vital per type) and "View all" links; shared SectionCard and ResourceContent (ChartSection refactored
  onto them; its 12 tests still pass). Locally: lint, typecheck, format:check, test (138 passed, no warnings) and build exit 0.
  Negative check: removing the active-only filter fails its test. One failing card leaves the others working (tested).
- 2026-11-14: M3c merged (`16f544d`, PR #9); CI on `main` passed. M3 complete. TanStack Query not adopted (no caching need).
- 2026-11-14: M4 plan: M4a observation trend (MUI X Charts, per PRIORITIES §4), M4b a11y/responsive polish, M4c README + demo.
- 2026-11-14: M4a implemented on `feat/m4-observation-trend`: Observations tab with a measurement selector (only types the patient
  has), Chart/Table toggle, an accessible one-sentence chart summary, and the full list; trend helpers unit-tested.
  `@mui/x-charts` pinned to exactly 9.17.0: the published `@mui/x-charts-vendor@9.18.0` ships 80 of its 354 files and its CommonJS
  entry is broken (Jest can't load it); 9.17.0 pins the complete vendor 9.15.0. Jest setup gained ResizeObserver and structuredClone
  shims (jsdom gaps). Locally: lint, typecheck, format:check, test (147 passed, no warnings) and build exit 0. Negative check:
  offering every measurement type fails two tests.
- 2026-11-14: M4a merged (`72c0cef`, PR #10); CI on `main` passed.
- 2026-11-15: M4b implemented on `feat/m4-a11y-polish`: info colour fixed (MUI default #0288d1 is 3.86:1, below AA; now #0B61A4,
  6.44:1) with a palette contrast test (jest-axe can't measure contrast in jsdom); app-wide not-found (real 404) and error boundary
  (never shows or logs the error message); LinkButton client component (a Server Component can't pass `component={NextLink}`, which
  broke the build and made unknown routes 500 until fixed; unit tests can't catch this, only the build); directory status chip uses
  StatusChip; keyboard-path tests (status filter is one Tab stop with arrow keys, as MUI's roving tabindex intends). Locally: lint,
  typecheck, format:check, test (158 passed, no warnings) and build exit 0; `/no-such-page` → 404. Negative check: restoring MUI's
  default info colour fails the contrast test. UNVERIFIED: real-browser keyboard walkthrough and 375 px layout (no browser used).

## Blockers and decisions
- None. GitHub repo `johnBaloran/careview` created; `careview-app` deleted (2026-11-14).

## How to update
Record only verified facts: the task, its PR/commit, and the checks run with their results.
Distinguish implemented, tested and manually verified. Keep the next task to one outcome.
