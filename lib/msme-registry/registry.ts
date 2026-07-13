import { calculateFinancialHealth } from "../financial-data/financial-health-engine.ts";
import { buildMockSnapshot } from "../financial-data/providers/mock/mock-data.ts";
import { MOCK_SCENARIOS } from "../financial-data/providers/mock/mock-scenarios.ts";
import type { FinancialHealthResult, FinancialSnapshot, MockFinancialScenario } from "../financial-data/types.ts";
import { assessDefaultRisk, type PdAssessment } from "../default-risk/pd-engine.ts";
import { healthBand, HEALTH_BAND_CONFIG, type HealthBandName } from "../default-risk/risk-bands.ts";
import type { MsmeSegment } from "../default-risk/segments.ts";
// Central MSME registry (Section 4): one canonical record per enterprise, 100 deterministic demonstration MSMEs.
// CRITICAL: every registry entry is scored through the SAME health engine and PD engine as the customer app —
// there is no second scoring path for demo data. All records are clearly demonstration data.
export type RegistryMsme = {
  id: string;
  legalName: string;
  tradingName: string;
  maskedPan: string;
  gstin: string;
  udyam: string;
  constitution: string;
  industry: string;
  nicCode: string;
  vintageYears: number;
  state: string;
  branch: string;
  relationshipManager: string;
  segment: MsmeSegment;
  scenario: MockFinancialScenario;
  healthScore: number;
  healthBand: HealthBandName;
  pd: number;
  pdBand: string;
  assessmentStatus: "FINAL" | "PROVISIONAL";
  connectedSources: string[];
  alertCount: number;
  lastAssessedAt: string;
  onboardedAt: string;
  isDemo: true;
};
export type MsmeDetail = { msme: RegistryMsme; snapshot: FinancialSnapshot; health: FinancialHealthResult; defaultRisk: PdAssessment; alerts: RegistryAlert[] };
export type RegistryAlert = { id: string; severity: "Informational" | "Low" | "Medium" | "High" | "Critical"; type: string; detail: string; raisedAt: string };
const SCENARIOS: MockFinancialScenario[] = ["healthy-growth", "stable-business", "stable-business", "seasonal-business", "high-debt", "cash-flow-stress", "incomplete-data"];
const INDUSTRIES: Array<[string, string]> = [["Manufacturing", "25"], ["Trading", "46"], ["Services", "62"], ["Food processing", "10"], ["Textiles", "13"], ["Auto components", "29"], ["Logistics", "52"], ["Healthcare services", "86"]];
const STATES = ["Maharashtra", "Gujarat", "Tamil Nadu", "Karnataka", "Uttar Pradesh", "West Bengal", "Rajasthan", "Telangana"];
const BRANCHES = ["Mumbai Fort", "Ahmedabad CG Road", "Chennai Anna Salai", "Bengaluru MG Road", "Lucknow Hazratganj", "Kolkata Park Street", "Jaipur MI Road", "Hyderabad Banjara Hills"];
const RMS = ["A. Sharma", "P. Iyer", "R. Deshmukh", "S. Banerjee", "K. Reddy", "M. Patel", "V. Nair", "J. Singh"];
const NAME_A = ["Saraswati", "Verdant", "Coastal", "Meridian", "Himalaya", "Kaveri", "Aravalli", "Deccan", "Ganga", "Malabar"];
const NAME_B = ["Precision Works", "Agro Exports", "Textiles", "Fabricators", "Handlooms", "Foods", "Components", "Logistics", "Enterprises", "Industries"];
function seeded(seed: number) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const pad = (n: number, w: number) => String(n).padStart(w, "0");
function buildAlerts(msmeIndex: number, health: FinancialHealthResult, pd: PdAssessment): RegistryAlert[] {
  const alerts: RegistryAlert[] = [];
  const at = new Date(Date.UTC(2026, 6, 1 + (msmeIndex % 12))).toISOString();
  if (health.overallScore < 45) alerts.push({ id: `alert_${msmeIndex}_score`, severity: "High", type: "SCORE_DETERIORATION", detail: "Financial health score is in a weak band for this period.", raisedAt: at });
  if (pd.probabilityOfDefault12M >= 0.12) alerts.push({ id: `alert_${msmeIndex}_pd`, severity: pd.probabilityOfDefault12M >= 0.25 ? "Critical" : "High", type: "PD_INCREASE", detail: "Predicted 12-month default probability is elevated.", raisedAt: at });
  for (const risk of health.risks.slice(0, 1)) alerts.push({ id: `alert_${msmeIndex}_${risk.id}`, severity: "Medium", type: "RISK_INDICATOR", detail: risk.detail, raisedAt: at });
  if (pd.status === "PROVISIONAL") alerts.push({ id: `alert_${msmeIndex}_thin`, severity: "Informational", type: "THIN_FILE", detail: "Assessment is provisional — insufficient history; request additional information.", raisedAt: at });
  return alerts;
}
function buildDetail(index: number): MsmeDetail {
  const rand = seeded(9000 + index);
  const scenario = SCENARIOS[index % SCENARIOS.length];
  const [industry, nicCode] = INDUSTRIES[index % INDUSTRIES.length];
  const geo = index % STATES.length;
  const legalName = `${NAME_A[index % NAME_A.length]} ${NAME_B[Math.floor(index / NAME_A.length) % NAME_B.length]} ${index >= 50 ? "Pvt Ltd" : "LLP"}`;
  const id = `msme_demo_${pad(index + 1, 3)}`;
  const snapshot = buildMockSnapshot(scenario, { businessId: id, businessName: legalName }, { fetchedAt: new Date(Date.UTC(2026, 6, 13)).toISOString(), message: "Demonstration data — not real bank data." });
  const flags = { hasBureauHistory: index % 3 === 0, isExistingToBank: index % 4 === 0 };
  const health = calculateFinancialHealth(snapshot);
  const defaultRisk = assessDefaultRisk(snapshot, flags);
  const alerts = buildAlerts(index, health, defaultRisk);
  const sources = ["ACCOUNT_AGGREGATOR", "GST"]; if (index % 2 === 0) sources.push("UPI"); if (index % 5 === 0) sources.push("EPFO"); if (flags.hasBureauHistory) sources.push("BUREAU");
  const msme: RegistryMsme = {
    id, legalName, tradingName: legalName.split(" ").slice(0, 2).join(" "),
    maskedPan: `•••••${pad(1000 + index, 4)}•`, gstin: `${pad(geo + 7, 2)}•••••${pad(2000 + index, 4)}•Z•`, udyam: `UDYAM-${STATES[geo].slice(0, 2).toUpperCase()}-${pad(index + 11, 2)}-${pad(70000 + index * 7, 7)}`,
    constitution: index >= 50 ? "Private Limited" : "LLP", industry, nicCode, vintageYears: 2 + Math.floor(rand() * 18),
    state: STATES[geo], branch: BRANCHES[geo], relationshipManager: RMS[index % RMS.length],
    segment: defaultRisk.segment, scenario,
    healthScore: health.overallScore, healthBand: healthBand(health.overallScore, HEALTH_BAND_CONFIG),
    pd: defaultRisk.probabilityOfDefault12M, pdBand: defaultRisk.pdBand, assessmentStatus: defaultRisk.status,
    connectedSources: sources, alertCount: alerts.length,
    lastAssessedAt: new Date(Date.UTC(2026, 6, 13)).toISOString(), onboardedAt: new Date(Date.UTC(2025, index % 12, 1 + (index % 27))).toISOString(),
    isDemo: true,
  };
  return { msme, snapshot, health, defaultRisk, alerts };
}
let cache: MsmeDetail[] | null = null;
export function listRegistry(): RegistryMsme[] { return details().map((d) => d.msme); }
export function getMsmeDetail(id: string): MsmeDetail | undefined { return details().find((d) => d.msme.id === id); }
function details(): MsmeDetail[] { if (!cache) cache = Array.from({ length: 100 }, (_, i) => buildDetail(i)); return cache; }
export type RegistryFilters = { band?: string; segment?: string; industry?: string; state?: string; search?: string; minScore?: number; maxScore?: number; alertsOnly?: boolean };
export function filterRegistry(filters: RegistryFilters): RegistryMsme[] {
  return listRegistry().filter((m) =>
    (!filters.band || m.healthBand === filters.band) &&
    (!filters.segment || m.segment === filters.segment) &&
    (!filters.industry || m.industry === filters.industry) &&
    (!filters.state || m.state === filters.state) &&
    (filters.minScore === undefined || m.healthScore >= filters.minScore) &&
    (filters.maxScore === undefined || m.healthScore <= filters.maxScore) &&
    (!filters.alertsOnly || m.alertCount > 0) &&
    (!filters.search || `${m.legalName} ${m.id} ${m.gstin}`.toLowerCase().includes(filters.search.toLowerCase())));
}
export function listAllAlerts(): Array<RegistryAlert & { msmeId: string; msmeName: string }> {
  return details().flatMap((d) => d.alerts.map((a) => ({ ...a, msmeId: d.msme.id, msmeName: d.msme.legalName })))
    .sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
}
function severityRank(s: RegistryAlert["severity"]): number { return ["Informational", "Low", "Medium", "High", "Critical"].indexOf(s); }
export function portfolioSummary() {
  const all = listRegistry();
  const avg = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);
  const byBand = Object.fromEntries(HEALTH_BAND_CONFIG.bands.map((b) => [b.name, all.filter((m) => m.healthBand === b.name).length]));
  return {
    total: all.length,
    ntc: all.filter((m) => m.segment === "NTC").length,
    ntb: all.filter((m) => m.segment === "NTB").length,
    existingToBank: all.filter((m) => m.segment === "EXISTING_TO_BANK").length,
    thinFile: all.filter((m) => m.segment === "THIN_FILE").length,
    averageScore: Math.round(avg(all.map((m) => m.healthScore))),
    portfolioPd: Number(avg(all.map((m) => m.pd)).toFixed(4)),
    highRisk: all.filter((m) => m.pd >= 0.12).length,
    withAlerts: all.filter((m) => m.alertCount > 0).length,
    byBand,
    byIndustry: INDUSTRIES.map(([name]) => ({ industry: name, count: all.filter((m) => m.industry === name).length })),
  };
}
