import type { AccountAggregatorProvider } from "./types.ts";
import { DemoAccountAggregatorProvider } from "./providers/demo-provider.ts";
import { SetuProvider } from "./providers/setu/setu-provider.ts";
import { getSetuConfig } from "./providers/setu/setu-config.ts";
import { SetuConfigurationError } from "./errors.ts";
let warnedEphemeral = false;
export function getAccountAggregatorProvider(): AccountAggregatorProvider {
  const config = getSetuConfig();
  if (config.mode === "demo") return new DemoAccountAggregatorProvider();
  // TODO(prod): back aaStore with the Prisma models (AccountAggregatorConsent / AccountAggregatorDataSession).
  // The in-memory store is not durable and not multi-instance safe — webhooks in separate serverless invocations
  // will not see consents created elsewhere.
  if (process.env.SETU_PERSISTENCE_READY !== "true") {
    if (process.env.SETU_ALLOW_EPHEMERAL_STORE !== "true") throw new SetuConfigurationError("Setu mode is disabled until runtime persistence is connected and migrated. Set SETU_ALLOW_EPHEMERAL_STORE=true for single-process local dev only.");
    if (!warnedEphemeral) { warnedEphemeral = true; console.warn("[setu] Live Setu is running against the in-memory store (SETU_ALLOW_EPHEMERAL_STORE=true). Dev/single-instance only — not production-safe."); }
  }
  return new SetuProvider(config);
}
