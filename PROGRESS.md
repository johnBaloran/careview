# CareView: progress

**Current milestone:** M0 Foundation, in review
**Active task:** M0 foundation, branch `chore/m0-foundation` (PR pending CI)
**Next task:** M1: application shell and design system (starts with an investigation)
**Last verified commit:** see the M0 PR

## Milestones
| Milestone | Status |
|---|---|
| M0 Foundation | in review |
| M1 Shell and design system | not started |
| M2 Patient directory | not started |
| M3 Patient chart | not started |
| M4 Observations and polish | not started |
| M5 Optional extension | deferred (needs approval after M4) |

## Completed
- 2026-11-14: stack, architecture and scope approved; project documents created (`fc6494c` on `main`).
- 2026-11-14: M0 implemented on `chore/m0-foundation`: Next 16.4.6, React 19.3.1, TS 5.9 strict + noUncheckedIndexedAccess,
  ESLint 9 (Next config) + Prettier, Jest 30 + RTL, CI workflow. Locally: lint, typecheck, format:check, test (1 passed) and build all exit 0;
  the test fails when the heading is broken (negative check). CI: pending.

## Blockers and decisions
- None. GitHub repo `johnBaloran/careview` created; `careview-app` deleted (2026-11-14).

## How to update
Record only verified facts: the task, its PR/commit, and the checks run with their results.
Distinguish implemented, tested and manually verified. Keep the next task to one outcome.
