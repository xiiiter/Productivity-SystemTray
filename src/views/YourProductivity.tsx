// frontend/views/YourProductivity.tsx

import { useTheme } from '../App';
import { useMetrics } from '../hooks/useMetrics';
import { MetricCard } from '../components/cards/MetricCard';

export function YourProductivity() {
  const { theme } = useTheme();
  const userId = 'current-user-id'; // Get from auth context
  const { metrics, loading } = useMetrics(userId);

  if (loading) {
    return (
      <div style={{ padding: '20px', color: theme.text.secondary }}>
        Loading your productivity...
      </div>
    );
  }

  if (!metrics) {
    return (
      <div style={{ padding: '20px', color: theme.text.secondary }}>
        No data available
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', height: '100%', overflow: 'auto' }}>
      <h2 style={{
        color: theme.text.primary,
        fontSize: '18px',
        fontWeight: 500,
        marginBottom: '16px',
      }}>
        Your Productivity
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '20px',
      }}>
        <MetricCard
          title="Today's Hours"
          value={metrics.summary.totalHours.toFixed(1)}
          subtitle="hours worked"
          theme={theme}
        />
        <MetricCard
          title="Tasks Completed"
          value={metrics.summary.completedTasks.toString()}
          subtitle="this week"
          theme={theme}
        />
      </div>

      {/* Add more personal stats here */}
    </div>
  );
}