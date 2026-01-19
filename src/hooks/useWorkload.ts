// src/hooks/useWorkload.ts

import { useState, useEffect } from 'react';
import { workloadService } from '../services/workload_service';
import { Workload, WorkloadValidation } from '../types/workload_types';

export function useWorkload(userId: string) {
  const [workload, setWorkload] = useState<Workload | null>(null);
  const [validation, setValidation] = useState<WorkloadValidation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWithinWorkingHours, setIsWithinWorkingHours] = useState(false);

  useEffect(() => {
    loadWorkload();
    validateHours();
    checkWorkingHours();
  }, [userId]);

  const loadWorkload = async () => {
    try {
      setLoading(true);
      const data = await workloadService.getWorkload(userId);
      setWorkload(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workload');
      console.error('Error loading workload:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateHours = async () => {
    try {
      const result = await workloadService.validateWorkload(userId);
      setValidation(result);
    } catch (err) {
      console.error('Failed to validate hours:', err);
    }
  };

  const checkWorkingHours = async () => {
    try {
      const result = await workloadService.isWithinWorkingHours(userId);
      setIsWithinWorkingHours(result);
    } catch (err) {
      console.error('Failed to check working hours:', err);
    }
  };

  return {
    workload,
    validation,
    loading,
    error,
    isWithinWorkingHours,
    refresh: loadWorkload,
  };
}