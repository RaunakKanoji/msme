import { SpecRecordsPage } from "@/components/platform/spec-records-page";
import { store } from "@/lib/platform-specs/ops-runbook";
export default function Page() { return <SpecRecordsPage title="Operations runbook" description="Standard procedures, health checks, and escalation." records={store.list().records} />; }
