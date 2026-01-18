// frontend/hooks/useBranch.ts

import { useState, useEffect, useCallback } from 'react';
import { branchService } from '../services/branch.service';
import { Branch } from '../types/branch_types';

export function useBranch() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      setLoading(true);
      const data = await branchService.getAllBranches();
      setBranches(data);
      
      // Set first active branch as current if none selected
      if (!currentBranch && data.length > 0) {
        const activeBranch = data.find(b => b.active) || data[0];
        setCurrentBranch(activeBranch);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  const selectBranch = useCallback(async (branchId: string) => {
    try {
      const userId = "current_user"; // TODO: Get from auth context
      await branchService.selectBranch(branchId, userId);
      const branch = branches.find(b => b.id === branchId);
      if (branch) {
        setCurrentBranch(branch);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select branch');
    }
  }, [branches]);

  const clearBranch = useCallback(async () => {
    try {
      const userId = "current_user"; // TODO: Get from auth context
      await branchService.clearBranch(userId);
      setCurrentBranch(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear branch');
    }
  }, []);

  return {
    branches,
    currentBranch,
    loading,
    error,
    selectBranch,
    clearBranch,
    refresh: loadBranches,
  };
}