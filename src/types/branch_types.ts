// frontend/src/types/branch_types.ts

/**
 * Branch entity representing a physical location
 */
export interface Branch {
  id: string;
  name: string;
  manager: string;
  active: boolean;
  config?: BranchConfig;
  created_at: string;
}

/**
 * Branch configuration settings
 */
export interface BranchConfig {
  working_hours: WorkingHours;
  timezone?: string;
  locale?: string;
}

/**
 * Working hours configuration
 */
export interface WorkingHours {
  start: string; // Format: "HH:MM" (e.g., "08:00")
  end: string;   // Format: "HH:MM" (e.g., "18:00")
}

/**
 * Branch selection record linking user to branch
 */
export interface BranchSelection {
  user_id: string;
  branch_id: string;
  selected_at: string; // ISO 8601 datetime string
}

/**
 * Branch statistics and metrics
 */
export interface BranchStats {
  branch_id: string;
  total_users: number;
  active_users: number;
  total_transactions?: number;
  last_activity?: string;
}

/**
 * Request payload for selecting a branch
 */
export interface SelectBranchRequest {
  branch_id: string;
  user_id: string;
}

/**
 * Request payload for clearing branch selection
 */
export interface ClearBranchRequest {
  user_id: string;
}

/**
 * Response from branch operations
 */
export interface BranchOperationResponse {
  success: boolean;
  message?: string;
  data?: Branch | BranchSelection;
}

/**
 * Branch filter options
 */
export interface BranchFilter {
  active_only?: boolean;
  manager?: string;
  search?: string;
}

/**
 * Type guards for runtime type checking
 */
export const isBranch = (obj: any): obj is Branch => {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.manager === 'string' &&
    typeof obj.active === 'boolean' &&
    typeof obj.created_at === 'string'
  );
};

export const isBranchSelection = (obj: any): obj is BranchSelection => {
  return (
    typeof obj === 'object' &&
    typeof obj.user_id === 'string' &&
    typeof obj.branch_id === 'string' &&
    typeof obj.selected_at === 'string'
  );
};

/**
 * Helper to format branch working hours
 */
export const formatWorkingHours = (config?: BranchConfig): string => {
  if (!config?.working_hours) return 'Not configured';
  return `${config.working_hours.start} - ${config.working_hours.end}`;
};

/**
 * Helper to check if branch is currently open
 */
export const isBranchOpen = (branch: Branch): boolean => {
  if (!branch.active || !branch.config?.working_hours) return false;

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const { start, end } = branch.config.working_hours;
  
  return currentTime >= start && currentTime <= end;
};

/**
 * Helper to get branch status text
 */
export const getBranchStatus = (branch: Branch): string => {
  if (!branch.active) return 'Inactive';
  if (isBranchOpen(branch)) return 'Open';
  return 'Closed';
};

/**
 * Helper to get branch status color
 */
export const getBranchStatusColor = (branch: Branch): string => {
  if (!branch.active) return '#FF3B30'; // Red
  if (isBranchOpen(branch)) return '#34C759'; // Green
  return '#FF9500'; // Orange
};