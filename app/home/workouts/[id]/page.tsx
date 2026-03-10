import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WorkoutDetailScreen from '@/components/screens/WorkoutDetailScreen';

type WorkoutDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WorkoutDetailPage({ params }: WorkoutDetailPageProps) {
  const { id } = await params;

  return (
    <DashboardLayout>
      <WorkoutDetailScreen workoutId={id} />
    </DashboardLayout>
  );
}
