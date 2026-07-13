import type { MsmeDetail } from "../msme-registry/registry.ts";
import type { CreditApplication } from "../msme-registry/applications.ts";
// Deterministic credit-decision engine (credit-policy-v1 / decision-matrix-v1 / limit-rec-v1). Evaluates the
// versioned eligibility rules against the REAL health + PD assessment and produces a RECOMMENDATION — never an
// approval: the model must not bypass policy, and final authority is always a human credit officer.
export const POLICY_VERSION = "credit-policy-v1";
export const MATRIX_VERSION = "decision-matrix-v1";
export const LIMIT_VERSION = "limit-rec-v1";
export type PolicyOutcome = "PASS" | "FAIL" | "REVIEW";
export type PolicyResult = { rule: string; outcome: PolicyOutcome; detail: string };
export type DecisionRecommendation = "ELIGIBLE" | "CONDITIONALLY_ELIGIBLE" | "MANUAL_REVIEW" | "DECLINE_RECOMMENDED";
export type DecisionEvaluation = {
  recommendation: DecisionRecommendation;
  policyResults: PolicyResult[];
  recommendedLimit: number;
  maxAnnualDebtService: number;
  targetDscr: number;
  expectedLossRate: number;
  versions: { policy: typeof POLICY_VERSION; matrix: typeof MATRIX_VERSION; limit: typeof LIMIT_VERSION; model: string; bands: string };
  humanAuthorityNote: string;
};
const TARGET_DSCR = 1.5;
const LGD = 0.45; // configurable assumption, recorded with the evaluation
export function evaluateApplication(detail: MsmeDetail, application: CreditApplication): DecisionEvaluation {
  const { msme, snapshot, health, defaultRisk } = detail;
  const results: PolicyResult[] = [];
  const add = (rule: string, outcome: PolicyOutcome, detailText: string) => results.push({ rule, outcome, detail: detailText });
  add("MIN_VINTAGE_2Y", msme.vintageYears >= 2 ? "PASS" : "FAIL", `Business vintage ${msme.vintageYears} years (minimum 2).`);
  add("PD_BELOW_25PCT", defaultRisk.probabilityOfDefault12M < 0.25 ? "PASS" : "FAIL", `Predicted 12-month PD ${(defaultRisk.probabilityOfDefault12M * 100).toFixed(1)}% (limit 25%).`);
  add("HEALTH_35_PLUS", health.overallScore >= 35 ? "PASS" : "FAIL", `Financial health score ${health.overallScore} (minimum 35).`);
  const dscr = snapshot.debtObligations > 0 ? snapshot.netCashFlow / snapshot.debtObligations : 3;
  add("DSCR_1_PLUS", dscr >= 1 ? "PASS" : "FAIL", `Debt-service coverage proxy ${dscr.toFixed(2)}x (minimum 1.0x).`);
  add("THIN_FILE_REVIEW", defaultRisk.status === "PROVISIONAL" ? "REVIEW" : "PASS", defaultRisk.status === "PROVISIONAL" ? "Provisional assessment — manual review required." : "Assessment is final.");
  add("ELEVATED_PD_REVIEW", defaultRisk.probabilityOfDefault12M >= 0.12 ? "REVIEW" : "PASS", defaultRisk.probabilityOfDefault12M >= 0.12 ? "PD 12%+ routes to manual review." : "PD below the review threshold.");
  const fails = results.filter((r) => r.outcome === "FAIL").length;
  const reviews = results.filter((r) => r.outcome === "REVIEW").length;
  const recommendation: DecisionRecommendation = fails >= 2 ? "DECLINE_RECOMMENDED" : fails === 1 ? "MANUAL_REVIEW" : reviews > 0 ? "MANUAL_REVIEW" : health.overallScore >= 65 ? "ELIGIBLE" : "CONDITIONALLY_ELIGIBLE";
  // Affordability (limit-rec-v1): max annual debt service = cash available / target DSCR.
  const cashAvailable = Math.max(0, snapshot.netCashFlow) * 12;
  const maxAnnualDebtService = cashAvailable / TARGET_DSCR;
  const recommendedLimit = Math.min(application.amount, Math.round((maxAnnualDebtService * 3) / 100000) * 100000);
  return {
    recommendation, policyResults: results,
    recommendedLimit, maxAnnualDebtService: Math.round(maxAnnualDebtService), targetDscr: TARGET_DSCR,
    expectedLossRate: Number((defaultRisk.probabilityOfDefault12M * LGD).toFixed(4)),
    versions: { policy: POLICY_VERSION, matrix: MATRIX_VERSION, limit: LIMIT_VERSION, model: defaultRisk.modelVersion, bands: defaultRisk.bandConfigVersion },
    humanAuthorityNote: "Recommendation only. Approval, decline, and pricing are human credit decisions within approved authority; overrides require justification and maker-checker approval.",
  };
}
