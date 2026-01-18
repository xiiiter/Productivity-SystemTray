interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  theme: any;
}

export function MetricCard({ title, value, subtitle, trend, trendValue, theme }: MetricCardProps) {
  const trendColor = trend === 'up' ? '#34d399' : trend === 'down' ? '#ef4444' : theme.text.secondary;

  return (
    <div style={{
      background: theme.background.secondary,
      borderRadius: '12px',
      padding: '16px',
    }}>
      <div style={{
        fontSize: '12px',
        color: theme.text.secondary,
        marginBottom: '8px',
      }}>
        {title}
      </div>
      <div style={{
        fontSize: '24px',
        fontWeight: 600,
        color: theme.text.primary,
        marginBottom: '4px',
      }}>
        {value}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{
          fontSize: '11px',
          color: theme.text.tertiary,
        }}>
          {subtitle}
        </span>
        {trend && trendValue && (
          <span style={{
            fontSize: '11px',
            color: trendColor,
            fontWeight: 500,
          }}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}