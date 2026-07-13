# Specification: Central MSME Registry

**Objective** — One canonical record per legal enterprise, visible to authorized bank users; never one record per
loan application.

**Scope (implemented)** — `lib/msme-registry/registry.ts`: 100 deterministic demonstration MSMEs (seeded; stable
across restarts) spanning segments (NTC/NTB/existing-to-bank/thin-file), industries, states, branches, RMs, and the
six financial scenarios. Every entry is scored through the **same** health engine (`financial-health-engine.ts`)
and PD engine (`pd-engine.ts`) as the customer app — one scoring path, no fake second calculation. Records carry
masked PAN/GSTIN/Udyam, health score + configurable band, PD + band, assessment status, connected sources, alerts.

**API** — `GET /api/v1/msme-registry` (filters: band, segment, industry, state, search, minScore, maxScore,
alertsOnly; plus portfolio summary), `GET /api/v1/msme-registry/{id}` (identity + health + defaultRisk + alerts +
snapshot summary). Bank-role gated via the house RBAC helper; borrower roles receive a safe 403.

**UI** — `/bank` portfolio dashboard, `/bank/msmes` filterable table, `/bank/msmes/[id]` tabbed 360 profile
(Overview / Identity / Health score / Default risk / Alerts), `/bank/alerts` severity-ordered queue — all inside one
persistent bank shell (`components/bank-shell/bank-shell.tsx`).

**Acceptance criteria (met)** — 100 unique canonical records; list score === detail score; filters correct;
summary segment counts total 100. Tests: `tests/default-risk.test.ts`.

**Known limitations** — In-memory demonstration registry (no PostgreSQL persistence yet); registry filters cover
the core subset of Section 4.2, not all ~20 filters; profile implements 5 of the 19 Section 4.3 tabs; branch/region
row-level access control is not enforced beyond role gating; customer-onboarding → registry sync is pending the
shared database.
