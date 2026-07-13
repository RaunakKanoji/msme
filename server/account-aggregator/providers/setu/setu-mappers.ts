import type { CreateConsentInput } from "../../types.ts";
import type { SetuConfig } from "./setu-config.ts";
import { setuConsentPayloadSchema } from "./setu-schemas.ts";
export function mapConsent(input: CreateConsentInput, config: SetuConfig) {
  // vua = "<mobile>@<aa-handle>"; the handle is optional — Setu's webview lets the user pick their AA during discovery.
  const handle = config.aaHandle ? (config.aaHandle.startsWith("@") ? config.aaHandle : `@${config.aaHandle}`) : "";
  const vua = input.mobileNumber.includes("@") ? input.mobileNumber : `${input.mobileNumber}${handle}`;
  const payload = {
    consentDuration: { unit: "MONTH" as const, value: input.fetchType === "ONETIME" ? "1" : "12" },
    vua,
    dataRange: { from: input.from, to: input.to },
    context: [] as { key: string; value: string }[],
    additionalParams: { tags: ["MSME_AROGYA360", "FINANCIAL_HEALTH", "DEFAULT_RISK", config.environment.toUpperCase()] }
  };
  return setuConsentPayloadSchema.parse(payload);
}
