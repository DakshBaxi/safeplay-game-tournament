import { DashboardLayout } from "@/components/dashboard-layout"
import { TournamentDashboard } from "@/components/tournament-dashboard"

export default function Home() {
  return (
    <DashboardLayout>
      <TournamentDashboard />
    </DashboardLayout>
  )
}
