// frontend/src/types/notification_types.ts

export enum NotificationType {
  TaskAssigned = 'TaskAssigned',
  TaskCompleted = 'TaskCompleted',
  Reminder = 'Reminder',
  Info = 'Info',
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: NotificationType;
  read: boolean;
  action_url?: string;
  created_at: string;
  _sheet_row?: number;
}

export interface NotificationFilter {
  read?: boolean;
  notification_type?: NotificationType;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  unread: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
}

export interface MarkAsReadRequest {
  notification_ids: string[];
}

export interface NotificationSettings {
  email_enabled: boolean;
  push_enabled: boolean;
  task_assigned: boolean;
  task_completed: boolean;
  reminders: boolean;
}

export interface UpdateSettingsRequest {
  settings: NotificationSettings;
}