import assert from "node:assert/strict";
import test from "node:test";
import { GET, POST } from "../app/api/v1/route-guards/route.ts";
import { routeGuardAuditCount } from "../lib/route-guards.ts";
const headers = { "x-user-role": "bank_analyst" };
test("returns route guards", async () => { const response = await GET(new Request("http://test/api/v1/route-guards", { headers })); assert.equal(response.status, 200); });
test("rejects missing guard id", async () => { const response = await POST(new Request("http://test/api/v1/route-guards", { method: "POST", headers: { ...headers, "content-type": "application/json" }, body: "{}" })); assert.equal(response.status, 400); });
test("denies unauthorized guard access", async () => { const response = await GET(new Request("http://test/api/v1/route-guards", { headers: { "x-user-role": "borrower" } })); assert.equal(response.status, 403); });
test("audits guard reviews", async () => { const before = routeGuardAuditCount(); const response = await POST(new Request("http://test/api/v1/route-guards", { method: "POST", headers: { ...headers, "content-type": "application/json" }, body: JSON.stringify({ guard_id: "guard_app_001" }) })); assert.equal(response.status, 200); assert.equal(routeGuardAuditCount(), before + 1); });
