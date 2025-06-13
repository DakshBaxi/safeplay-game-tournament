import { DashboardLayout } from "@/components/dashboard-layout"
import { TournamentEditForm } from "@/components/tournament-edit-form"

export default async function EditTournamentPage(promise: { params: Promise<{ id: string }> }) {
  const { id } = await promise.params;
  return (
    <DashboardLayout>
      <TournamentEditForm id={id} />
    </DashboardLayout>
  )
}
