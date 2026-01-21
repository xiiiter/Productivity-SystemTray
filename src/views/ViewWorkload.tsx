// frontend/views/ViewWorkload.tsx

import { useTheme } from '../App';
import { useWorkload } from '../hooks/useWorkload';

export function ViewWorkload() {
  const { theme } = useTheme();
  const userId = 'current-user-id'; // Get from auth context
  const { workload, validation, loading, isWithinWorkingHours } = useWorkload(userId);

  if (loading) {
    return (
      <div style={{ 
        padding: '32px 24px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}>
        <div
          className="spinner"
          style={{
            width: '32px',
            height: '32px',
            border: `2px solid ${theme.background.secondary}`,
            borderTop: `2px solid ${theme.accent.primary}`,
            borderRadius: '50%',
          }}
        />
        <div style={{ 
          color: theme.text.secondary,
          fontSize: '15px',
        }}>
          Loading workload...
        </div>
      </div>
    );
  }

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div 
      className="fade-in"
      style={{ 
        padding: '32px 24px', 
        height: '100%', 
        overflow: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          color: theme.text.primary,
          fontSize: '28px',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          marginBottom: '4px',
        }}>
          Workload
        </h2>
        <p style={{
          color: theme.text.secondary,
          fontSize: '14px',
          fontWeight: 400,
        }}>
          Your weekly schedule and current status
        </p>
      </div>

      {/* Work Status Card */}
      <div 
        className="scale-in"
        style={{
          background: isWithinWorkingHours 
            ? `linear-gradient(135deg, ${theme.accent.primary}20 0%, ${theme.accent.primary}10 100%)`
            : 'rgba(255, 59, 48, 0.12)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: `1px solid ${isWithinWorkingHours ? theme.accent.primary + '40' : '#FF3B3040'}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          fontSize: '100px',
          opacity: 0.08,
          pointerEvents: 'none',
        }}>
          {isWithinWorkingHours ? '💼' : '🌙'}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: isWithinWorkingHours ? theme.accent.primary : '#FF3B30',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: isWithinWorkingHours 
                ? `0 4px 16px ${theme.accent.glow}`
                : '0 4px 16px rgba(255, 59, 48, 0.3)',
            }}>
              {isWithinWorkingHours ? '✓' : '○'}
            </div>
            <div>
              <div style={{
                fontSize: '17px',
                fontWeight: 600,
                color: theme.text.primary,
                letterSpacing: '-0.02em',
                marginBottom: '2px',
              }}>
                {isWithinWorkingHours ? 'Active Work Hours' : 'Outside Work Hours'}
              </div>
              <div style={{
                fontSize: '13px',
                color: theme.text.secondary,
                fontWeight: 400,
              }}>
                {validation?.message || 'Loading status...'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      {workload && workload.schedule && workload.schedule.length > 0 && (
        <div 
          className="slide-in"
          style={{
            background: theme.background.secondary,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${theme.divider}`,
          }}
        >
          <h3 style={{
            color: theme.text.primary,
            fontSize: '17px',
            fontWeight: 600,
            marginBottom: '20px',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '18px' }}>📅</span>
            Weekly Schedule
          </h3>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
          }}>
            {workload.schedule.map((schedule, index) => {
              const isToday = new Date().getDay() === schedule.weekday;
              
              return (
                <div
                  key={index}
                  className="slide-in"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    borderRadius: '12px',
                    background: isToday 
                      ? theme.background.active
                      : 'transparent',
                    border: isToday 
                      ? `1px solid ${theme.accent.primary}40`
                      : `1px solid ${theme.divider}`,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    animationDelay: `${index * 0.05}s`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isToday) {
                      e.currentTarget.style.background = theme.background.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isToday) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                  }}>
                    {isToday && (
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: theme.accent.primary,
                        boxShadow: `0 0 8px ${theme.accent.primary}`,
                      }} />
                    )}
                    <span style={{ 
                      color: isToday ? theme.accent.primary : theme.text.primary,
                      fontSize: '15px',
                      fontWeight: isToday ? 600 : 500,
                      letterSpacing: '-0.01em',
                      minWidth: '90px',
                    }}>
                      {weekdays[schedule.weekday]}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{ 
                      color: theme.text.secondary,
                      fontSize: '14px',
                      fontWeight: 500,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {schedule.startTime}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={theme.text.tertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                    <span style={{ 
                      color: theme.text.secondary,
                      fontSize: '14px',
                      fontWeight: 500,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {schedule.endTime}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(!workload || !workload.schedule || workload.schedule.length === 0) && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
        }}>
          <div style={{ 
            fontSize: '64px',
            marginBottom: '20px',
            opacity: 0.3,
            filter: 'grayscale(1)',
          }}>
            📋
          </div>
          <div style={{
            fontSize: '17px',
            fontWeight: 500,
            color: theme.text.primary,
            marginBottom: '8px',
          }}>
            No schedule available
          </div>
          <div style={{
            fontSize: '14px',
            color: theme.text.tertiary,
            maxWidth: '280px',
            margin: '0 auto',
          }}>
            Your weekly schedule will appear here once configured
          </div>
        </div>
      )}
    </div>
  );
}