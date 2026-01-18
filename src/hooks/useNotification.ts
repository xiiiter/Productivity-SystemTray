// frontend/hooks/useNotifications.ts

import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notification.service';
import { Notification, NotificationFilter } from '../types/notification.types';

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [userId]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(userId);
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = useCallback(async (notificationIds: string[]) => {
    try {
      await notificationService.markAsRead(userId, notificationIds);
      await loadNotifications();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }, [userId]);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead(userId);
      await loadNotifications();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, [userId]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh: loadNotifications,
  };
}