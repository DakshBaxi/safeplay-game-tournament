import { DashboardLayout } from "@/components/dashboard-layout"
import { TeamDetails } from "@/components/team-details"

export default function TeamDetailsPage({
  params,
}: {
  params: { id: string; teamId: string }
}) {
  return (
    <DashboardLayout>
      <TeamDetails tournamentId={params.id} teamId={params.teamId} />
    </DashboardLayout>
  )
}
