// src/types/workload.types.ts

export interface Workload {
  id: string;
  userId: string;
  branchId: string;
  schedule: WorkSchedule[];
  maxHoursPerDay: number;
  maxHoursPerWeek: number;
  maxTasksPerDay: number;
  preferences: WorkloadPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface WorkSchedule {
  weekday: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "HH:MM" format
  endTime: string; // "HH:MM" format
  breakStart?: string;
  breakEnd?: string;
  isWorkingDay: boolean;
}

export interface WorkloadPreferences {
  autoAssignTasks: boolean;
  prioritizeUrgentTasks: boolean;
  balanceWorkload: boolean;
  allowOvertime: boolean;
  maxOvertimeHours: number;
  notifyOnCapacity: boolean;
  capacityThreshold: number; // percentage (e.g., 80 = 80%)
}

export interface WorkloadValidation {
  isValid: boolean;
  message: string;
  currentHours: number;
  maxHours: number;
  utilizationPercentage: number;
  availableHours: number;
  warnings: WorkloadWarning[];
}

export interface WorkloadWarning {
  type: WorkloadWarningType;
  message: string;
  severity: "low" | "medium" | "high";
  affectedDate?: string;
}

export enum WorkloadWarningType {
  ApproachingCapacity = "approaching_capacity",
  OverCapacity = "over_capacity",
  NoAvailableTime = "no_available_time",
  OutsideWorkingHours = "outside_working_hours",
  ConflictingTasks = "conflicting_tasks",
  UnbalancedDistribution = "unbalanced_distribution",
}

export interface WorkloadSummary {
  userId: string;
  currentWeekHours: number;
  currentWeekTasks: number;
  projectedWeekHours: number;
  projectedWeekTasks: number;
  utilizationPercentage: number;
  availableHoursThisWeek: number;
  isOverloaded: boolean;
  recommendations: string[];
}

export interface WorkloadDistribution {
  date: string;
  scheduledHours: number;
  actualHours: number;
  tasks: Array<{
    taskId: string;
    title: string;
    estimatedHours: number;
    status: string;
  }>;
  utilizationPercentage: number;
}

export interface UpdateWorkloadInput {
  schedule?: WorkSchedule[];
  maxHoursPerDay?: number;
  maxHoursPerWeek?: number;
  maxTasksPerDay?: number;
  preferences?: Partial<WorkloadPreferences>;
}

export interface WorkingHoursCheck {
  isWithinWorkingHours: boolean;
  currentTime: string;
  nextWorkingPeriod?: {
    day: string;
    startTime: string;
    endTime: string;
  };
  message: string;
}

export interface CapacityAnalysis {
  userId: string;
  period: "day" | "week" | "month";
  totalCapacity: number; // in hours
  usedCapacity: number; // in hours
  remainingCapacity: number; // in hours
  utilizationPercentage: number;
  breakdown: Array<{
    category: string;
    hours: number;
    percentage: number;
  }>;
  projectedUtilization: number;
  recommendations: CapacityRecommendation[];
}

export interface CapacityRecommendation {
  type: "increase_capacity" | "reduce_workload" | "redistribute_tasks" | "optimize_schedule";
  priority: "low" | "medium" | "high";
  description: string;
  impact: string;
}