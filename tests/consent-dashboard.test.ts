import assert from "node:assert/strict";
import test from "node:test";
import { GET, POST } from "../app/api/v1/consent-dashboard/route.ts";
import { PATCH } from "../app/api/v1/consent-dashboard/[id]/route.ts";
import { consentDashboardAuditCount } from "../lib/consent-dashboard.ts";

const headers = { "x-user-role": "bank_analyst" };
test("returns seeded synthetic consent dashboard with trace id", async () => { const response = await GET(new Request("http://test/api/v1/consent-dashboard", { headers })); const payload = await response.json(); assert.equal(response.status, 200); assert.equal(payload.data.consents[0].status, "Active"); assert.equal(payload.data.connector_accounts.length, 3); assert.ok(payload.trace_id.startsWith("trc_")); });
test("rejects incomplete consent capture", async () => { const response = await POST(new Request("http://test/api/v1/consent-dashboard", { method: "POST", headers: { ...headers, "content-type": "application/json" }, body: "{}" })); const payload = await response.json(); assert.equal(response.status, 400); assert.equal(payload.error.code, "VALIDATION_ERROR"); });
test("denies unauthorized consent dashboard access", async () => { const response = await GET(new Request("http://test/api/v1/consent-dashboard", { headers: { "x-user-role": "borrower" } })); const payload = await response.json(); assert.equal(response.status, 403); assert.equal(payload.error.code, "AUTHORIZATION_DENIED"); assert.equal("data" in payload, false); });
test("audits consent changes", async () => { const before = consentDashboardAuditCount(); const response = await PATCH(new Request("http://test/api/v1/consent-dashboard/consent_demo_001", { method: "PATCH", headers: { ...headers, "content-type": "application/json" }, body: JSON.stringify({ status: "Revoked" }) }), { params: Promise.resolve({ id: "consent_demo_001" }) }); assert.equal(response.status, 200); assert.equal(consentDashboardAuditCount(), before + 1); });
