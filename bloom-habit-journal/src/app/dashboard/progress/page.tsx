import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function ProgressPage() {
  return (
    <ComingSoon
      emoji="📈"
      title="Weekly, monthly, yearly progress"
      description="Heatmaps, consistency graphs, longest streaks, and completion percentages — all computed from your habit_logs table, which is already syncing to the cloud."
    />
  );
}
