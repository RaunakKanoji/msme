import { SpecRecordsPage } from "@/components/platform/spec-records-page";
import { store } from "@/lib/platform-specs/borrower-service-requests";
export default function Page() { return <SpecRecordsPage title="Borrower service requests" description="Categorized requests with SLA clocks and status workflow." records={store.list().records} />; }
