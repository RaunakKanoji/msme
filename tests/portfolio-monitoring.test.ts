import assert from "node:assert/strict"; import test from "node:test";
import { branchAnalytics, exposureSummary, segmentAnalytics, watchlist } from "../lib/portfolio-monitoring/portfolio-analytics.ts";
import { listRegistry } from "../lib/msme-registry/registry.ts";
// Uniform coverage for the ten 09-batch slices plus the live portfolio analytics rules.
const SLUGS = ["portfolio-dashboard", "watchlist-management", "early-warning-indicators", "stress-trend-analysis", "segment-risk-analytics", "branch-risk-analytics", "exposure-monitoring", "collection-handoff", "renewal-review", "portfolio-alerts"];
const analyst = { "x-user-role": "bank_analyst", "content-type": "application/json" };
for (const slug of SLUGS) {
  test(`09 ${slug}: CRUD, RBAC, and audit`, async () => {
    const { handlers, store } = (await import(`../lib/portfolio-monitoring/${slug}.ts`)) as { handlers: { GET: (r: Request) => Promise<Response>; POST: (r: Request) => Promise<Response>; PATCH: (r: Request, c: { params: Promise<{ id: string }> }) => Promise<Response> }; store: { auditCount: () => number } };
    const ok = await handlers.GET(new Request(`http://test/api/v1/${slug}`, { headers: analyst }));
    const body = await ok.json();
    assert.equal(ok.status, 200); assert.equal(body.data.records.length, 2); assert.ok(body.trace_id.startsWith("trc_"));
    const denied = await handlers.GET(new Request(`http://test/api/v1/${slug}`, { headers: { "x-user-role": "borrower" } }));
    assert.equal(denied.status, 403); assert.equal("data" in (await denied.json()), false);
    const invalid = await handlers.POST(new Request(`http://test/api/v1/${slug}`, { method: "POST", headers: analyst, body: "{}" }));
    assert.equal(invalid.status, 400);
    const before = store.auditCount();
    const created = await handlers.POST(new Request(`http://test/api/v1/${slug}`, { method: "POST", headers: analyst, body: JSON.stringify({ label: "Test", version: "test-v1", summary: "Test summary." }) }));
    const createdBody = await created.json();
    assert.equal(created.status, 201);
    const patched = await handlers.PATCH(new Request("http://test/x", { method: "PATCH", headers: analyst, body: JSON.stringify({ status: "Adopted" }) }), { params: Promise.resolve({ id: createdBody.data.id }) });
    assert.equal(patched.status, 200);
    assert.equal(store.auditCount(), before + 2);
  });
}
test("portfolio analytics aggregate the live registry correctly", () => {
  const segments = segmentAnalytics();
  assert.equal(segments.reduce((s, r) => s + r.count, 0), 100);
  const branches = branchAnalytics();
  assert.equal(branches.reduce((s, r) => s + r.count, 0), 100);
  for (let i = 1; i < branches.length; i++) assert.ok(branches[i - 1].portfolioPd >= branches[i].portfolioPd);
  const exposure = exposureSummary();
  assert.ok(exposure.total > 0);
  for (const c of exposure.concentrated) assert.ok(c.share > 5);
  const watch = watchlist();
  assert.ok(watch.every((m) => m.pd >= 0.12 || m.healthScore < 45 || m.healthBand === "Critical"));
  for (let i = 1; i < watch.length; i++) assert.ok(watch[i - 1].pd >= watch[i].pd);
  const eligible = listRegistry().filter((m) => m.pd >= 0.12 || m.healthScore < 45 || m.healthBand === "Critical");
  assert.equal(watch.length, eligible.length);
});
