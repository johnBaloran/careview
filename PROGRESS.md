# CareView: progress

**Current milestone:** M1 Shell and design system
**Active task:** M1a theme and shell, branch `feat/m1-theme-shell`
**Next task:** M1b PageHeader and feedback components
**Last verified commit:** `ae65b2c` on `main` (PR #1; CI green on main)

## Milestones
| Milestone | Status |
|---|---|
| M0 Foundation | done (PR #1) |
| M1 Shell and design system | in progress |
| M2 Patient directory | not started |
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
  UNVERIFIED: visual check in a browser (desktop + 375 px).

## Blockers and decisions
- None. GitHub repo `johnBaloran/careview` created; `careview-app` deleted (2026-11-14).

## How to update
Record only verified facts: the task, its PR/commit, and the checks run with their results.
Distinguish implemented, tested and manually verified. Keep the next task to one outcome.
