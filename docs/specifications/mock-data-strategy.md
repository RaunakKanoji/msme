# Specification: Mock Data Strategy

**Objective** — A complete deterministic demonstration ecosystem so the platform functions and is testable without
live providers, with mock data never silently presented as live.

**Scope (implemented)** — Seeded generators (mulberry32, fixed per-scenario seeds): six financial scenarios
(`lib/financial-data/providers/mock/mock-scenarios.ts`) produce internally consistent 12-month INR datasets
(opening + credits − debits = closing verified by `checkSnapshotConsistency`; revenue, supplier, salary, GST, rent,
utilities, EMI transactions; seasonality). The central registry (`lib/msme-registry/registry.ts`) composes 100
MSME profiles across strong/healthy/watch/weak/critical mixes, segments, industries, and states — each flagged
`isDemo: true` and scored through the shared engines. Provider modes `auto | setu | mock` with the fallback chain
(`lib/financial-data/fallback.ts`); every response carries `DataSourceMetadata` and the UI labels live / cached /
demo via `DataSourceBadge`.

**Acceptance criteria (met)** — Same seed ⇒ identical datasets and scores (tested); consistency checks pass for
all scenarios; demo labelling asserted in UI components; `setu` mode never silently returns mock.

**Known limitations** — Bureau facilities, EPFO contributions, GST return documents, loan applications, and score
histories are represented as summary flags/fields rather than full transactional fixtures; expand when those
modules land.
