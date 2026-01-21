// src/hooks/useBranch.ts
// SOLUÇÃO: Enviar em camelCase como o Tauri espera

import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Branch, BranchSelection } from '../types/branch_types';

export function useBranch() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBranches = async () => {
    try {
      setLoading(true);
      const result = await invoke<Branch[]>('get_all_branches');
      console.log('✅ Branches received:', result);
      setBranches(result);
    } catch (error) {
      console.error('❌ Failed to load branches:', error);
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentBranch = async () => {
    try {
      const userId = 'user123'; // TODO: Get from auth
      
      // SOLUÇÃO: Enviar em camelCase
      const result = await invoke<Branch | null>('get_current_branch', { 
        userId: userId  // ← camelCase (como o Tauri espera)
      });
      
      console.log('✅ Current branch loaded:', result);
      setCurrentBranch(result);
    } catch (error) {
      console.error('❌ Failed to load current branch:', error);
      setCurrentBranch(null);
    }
  };

  const selectBranch = async (branchId: string) => {
    try {
      const userId = 'user123'; // TODO: Get from auth
      
      console.log('🔵 Calling select_branch');
      console.log('🔵 branchId:', branchId);
      console.log('🔵 userId:', userId);
      
      // SOLUÇÃO: Enviar em camelCase
      const result = await invoke<BranchSelection>('select_branch', {
        branchId: branchId,  // ← camelCase (como o Tauri espera)
        userId: userId       // ← camelCase (como o Tauri espera)
      });
      
      console.log('✅ Branch selected successfully:', result);
      await loadCurrentBranch();
      return result;
    } catch (error) {
      console.error('❌ Failed to select branch:', error);
      throw error;
    }
  };

  const clearBranch = async () => {
    try {
      const userId = 'user123'; // TODO: Get from auth
      
      // SOLUÇÃO: Enviar em camelCase
      await invoke('clear_branch', { 
        userId: userId  // ← camelCase
      });
      
      setCurrentBranch(null);
      console.log('✅ Branch cleared');
    } catch (error) {
      console.error('❌ Failed to clear branch:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadBranches();
    loadCurrentBranch();
  }, []);

  return {
    branches,
    currentBranch,
    loading,
    selectBranch,
    clearBranch,
    reload: () => {
      loadBranches();
      loadCurrentBranch();
    },
  };
}

/*
✅ SOLUÇÃO APLICADA!

O Tauri 2.x espera camelCase no frontend, mesmo que o Rust use snake_case.
Agora enviamos:
- branchId (não branch_id)
- userId (não user_id)

O Tauri faz a conversão internamente para o Rust.
*/