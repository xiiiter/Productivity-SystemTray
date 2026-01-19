// src/hooks/useMetrics.ts

import { useState, useEffect, useCallback } from 'react';
import { metricsService } from '../services/metrics_service';
import { Metrics, MetricsFilter, MetricsPeriod } from '../types/metrics_types';

export function useMetrics(userId?: string) {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, [userId]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const filter: MetricsFilter = {
        userId,
        period: MetricsPeriod.Weekly,
      };

      const data = await metricsService.getMetrics(filter);
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
      console.error('Error loading metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    metrics,
    loading,
    error,
    refresh: loadMetrics,
  };
}