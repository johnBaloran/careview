# CareView

A clinical patient-overview app built with **Next.js, React and TypeScript**. Search a patient directory, open a
patient chart, and review conditions, encounters, observations and medications in an enterprise-style interface.

> **Status:** milestone M0 (foundation). See [`PROGRESS.md`](PROGRESS.md).

## What it demonstrates
- React component architecture and composition
- Hooks and deliberate state ownership (local, lifted, URL)
- REST API integration with loading, empty, error and success states
- Server-driven search, filtering, pagination and sorting
- Reusable, accessible, responsive UI (MUI)
- Jest and React Testing Library tests of real user behaviour

## Scope
First release: app shell, patient directory, patient chart and an observation trend view.
FHIR and HL7 integration are possible later extensions. Plan: [`PROJECT_PLAN.md`](PROJECT_PLAN.md) ·
architecture: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Setup
Requires Node 24 (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run lint` | ESLint (Next.js rules) |
| `npm run typecheck` | TypeScript, strict |
| `npm run format` / `format:check` | Prettier |
| `npm test` | Jest + React Testing Library |
| `npm run build` | Production build |

CI runs lint, typecheck, format check, tests and build on every pull request.

## Privacy and limitations
- Synthetic, fictional data only.
- Not for clinical use; no PHIPA/HIPAA compliance is claimed.
- No login or authorization in the first release.
