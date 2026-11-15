# CareView: progress

**Current milestone:** M2 Patient directory
**Active task:** M2b directory table, branch `feat/m2-directory-table`
**Next task:** M2c search and status filter
**Last verified commit:** `0481f13` on `main` (PR #4; CI green on main)

## Milestones
| Milestone | Status |
|---|---|
| M0 Foundation | done (PR #1) |
| M1 Shell and design system | done (PRs #2, #3) |
| M2 Patient directory | in progress |
| M3 Patient chart | not started |
| M4 Observations and polish | not started |
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

## Blockers and decisions
- None. GitHub repo `johnBaloran/careview` created; `careview-app` deleted (2026-11-14).

## How to update
Record only verified facts: the task, its PR/commit, and the checks run with their results.
Distinguish implemented, tested and manually verified. Keep the next task to one outcome.
