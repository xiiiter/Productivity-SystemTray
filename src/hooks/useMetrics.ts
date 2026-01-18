// frontend/hooks/useMetrics.ts

import { useState, useEffect, useCallback } from 'react';
import { metricsService } from '../services/metrics.service';
import { MetricsData, MetricsFilter } from '../types/metrics.types';
import { useBranch } from './useBranch';

export function useMetrics(userId?: string) {
  const { currentBranch } = useBranch();
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<MetricsFilter>({
    period: 'week',
    branchId: currentBranch?.id,
    userId,
  });

  useEffect(() => {
    if (currentBranch) {
      loadMetrics();
    }
  }, [currentBranch, filter, userId]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = userId
        ? await metricsService.getUserMetrics(userId, filter)
        : await metricsService.getBranchMetrics(filter);

      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = useCallback((newFilter: Partial<MetricsFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  return {
    metrics,
    loading,
    error,
    filter,
    updateFilter,
    refresh: loadMetrics,
  };
}