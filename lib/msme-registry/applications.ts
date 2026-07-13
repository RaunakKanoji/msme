import { listRegistry } from "./registry.ts";
// Deterministic demo credit applications derived from registry organizations — powers the dashboard pipeline and
// the applications workspace. Same one-scoring-path principle: no random values, stable across restarts.
export type ApplicationStage = "Application Received" | "Under Review" | "Information Requested" | "Underwriting" | "Risk Assessment" | "Approved" | "Declined" | "Closed";
export type CreditApplication = { id: string; msmeId: string; msmeName: string; maskedPan: string; gstin: string; product: string; amount: number; stage: ApplicationStage; assignedTo: string; healthScore: number; healthBand: string; pd: number; updatedAt: string };
export const APPLICATION_STAGES: ApplicationStage[] = ["Application Received", "Under Review", "Information Requested", "Underwriting", "Risk Assessment", "Approved", "Declined", "Closed"];
export const IN_PROGRESS_STAGES: ApplicationStage[] = ["Application Received", "Under Review", "Information Requested", "Underwriting", "Risk Assessment"];
const PRODUCTS = ["Term Loan", "Working Capital", "OD Facility", "Bill Discounting"];
const ASSIGNEES = ["Anita Verma", "Rohit Singh", "Neha Patil", "Rahul Sharma", "Kunal Mehta", "Moena Iyer", "Sanjay Rao"];
const STAGE_PATTERN = [1, 2, 0, 3, 4, 5, 1, 6, 5, 7, 3, 1, 0, 5, 2] as const;
let cache: CreditApplication[] | null = null;
export function listApplications(): CreditApplication[] {
  if (cache) return cache;
  cache = listRegistry().filter((_, i) => i % 2 === 0).map((m, i) => ({
    id: `APP-2026-${String(1001 + i).padStart(6, "0")}`,
    msmeId: m.id, msmeName: m.legalName, maskedPan: m.maskedPan, gstin: m.gstin,
    product: PRODUCTS[i % PRODUCTS.length],
    amount: [5000000, 2500000, 7500000, 1500000, 12000000, 850000, 6000000][i % 7],
    stage: APPLICATION_STAGES[STAGE_PATTERN[i % STAGE_PATTERN.length]],
    assignedTo: ASSIGNEES[i % ASSIGNEES.length],
    healthScore: m.healthScore, healthBand: m.healthBand, pd: m.pd,
    updatedAt: new Date(Date.UTC(2026, 6, 1 + (i % 13), 9 + (i % 8), (i * 7) % 60)).toISOString(),
  }));
  return cache;
}
export function applicationsByStage(): Array<{ stage: ApplicationStage; count: number }> {
  const apps = listApplications();
  return APPLICATION_STAGES.map((stage) => ({ stage, count: apps.filter((a) => a.stage === stage).length }));
}
export function applicationsForMsme(msmeId: string): CreditApplication[] { return listApplications().filter((a) => a.msmeId === msmeId); }
export function applicationSummary() {
  const apps = listApplications();
  const count = (stages: ApplicationStage[]) => apps.filter((a) => stages.includes(a.stage)).length;
  const approved = count(["Approved"]);
  const decided = approved + count(["Declined"]);
  return { total: apps.length, inProgress: count(IN_PROGRESS_STAGES), approved, declined: count(["Declined"]), closed: count(["Closed"]), conversionRate: decided ? Math.round((approved / decided) * 1000) / 10 : 0 };
}
