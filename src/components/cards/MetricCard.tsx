// src/components/cards/MetricCard.tsx

import { useState } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: string;
  theme: any;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  theme,
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: theme.background.secondary,
        borderRadius: '12px',
        padding: '20px',
        border: `1px solid ${isHovered ? theme.divider : 'transparent'}`,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? `0 8px 24px ${theme.accent.glow}`
          : 'none',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            color: theme.text.secondary,
            fontSize: '12px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {title}
        </div>

        {icon && (
          <div style={{ fontSize: '20px', opacity: 0.8 }}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div
        style={{
          color: theme.text.primary,
          fontSize: '32px',
          fontWeight: 700,
          lineHeight: 1,
          marginBottom: subtitle || trend ? '8px' : '0',
        }}
      >
        {value}
      </div>

      {/* Footer */}
      {(subtitle || trend) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '8px',
          }}
        >
          {subtitle && (
            <span
              style={{
                color: theme.text.tertiary,
                fontSize: '11px',
              }}
            >
              {subtitle}
            </span>
          )}

          {trend && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '4px',
                background: trend.isPositive
                  ? '#34d39920'
                  : '#ef444420',
                color: trend.isPositive ? '#34d399' : '#ef4444',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}