import { DashboardLayout } from "@/components/dashboard-layout"
import { TournamentEditForm } from "@/components/tournament-edit-form"

export default function EditTournamentPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <TournamentEditForm id={params.id} />
    </DashboardLayout>
  )
}
