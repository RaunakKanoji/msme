import { listRegistry } from "./registry.ts";
// Deterministic demo credit applications derived from registry organizations — powers the dashboard pipeline and
// the applications workspace. Same one-scoring-path principle: no random values, stable across restarts.
export type ApplicationStage = "Application Received" | "Under Review" | "Information Requested" | "Approved" | "Declined";
export type CreditApplication = { id: string; msmeId: string; msmeName: string; product: string; amount: number; stage: ApplicationStage; assignedTo: string; updatedAt: string };
const STAGES: ApplicationStage[] = ["Application Received", "Under Review", "Information Requested", "Approved", "Declined"];
const PRODUCTS = ["Term Loan", "Working Capital", "OD Facility", "Bill Discounting"];
const ASSIGNEES = ["Anita Verma", "Rohit Singh", "Neha Patil", "Rahul Sharma", "Kunal Mehta"];
let cache: CreditApplication[] | null = null;
export function listApplications(): CreditApplication[] {
  if (cache) return cache;
  cache = listRegistry().filter((_, i) => i % 2 === 0).map((m, i) => ({
    id: `APP-2026-${String(1001 + i).padStart(6, "0")}`,
    msmeId: m.id, msmeName: m.legalName,
    product: PRODUCTS[i % PRODUCTS.length],
    amount: [5000000, 2500000, 7500000, 1500000, 10000000][i % 5],
    stage: STAGES[[0, 1, 1, 2, 1, 3, 0, 4, 3, 1][i % 10]],
    assignedTo: ASSIGNEES[i % ASSIGNEES.length],
    updatedAt: new Date(Date.UTC(2026, 6, 1 + (i % 13))).toISOString(),
  }));
  return cache;
}
export function applicationsByStage(): Array<{ stage: ApplicationStage; count: number }> {
  const apps = listApplications();
  return STAGES.map((stage) => ({ stage, count: apps.filter((a) => a.stage === stage).length }));
}
export function applicationsForMsme(msmeId: string): CreditApplication[] { return listApplications().filter((a) => a.msmeId === msmeId); }
