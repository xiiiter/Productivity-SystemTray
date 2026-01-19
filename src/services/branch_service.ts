// src/services/branch_service.ts

import { invoke } from "@tauri-apps/api/core";
import { Branch, BranchListResponse, BranchStats } from "../types/branch_types";

class BranchService {
  async listBranches(): Promise<Branch[]> {
    try {
      const response = await invoke<BranchListResponse>("list_branches");
      return response.branches;
    } catch (error) {
      console.error("Error listing branches:", error);
      throw error;
    }
  }

  async getBranch(branchId: string): Promise<Branch> {
    try {
      const branch = await invoke<Branch>("get_branch", { branchId });
      return branch;
    } catch (error) {
      console.error("Error getting branch:", error);
      throw error;
    }
  }

  async selectBranch(branchId: string): Promise<void> {
    try {
      await invoke("select_branch", { branchId });
    } catch (error) {
      console.error("Error selecting branch:", error);
      throw error;
    }
  }

  async getCurrentBranch(): Promise<Branch | null> {
    try {
      const branch = await invoke<Branch | null>("get_current_branch");
      return branch;
    } catch (error) {
      console.error("Error getting current branch:", error);
      return null;
    }
  }

  async getBranchStats(branchId: string): Promise<BranchStats> {
    try {
      const stats = await invoke<BranchStats>("get_branch_stats", { branchId });
      return stats;
    } catch (error) {
      console.error("Error getting branch stats:", error);
      throw error;
    }
  }
}

export const branchService = new BranchService();