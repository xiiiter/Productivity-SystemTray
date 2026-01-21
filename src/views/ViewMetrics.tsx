// src/views/ViewMetrics.tsx

import { useTheme } from '../App';

export function ViewMetrics() {
  const { theme } = useTheme();

  // Mock data - você vai substituir isso com dados reais do backend
  const metrics = {
    tasksCompleted: 12,
    hoursWorked: 7.5,
    productivity: 85,
    weeklyGoal: 40,
  };

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
          Metrics
        </h2>
        <p style={{
          color: theme.text.secondary,
          fontSize: '14px',
          fontWeight: 400,
        }}>
          Your performance overview
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {/* Tasks Completed */}
        <div 
          className="scale-in card-hover"
          style={{
            background: theme.background.secondary,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${theme.divider}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
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
              background: `${theme.accent.primary}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}>
              ✓
            </div>
            <div>
              <div style={{
                fontSize: '13px',
                color: theme.text.secondary,
                fontWeight: 400,
                marginBottom: '4px',
              }}>
                Tasks Completed
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: theme.accent.primary,
                letterSpacing: '-0.02em',
              }}>
                {metrics.tasksCompleted}
              </div>
            </div>
          </div>
        </div>

        {/* Hours Worked */}
        <div 
          className="scale-in card-hover"
          style={{
            background: theme.background.secondary,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${theme.divider}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            animationDelay: '0.1s',
          }}
        >
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
              background: `${theme.accent.primary}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}>
              ⏱
            </div>
            <div>
              <div style={{
                fontSize: '13px',
                color: theme.text.secondary,
                fontWeight: 400,
                marginBottom: '4px',
              }}>
                Hours Worked
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: theme.accent.primary,
                letterSpacing: '-0.02em',
              }}>
                {metrics.hoursWorked}h
              </div>
            </div>
          </div>
        </div>

        {/* Productivity Score */}
        <div 
          className="scale-in card-hover"
          style={{
            background: theme.background.secondary,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${theme.divider}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            animationDelay: '0.2s',
          }}
        >
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
              background: `${theme.accent.primary}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}>
              📈
            </div>
            <div>
              <div style={{
                fontSize: '13px',
                color: theme.text.secondary,
                fontWeight: 400,
                marginBottom: '4px',
              }}>
                Productivity
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: theme.accent.primary,
                letterSpacing: '-0.02em',
              }}>
                {metrics.productivity}%
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Goal */}
        <div 
          className="scale-in card-hover"
          style={{
            background: theme.background.secondary,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${theme.divider}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            animationDelay: '0.3s',
          }}
        >
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
              background: `${theme.accent.primary}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}>
              🎯
            </div>
            <div>
              <div style={{
                fontSize: '13px',
                color: theme.text.secondary,
                fontWeight: 400,
                marginBottom: '4px',
              }}>
                Weekly Goal
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: theme.accent.primary,
                letterSpacing: '-0.02em',
              }}>
                {metrics.weeklyGoal}h
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div 
        className="slide-in"
        style={{
          background: theme.background.secondary,
          borderRadius: '16px',
          padding: '24px',
          border: `1px solid ${theme.divider}`,
          animationDelay: '0.4s',
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
          <span style={{ fontSize: '18px' }}>📊</span>
          Weekly Performance
        </h3>

        {/* Simple bar chart placeholder */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '12px',
          height: '200px',
          padding: '20px',
          background: `${theme.background.primary}80`,
          borderRadius: '12px',
        }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const height = Math.random() * 100 + 20;
            return (
              <div
                key={day}
                className="fade-in"
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  animationDelay: `${0.5 + index * 0.1}s`,
                }}
              >
                <div style={{
                  width: '100%',
                  height: `${height}%`,
                  background: `linear-gradient(180deg, ${theme.accent.primary} 0%, ${theme.accent.primary}80 100%)`,
                  borderRadius: '6px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scaleY(1.05)';
                  e.currentTarget.style.filter = 'brightness(1.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scaleY(1)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
                />
                <div style={{
                  fontSize: '11px',
                  color: theme.text.tertiary,
                  fontWeight: 500,
                }}>
                  {day}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}