# Specification: Unified Financial Health Score

**Objective** — One unified 0–100 MSME Financial Health Score; data completeness/freshness/consistency feed the
score as features, and **no separate numerical Financial Data Score is displayed anywhere**.

**Scope (implemented)** — Deterministic engine (`lib/financial-data/financial-health-engine.ts`) over the
normalized `FinancialSnapshot` (same path for Setu-sourced and demonstration data): six explainable indicators
(cash-flow stability, revenue trend, debt-service, liquidity, expense ratio, working capital) blended with fixed
weights; strengths/risks/recommendations generated per assessment. Bands are configurable
(`lib/default-risk/risk-bands.ts`, `health-bands-v1`: Strong 80–100 / Healthy 65–79 / Watch 50–64 / Weak 35–49 /
Critical 0–34) — cut-offs are configuration, not UI constants. Data completeness is displayed as descriptive
context only (percentage + missing information), never as a second score. Serves as the Section 11.2 **Stage-1
bootstrap** for a future trained model.

**UI** — Customer: score card + PD strip + tabbed breakdown on `/app/financial-health`; card view at
`/app/businesses/[id]/health-card`. Bank: score tab in the MSME 360 profile with top positive/negative factors.

**Known limitations** — Rules-based bootstrap, not a trained ML regressor; no outcome calibration, SHAP, monotonic
GBM, or champion–challenger governance yet (requires historical outcomes + the Python ML service). Explanations use
grouped human-readable templates rather than model attributions.
