import { NextResponse } from "next/server";
export async function GET(request: Request) { const url = new URL(request.url); // Setu's hosted webview redirects back with the consent id; accept the documented names defensively. The browser
  // redirect is not authoritative — the callback page re-checks the real consent status through the backend.
  const consentId = url.searchParams.get("consentId") || url.searchParams.get("id") || url.searchParams.get("consentHandle") || ""; const state = url.searchParams.get("state") || ""; return NextResponse.redirect(new URL(`/app/data-connections/setu/callback?consentId=${encodeURIComponent(consentId)}&state=${encodeURIComponent(state)}`, url)); }
