// frontend/views/ViewWorkload.tsx

import { useTheme } from '../App';
import { useWorkload } from '../hooks/useWorkload';

export function ViewWorkload() {
  const { theme } = useTheme();
  const userId = 'current-user-id'; // Get from auth context
  const { workload, validation, loading, isWithinWorkingHours } = useWorkload(userId);

  if (loading) {
    return (
      <div style={{ padding: '20px', color: theme.text.secondary }}>
        Loading workload...
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
        View Workload
      </h2>

      {/* Work Status */}
      <div style={{
        background: isWithinWorkingHours ? theme.accent.primary + '20' : '#ef444420',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 500,
          color: theme.text.primary,
          marginBottom: '8px',
        }}>
          Current Status
        </div>
        <div style={{
          fontSize: '12px',
          color: theme.text.secondary,
        }}>
          {validation?.message || 'Loading...'}
        </div>
      </div>

      {/* Schedule */}
      {workload && (
        <div style={{
          background: theme.background.secondary,
          borderRadius: '12px',
          padding: '16px',
        }}>
          <h3 style={{
            color: theme.text.primary,
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '12px',
          }}>
            Weekly Schedule
          </h3>

          {workload.schedule.map((schedule, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: index < workload.schedule.length - 1 ? `1px solid ${theme.divider}` : 'none',
              }}
            >
              <span style={{ color: theme.text.primary, fontSize: '13px' }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][schedule.weekday]}
              </span>
              <span style={{ color: theme.text.secondary, fontSize: '13px' }}>
                {schedule.startTime} - {schedule.endTime}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}