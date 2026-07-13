# Production readiness

Production is blocked until FIU/Sahamati onboarding, regulatory approval, Setu live product review, production credentials, approved purpose configuration, HTTPS callbacks/webhooks, exact verification controls, retention/legal review, live FIP interoperability testing, model validation, operational alerts, and disaster/reconciliation testing are complete. `productionReady` remains false in the status API. `SETU_PERSISTENCE_READY` must remain false until the generated Prisma migration is applied and runtime Neon persistence replaces the demo in-memory store.
