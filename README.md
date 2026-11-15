# CareView

A clinical patient-overview app built with **Next.js, React and TypeScript**. Search a patient directory, open a
patient chart, and review conditions, encounters, observations and medications in an enterprise-style interface.

> **Status:** planning complete; implementation starting (milestone M0). See [`PROGRESS.md`](PROGRESS.md).

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
Added once the app is scaffolded (M0). Requires Node 24.

## Privacy and limitations
- Synthetic, fictional data only.
- Not for clinical use; no PHIPA/HIPAA compliance is claimed.
- No login or authorization in the first release.
