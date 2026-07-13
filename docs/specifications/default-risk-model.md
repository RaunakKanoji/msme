# Specification: 12-Month Default Risk Model

**Objective** — Predict the probability of a defined default event within 12 months, separately from the unified
Financial Health Score (they answer different questions).

**Scope (implemented)** — Stage-1 **bootstrap scorecard** (`lib/default-risk/pd-engine.ts`,
`pd-bootstrap-scorecard-v1.0.0`): deterministic, points-based, monotonic (worse cash-flow margin, DSCR, liquidity,
or leverage can only raise PD), converted to a probability via a logistic transform anchored at a 3.5% baseline with
30 points-to-double-the-odds. Configurable PD bands (`risk-bands.ts`, `pd-bands-v1`) and default definition
(`default-90dpd-v1`) are versioned on every assessment. Segment routing (`segments.ts`): NTC / NTB /
EXISTING_TO_BANK / THIN_FILE; thin-file assessments are marked PROVISIONAL; absent bureau history is explicitly
neutral for NTC (zero points, recorded for transparency).

**Actors** — MSME owner (sees own PD, plain language), credit analyst / risk officer (sees factors, model +
definition versions), model-risk officer (future: validation reports).

**API** — PD is embedded in `GET /api/v1/msme-registry` rows and `GET /api/v1/msme-registry/{id}`
(`defaultRisk` object with factors and versions); the MSME app computes it server-side on the financial-health page.

**UI** — Displayed as `Predicted 12-Month Probability of Default: X.X%` with band, never merged into the health
score; provisional status labelled; "not a bureau score" stated.

**Acceptance criteria (met)** — determinism; monotonic transform; stressed scenario > stable scenario PD; NTC
neutrality; versions recorded. Tests: `tests/default-risk.test.ts`.

**Known limitations** — This is Section 11.2 Stage 1 only: no trained champion (WOE logistic) or challenger
(LightGBM/XGBoost/EBM), no calibration against observed outcomes, no reject inference, no drift monitoring. Those
require a historical outcome dataset and the Python ML service, both out of scope for this phase.
