import { DashboardLayout } from "@/components/dashboard-layout"
import { TournamentCreationForm } from "@/components/tournament-creation-form"

export default function CreateTournamentPage() {
  return (
    <DashboardLayout>
      <TournamentCreationForm />
    </DashboardLayout>
  )
}
