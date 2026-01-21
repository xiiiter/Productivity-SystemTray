// frontend/hooks/useNotification.ts

import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { 
  Notification, 
  NotificationFilter, 
  NotificationListResponse, 
  NotificationStats 
} from '../types/notification_types';

export function useNotifications(userId: string, filter?: NotificationFilter) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: NotificationListResponse = await invoke('get_notifications', {
        userId,
        filter,
      });
      
      setNotifications(response.notifications);
      setUnreadCount(response.unread);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError(err as string);
    } finally {
      setLoading(false);
    }
  }, [userId, filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (notificationIds: string[]): Promise<void> => {
    try {
      await invoke('mark_notification_as_read', {
        userId,
        notificationIds,
      });
      
      setNotifications(prev => prev.map(notification =>
        notificationIds.includes(notification.id)
          ? { ...notification, read: true }
          : notification
      ));
      
      setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
      throw err;
    }
  }, [userId]);

  const markAllAsRead = useCallback(async (): Promise<void> => {
    try {
      await invoke('mark_all_notifications_as_read', {
        userId,
      });
      
      setNotifications(prev => prev.map(notification => ({
        ...notification,
        read: true,
      })));
      
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      throw err;
    }
  }, [userId]);

  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  };
}

export function useNotificationStats(userId: string) {
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response: NotificationStats = await invoke('get_notification_stats', {
        userId,
      });
      setStats(response);
    } catch (err) {
      console.error('Failed to fetch notification stats:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, loading, refreshStats: fetchStats };
}