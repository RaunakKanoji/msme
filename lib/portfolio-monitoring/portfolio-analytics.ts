import { getMsmeDetail, listRegistry, type RegistryMsme } from "../msme-registry/registry.ts";
// Live portfolio analytics (segment-risk-v1 / branch-risk-v1 / exposure-v1 / watchlist-v1) aggregated from the
// shared registry — anonymized aggregates and masked identifiers only.
const avg = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);
function groupStats(items: RegistryMsme[]) {
  return { count: items.length, averageScore: Math.round(avg(items.map((m) => m.healthScore))), portfolioPd: Number(avg(items.map((m) => m.pd)).toFixed(4)), alerts: items.reduce((s, m) => s + m.alertCount, 0) };
}
export function segmentAnalytics() {
  const all = listRegistry();
  return ["NTC", "NTB", "EXISTING_TO_BANK", "THIN_FILE"].map((segment) => ({ segment, ...groupStats(all.filter((m) => m.segment === segment)) }));
}
export function branchAnalytics() {
  const all = listRegistry();
  return [...new Set(all.map((m) => m.branch))].map((branch) => ({ branch, ...groupStats(all.filter((m) => m.branch === branch)) })).sort((a, b) => b.portfolioPd - a.portfolioPd);
}
export function exposureSummary() {
  const all = listRegistry();
  const exposures = all.map((m) => ({ id: m.id, legalName: m.legalName, exposure: getMsmeDetail(m.id)!.snapshot.liabilities }));
  const total = exposures.reduce((s, e) => s + e.exposure, 0);
  const concentrated = exposures.filter((e) => total > 0 && e.exposure / total > 0.05).map((e) => ({ ...e, share: Number(((e.exposure / total) * 100).toFixed(1)) }));
  return { total, concentrated };
}
// watchlist-v1 auto-entry: PD 12%+, health < 45, or Critical band.
export function watchlist() {
  return listRegistry().filter((m) => m.pd >= 0.12 || m.healthScore < 45 || m.healthBand === "Critical").sort((a, b) => b.pd - a.pd);
}
