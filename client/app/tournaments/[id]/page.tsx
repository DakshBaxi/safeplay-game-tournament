import { DashboardLayout } from "@/components/dashboard-layout"
import { TournamentDetails } from "@/components/tournament-details"

export default function TournamentDetailsPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <TournamentDetails id={params.id} />
    </DashboardLayout>
  )
}
