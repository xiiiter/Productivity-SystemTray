// src/hooks/useBranch.ts

import { useState, useEffect, useCallback } from 'react';
import { branchService } from '../services/branch_service';
import { Branch } from '../types/branch_types';

export function useBranch() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBranches();
    loadCurrentBranch();
  }, []);

  const loadBranches = async () => {
    try {
      setLoading(true);
      const data = await branchService.listBranches();
      setBranches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load branches');
      console.error('Error loading branches:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentBranch = async () => {
    try {
      const branch = await branchService.getCurrentBranch();
      setCurrentBranch(branch);
    } catch (err) {
      console.error('Error loading current branch:', err);
    }
  };

  const selectBranch = useCallback(async (branchId: string) => {
    try {
      await branchService.selectBranch(branchId);
      const branch = branches.find(b => b.id === branchId);
      if (branch) {
        setCurrentBranch(branch);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select branch');
      throw err;
    }
  }, [branches]);

  return {
    branches,
    currentBranch,
    loading,
    error,
    selectBranch,
    refresh: loadBranches,
  };
}