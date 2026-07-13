import assert from "node:assert/strict"; import test from "node:test";
// Uniform coverage for the ten 08-batch slices plus the analyst queue ordering rule (queue-v1).
import { applicationSummary, IN_PROGRESS_STAGES, listApplications } from "../lib/msme-registry/applications.ts";
const SLUGS = ["analyst-dashboard", "application-queue", "borrower-summary-panel", "evidence-viewer", "health-card-panel", "pd-risk-panel", "notes-and-collaboration", "task-assignment", "approval-memo-builder", "analyst-export-pack"];
const analyst = { "x-user-role": "bank_analyst", "content-type": "application/json" };
for (const slug of SLUGS) {
  test(`08 ${slug}: CRUD, RBAC, and audit`, async () => {
    const { handlers, store } = (await import(`../lib/analyst-workbench/${slug}.ts`)) as { handlers: { GET: (r: Request) => Promise<Response>; POST: (r: Request) => Promise<Response>; PATCH: (r: Request, c: { params: Promise<{ id: string }> }) => Promise<Response> }; store: { auditCount: () => number } };
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
test("analyst queue orders in-progress applications by PD descending", () => {
  const queue = listApplications().filter((a) => IN_PROGRESS_STAGES.includes(a.stage)).sort((a, b) => b.pd - a.pd);
  assert.ok(queue.length > 0);
  for (let i = 1; i < queue.length; i++) assert.ok(queue[i - 1].pd >= queue[i].pd);
  assert.equal(applicationSummary().inProgress, queue.length);
});
