import assert from "node:assert/strict";
import test from "node:test";
import { GET, POST } from "../app/api/v1/target-personas/route.ts";
import { PATCH } from "../app/api/v1/target-personas/[id]/route.ts";
import { personaAuditEventCount } from "../lib/target-personas.ts";

const analystHeaders = { "x-user-role": "bank_analyst" };
test("returns seeded personas to an authorized analyst", async () => { const response = await GET(new Request("http://test/api/v1/target-personas", { headers: analystHeaders })); const payload = await response.json(); assert.equal(response.status, 200); assert.equal(payload.data[0].role, "MSME owner"); assert.ok(payload.trace_id.startsWith("trc_")); });
test("rejects incomplete persona payloads", async () => { const response = await POST(new Request("http://test/api/v1/target-personas", { method: "POST", headers: { ...analystHeaders, "content-type": "application/json" }, body: "{}" })); const payload = await response.json(); assert.equal(response.status, 400); assert.equal(payload.error.code, "VALIDATION_ERROR"); });
test("denies unauthorized persona access", async () => { const response = await GET(new Request("http://test/api/v1/target-personas", { headers: { "x-user-role": "borrower" } })); const payload = await response.json(); assert.equal(response.status, 403); assert.equal(payload.error.code, "AUTHORIZATION_DENIED"); assert.equal("data" in payload, false); });
test("audits persona updates", async () => { const before = personaAuditEventCount(); const response = await PATCH(new Request("http://test/api/v1/target-personas/persona_owner_001", { method: "PATCH", headers: { ...analystHeaders, "content-type": "application/json" }, body: JSON.stringify({ priority: "Primary" }) }), { params: Promise.resolve({ id: "persona_owner_001" }) }); assert.equal(response.status, 200); assert.equal(personaAuditEventCount(), before + 1); });
