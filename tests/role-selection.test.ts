import assert from "node:assert/strict";
import test from "node:test";
import { GET, POST } from "../app/api/v1/role-selection/route.ts";
import { roleSelectionAuditCount } from "../lib/role-selection.ts";
const headers = { "x-user-role": "bank_analyst" };
test("returns available roles", async () => { const response = await GET(new Request("http://test/api/v1/role-selection", { headers })); const payload = await response.json(); assert.equal(response.status, 200); assert.equal(payload.data[0].role, "MSME owner"); });
test("rejects invalid role creation", async () => { const response = await POST(new Request("http://test/api/v1/role-selection", { method: "POST", headers: { ...headers, "content-type": "application/json" }, body: "{}" })); assert.equal(response.status, 400); });
test("denies unauthorized role access", async () => { const response = await GET(new Request("http://test/api/v1/role-selection", { headers: { "x-user-role": "borrower" } })); assert.equal(response.status, 403); });
test("audits role choices", async () => { const before = roleSelectionAuditCount(); const response = await POST(new Request("http://test/api/v1/role-selection", { method: "POST", headers: { ...headers, "content-type": "application/json" }, body: JSON.stringify({ role_id: "role_select_owner" }) })); assert.equal(response.status, 200); assert.equal(roleSelectionAuditCount(), before + 1); });
