import assert from "node:assert/strict";
import test from "node:test";
import { GET, POST } from "../app/api/v1/track-03-04-scope/route.ts";
import { PATCH } from "../app/api/v1/track-03-04-scope/[id]/route.ts";
import { scopeAuditEventCount } from "../lib/track-03-04-scope.ts";

const analystHeaders = { "x-user-role": "bank_analyst" };

test("returns synthetic Track 03 and Track 04 scope to authorized users", async () => {
  const response = await GET(new Request("http://test/api/v1/track-03-04-scope", { headers: analystHeaders }));
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.ok(payload.trace_id.startsWith("trc_"));
  assert.deepEqual(payload.data.map((item: { track: string }) => item.track).slice(0, 2), ["Track 03", "Track 04"]);
});
test("returns a validation error for an incomplete scope item", async () => {
  const response = await POST(new Request("http://test/api/v1/track-03-04-scope", { method: "POST", headers: { ...analystHeaders, "content-type": "application/json" }, body: JSON.stringify({ track: "Track 03" }) }));
  const payload = await response.json();
  assert.equal(response.status, 400);
  assert.equal(payload.error.code, "VALIDATION_ERROR");
  assert.ok(payload.trace_id.startsWith("trc_"));
});
test("denies unauthorized scope access without sensitive data", async () => {
  const response = await GET(new Request("http://test/api/v1/track-03-04-scope", { headers: { "x-user-role": "borrower" } }));
  const payload = await response.json();
  assert.equal(response.status, 403);
  assert.equal(payload.error.code, "AUTHORIZATION_DENIED");
  assert.equal("data" in payload, false);
});
test("audits a scope change", async () => {
  const before = scopeAuditEventCount();
  const response = await PATCH(new Request("http://test/api/v1/track-03-04-scope/scope_fhc_001", { method: "PATCH", headers: { ...analystHeaders, "content-type": "application/json" }, body: JSON.stringify({ status: "In scope" }) }), { params: Promise.resolve({ id: "scope_fhc_001" }) });
  assert.equal(response.status, 200);
  assert.equal(scopeAuditEventCount(), before + 1);
});
