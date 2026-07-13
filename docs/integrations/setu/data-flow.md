# Data flow

An active consent creates exactly one manual data session unless Auto-Fetch is enabled. Sessions progress through `PENDING`, `PARTIAL`, `COMPLETED`, `FAILED`, or `EXPIRED`. FI data is fetched only for `PARTIAL` or `COMPLETED`; partial results remain visibly incomplete.
