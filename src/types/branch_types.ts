// frontend/types/branch_types.ts

export interface Branch {
  id: string;
  name: string;
  manager: string;
  active: boolean;
  config: BranchConfig;
}

export interface BranchConfig {
  timezone: string;
  working_hours: WorkingHours;
  features: BranchFeatures;
  notifications: NotificationConfig;
}

export interface WorkingHours {
  start: string;
  end: string;
  break_start?: string;
  break_end?: string;
  work_days: number[]; // 1-7 (Monday-Sunday)
}

export interface BranchFeatures {
  time_tracking: boolean;
  task_management: boolean;
  notifications: boolean;
  metrics: boolean;
  workload_management: boolean;
}

export interface NotificationConfig {
  enabled: boolean;
  email: boolean;
  push: boolean;
  in_app: boolean;
}

export interface BranchSelection {
  branch_id: string;
  selected_at: string;
  user_id: string;
}

export interface BranchListResponse {
  branches: Branch[];
  total: number;
}

export interface BranchStats {
  total_users: number;
  active_users: number;
  total_tasks: number;
  completed_tasks: number;
  total_hours: number;
}