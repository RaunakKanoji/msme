export const ALLOWED_ROLES = ["bank_analyst", "risk_officer", "admin"] as const;
export type AllowedRole = (typeof ALLOWED_ROLES)[number];

export type Evidence = {
  source_id: string;
  source_name: string;
  observed_at: string;
  freshness: "Current" | "Stale";
  completeness: number;
  detail: string;
};

export type FitAssessment = {
  id: string;
  organization_id: string;
  organization_name: string;
  title: string;
  status: "Ready" | "Needs review";
  confidence: number;
  recommendation: string;
  explanation: string;
  evidence: Evidence[];
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
};

export type ApiError = { error: { code: string; message: string }; trace_id: string };

const seededAssessment: FitAssessment = {
  id: "psf_demo_001",
  organization_id: "org_demo_saraswati",
  organization_name: "Saraswati Precision Works",
  title: "Alternative-data credit readiness",
  status: "Ready",
  confidence: 82,
  recommendation: "Proceed to assisted Financial Health Card review",
  explanation:
    "Consistent digital collections and verified business identity provide sufficient evidence for an assisted review. Two months of GST data are still pending.",
  evidence: [
    {
      source_id: "demo_upi_2026_06",
      source_name: "Synthetic UPI collections",
      observed_at: "2026-07-10T08:30:00.000Z",
      freshness: "Current",
      completeness: 96,
      detail: "Collections were stable across the last 90 days.",
    },
    {
      source_id: "demo_kyb_2026_07",
      source_name: "Synthetic KYB verification",
      observed_at: "2026-07-11T10:15:00.000Z",
      freshness: "Current",
      completeness: 100,
      detail: "Entity and authorized representative were verified.",
    },
    {
      source_id: "demo_gst_2026_05",
      source_name: "Synthetic GST filing summary",
      observed_at: "2026-05-31T18:30:00.000Z",
      freshness: "Stale",
      completeness: 67,
      detail: "Two recent monthly summaries are unavailable.",
    },
  ],
  created_at: "2026-07-11T10:30:00.000Z",
  updated_at: "2026-07-11T10:30:00.000Z",
  created_by: "system.seed",
  updated_by: "system.seed",
};

let assessments: FitAssessment[] = [seededAssessment];
const auditEvents: Array<Record<string, string>> = [];

export function traceId() {
  return `trc_${crypto.randomUUID()}`;
}

export function getActor(request: Request) {
  return {
    id: request.headers.get("x-actor-id") || "demo.bank.analyst",
    role: request.headers.get("x-user-role") || "bank_analyst",
  };
}

export function isAllowedRole(role: string): role is AllowedRole {
  return (ALLOWED_ROLES as readonly string[]).includes(role);
}

export function apiError(trace_id: string, code: string, message: string, status: number) {
  return Response.json({ error: { code, message }, trace_id } satisfies ApiError, { status });
}

export function listAssessments() {
  return assessments;
}

export function getAssessment(id: string) {
  return assessments.find((assessment) => assessment.id === id);
}

export function createAssessment(input: Pick<FitAssessment, "organization_name" | "title" | "recommendation" | "explanation">, actor: string) {
  const now = new Date().toISOString();
  const assessment: FitAssessment = {
    id: `psf_${crypto.randomUUID()}`,
    organization_id: `org_${crypto.randomUUID()}`,
    organization_name: input.organization_name,
    title: input.title,
    status: "Needs review",
    confidence: 0,
    recommendation: input.recommendation,
    explanation: input.explanation,
    evidence: [],
    created_at: now,
    updated_at: now,
    created_by: actor,
    updated_by: actor,
  };
  assessments = [assessment, ...assessments];
  writeAudit("problem_statement_fit.created", assessment.id, actor);
  return assessment;
}

export function updateAssessment(id: string, input: Partial<Pick<FitAssessment, "title" | "recommendation" | "explanation" | "status">>, actor: string) {
  const current = getAssessment(id);
  if (!current) return undefined;
  const updated = { ...current, ...input, updated_at: new Date().toISOString(), updated_by: actor };
  assessments = assessments.map((assessment) => (assessment.id === id ? updated : assessment));
  writeAudit("problem_statement_fit.updated", id, actor);
  return updated;
}

function writeAudit(event_type: string, entity_id: string, actor_id: string) {
  auditEvents.push({
    id: `audit_${crypto.randomUUID()}`,
    event_type,
    entity_id,
    actor_id,
    occurred_at: new Date().toISOString(),
  });
}

export function auditEventCount() {
  return auditEvents.length;
}
