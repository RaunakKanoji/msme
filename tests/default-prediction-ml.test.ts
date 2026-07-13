import assert from "node:assert/strict"; import test from "node:test";
// Uniform coverage for the twelve 06-batch governance slices: authorized success, validation failure,
// authorization failure, and audit creation per slug — plus the shared risk-predictions contract.
const SLUGS = ["default-definition", "observation-prediction-windows", "model-feature-engineering", "training-dataset-builder", "model-selection-baseline", "calibration-and-risk-bands", "prediction-api", "shap-explainability", "prediction-confidence", "model-monitoring", "retraining-strategy", "synthetic-data-disclaimer"];
const analyst = { "x-user-role": "bank_analyst", "content-type": "application/json" };
for (const slug of SLUGS) {
  test(`06 ${slug}: CRUD, RBAC, and audit`, async () => {
    const lib = await import(`../lib/default-prediction/${slug}.ts`);
    const { handlers, store } = lib as { handlers: { GET: (r: Request) => Promise<Response>; POST: (r: Request) => Promise<Response>; PATCH: (r: Request, c: { params: Promise<{ id: string }> }) => Promise<Response> }; store: { auditCount: () => number } };
    // authorized success with seeded records + trace id
    const ok = await handlers.GET(new Request(`http://test/api/v1/${slug}`, { headers: analyst }));
    const body = await ok.json();
    assert.equal(ok.status, 200); assert.equal(body.data.records.length, 2); assert.ok(body.trace_id.startsWith("trc_"));
    assert.ok(body.data.records.every((r: { version: string; status: string }) => r.version && r.status));
    // authorization failure leaks nothing
    const denied = await handlers.GET(new Request(`http://test/api/v1/${slug}`, { headers: { "x-user-role": "borrower" } }));
    assert.equal(denied.status, 403); assert.equal("data" in (await denied.json()), false);
    // validation failure
    const invalid = await handlers.POST(new Request(`http://test/api/v1/${slug}`, { method: "POST", headers: analyst, body: "{}" }));
    assert.equal(invalid.status, 400);
    // create + status transition writes audit
    const before = store.auditCount();
    const created = await handlers.POST(new Request(`http://test/api/v1/${slug}`, { method: "POST", headers: analyst, body: JSON.stringify({ label: "Test record", version: "test-v1", summary: "Test summary." }) }));
    const createdBody = await created.json();
    assert.equal(created.status, 201); assert.equal(createdBody.data.status, "Draft");
    const patched = await handlers.PATCH(new Request(`http://test/api/v1/${slug}/${createdBody.data.id}`, { method: "PATCH", headers: analyst, body: JSON.stringify({ status: "Adopted" }) }), { params: Promise.resolve({ id: createdBody.data.id }) });
    assert.equal(patched.status, 200);
    assert.equal(store.auditCount(), before + 2);
  });
}
test("06-007 risk-predictions contract returns the real PD with all governing versions", async () => {
  const { GET } = await import("../app/api/v1/businesses/[id]/risk-predictions/route.ts");
  const ok = await GET(new Request("http://test/api/v1/businesses/msme_demo_001/risk-predictions", { headers: analyst }), { params: Promise.resolve({ id: "msme_demo_001" }) });
  const body = await ok.json();
  assert.equal(ok.status, 200);
  assert.ok(body.data.probabilityOfDefault12M > 0 && body.data.probabilityOfDefault12M < 1);
  assert.ok(body.data.versions.model.startsWith("pd-bootstrap"));
  assert.equal(body.data.versions.defaultDefinition, "default-90dpd-v1");
  assert.equal(body.data.versions.bandConfig, "pd-bands-v1");
  assert.equal(body.data.isDemo, true);
  assert.ok(body.data.disclaimer.includes("not a credit decision"));
  const denied = await GET(new Request("http://test/x", { headers: { "x-user-role": "borrower" } }), { params: Promise.resolve({ id: "msme_demo_001" }) });
  assert.equal(denied.status, 403);
});
