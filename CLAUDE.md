# CareView: Claude Code instructions

## Mission
Build CareView, a polished, enterprise-style healthcare app that demonstrates job-ready **React / Next.js /
TypeScript** frontend engineering: component architecture, Hooks and state ownership, REST API integration, reusable
UI, async states, accessibility, and Jest + React Testing Library.

Healthcare is the product context, not a mandate to build a healthcare platform.
**Success is a focused, well-tested, explainable app, not the most features or technologies.**

## Documents and authority
| File | Owns |
|---|---|
| `CLAUDE.md` | How work is done (this file) |
| `PROJECT_PLAN.md` | What is built: features, acceptance criteria, non-goals, milestones |
| `docs/PRIORITIES.md` | What comes first; deferred items and their adoption triggers |
| `docs/ARCHITECTURE.md` | Approved stack, structure, state and API design |
| `PROGRESS.md` | Current status (verified facts only) |
| `README.md` | Public overview and setup |

The human owns scope, priorities, stack and dependencies. Claude recommends; it never approves its own changes.
If documents conflict, stop, name the conflict and ask. Never silently expand scope.
Create no other documentation unless the human asks for it.

## Workflow (every task)
1. **Investigate (no edits):** read the relevant plan/architecture sections and the current code. State the
   priority (P0–P3), the competency it demonstrates, the smallest implementation, files, tests and non-goals.
   End with `READY FOR APPROVAL`, `NEEDS CLARIFICATION` or `RECOMMEND DEFER`.
2. **Implement after approval:** on a branch `feat/<short-name>` (or `fix/`, `chore/`, `docs/`). Only approved
   scope. Inspect the diff as you go. Need a new file outside the plan, a dependency or an architecture change?
   Stop and ask.
3. **Verify:** `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` (once they exist), plus focused
   tests. For UI, say plainly whether a browser check happened; never imply one that didn't.
4. **Report:** what changed; **files created/modified, with a one-line purpose each and how they connect**;
   acceptance-criteria status; commands run with exit codes; what's unverified; deferred ideas; branch and commit.
   Then update `PROGRESS.md`.

Keep it light: no per-step ceremony, session logs or reviewer agents unless the human asks.
Before starting any task, ask: *is this the highest-value unfinished P0 task?* If not, say why it's first.

## Evidence rules
- No "done", "works" or "passes" without the command, its exit code and the key output.
- Run checks through the project's npm scripts and real config. Command-line overrides are not evidence.
- After a scripted edit (sed, Python, find-replace), show `git diff -- <file>`; a replacement that matches nothing must fail loudly.
- To claim a guard works (a lint rule, a test), show it failing on a bad input once.
- If something wasn't verified, write `UNVERIFIED:` and why.

## Anti-overengineering
Smallest solution that meets the acceptance criteria. Don't:
- add a dependency when the framework or browser already does it (state why it's needed first);
- build generic frameworks, wrappers or layers for one use case; abstract on the second real use;
- use global state or Context for local state; use Context only for genuinely shared, distant state, with the reason written down;
- add `useMemo` / `useCallback` / `memo` without a reason; write a custom Hook for every effect;
- add database, auth, Docker, external services or infrastructure (all deferred, see `docs/PRIORITIES.md`);
- refactor unrelated code, or widen acceptance criteria.

## React standards
For each feature, decide deliberately and be able to explain: component responsibilities and composition, prop
types, state ownership (local / lifted / URL), effects and their dependencies and cleanup, separation of
presentation vs data fetching vs pure logic, loading/empty/error/success states, keyboard and screen-reader use.

## Testing
Jest + React Testing Library + user-event. Test what the user sees and does (query by role and label), API route
behaviour, and pure logic. Mock the network boundary (`fetch`), not internal functions. No snapshot tests of UI.
No coverage thresholds until the critical paths are tested.

## Git
- Never commit to `main` directly; one branch and one PR per task, squash-merged.
- Conventional commits: `feat(patients): add status filter`. Commit only green work.
- Never push, merge, force-push or rewrite pushed history without the human's explicit instruction.
- **Never add AI attribution** (`Co-Authored-By: Claude`, "Generated with…") to commits or PRs.

## Privacy (healthcare context)
- Synthetic, fictional data only. Never real patient information.
- Never put patient names, MRNs or birth dates in URLs, logs, analytics or error messages.
- Don't claim PHIPA/HIPAA compliance. Role-based UI hiding, if ever added, is a UI demo, not security.

## Definition of done
Acceptance criteria met with evidence · checks green · no unrelated changes, unneeded dependencies or abstractions ·
`PROGRESS.md` updated with verified status · PR description lists what changed and how it was verified.
