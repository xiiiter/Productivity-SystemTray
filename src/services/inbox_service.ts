// frontend/services/inbox_service.ts

import { invokeCommand } from './api';

// Task Types
export interface Task {
  id: string;
  title: string;
  description: string;
  branch_id: string;
  assigned_to: string;
  assigned_by: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  tags: string[];
  metadata: TaskMetadata;
}

export enum TaskStatus {
  Pending = "pending",
  InProgress = "in_progress",
  Done = "done",
  Cancelled = "cancelled",
  OnHold = "on_hold",
}

export enum TaskPriority {
  Low = "low",
  Normal = "normal",
  High = "high",
  Urgent = "urgent",
}

export interface TaskMetadata {
  source: string;
  last_modified_by: string;
  version: number;
  attachments?: string[];
  comments?: TaskComment[];
}

export interface TaskComment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  assigned_to: string;
  priority: TaskPriority;
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

export interface TaskFilter {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigned_to?: string;
  branch_id?: string;
  tags?: string[];
  search?: string;
}

export interface TaskSort {
  field: string;
  order: "asc" | "desc";
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface TaskStats {
  total: number;
  by_status: Record<string, number>;
  by_priority: Record<string, number>;
  overdue: number;
  completed_today: number;
  average_completion_time: number;
}

class InboxService {
  async getTasks(
    filter?: TaskFilter,
    sort?: TaskSort,
    page: number = 1,
    pageSize: number = 50
  ): Promise<TaskListResponse> {
    return invokeCommand<TaskListResponse>('get_tasks', {
      filter,
      sort,
      page,
      pageSize,
    });
  }

  async getTaskById(taskId: string): Promise<Task> {
    return invokeCommand<Task>('get_task_by_id', { taskId });
  }

  async createTask(request: CreateTaskRequest): Promise<Task> {
    const userId = "current_user"; // TODO: Get from auth context
    return invokeCommand<Task>('create_task', {
      userId,
      request,
    });
  }

  async updateTask(request: UpdateTaskRequest): Promise<Task> {
    const userId = "current_user"; // TODO: Get from auth context
    return invokeCommand<Task>('update_task', {
      userId,
      request,
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    const userId = "current_user"; // TODO: Get from auth context
    return invokeCommand<void>('delete_task', {
      userId,
      taskId,
    });
  }

  async getTaskStats(branchId?: string): Promise<TaskStats> {
    return invokeCommand<TaskStats>('get_task_stats', { branchId });
  }

  async markTaskComplete(taskId: string): Promise<Task> {
    const userId = "current_user"; // TODO: Get from auth context
    return invokeCommand<Task>('mark_task_complete', {
      userId,
      taskId,
    });
  }

  async assignTask(taskId: string, assignedTo: string): Promise<Task> {
    const userId = "current_user"; // TODO: Get from auth context
    return invokeCommand<Task>('assign_task', {
      userId,
      taskId,
      assignedTo,
    });
  }
}

export const inboxService = new InboxService();