# Troubleshooting

- `SETU_CONFIGURATION_ERROR`: verify server-only Bridge credentials, base URL, callback, and approved purpose fields.
- Consent remains pending: run manual sync and verify consent notification configuration.
- Session remains pending: check FI notifications and reconcile; do not fetch before partial/completed.
- Duplicate webhook: expected safe idempotent acknowledgement.
- Disable Setu: set `SETU_MODE=demo` explicitly; demo data must never be presented as sandbox or production FI evidence.
