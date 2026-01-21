// frontend/src/types/task_types.ts

export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Done = 'Done',
}

export enum TaskPriority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export interface Task {
  id: string;
  branch_id: string;
  created_by: string;
  assigned_to?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  _sheet_row?: number;
}

export interface TaskFilter {
  branchId?: string;
  assigned_to?: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  tags?: string[];
}

export interface CreateTaskRequest {
  branch_id: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  assigned_to?: string;
  due_date?: string;
  estimated_hours?: number;
  tags?: string[];
}

export interface UpdateTaskRequest {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigned_to?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  tags?: string[];
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  page_size: number;
}

export interface TaskStats {
  total: number;
  pending: number;
  in_progress: number;
  done: number;
}

export enum TaskSort {
  CreatedAt = 'CreatedAt',
  UpdatedAt = 'UpdatedAt',
  DueDate = 'DueDate',
  Priority = 'Priority',
}