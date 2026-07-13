import type { FinancialSnapshot } from "./types.ts";
// Snapshot cache seam. A DB-backed cache (financial_data_snapshots) plugs in here later; until a runtime database
// is provisioned this is a no-op so the fallback chain degrades auto → mock without requiring a database.
export async function getLatestCachedSnapshot(_businessId: string): Promise<FinancialSnapshot | null> { return null; }
export async function saveSnapshotToCache(_snapshot: FinancialSnapshot): Promise<void> { /* no-op until DB cache is connected */ }
