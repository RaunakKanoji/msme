import assert from "node:assert/strict"; import test from "node:test";
import { evaluateApplication, POLICY_VERSION } from "../lib/credit-decisioning/decision-engine.ts";
import { listApplications } from "../lib/msme-registry/applications.ts";
import { getMsmeDetail } from "../lib/msme-registry/registry.ts";
// Uniform coverage for the ten 07-batch slices plus the decision engine on the shared surface.
const SLUGS = ["eligibility-policy-rules", "decision-matrix", "manual-review-workflow", "limit-recommendation", "pricing-risk-adjustment", "collateral-and-guarantee", "exception-handling", "override-justification", "decision-audit-ledger", "credit-committee-memo"];
const analyst = { "x-user-role": "bank_analyst", "content-type": "application/json" };
for (const slug of SLUGS) {
  test(`07 ${slug}: CRUD, RBAC, and audit`, async () => {
    const { handlers, store } = (await import(`../lib/credit-decisioning/${slug}.ts`)) as { handlers: { GET: (r: Request) => Promise<Response>; POST: (r: Request) => Promise<Response>; PATCH: (r: Request, c: { params: Promise<{ id: string }> }) => Promise<Response> }; store: { auditCount: () => number } };
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
    const patched = await handlers.PATCH(new Request(`http://test/x/${createdBody.data.id}`, { method: "PATCH", headers: analyst, body: JSON.stringify({ status: "Adopted" }) }), { params: Promise.resolve({ id: createdBody.data.id }) });
    assert.equal(patched.status, 200);
    assert.equal(store.auditCount(), before + 2);
  });
}
test("decision engine recommends, never approves, with versioned policy results", () => {
  const apps = listApplications();
  const healthy = apps.find((a) => a.healthScore >= 65 && a.pd < 0.06)!;
  const stressed = apps.reduce((worst, a) => (a.pd > worst.pd ? a : worst), apps[0]);
  const evalHealthy = evaluateApplication(getMsmeDetail(healthy.msmeId)!, healthy);
  const evalStressed = evaluateApplication(getMsmeDetail(stressed.msmeId)!, stressed);
  assert.equal(evalHealthy.versions.policy, POLICY_VERSION);
  assert.ok(["ELIGIBLE", "CONDITIONALLY_ELIGIBLE"].includes(evalHealthy.recommendation));
  if (stressed.pd >= 0.12) assert.ok(["MANUAL_REVIEW", "DECLINE_RECOMMENDED"].includes(evalStressed.recommendation));
  assert.ok(evalHealthy.policyResults.length >= 6);
  assert.ok(evalHealthy.recommendedLimit <= healthy.amount);
  assert.ok(evalHealthy.expectedLossRate > 0 && evalHealthy.expectedLossRate < 0.5);
  assert.ok(evalHealthy.humanAuthorityNote.includes("human"));
  // determinism
  assert.deepEqual(evaluateApplication(getMsmeDetail(healthy.msmeId)!, healthy), evalHealthy);
});
