// src/services/branch_service.ts

import { invoke } from "@tauri-apps/api/core";
import { Branch, BranchStats } from "../types/branch_types";

class BranchService {
  async listBranches(): Promise<Branch[]> {
    try {
      console.log('🔵 Calling get_all_branches');
      const branches = await invoke<Branch[]>("get_all_branches");
      console.log('✅ Branches loaded:', branches.length);
      return branches;
    } catch (error) {
      console.error("❌ Error listing branches:", error);
      throw error;
    }
  }

  async getBranch(branchId: string): Promise<Branch> {
    try {
      console.log('🔵 Calling get_branch_by_id with:', { branch_id: branchId });
      const branch = await invoke<Branch>("get_branch_by_id", { 
        branch_id: branchId 
      });
      console.log('✅ Branch loaded:', branch);
      return branch;
    } catch (error) {
      console.error("❌ Error getting branch:", error);
      throw error;
    }
  }

  async selectBranch(branchId: string, userId: string): Promise<void> {
    try {
      const params = { 
        branch_id: branchId, 
        user_id: userId 
      };
      console.log('🔵 Calling select_branch with:', params);
      await invoke("select_branch", params);
      console.log('✅ Branch selected successfully');
    } catch (error) {
      console.error("❌ Error selecting branch:", error);
      console.error("❌ Error details:", JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async getCurrentBranch(userId: string): Promise<Branch | null> {
    try {
      console.log('🔵 Calling get_current_branch with:', { user_id: userId });
      const branch = await invoke<Branch | null>("get_current_branch", { 
        user_id: userId 
      });
      console.log('✅ Current branch:', branch);
      return branch;
    } catch (error) {
      console.error("❌ Error getting current branch:", error);
      return null;
    }
  }

  async clearBranch(userId: string): Promise<void> {
    try {
      console.log('🔵 Calling clear_branch with:', { user_id: userId });
      await invoke("clear_branch", { user_id: userId });
      console.log('✅ Branch cleared');
    } catch (error) {
      console.error("❌ Error clearing branch:", error);
      throw error;
    }
  }

  async getBranchStats(branchId: string): Promise<BranchStats> {
    try {
      console.log('🔵 Calling get_branch_stats with:', { branch_id: branchId });
      const stats = await invoke<BranchStats>("get_branch_stats", { 
        branch_id: branchId 
      });
      console.log('✅ Branch stats:', stats);
      return stats;
    } catch (error) {
      console.error("❌ Error getting branch stats:", error);
      throw error;
    }
  }
}

export const branchService = new BranchService();