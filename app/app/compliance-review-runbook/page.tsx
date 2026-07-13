import { SpecRecordsPage } from "@/components/platform/spec-records-page";
import { store } from "@/lib/platform-specs/compliance-review-runbook";
export default function Page() { return <SpecRecordsPage title="Compliance review runbook" description="Periodic consent, retention, and attestation checks." records={store.list().records} />; }
