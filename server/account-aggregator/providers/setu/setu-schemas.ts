import { z } from "zod";
// Documented Setu v2 create-consent body. consentMode/fetchType/consentTypes/fiTypes/purpose/dataLife/frequency
// are configured on the Setu product instance (Bridge console) and returned in the consent `detail`, not posted here.
export const setuConsentPayloadSchema = z.object({ consentDuration: z.object({ unit: z.enum(["DAY", "MONTH", "YEAR"]), value: z.string() }), vua: z.string().min(3), dataRange: z.object({ from: z.iso.datetime(), to: z.iso.datetime() }), context: z.array(z.object({ key: z.string(), value: z.string() })), additionalParams: z.object({ tags: z.array(z.string()) }) });
// `url` (hosted webview) is guaranteed on create but may be omitted on GET /consents/:id status reads — keep it
// optional so consent reconciliation/polling can't hard-fail on a missing field.
export const setuConsentResponseSchema = z.object({ id: z.string(), url: z.string().url().optional(), status: z.string(), detail: z.unknown().optional(), traceId: z.string().optional() });
export const setuSessionResponseSchema = z.object({ id: z.string(), consentId: z.string(), status: z.string(), traceId: z.string().optional(), dataRange: z.object({ from: z.string(), to: z.string() }) });
