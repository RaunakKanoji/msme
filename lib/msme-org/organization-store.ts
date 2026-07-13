import { listRegistry } from "../msme-registry/registry.ts";
import { BANK_ID, maskPan, type DuplicateCheckResult, type MSMEOrganization, type MSMEOnboardingStatus, type OnboardingSource, type OrganizationAssignment, type OrganizationInvitation, type OrganizationMembership, type OrganizationRole, type OrganizationStatusEvent } from "./organization-model.ts";
// In-memory organization store (spec §4–§7, §11–§12). Seeds one canonical MSMEOrganization per scored registry
// record, then supports bank-created / invited / bulk-imported / API-imported organizations on top. All demo
// records are labelled; a database-backed implementation replaces this store behind the same functions.
type StoreState = { orgs: MSMEOrganization[]; memberships: OrganizationMembership[]; assignments: OrganizationAssignment[]; invitations: OrganizationInvitation[]; statusEvents: OrganizationStatusEvent[]; idempotency: Map<string, string>; audit: Array<Record<string, string>> };
let state: StoreState | null = null;
const now = () => new Date().toISOString();
const pad = (n: number, w: number) => String(n).padStart(w, "0");
function seed(): StoreState {
  const s: StoreState = { orgs: [], memberships: [], assignments: [], invitations: [], statusEvents: [], idempotency: new Map(), audit: [] };
  const statuses: MSMEOnboardingStatus[] = ["ACTIVE", "ACTIVE", "ACTIVE", "MONITORING", "READY_FOR_ASSESSMENT", "DATA_CONNECTION_PENDING"];
  const sources: OnboardingSource[] = ["BANK_CREATED", "MSME_SELF_ONBOARDED", "BULK_IMPORT"];
  for (const [index, m] of listRegistry().entries()) {
    const source = sources[index % sources.length];
    const org: MSMEOrganization = {
      id: `org_${m.id}`, bankId: BANK_ID, legalName: m.legalName, tradingName: m.tradingName,
      constitutionType: m.constitution === "Private Limited" ? "PRIVATE_LIMITED" : "LLP",
      pan: `DEMOP${pad(1000 + index, 4)}X`, primaryGstin: m.gstin, udyamRegistrationNumber: m.udyam,
      industryCode: m.industry, nicCode: m.nicCode, enterpriseClassification: index % 3 === 0 ? "MICRO" : index % 3 === 1 ? "SMALL" : "MEDIUM",
      customerCategory: m.segment === "NTB" ? "NEW_TO_BANK" : m.segment === "EXISTING_TO_BANK" ? "EXISTING_TO_BANK" : "NEW_TO_CREDIT",
      homeBranchId: m.branch, relationshipManagerId: m.relationshipManager, state: m.state,
      contactEmail: `owner${index + 1}@demo.msme.example`, contactMobile: `98${pad(10000000 + index * 137, 8)}`,
      onboardingSource: source, onboardingStatus: statuses[index % statuses.length],
      verificationStatus: source === "BULK_IMPORT" ? (index % 2 ? "IMPORTED_PARTIALLY_VERIFIED" : "VERIFIED") : "VERIFIED",
      registryMsmeId: m.id, isActive: true, isDemo: true, createdAt: m.onboardedAt, updatedAt: m.lastAssessedAt,
    };
    s.orgs.push(org);
    s.memberships.push({ id: `mem_${org.id}_owner`, userId: `user_demo_${pad(index + 1, 3)}`, userEmail: org.contactEmail!, msmeOrganizationId: org.id, role: "OWNER", ownershipPercentage: 60, authorizationStatus: "VERIFIED", joinedAt: org.createdAt });
    s.assignments.push({ id: `asg_${org.id}_1`, msmeOrganizationId: org.id, branchId: m.branch, relationshipManagerId: m.relationshipManager, assignedBy: "system.seed", assignedAt: org.createdAt, current: true });
    s.statusEvents.push({ id: `st_${org.id}_1`, msmeOrganizationId: org.id, from: null, to: org.onboardingStatus, actor: "system.seed", at: org.createdAt });
  }
  // One shared accountant across two organizations demonstrates user ↔ many-organization membership (§6).
  s.memberships.push({ id: "mem_shared_acct_1", userId: "user_shared_accountant", userEmail: "accounts@shared.example", msmeOrganizationId: s.orgs[0].id, role: "ACCOUNTANT", authorizationStatus: "VERIFIED", joinedAt: now() });
  s.memberships.push({ id: "mem_shared_acct_2", userId: "user_shared_accountant", userEmail: "accounts@shared.example", msmeOrganizationId: s.orgs[1].id, role: "ACCOUNTANT", authorizationStatus: "VERIFIED", joinedAt: now() });
  return s;
}
function db(): StoreState { if (!state) state = seed(); return state; }
function writeAudit(event: string, entityId: string, actor: string) { db().audit.push({ id: `audit_${crypto.randomUUID()}`, event, entityId, actor, at: now() }); }
export function listOrganizations(filters: { status?: string; source?: string; category?: string; branch?: string; search?: string } = {}): MSMEOrganization[] {
  return db().orgs.filter((o) =>
    (!filters.status || o.onboardingStatus === filters.status) &&
    (!filters.source || o.onboardingSource === filters.source) &&
    (!filters.category || o.customerCategory === filters.category) &&
    (!filters.branch || o.homeBranchId === filters.branch) &&
    (!filters.search || `${o.legalName} ${o.id} ${o.primaryGstin ?? ""}`.toLowerCase().includes(filters.search.toLowerCase())));
}
export function getOrganization(id: string) { return db().orgs.find((o) => o.id === id); }
export function getOrganizationBundle(id: string) {
  const org = getOrganization(id);
  if (!org) return undefined;
  const s = db();
  return { organization: publicView(org), memberships: s.memberships.filter((m) => m.msmeOrganizationId === id), assignments: s.assignments.filter((a) => a.msmeOrganizationId === id).sort((a, b) => (a.assignedAt < b.assignedAt ? 1 : -1)), invitations: s.invitations.filter((i) => i.msmeOrganizationId === id), statusHistory: s.statusEvents.filter((e) => e.msmeOrganizationId === id).sort((a, b) => (a.at < b.at ? 1 : -1)) };
}
// Sensitive-field masking for API/UI exposure (§15) — raw PAN never leaves the store.
export function publicView(org: MSMEOrganization): Omit<MSMEOrganization, "pan"> & { maskedPan: string } { const { pan, ...rest } = org; return { ...rest, maskedPan: maskPan(pan) }; }
export function checkDuplicates(input: { pan?: string; gstin?: string; udyam?: string; legalName?: string; contactEmail?: string; contactMobile?: string }): DuplicateCheckResult {
  const matches: DuplicateCheckResult["matches"] = [];
  for (const org of db().orgs) {
    const matchedOn: string[] = [];
    if (input.pan && org.pan.toUpperCase() === input.pan.toUpperCase()) matchedOn.push("PAN");
    if (input.gstin && org.primaryGstin && org.primaryGstin.toUpperCase() === input.gstin.toUpperCase()) matchedOn.push("GSTIN");
    if (input.udyam && org.udyamRegistrationNumber && org.udyamRegistrationNumber.toUpperCase() === input.udyam.toUpperCase()) matchedOn.push("UDYAM");
    if (input.legalName && org.legalName.toLowerCase() === input.legalName.trim().toLowerCase()) matchedOn.push("LEGAL_NAME");
    if (input.contactEmail && org.contactEmail === input.contactEmail.toLowerCase()) matchedOn.push("EMAIL");
    if (input.contactMobile && org.contactMobile === input.contactMobile) matchedOn.push("MOBILE");
    if (matchedOn.length) matches.push({ organizationId: org.id, legalName: org.legalName, matchedOn });
  }
  const exact = matches.some((m) => m.matchedOn.some((k) => ["PAN", "GSTIN", "UDYAM"].includes(k)));
  return { outcome: matches.length === 0 ? "NO_MATCH" : exact ? "EXACT_MATCH" : "POSSIBLE_MATCH", matches };
}
export type CreateOrganizationInput = { legalName: string; tradingName?: string; pan: string; gstin?: string; udyam?: string; constitutionType?: MSMEOrganization["constitutionType"]; industryCode?: string; contactEmail?: string; contactMobile?: string; branchId?: string; relationshipManagerId?: string; source?: OnboardingSource };
export type CreateOrganizationResult = { created: false; duplicate: DuplicateCheckResult } | { created: true; organization: ReturnType<typeof publicView>; duplicate: DuplicateCheckResult };
export function createOrganization(input: CreateOrganizationInput, actor: string, idempotencyKey?: string): CreateOrganizationResult {
  const s = db();
  if (idempotencyKey && s.idempotency.has(idempotencyKey)) { const existing = getOrganization(s.idempotency.get(idempotencyKey)!)!; return { created: true, organization: publicView(existing), duplicate: { outcome: "NO_MATCH", matches: [] } }; }
  const duplicate = checkDuplicates({ pan: input.pan, gstin: input.gstin, udyam: input.udyam, legalName: input.legalName, contactEmail: input.contactEmail, contactMobile: input.contactMobile });
  // Exact identifier match: never create a second organization for the same enterprise (§5).
  if (duplicate.outcome === "EXACT_MATCH") return { created: false, duplicate };
  const source = input.source ?? "BANK_CREATED";
  const org: MSMEOrganization = {
    id: `org_msme_${crypto.randomUUID()}`, bankId: BANK_ID, legalName: input.legalName.trim(), tradingName: input.tradingName?.trim() || undefined,
    constitutionType: input.constitutionType ?? "PROPRIETORSHIP", pan: input.pan.toUpperCase(),
    primaryGstin: input.gstin, udyamRegistrationNumber: input.udyam, industryCode: input.industryCode,
    customerCategory: "NEW_TO_BANK", homeBranchId: input.branchId, relationshipManagerId: input.relationshipManagerId,
    contactEmail: input.contactEmail?.toLowerCase(), contactMobile: input.contactMobile,
    onboardingSource: source, onboardingStatus: source === "BULK_IMPORT" || source === "API_IMPORT" ? "IDENTITY_PENDING" : "PROSPECT",
    verificationStatus: source === "BULK_IMPORT" || source === "API_IMPORT" ? "IMPORTED_UNVERIFIED" : "PROVISIONAL",
    isActive: true, isDemo: true, createdAt: now(), updatedAt: now(),
  };
  s.orgs.unshift(org);
  s.statusEvents.push({ id: `st_${crypto.randomUUID()}`, msmeOrganizationId: org.id, from: null, to: org.onboardingStatus, actor, at: now() });
  if (input.branchId && input.relationshipManagerId) s.assignments.push({ id: `asg_${crypto.randomUUID()}`, msmeOrganizationId: org.id, branchId: input.branchId, relationshipManagerId: input.relationshipManagerId, assignedBy: actor, assignedAt: now(), current: true });
  if (idempotencyKey) s.idempotency.set(idempotencyKey, org.id);
  writeAudit("msme_organization.created", org.id, actor);
  return { created: true, organization: publicView(org), duplicate };
}
export function transitionStatus(id: string, to: MSMEOnboardingStatus, actor: string, note?: string) {
  const org = getOrganization(id);
  if (!org) return undefined;
  const s = db();
  s.statusEvents.push({ id: `st_${crypto.randomUUID()}`, msmeOrganizationId: id, from: org.onboardingStatus, to, actor, at: now(), note });
  org.onboardingStatus = to; org.updatedAt = now();
  writeAudit("msme_organization.status_changed", id, actor);
  return publicView(org);
}
export function assignOrganization(id: string, branchId: string, relationshipManagerId: string, actor: string) {
  const org = getOrganization(id);
  if (!org) return undefined;
  const s = db();
  // History-preserving reassignment (§7): close the current assignment, never overwrite it.
  for (const a of s.assignments) if (a.msmeOrganizationId === id && a.current) { a.current = false; a.endedAt = now(); }
  s.assignments.push({ id: `asg_${crypto.randomUUID()}`, msmeOrganizationId: id, branchId, relationshipManagerId, assignedBy: actor, assignedAt: now(), current: true });
  org.homeBranchId = branchId; org.relationshipManagerId = relationshipManagerId; org.updatedAt = now();
  writeAudit("msme_organization.assigned", id, actor);
  return getOrganizationBundle(id);
}
export function inviteOrganization(id: string, contact: string, requestedActions: string[], actor: string): OrganizationInvitation | undefined {
  const org = getOrganization(id);
  if (!org) return undefined;
  const invitation: OrganizationInvitation = { id: `inv_${crypto.randomUUID()}`, msmeOrganizationId: id, bankId: org.bankId, branchId: org.homeBranchId, contact, token: crypto.randomUUID(), requestedActions, invitedBy: actor, createdAt: now(), expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(), status: "PENDING" };
  db().invitations.push(invitation);
  if (org.onboardingStatus === "PROSPECT") transitionStatus(id, "INVITED", actor, `Invitation sent to ${contact}`);
  writeAudit("msme_organization.invited", id, actor);
  return invitation;
}
export function addMembership(id: string, input: { userId: string; userEmail: string; role: OrganizationRole; ownershipPercentage?: number }, actor: string): OrganizationMembership | undefined {
  if (!getOrganization(id)) return undefined;
  const membership: OrganizationMembership = { id: `mem_${crypto.randomUUID()}`, msmeOrganizationId: id, userId: input.userId, userEmail: input.userEmail.toLowerCase(), role: input.role, ownershipPercentage: input.ownershipPercentage, authorizationStatus: "PENDING", joinedAt: now() };
  db().memberships.push(membership);
  writeAudit("msme_organization.membership_added", id, actor);
  return membership;
}
export function membershipsForUser(userId: string): OrganizationMembership[] { return db().memberships.filter((m) => m.userId === userId && !m.revokedAt); }
export type ImportRow = { legalName?: string; pan?: string; gstin?: string; udyam?: string; branchId?: string; relationshipManagerId?: string; contactEmail?: string };
export function importOrganizations(rows: ImportRow[], options: { dryRun: boolean }, actor: string) {
  const results = rows.map((row, index) => {
    if (!row.legalName?.trim() || !row.pan?.trim()) return { row: index, status: "INVALID" as const, reason: "legalName and pan are required" };
    const duplicate = checkDuplicates({ pan: row.pan, gstin: row.gstin, udyam: row.udyam, legalName: row.legalName });
    if (duplicate.outcome === "EXACT_MATCH") return { row: index, status: "DUPLICATE" as const, reason: `Matches ${duplicate.matches[0].organizationId}`, matches: duplicate.matches };
    if (options.dryRun) return { row: index, status: "WOULD_CREATE" as const };
    const created = createOrganization({ legalName: row.legalName, pan: row.pan, gstin: row.gstin, udyam: row.udyam, branchId: row.branchId, relationshipManagerId: row.relationshipManagerId, contactEmail: row.contactEmail, source: "BULK_IMPORT" }, actor);
    return created.created ? { row: index, status: "CREATED" as const, organizationId: created.organization.id } : { row: index, status: "DUPLICATE" as const, matches: created.duplicate.matches };
  });
  const summary = { total: rows.length, created: results.filter((r) => r.status === "CREATED").length, wouldCreate: results.filter((r) => r.status === "WOULD_CREATE").length, duplicates: results.filter((r) => r.status === "DUPLICATE").length, invalid: results.filter((r) => r.status === "INVALID").length, dryRun: options.dryRun };
  writeAudit(options.dryRun ? "msme_organization.import_dry_run" : "msme_organization.import", `rows:${rows.length}`, actor);
  return { summary, results };
}
export function organizationDashboardStats() {
  const orgs = db().orgs;
  const by = <K extends keyof MSMEOrganization>(key: K, value: MSMEOrganization[K]) => orgs.filter((o) => o[key] === value).length;
  return {
    total: orgs.length,
    verified: by("verificationStatus", "VERIFIED"),
    awaitingVerification: orgs.filter((o) => o.verificationStatus !== "VERIFIED").length,
    bankCreated: by("onboardingSource", "BANK_CREATED"),
    selfOnboarded: by("onboardingSource", "MSME_SELF_ONBOARDED"),
    bulkImported: by("onboardingSource", "BULK_IMPORT"),
    invitedNotActive: by("onboardingStatus", "INVITED"),
    incompleteOnboarding: orgs.filter((o) => !["ACTIVE", "MONITORING"].includes(o.onboardingStatus)).length,
    readyForAssessment: by("onboardingStatus", "READY_FOR_ASSESSMENT"),
  };
}
export function organizationAuditCount() { return db().audit.length; }
