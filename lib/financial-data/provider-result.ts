import type { DataSourceMetadata, FinancialProviderError, FinancialProviderErrorCode, ProviderResult } from "./types.ts";
export function ok<T>(data: T, source: DataSourceMetadata): ProviderResult<T> { return { ok: true, data, source }; }
export function err<T>(code: FinancialProviderErrorCode, message: string): ProviderResult<T> { return { ok: false, error: { code, message } }; }
export function isOk<T>(result: ProviderResult<T>): result is { ok: true; data: T; source: DataSourceMetadata } { return result.ok; }
// User-safe messages — never surface raw provider errors.
const SAFE_MESSAGES: Record<FinancialProviderErrorCode, string> = {
  PROVIDER_UNAVAILABLE: "Financial data is temporarily unavailable.",
  PROVIDER_TIMEOUT: "The financial-data provider took too long to respond.",
  PROVIDER_AUTH_FAILED: "The financial-data connection needs to be re-authorized.",
  PROVIDER_RATE_LIMITED: "Too many requests to the financial-data provider. Please try again shortly.",
  INVALID_PROVIDER_RESPONSE: "The financial-data provider returned an unexpected response.",
  PROVIDER_NOT_CONFIGURED: "The financial-data provider is not configured.",
  CONSENT_REQUIRED: "Financial-data access consent is required.",
  UNKNOWN_PROVIDER_ERROR: "Financial data is temporarily unavailable.",
};
export function safeMessage(error: FinancialProviderError): string { return SAFE_MESSAGES[error.code] ?? SAFE_MESSAGES.UNKNOWN_PROVIDER_ERROR; }
