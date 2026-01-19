// src/types/metrics.types.ts

export interface MetricsSummary {
  totalHours: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  avgTaskCompletionTime: number;
  productivityScore: number;
}

export interface Metrics {
  summary: MetricsSummary;
  dailyHours: DailyHoursMetric[];
  weeklyHours: WeeklyHoursMetric[];
  tasksByStatus: TaskStatusMetric[];
  tasksByPriority: TaskPriorityMetric[];
  userProductivity: UserProductivityMetric[];
  branchPerformance?: BranchPerformanceMetric;
}

export interface DailyHoursMetric {
  date: string;
  hours: number;
  tasksCompleted: number;
}

export interface WeeklyHoursMetric {
  week: number;
  year: number;
  hours: number;
  tasksCompleted: number;
}

export interface TaskStatusMetric {
  status: string;
  count: number;
  percentage: number;
}

export interface TaskPriorityMetric {
  priority: string;
  count: number;
  avgCompletionTime: number;
}

export interface UserProductivityMetric {
  userId: string;
  userName: string;
  totalHours: number;
  tasksCompleted: number;
  productivityScore: number;
}

export interface BranchPerformanceMetric {
  branchId: string;
  branchName: string;
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  completedTasks: number;
  totalHours: number;
  avgProductivityScore: number;
}

export interface MetricsFilter {
  userId?: string;
  branchId?: string;
  startDate?: string;
  endDate?: string;
  period?: MetricsPeriod;
}

export enum MetricsPeriod {
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
  Yearly = "yearly",
  Custom = "custom",
}

export interface ProductivityTrend {
  period: string;
  score: number;
  change: number; // percentage change from previous period
}

export interface TimeTracking {
  id: string;
  userId: string;
  taskId?: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  description?: string;
  branchId: string;
}

export interface TimeTrackingSummary {
  totalMinutes: number;
  totalHours: number;
  byTask: Array<{
    taskId: string;
    taskTitle: string;
    minutes: number;
  }>;
  byDay: Array<{
    date: string;
    minutes: number;
  }>;
}