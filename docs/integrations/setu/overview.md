# Setu Account Aggregator

MSME Arogya360 uses a provider-neutral Account Aggregator layer with Setu as the first provider. `SETU_MODE=demo` is local-only and never represents production financial evidence. `SETU_MODE=setu` enables server-side sandbox calls when Bridge credentials and approved product configuration are present.

The workflow is consent → notification/reconciliation → data session → partial/completed FI fetch → normalization → metrics → versioned risk features. Production connectivity is not complete until FIU/Sahamati onboarding, regulatory and product-instance approval, production credentials, callback configuration, and live FIP testing are complete.
