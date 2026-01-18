// src/types/notification.types.ts

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  read: boolean;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
  data?: NotificationData;
  actionUrl?: string;
  actionLabel?: string;
}

export enum NotificationType {
  Info = "info",
  Warning = "warning",
  Error = "error",
  Success = "success",
  TaskAssigned = "task_assigned",
  TaskCompleted = "task_completed",
  TaskOverdue = "task_overdue",
  TaskUpdated = "task_updated",
  Reminder = "reminder",
  WorkloadAlert = "workload_alert",
  BranchUpdate = "branch_update",
  SystemAlert = "system_alert",
}

export enum NotificationPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
  Urgent = "urgent",
}

export interface NotificationData {
  taskId?: string;
  branchId?: string;
  userId?: string;
  assignedBy?: string;
  dueDate?: string;
  metadata?: Record<string, any>;
}

export interface NotificationFilter {
  userId?: string;
  type?: NotificationType[];
  priority?: NotificationPriority[];
  read?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface NotificationPreferences {
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  mutedTypes: NotificationType[];
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  groupNotifications: boolean;
}

export interface NotificationBatch {
  notifications: Notification[];
  unreadCount: number;
  hasMore: boolean;
}

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  data?: NotificationData;
  actionUrl?: string;
  actionLabel?: string;
  expiresAt?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Array<{
    type: NotificationType;
    count: number;
  }>;
  byPriority: Array<{
    priority: NotificationPriority;
    count: number;
  }>;
}