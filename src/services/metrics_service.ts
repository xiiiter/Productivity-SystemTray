// src/services/metrics_service.ts

import { invoke } from "@tauri-apps/api/core";
import {
  Metrics,
  MetricsFilter,
  MetricsPeriod,
  ProductivityTrend,
  TimeTracking,
  TimeTrackingSummary,
} from "../types/metrics_types";

class MetricsService {
  async getMetrics(filter?: MetricsFilter): Promise<Metrics> {
    try {
      const metrics = await invoke<Metrics>("get_metrics", { filter });
      return metrics;
    } catch (error) {
      console.error("Error getting metrics:", error);
      return {
        summary: {
          totalHours: 0,
          completedTasks: 0,
          pendingTasks: 0,
          inProgressTasks: 0,
          avgTaskCompletionTime: 0,
          productivityScore: 0,
        },
        dailyHours: [],
        weeklyHours: [],
        tasksByStatus: [],
        tasksByPriority: [],
        userProductivity: [],
      };
    }
  }

  async getUserMetrics(userId: string, period?: MetricsPeriod): Promise<Metrics> {
    return this.getMetrics({ userId, period });
  }

  async getBranchMetrics(branchId: string, period?: MetricsPeriod): Promise<Metrics> {
    return this.getMetrics({ branchId, period });
  }

  async getMetricsByDateRange(userId: string, startDate: string, endDate: string): Promise<Metrics> {
    return this.getMetrics({
      userId,
      startDate,
      endDate,
      period: MetricsPeriod.Custom,
    });
  }

  async getProductivityTrend(userId: string, period: MetricsPeriod): Promise<ProductivityTrend[]> {
    try {
      const trend = await invoke<ProductivityTrend[]>("get_productivity_trend", { userId, period });
      return trend;
    } catch (error) {
      console.error("Error getting productivity trend:", error);
      return [];
    }
  }

  async startTimeTracking(userId: string, taskId?: string, description?: string): Promise<TimeTracking> {
    try {
      const tracking = await invoke<TimeTracking>("start_time_tracking", { userId, taskId, description });
      return tracking;
    } catch (error) {
      console.error("Error starting time tracking:", error);
      throw error;
    }
  }

  async stopTimeTracking(trackingId: string): Promise<TimeTracking> {
    try {
      const tracking = await invoke<TimeTracking>("stop_time_tracking", { trackingId });
      return tracking;
    } catch (error) {
      console.error("Error stopping time tracking:", error);
      throw error;
    }
  }

  async getActiveTimeTracking(userId: string): Promise<TimeTracking | null> {
    try {
      const tracking = await invoke<TimeTracking | null>("get_active_time_tracking", { userId });
      return tracking;
    } catch (error) {
      console.error("Error getting active time tracking:", error);
      return null;
    }
  }

  async getTimeTrackingSummary(userId: string, startDate: string, endDate: string): Promise<TimeTrackingSummary> {
    try {
      const summary = await invoke<TimeTrackingSummary>("get_time_tracking_summary", {
        userId,
        startDate,
        endDate,
      });
      return summary;
    } catch (error) {
      console.error("Error getting time tracking summary:", error);
      return {
        totalMinutes: 0,
        totalHours: 0,
        byTask: [],
        byDay: [],
      };
    }
  }

  async exportMetrics(filter: MetricsFilter, format: "csv" | "json" | "pdf"): Promise<string> {
    try {
      const filePath = await invoke<string>("export_metrics", { filter, format });
      return filePath;
    } catch (error) {
      console.error("Error exporting metrics:", error);
      throw error;
    }
  }

  async calculateProductivityScore(userId: string, period: MetricsPeriod): Promise<number> {
    try {
      const score = await invoke<number>("calculate_productivity_score", { userId, period });
      return score;
    } catch (error) {
      console.error("Error calculating productivity score:", error);
      return 0;
    }
  }
}

export const metricsService = new MetricsService();