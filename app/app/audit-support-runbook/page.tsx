import { SpecRecordsPage } from "@/components/platform/spec-records-page";
import { store } from "@/lib/platform-specs/audit-support-runbook";
export default function Page() { return <SpecRecordsPage title="Audit support runbook" description="Serving audit with masked, logged, read-only access." records={store.list().records} />; }
