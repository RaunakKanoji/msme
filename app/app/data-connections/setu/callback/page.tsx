import SetuCallbackStatus from "@/components/setu/setu-callback-status";
export default async function SetuCallbackPage({ searchParams }: { searchParams: Promise<{ consentId?: string }> }) { const params = await searchParams; return <SetuCallbackStatus consentId={params.consentId ?? ""} />; }
