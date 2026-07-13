import { SpecRecordsPage } from "@/components/platform/spec-records-page";
import { store } from "@/lib/platform-specs/sla-policy";
export default function Page() { return <SpecRecordsPage title="Support SLA policy" description="Response and resolution targets by severity." records={store.list().records} />; }
