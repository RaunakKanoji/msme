# Webhook flow

Consent and FI endpoints capture the raw body, validate schemas, correlate consent/session IDs, deduplicate external event IDs, acknowledge quickly, and record safe state transitions. The configured product's exact verification mechanism must be confirmed in Bridge; this implementation supports a shared unpredictable secret and does not invent a signature scheme. Reconciliation is mandatory because Setu documentation says notification retries are not currently guaranteed.
