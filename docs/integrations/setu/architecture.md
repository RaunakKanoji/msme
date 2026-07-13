# Architecture

Application routes call `AccountAggregatorProvider`; business services do not import `SetuProvider`. The Setu client is server-only. The browser receives only safe application IDs, states, and Setu's approval URL. Webhooks persist/deduplicate state transitions and reconciliation covers missed notifications.
