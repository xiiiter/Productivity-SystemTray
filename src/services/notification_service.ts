// src/services/notification_service.ts

import { invoke } from "@tauri-apps/api/core";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  data?: any;
}

export enum NotificationType {
  Info = "info",
  Warning = "warning",
  Error = "error",
  Success = "success",
  TaskAssigned = "task_assigned",
  TaskCompleted = "task_completed",
  Reminder = "reminder",
}

class NotificationService {
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const notifications = await invoke<Notification[]>("get_notifications", { userId });
      return notifications;
    } catch (error) {
      console.error("Error getting notifications:", error);
      return [];
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const count = await invoke<number>("get_unread_notification_count", { userId });
      return count;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }

  async markAsRead(notificationIds: string[]): Promise<void> {
    try {
      await invoke("mark_notifications_as_read", { notificationIds });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      throw error;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await invoke("mark_all_notifications_as_read", { userId });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await invoke("delete_notification", { notificationId });
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();