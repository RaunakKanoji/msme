# Consent flow

The backend creates consent and stores `PENDING`, external ID, approval URL, scope, dates, purpose, correlation ID, and expiry. The callback is UX only and polls local state; approval is established through a validated notification or reconciliation. `ACTIVE`, `REJECTED`, `REVOKED`, `PAUSED`, and `EXPIRED` are authoritative terminal/operational states.
