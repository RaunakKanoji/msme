import assert from "node:assert/strict";
import test from "node:test";
import { GET, POST } from "../app/api/v1/problem-statement-fit/route.ts";
import { PATCH } from "../app/api/v1/problem-statement-fit/[id]/route.ts";
import { auditEventCount } from "../lib/problem-statement-fit.ts";

const analystHeaders = { "x-user-role": "bank_analyst" };

test("returns seeded synthetic data to an authorized analyst", async () => {
  const response = await GET(new Request("http://test/api/v1/problem-statement-fit", { headers: analystHeaders }));
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.ok(payload.trace_id.startsWith("trc_"));
  assert.equal(payload.data[0].organization_name, "Saraswati Precision Works");
});

test("rejects an invalid assessment payload using the shared error shape", async () => {
  const response = await POST(new Request("http://test/api/v1/problem-statement-fit", { method: "POST", headers: { ...analystHeaders, "content-type": "application/json" }, body: "{}" }));
  const payload = await response.json();
  assert.equal(response.status, 400);
  assert.equal(payload.error.code, "VALIDATION_ERROR");
  assert.ok(payload.trace_id.startsWith("trc_"));
});

test("denies an unauthorized role without returning assessment data", async () => {
  const response = await GET(new Request("http://test/api/v1/problem-statement-fit", { headers: { "x-user-role": "borrower" } }));
  const payload = await response.json();
  assert.equal(response.status, 403);
  assert.equal(payload.error.code, "AUTHORIZATION_DENIED");
  assert.equal("data" in payload, false);
});

test("records an audit event when an assessment is updated", async () => {
  const before = auditEventCount();
  const response = await PATCH(
    new Request("http://test/api/v1/problem-statement-fit/psf_demo_001", { method: "PATCH", headers: { ...analystHeaders, "content-type": "application/json" }, body: JSON.stringify({ status: "Ready" }) }),
    { params: Promise.resolve({ id: "psf_demo_001" }) },
  );
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.data.updated_by, "demo.bank.analyst");
  assert.equal(auditEventCount(), before + 1);
});
