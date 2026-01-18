// frontend/hooks/useWorkload.ts

import { useState, useEffect, useCallback } from 'react';
import { workloadService } from '../services/workload.service';
import { Workload, WorkHoursValidation } from '../types/workload.types';

export function useWorkload(userId: string) {
  const [workload, setWorkload] = useState<Workload | null>(null);
  const [validation, setValidation] = useState<WorkHoursValidation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWorkload();
    validateHours();
  }, [userId]);

  const loadWorkload = async () => {
    try {
      setLoading(true);
      const data = await workloadService.getWorkload(userId);
      setWorkload(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workload');
    } finally {
      setLoading(false);
    }
  };

  const validateHours = async () => {
    try {
      const result = await workloadService.validateWorkHours(userId);
      setValidation(result);
    } catch (err) {
      console.error('Failed to validate hours:', err);
    }
  };

  return {
    workload,
    validation,
    loading,
    error,
    refresh: loadWorkload,
    isWithinWorkingHours: validation?.isWithinHours ?? false,
  };
}