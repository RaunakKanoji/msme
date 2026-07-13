import { SpecRecordsPage } from "@/components/platform/spec-records-page";
import { store } from "@/lib/platform-specs/connector-failure-runbook";
export default function Page() { return <SpecRecordsPage title="Connector failure runbook" description="Provider outage handling with visible fallback." records={store.list().records} />; }
