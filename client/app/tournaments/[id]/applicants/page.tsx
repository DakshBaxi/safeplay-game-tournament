import { DashboardLayout } from "@/components/dashboard-layout"
import { ApplicantsManagement } from "@/components/applicants-management"

export default function ApplicantsPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <ApplicantsManagement id={params.id} />
    </DashboardLayout>
  )
}
