// src/services/workload_service.ts

import { invoke } from "@tauri-apps/api/core";

export interface WorkSchedule {
  weekday: number;
  startTime: string;
  endTime: string;
}

export interface Workload {
  userId: string;
  schedule: WorkSchedule[];
  maxHoursPerDay: number;
  maxHoursPerWeek: number;
}

export interface WorkloadValidation {
  isValid: boolean;
  message: string;
  currentHours: number;
  maxHours: number;
}

class WorkloadService {
  async getWorkload(userId: string): Promise<Workload | null> {
    try {
      const workload = await invoke<Workload>("get_workload", { userId });
      return workload;
    } catch (error) {
      console.error("Error getting workload:", error);
      return null;
    }
  }

  async validateWorkload(userId: string): Promise<WorkloadValidation> {
    try {
      const validation = await invoke<WorkloadValidation>("validate_workload", { userId });
      return validation;
    } catch (error) {
      console.error("Error validating workload:", error);
      return {
        isValid: false,
        message: "Error validating workload",
        currentHours: 0,
        maxHours: 0,
      };
    }
  }

  async isWithinWorkingHours(userId: string): Promise<boolean> {
    try {
      const result = await invoke<boolean>("is_within_working_hours", { userId });
      return result;
    } catch (error) {
      console.error("Error checking working hours:", error);
      return false;
    }
  }

  async updateWorkload(userId: string, workload: Partial<Workload>): Promise<void> {
    try {
      await invoke("update_workload", { userId, workload });
    } catch (error) {
      console.error("Error updating workload:", error);
      throw error;
    }
  }
}

export const workloadService = new WorkloadService();