// Bank-owned multi-MSME organization architecture — domain model (spec §3, §6, §7, §12). Each MSME is a
// first-class organization under the bank tenant, never just a user account or a loan application. UUIDs are the
// canonical identifiers; PAN/GSTIN/Udyam are attributes, never primary keys.
export type MSMEConstitutionType = "PROPRIETORSHIP" | "PARTNERSHIP" | "LLP" | "PRIVATE_LIMITED" | "OPC" | "HUF";
export type MSMEOnboardingStatus =
  | "PROSPECT" | "INVITED" | "REGISTRATION_STARTED" | "IDENTITY_PENDING" | "DATA_CONNECTION_PENDING"
  | "DOCUMENTS_PENDING" | "UNDER_VERIFICATION" | "READY_FOR_ASSESSMENT" | "SCORING" | "ACTIVE"
  | "MONITORING" | "SUSPENDED" | "DORMANT" | "CLOSED" | "REJECTED" | "ARCHIVED";
export type MSMEVerificationStatus = "PROVISIONAL" | "IMPORTED_UNVERIFIED" | "IMPORTED_PARTIALLY_VERIFIED" | "VERIFIED";
export type OnboardingSource = "BANK_CREATED" | "MSME_SELF_ONBOARDED" | "BANK_INVITATION" | "BULK_IMPORT" | "API_IMPORT" | "ULI" | "OCEN";
export type CustomerCategory = "NEW_TO_CREDIT" | "NEW_TO_BANK" | "EXISTING_TO_BANK";
export interface MSMEOrganization {
  id: string;
  bankId: string;
  legalName: string;
  tradingName?: string;
  constitutionType: MSMEConstitutionType;
  pan: string;
  primaryGstin?: string;
  udyamRegistrationNumber?: string;
  industryCode?: string;
  nicCode?: string;
  enterpriseClassification?: "MICRO" | "SMALL" | "MEDIUM";
  customerCategory: CustomerCategory;
  homeBranchId?: string;
  relationshipManagerId?: string;
  state?: string;
  contactEmail?: string;
  contactMobile?: string;
  onboardingSource: OnboardingSource;
  onboardingStatus: MSMEOnboardingStatus;
  verificationStatus: MSMEVerificationStatus;
  registryMsmeId?: string; // link to the scored demo registry record, when one exists
  isActive: boolean;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}
export type OrganizationRole = "OWNER" | "PROMOTER" | "DIRECTOR" | "PARTNER" | "AUTHORIZED_REPRESENTATIVE" | "FINANCE_MANAGER" | "ACCOUNTANT" | "AUDITOR" | "DATA_ENTRY" | "READ_ONLY";
export interface OrganizationMembership { id: string; userId: string; userEmail: string; msmeOrganizationId: string; role: OrganizationRole; ownershipPercentage?: number; authorizationStatus: "PENDING" | "VERIFIED" | "REVOKED"; joinedAt: string; revokedAt?: string }
export interface OrganizationAssignment { id: string; msmeOrganizationId: string; branchId: string; relationshipManagerId: string; assignedBy: string; assignedAt: string; endedAt?: string; current: boolean }
export interface OrganizationInvitation { id: string; msmeOrganizationId: string; bankId: string; branchId?: string; contact: string; token: string; requestedActions: string[]; invitedBy: string; createdAt: string; expiresAt: string; status: "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED" }
export interface OrganizationStatusEvent { id: string; msmeOrganizationId: string; from: MSMEOnboardingStatus | null; to: MSMEOnboardingStatus; actor: string; at: string; note?: string }
export type DuplicateOutcome = "NO_MATCH" | "POSSIBLE_MATCH" | "EXACT_MATCH" | "RELATED_ORGANIZATION" | "CONFLICTING_IDENTITY";
export interface DuplicateCheckResult { outcome: DuplicateOutcome; matches: Array<{ organizationId: string; legalName: string; matchedOn: string[] }> }
export const BANK_ID = "bank_idbi_demo";
export function maskPan(pan: string): string { return pan.length >= 4 ? `•••••${pan.slice(-4, -1)}•` : "•••••"; }
