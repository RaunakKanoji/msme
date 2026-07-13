# Specification: Bank-Owned Multi-MSME Organization Architecture

**Objective** — Every MSME is a first-class organization under the bank tenant with its own users, identity,
assignments, lifecycle, and linked financial records — never just a user account or a loan application.

**Scope (implemented)** — `lib/msme-org/`:
- `MSMEOrganization` entity (§3): UUID canonical id (PAN/GSTIN/Udyam are attributes, never keys), bankId tenant
  link, onboarding source (§4), 16-state lifecycle (§12, separate from credit/monitoring status), verification
  status (PROVISIONAL / IMPORTED_* / VERIFIED).
- Store seeded with one canonical organization per scored registry MSME (100+), plus mutations: bank-created
  onboarding with **duplicate detection** (§5: NO_MATCH / POSSIBLE_MATCH / EXACT_MATCH — exact identifier matches
  are refused, never silently created), **idempotent create**, invitation (token + expiry, PROSPECT→INVITED),
  **history-preserving reassignment** (§7), memberships (§6: many-to-many users↔organizations with roles,
  ownership %, authorization status), lifecycle transitions with actor/note history, **bulk import** (§4.4: dry-run,
  invalid-row reporting, duplicate refusal, partial success, summary), dashboard stats (§14 subset).
- APIs (§15 subset, bank-role gated, PAN always masked): `POST/GET /api/v1/bank/msme-organizations`,
  `GET/PATCH .../{id}`, `POST .../{id}/invite`, `POST .../{id}/assign`, `POST .../import`.
- Bank UI: **Add MSME** flow (`/bank/msmes/new`: duplicate check → provisional org → invite owner), registry
  "Add MSME" action, dashboard onboarding-pipeline metrics, and an **Organization tab** on the MSME profile
  (record, memberships/ownership, assignment history, lifecycle history).

**Acceptance criteria (met)** — bank-created onboarding; invitations; bulk import with dry-run; duplicate
prevention; one canonical record per enterprise; many-to-many memberships (one user in multiple organizations
seeded and tested); bank/branch/RM linkage with assignment history; role-gated APIs with masking; demo labelling.
Tests: `tests/msme-organizations.test.ts` (10 checks).

**Known limitations** — In-memory store (no PostgreSQL; §11 tables pending a provisioned database); MSME
self-onboarding is modelled (seeded source + status) but the customer signup flow does not yet write into this
store (needs the shared DB); merge review queue, CSV/XLSX file parsing, branch/region row-level ABAC, multi-bank
tenancy, and the remaining §15 endpoints (refresh-data, generate-assessment, imports/{id}, audit) are deferred.
