import assert from "node:assert/strict";
import test from "node:test";
import { GET, POST } from "../app/api/v1/accessibility-foundation/route.ts";
import { accessibilityAuditCount } from "../lib/accessibility-foundation.ts";
const headers = { "x-user-role": "bank_analyst" };
test("returns accessibility policies", async () => assert.equal((await GET(new Request("http://test", { headers }))).status, 200));
test("validates policy reviews", async () => assert.equal((await POST(new Request("http://test", { method: "POST", headers: { ...headers, "content-type": "application/json" }, body: "{}" }))).status, 400));
test("denies unauthorized policy access", async () => assert.equal((await GET(new Request("http://test", { headers: { "x-user-role": "borrower" } }))).status, 403));
test("audits policy reviews", async () => { const before = accessibilityAuditCount(); assert.equal((await POST(new Request("http://test", { method: "POST", headers: { ...headers, "content-type": "application/json" }, body: JSON.stringify({ policy_id: "a11y_keyboard" }) }))).status, 200); assert.equal(accessibilityAuditCount(), before + 1); });
