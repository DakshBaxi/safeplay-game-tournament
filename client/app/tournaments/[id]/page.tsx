import { DashboardLayout } from "@/components/dashboard-layout";
import { TournamentDetails } from "@/components/tournament-details";

export default async function TournamentDetailsPage(promise: { params: Promise<{ id: string }> }) {
  const { id } = await promise.params;

  return (
    <DashboardLayout>
      <TournamentDetails id={id} />
    </DashboardLayout>
  );
}
