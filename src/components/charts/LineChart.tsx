// frontend/components/charts/LineChart.tsx

interface LineChartProps {
  data: Array<{ date: string; value: number }>;
  theme: any;
}

export function LineChart({ data, theme }: LineChartProps) {
  // Simple SVG line chart implementation
  const maxValue = Math.max(...data.map(d => d.value));
  const width = 300;
  const height = 150;
  const padding = 20;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - (d.value / maxValue) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} style={{ width: '100%', height: 'auto' }}>
      <polyline
        points={points}
        fill="none"
        stroke={theme.accent.primary}
        strokeWidth="2"
      />
    </svg>
  );
}