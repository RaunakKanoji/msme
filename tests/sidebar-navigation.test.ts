import assert from "node:assert/strict";
import test from "node:test";
import { GET, POST } from "../app/api/v1/sidebar-navigation/route.ts";
import { navigationAuditCount } from "../lib/sidebar-navigation.ts";
const headers = { "x-user-role": "bank_analyst" };
test("returns navigation items", async () => assert.equal((await GET(new Request("http://test", { headers }))).status, 200));
test("validates navigation selection", async () => assert.equal((await POST(new Request("http://test", { method: "POST", headers: { ...headers, "content-type": "application/json" }, body: "{}" }))).status, 400));
test("denies unauthorized navigation access", async () => assert.equal((await GET(new Request("http://test", { headers: { "x-user-role": "borrower" } }))).status, 403));
test("audits navigation selection", async () => { const before = navigationAuditCount(); assert.equal((await POST(new Request("http://test", { method: "POST", headers: { ...headers, "content-type": "application/json" }, body: JSON.stringify({ item_id: "nav_overview" }) }))).status, 200); assert.equal(navigationAuditCount(), before + 1); });
