# UI, Routing, and Data Audit

_MSME Arogya360 — consolidation, routing repair, and Setu fallback._

## 1. Method

Read-only inspection of `app/`, `components/`, `lib/`, `server/`, `proxy.ts`, and the
existing Setu integration, plus a scan for the anti-patterns named in the brief
(`window.location`, internal `<a href>`, client→Setu direct calls, secrets in client
bundles, duplicate navigation).

## 2. What is already good (do NOT rebuild)

- **A single authenticated app shell already exists.** `app/app/layout.tsx` →
  `components/app-shell/app-shell.tsx` renders sidebar + topbar + mobile nav once, and
  **every** product page lives under `app/app/*` and renders inside it. There is no
  per-page sidebar/header duplication.
- **One navigation source of truth:** `lib/constants/navigation.ts` (`APP_NAVIGATION`),
  consumed by `components/app-shell/sidebar-navigation.tsx` and `mobile-navigation.tsx`
  via `usePathname()` for active state.
- **No client → Setu direct calls and no secrets in client code.** Client components
  (`components/setu/*`) fetch internal `/api/integrations/setu/*` route handlers only.
  Setu credentials + `SetuClient` are `server-only`. `proxy.ts` (Clerk) marks the Setu
  webhook/callback routes public.
- **Setu is already provider-abstracted server-side** under `server/account-aggregator/`
  (`provider.ts` selects demo vs Setu; `SetuProvider`, `SetuClient`, mappers, schemas,
  normalization/metrics/feature services). This is close to the target adapter shape.
- Route-level `loading.tsx` / `error.tsx` exist for the `app/app` group.

Conclusion: the "fragmented UI / separate layouts / duplicate sidebars" premise is
**largely not true** for the current tree. The shell and navigation are already unified.

## 3. The real gaps (what this task fixes)

1. **No fallback data path.** The Financial Health page (`components/setu/financial-health-summary.tsx`)
   reads `/api/integrations/setu/financial-summary`, which is backed by the in-memory AA
   store and is empty unless a live Setu ingestion runs. With Setu unavailable the page
   shows only "Awaiting verified data" — the product is not usable. **This is the headline
   problem.** There is no `auto → cache → mock` chain and no deterministic demo dataset.
2. **No application-owned normalized snapshot type** consumed uniformly. Track 03 math
   (`server/account-aggregator/metrics-service.ts`) consumes `NormalizedFinancialTransaction`,
   but there is no `FinancialSnapshot` domain object with `DataSourceMetadata`.
3. **No data-source status indicator.** The UI cannot tell the user whether data is live,
   cached, or demo. Definition-of-Done requires this.
4. **No `/api/financial-data` or health endpoints** (`/api/health`, `/api/integrations/setu/health`).
5. **Env config** does not express provider mode / fallback / scenario.

Minor anti-patterns found (low priority, not blocking): 1 `window.location.assign`
(in `setu-consent-form.tsx`, an intentional external redirect to Setu's hosted webview —
acceptable), 3 internal `<a href="/…">` in `app/app/consents/*` sub-navs (should be `<Link>`).

## 4. Target architecture (this task)

```text
lib/financial-data/
├── types.ts                 # DataSourceMetadata, FinancialAccount/Transaction/Snapshot,
│                            #   FinancialDataContext, ProviderResult, error codes,
│                            #   FinancialHealthResult/Metric
├── provider.ts              # FinancialDataProvider interface + ProviderHealthResult
├── provider-result.ts       # ok()/err() helpers
├── financial-config.ts      # env: FINANCIAL_DATA_PROVIDER / _FALLBACK_ENABLED / _MOCK_SCENARIO
├── financial-data-service.ts# auto→(setu)→(cache)→mock fallback; single entry point
├── financial-health-engine.ts # FinancialSnapshot → FinancialHealthResult (Track 03 math)
└── providers/
    ├── setu/setu-financial-provider.ts   # server-only adapter over server/account-aggregator
    └── mock/{mock-provider,mock-data,mock-scenarios}.ts  # deterministic seeded fixtures
```

- `GET /api/financial-data` — normalized snapshot + `source` metadata.
- `GET /api/health`, `GET /api/integrations/setu/health` — safe status (no secrets).
- Financial Health + Overview consume `/api/financial-data`; a shared `DataSourceBadge`
  and fallback notice make live/cached/demo explicit.
- The **same** engine scores both Setu and mock snapshots (no separate fake calc).

## 5. Deliberately deferred (not in this pass, called out honestly)

- Wholesale migration of `app/app/*` → `app/(app)/*` route groups. The existing
  `app/app` shell already delivers unified navigation; the constraints say to *adapt, not
  move files blindly*, and a mass move is high-churn/high-risk for no functional gain now.
- DB-backed snapshot cache (`financial_data_snapshots`): no runtime DB is provisioned
  (`SETU_ALLOW_EPHEMERAL_STORE`), so the cache tier is stubbed behind an interface and the
  chain degrades `auto → mock` until a DB is connected. Mock works without any DB.
- Track 04 default-risk logic (explicitly out of scope; route stays a labelled placeholder).
- Converting the 3 internal `<a href>` sub-nav links to `<Link>` (cosmetic; noted above).

## 6. Files to reuse

- Track 03 math: `server/account-aggregator/metrics-service.ts`, `normalization-service.ts`,
  `feature-service.ts` (decimal-safe; keep as the single calc path).
- Shell/nav: `components/app-shell/*`, `lib/constants/navigation.ts` (unchanged).
- Setu server client: `server/account-aggregator/providers/setu/*` (wrapped, not rewritten).
