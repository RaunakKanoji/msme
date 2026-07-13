import assert from "node:assert/strict"; import test from "node:test";
import { assessDefaultRisk, pointsToPd, PD_MODEL_VERSION } from "../lib/default-risk/pd-engine.ts";
import { healthBand, pdBand } from "../lib/default-risk/risk-bands.ts";
import { selectSegment } from "../lib/default-risk/segments.ts";
import { buildMockSnapshot } from "../lib/financial-data/providers/mock/mock-data.ts";
import { filterRegistry, getMsmeDetail, listRegistry, portfolioSummary } from "../lib/msme-registry/registry.ts";
const ctx = { businessId: "b" };

test("risk bands map configurable cut-offs", () => {
  assert.equal(healthBand(85), "Strong"); assert.equal(healthBand(70), "Healthy"); assert.equal(healthBand(55), "Watch"); assert.equal(healthBand(40), "Weak"); assert.equal(healthBand(10), "Critical");
  assert.equal(pdBand(0.01), "LOW"); assert.equal(pdBand(0.048), "LOW_MODERATE"); assert.equal(pdBand(0.3), "VERY_HIGH");
});

test("points transform is monotonic and bounded", () => {
  assert.ok(pointsToPd(0) > 0.03 && pointsToPd(0) < 0.04);
  assert.ok(pointsToPd(30) > pointsToPd(0));
  assert.ok(pointsToPd(-30) < pointsToPd(0));
  assert.ok(pointsToPd(1000) <= 0.99 && pointsToPd(-1000) >= 0.001);
});

test("segment routing follows section 12", () => {
  assert.equal(selectSegment({ hasBureauHistory: false, isExistingToBank: false, monthsOfBankData: 3, transactionCount: 10 }), "THIN_FILE");
  assert.equal(selectSegment({ hasBureauHistory: false, isExistingToBank: true, monthsOfBankData: 12, transactionCount: 90 }), "EXISTING_TO_BANK");
  assert.equal(selectSegment({ hasBureauHistory: false, isExistingToBank: false, monthsOfBankData: 12, transactionCount: 90 }), "NTC");
  assert.equal(selectSegment({ hasBureauHistory: true, isExistingToBank: false, monthsOfBankData: 12, transactionCount: 90 }), "NTB");
});

test("PD is deterministic, versioned, and higher for stressed businesses", () => {
  const stable = assessDefaultRisk(buildMockSnapshot("stable-business", ctx));
  const stable2 = assessDefaultRisk(buildMockSnapshot("stable-business", ctx));
  const stressed = assessDefaultRisk(buildMockSnapshot("cash-flow-stress", ctx));
  assert.equal(stable.probabilityOfDefault12M, stable2.probabilityOfDefault12M);
  assert.ok(stressed.probabilityOfDefault12M > stable.probabilityOfDefault12M);
  assert.equal(stable.modelVersion, PD_MODEL_VERSION);
  assert.equal(stable.definitionVersion, "default-90dpd-v1");
});

test("NTC bureau absence is neutral, thin-file is provisional", () => {
  const ntc = assessDefaultRisk(buildMockSnapshot("stable-business", ctx), { hasBureauHistory: false });
  const withBureau = assessDefaultRisk(buildMockSnapshot("stable-business", ctx), { hasBureauHistory: true });
  assert.equal(ntc.probabilityOfDefault12M, withBureau.probabilityOfDefault12M);
  assert.ok(ntc.factors.some((f) => f.code === "NO_BUREAU_HISTORY_NEUTRAL" && f.points === 0));
  const thin = assessDefaultRisk(buildMockSnapshot("incomplete-data", ctx));
  assert.equal(thin.segment, "THIN_FILE"); assert.equal(thin.status, "PROVISIONAL");
});

test("registry has 100 canonical demo MSMEs scored through the shared engines", () => {
  const all = listRegistry();
  assert.equal(all.length, 100);
  assert.equal(new Set(all.map((m) => m.id)).size, 100);
  for (const m of all.slice(0, 10)) { assert.ok(m.healthScore >= 0 && m.healthScore <= 100); assert.ok(m.pd > 0 && m.pd < 1); assert.equal(m.isDemo, true); }
  const detail = getMsmeDetail(all[0].id);
  assert.ok(detail); assert.equal(detail.health.overallScore, all[0].healthScore); assert.equal(detail.defaultRisk.probabilityOfDefault12M, all[0].pd);
});

test("registry filters and portfolio summary work", () => {
  const watch = filterRegistry({ band: "Watch" });
  assert.ok(watch.every((m) => m.healthBand === "Watch"));
  const searched = filterRegistry({ search: listRegistry()[0].legalName.slice(0, 9) });
  assert.ok(searched.length >= 1);
  const summary = portfolioSummary();
  assert.equal(summary.total, 100);
  assert.equal(summary.ntc + summary.ntb + summary.existingToBank + summary.thinFile, 100);
  assert.ok(summary.averageScore > 0 && summary.portfolioPd > 0);
});

test("registry API handlers gate roles and serve data", async () => {
  const { GET } = await import("../app/api/v1/msme-registry/route.ts");
  const { GET: GET_ONE } = await import("../app/api/v1/msme-registry/[id]/route.ts");
  const ok = await GET(new Request("http://test/api/v1/msme-registry?band=Watch", { headers: { "x-user-role": "bank_analyst" } }));
  const okBody = await ok.json();
  assert.equal(ok.status, 200); assert.equal(okBody.data.summary.total, 100); assert.ok(okBody.data.msmes.every((m: { healthBand: string }) => m.healthBand === "Watch"));
  const denied = await GET(new Request("http://test/api/v1/msme-registry", { headers: { "x-user-role": "borrower" } }));
  assert.equal(denied.status, 403);
  const one = await GET_ONE(new Request("http://test/api/v1/msme-registry/msme_demo_001", { headers: { "x-user-role": "bank_analyst" } }), { params: Promise.resolve({ id: "msme_demo_001" }) });
  const oneBody = await one.json();
  assert.equal(one.status, 200); assert.equal(oneBody.data.msme.id, "msme_demo_001"); assert.ok(oneBody.data.defaultRisk.modelVersion.startsWith("pd-bootstrap"));
});
