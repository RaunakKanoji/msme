import BusinessProfileWorkspace from "@/components/business-profile-workspace";
import BusinessAddressesWorkspace from "@/components/business-addresses-workspace";
import IndustryClassificationWorkspace from "@/components/industry-classification-workspace";
import ApplicationProgressWorkspace from "@/components/application-progress-workspace";
import NtbNtcIdentificationWorkspace from "@/components/ntb-ntc-identification-workspace";
import KybReviewPacketWorkspace from "@/components/kyb-review-packet-workspace";
export default async function ApplicationPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ section?: string }> }) { const [{ id }, { section }] = await Promise.all([params, searchParams]); if (section === "addresses") return <BusinessAddressesWorkspace applicationId={id} />; if (section === "industry-classification") return <IndustryClassificationWorkspace applicationId={id} />; if (section === "progress") return <ApplicationProgressWorkspace applicationId={id} />; if (section === "ntb-ntc") return <NtbNtcIdentificationWorkspace applicationId={id} />; if (section === "kyb-review") return <KybReviewPacketWorkspace applicationId={id} />; return <BusinessProfileWorkspace applicationId={id} />; }
