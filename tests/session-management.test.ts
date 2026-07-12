import assert from "node:assert/strict";
import test from "node:test";
import { GET, POST } from "../app/api/v1/session-management/route.ts";
import { sessionAuditCount } from "../lib/session-management.ts";
const headers = { "x-user-role": "bank_analyst" };
test("returns session policy", async () => { const response = await GET(new Request("http://test/api/v1/session-management", { headers })); assert.equal(response.status, 200); });
test("rejects invalid policy creation", async () => { const response = await POST(new Request("http://test/api/v1/session-management", { method: "POST", headers: { ...headers, "content-type": "application/json" }, body: "{}" })); assert.equal(response.status, 400); });
test("denies unauthorized session access", async () => { const response = await GET(new Request("http://test/api/v1/session-management", { headers: { "x-user-role": "borrower" } })); assert.equal(response.status, 403); });
test("audits session reviews", async () => { const before = sessionAuditCount(); const response = await POST(new Request("http://test/api/v1/session-management", { method: "POST", headers: { ...headers, "content-type": "application/json" }, body: JSON.stringify({ policy_id: "session_policy_001" }) })); assert.equal(response.status, 200); assert.equal(sessionAuditCount(), before + 1); });
