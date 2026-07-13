"use client";
import { ProviderUnavailableState } from "@/components/financial-data/states";
// Route error boundary — plain-language, retryable, no stack trace surfaced to the user.
export default function FinancialHealthError({ reset }: { error: Error; reset: () => void }) {
  return <div onClick={reset}><ProviderUnavailableState code="FINANCIAL_HEALTH_RENDER_ERROR" /></div>;
}
