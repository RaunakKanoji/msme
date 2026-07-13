import assert from "node:assert/strict"; import test from "node:test";
import { addMembership, assignOrganization, checkDuplicates, createOrganization, getOrganizationBundle, importOrganizations, inviteOrganization, listOrganizations, membershipsForUser, organizationDashboardStats, transitionStatus } from "../lib/msme-org/organization-store.ts";
import { maskPan } from "../lib/msme-org/organization-model.ts";

test("seeds one canonical organization per registry MSME with owner membership and assignment", () => {
  const orgs = listOrganizations();
  assert.equal(orgs.length >= 100, true);
  const bundle = getOrganizationBundle(orgs[orgs.length - 1].id)!;
  assert.ok(bundle.memberships.some((m) => m.role === "OWNER"));
  assert.equal(bundle.assignments.filter((a) => a.current).length, 1);
  assert.ok(!("pan" in bundle.organization)); assert.ok(bundle.organization.maskedPan.includes("•"));
});

test("duplicate detection: exact on identifiers, possible on name, none otherwise", () => {
  const existing = listOrganizations()[50];
  assert.equal(checkDuplicates({ gstin: existing.primaryGstin }).outcome, "EXACT_MATCH");
  assert.equal(checkDuplicates({ legalName: existing.legalName }).outcome, "POSSIBLE_MATCH");
  assert.equal(checkDuplicates({ pan: "ZZZZZ9999Z", legalName: "Completely Unknown Traders" }).outcome, "NO_MATCH");
});

test("bank-created organization is PROVISIONAL, exact duplicates are refused, idempotency replays", () => {
  const created = createOrganization({ legalName: "Test Bank Created Traders", pan: "TESTP0001A", branchId: "Mumbai Fort", relationshipManagerId: "A. Sharma" }, "analyst.demo", "idem-key-1");
  assert.ok(created.created); if (!created.created) return;
  assert.equal(created.organization.verificationStatus, "PROVISIONAL");
  assert.equal(created.organization.onboardingStatus, "PROSPECT");
  const dupe = createOrganization({ legalName: "Different Name", pan: "TESTP0001A" }, "analyst.demo");
  assert.equal(dupe.created, false);
  const replay = createOrganization({ legalName: "Test Bank Created Traders", pan: "TESTP0001A" }, "analyst.demo", "idem-key-1");
  assert.ok(replay.created); if (replay.created) assert.equal(replay.organization.id, created.organization.id);
});

test("invitation carries token/expiry and moves PROSPECT to INVITED", () => {
  const created = createOrganization({ legalName: "Invite Flow Traders", pan: "TESTP0002B" }, "analyst.demo");
  assert.ok(created.created); if (!created.created) return;
  const invitation = inviteOrganization(created.organization.id, "owner@invitee.example", ["COMPLETE_ONBOARDING"], "analyst.demo")!;
  assert.ok(invitation.token.length > 10); assert.ok(invitation.expiresAt > invitation.createdAt);
  const bundle = getOrganizationBundle(created.organization.id)!;
  assert.equal(bundle.organization.onboardingStatus, "INVITED");
  assert.equal(bundle.statusHistory[0].to, "INVITED");
});

test("reassignment preserves history instead of overwriting", () => {
  const org = listOrganizations()[10];
  const before = getOrganizationBundle(org.id)!.assignments.length;
  const bundle = assignOrganization(org.id, "Pune Camp", "N. Kulkarni", "manager.demo")!;
  assert.equal(bundle.assignments.length, before + 1);
  assert.equal(bundle.assignments.filter((a) => a.current).length, 1);
  assert.equal(bundle.assignments.find((a) => a.current)!.branchId, "Pune Camp");
  assert.ok(bundle.assignments.some((a) => !a.current && a.endedAt));
});

test("one user can belong to multiple organizations", () => {
  const memberships = membershipsForUser("user_shared_accountant");
  assert.equal(memberships.length, 2);
  assert.notEqual(memberships[0].msmeOrganizationId, memberships[1].msmeOrganizationId);
  const org = listOrganizations()[5];
  const added = addMembership(org.id, { userId: "user_shared_accountant", userEmail: "accounts@shared.example", role: "READ_ONLY" }, "analyst.demo")!;
  assert.equal(added.authorizationStatus, "PENDING");
  assert.equal(membershipsForUser("user_shared_accountant").length, 3);
});

test("lifecycle transitions are recorded with actor and history order", () => {
  const created = createOrganization({ legalName: "Lifecycle Traders", pan: "TESTP0003C" }, "analyst.demo");
  assert.ok(created.created); if (!created.created) return;
  transitionStatus(created.organization.id, "IDENTITY_PENDING", "analyst.demo");
  transitionStatus(created.organization.id, "READY_FOR_ASSESSMENT", "analyst.demo", "Checks complete");
  const bundle = getOrganizationBundle(created.organization.id)!;
  assert.equal(bundle.organization.onboardingStatus, "READY_FOR_ASSESSMENT");
  assert.equal(bundle.statusHistory[0].from, "IDENTITY_PENDING");
  assert.equal(bundle.statusHistory[0].note, "Checks complete");
});

test("bulk import: dry-run creates nothing, live run reports partial success", () => {
  const rows = [
    { legalName: "Import Alpha Traders", pan: "IMPTP0001D" },
    { legalName: listOrganizations()[3].legalName, pan: listOrganizations()[3].id, gstin: listOrganizations()[3].primaryGstin }, // exact GSTIN duplicate
    { legalName: "", pan: "" }, // invalid
  ];
  const before = listOrganizations().length;
  const dry = importOrganizations(rows, { dryRun: true }, "ops.demo");
  assert.deepEqual([dry.summary.wouldCreate, dry.summary.duplicates, dry.summary.invalid], [1, 1, 1]);
  assert.equal(listOrganizations().length, before);
  const live = importOrganizations(rows, { dryRun: false }, "ops.demo");
  assert.equal(live.summary.created, 1);
  assert.equal(listOrganizations().length, before + 1);
});

test("dashboard stats and API handlers enforce roles", async () => {
  const stats = organizationDashboardStats();
  assert.ok(stats.total >= 100); assert.ok(stats.verified > 0);
  const { GET, POST } = await import("../app/api/v1/bank/msme-organizations/route.ts");
  const denied = await GET(new Request("http://test/api/v1/bank/msme-organizations", { headers: { "x-user-role": "borrower" } }));
  assert.equal(denied.status, 403);
  const ok = await GET(new Request("http://test/api/v1/bank/msme-organizations?source=BULK_IMPORT", { headers: { "x-user-role": "bank_analyst" } }));
  const body = await ok.json();
  assert.equal(ok.status, 200);
  assert.ok(body.data.organizations.every((o: { onboardingSource: string }) => o.onboardingSource === "BULK_IMPORT"));
  assert.ok(body.data.organizations.every((o: Record<string, unknown>) => !("pan" in o)));
  const conflict = await POST(new Request("http://test/api/v1/bank/msme-organizations", { method: "POST", headers: { "x-user-role": "bank_analyst", "content-type": "application/json" }, body: JSON.stringify({ legalName: "x", pan: "TESTP0001A" }) }));
  assert.equal(conflict.status, 409);
});

test("maskPan never leaks the full identifier", () => {
  assert.equal(maskPan("ABCDE1234F").includes("ABCDE"), false);
  assert.ok(maskPan("ABCDE1234F").includes("•"));
});
