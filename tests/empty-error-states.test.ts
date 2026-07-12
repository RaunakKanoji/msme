import assert from "node:assert/strict";
import test from "node:test";
import { GET, POST } from "../app/api/v1/empty-error-states/route.ts";
import { stateAuditCount } from "../lib/empty-error-states.ts";
const headers = { "x-user-role": "bank_analyst" };
test("returns UI states", async () => assert.equal((await GET(new Request("http://test", { headers }))).status, 200));
test("validates state review", async () => assert.equal((await POST(new Request("http://test", { method: "POST", headers: { ...headers, "content-type": "application/json" }, body: "{}" }))).status, 400));
test("denies unauthorized UI state access", async () => assert.equal((await GET(new Request("http://test", { headers: { "x-user-role": "borrower" } }))).status, 403));
test("audits UI state reviews", async () => { const before = stateAuditCount(); assert.equal((await POST(new Request("http://test", { method: "POST", headers: { ...headers, "content-type": "application/json" }, body: JSON.stringify({ state_id: "state_empty" }) }))).status, 200); assert.equal(stateAuditCount(), before + 1); });
