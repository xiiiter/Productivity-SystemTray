import { useTheme } from '../App';
import { useMetrics } from '../hooks/useMetrics';
import { useBranch } from '../hooks/useBranch';

export function ViewMetrics() {
  const { theme } = useTheme();
  const { currentBranch } = useBranch();
  const { metrics, loading } = useMetrics();

  if (!currentBranch) {
    return (
      <div style={{ padding: '20px', color: theme.text.secondary }}>
        Please select a branch first
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', color: theme.text.secondary }}>
        Loading metrics...
      </div>
    );
  }

  if (!metrics) {
    return (
      <div style={{ padding: '20px', color: theme.text.secondary }}>
        No metrics available
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      height: '100%',
      overflow: 'auto',
    }}>
      <h2 style={{
        color: theme.text.primary,
        fontSize: '18px',
        fontWeight: 500,
        marginBottom: '16px',
      }}>
        Metrics - {currentBranch.name}
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
      }}>
        <div style={{
          background: theme.background.secondary,
          borderRadius: '12px',
          padding: '16px',
        }}>
          <div style={{ fontSize: '12px', color: theme.text.secondary, marginBottom: '8px' }}>
            Total Hours
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, color: theme.text.primary }}>
            {metrics.summary.totalHours.toFixed(1)}
          </div>
        </div>

        <div style={{
          background: theme.background.secondary,
          borderRadius: '12px',
          padding: '16px',
        }}>
          <div style={{ fontSize: '12px', color: theme.text.secondary, marginBottom: '8px' }}>
            Tasks Completed
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, color: theme.text.primary }}>
            {metrics.summary.completedTasks}
          </div>
        </div>
      </div>
    </div>
  );
}