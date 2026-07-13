"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
type Status = { status: string; consent: null | { id: string; expiresAt: string } };
export default function SetuConsentControls() {
  const [data, setData] = useState<Status | undefined>(undefined);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() { try { const response = await fetch("/api/integrations/setu/status"); const body = await response.json(); if (!response.ok) throw new Error(body.title); setData(body.data as Status); } catch (value) { setError(value instanceof Error ? value.message : "Consent status is unavailable."); } }
  useEffect(() => { void load(); }, []);
  async function revoke() {
    if (!data?.consent) return;
    setBusy(true); setError(""); setMessage("");
    try { const response = await fetch(`/api/integrations/setu/consents/${data.consent.id}/revoke`, { method: "POST" }); const body = await response.json(); if (!response.ok) throw new Error(body.title); setMessage("Consent revoked. Future synchronisation is stopped and connected evidence is marked stale."); await load(); }
    catch (value) { setError(value instanceof Error ? value.message : "Revocation failed."); }
    finally { setBusy(false); }
  }
  const active = data?.consent && data.status === "ACTIVE";
  return <section className="detail-card"><div className="detail-top"><div><p className="eyebrow">Setu AA</p><h2>Consent controls</h2></div>{data && <span className={`status ${active ? "ready" : "review"}`}>{data.status.replaceAll("_", " ")}</span>}</div>
    {error && <p className="address-missing">{error}</p>}
    {message && <p className="recommendation"><strong>{message}</strong></p>}
    <div className="button-row">
      <Link className="ui-button" href="/app/data-connections">View connection</Link>
      <Link className="ui-button ui-button-outline" href="/app/data-connections/setu">Create or renew consent</Link>
      {active && <button className="ui-button ui-button-outline" disabled={busy} onClick={revoke}>{busy ? "Revoking…" : "Revoke access"}</button>}
    </div>
  </section>;
}
