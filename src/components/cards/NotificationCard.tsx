// src/components/cards/NotificationCard.tsx

import { Notification, NotificationType } from '../../types/notification.types';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: () => void;
  theme: any;
}

export function NotificationCard({ notification, onMarkAsRead, theme }: NotificationCardProps) {
  const typeIcons = {
    [NotificationType.Info]: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    [NotificationType.Warning]: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    [NotificationType.Error]: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    [NotificationType.Success]: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    [NotificationType.TaskAssigned]: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    ),
    [NotificationType.TaskCompleted]: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    [NotificationType.TaskOverdue]: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    [NotificationType.TaskUpdated]: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    [NotificationType.Reminder]: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    [NotificationType.WorkloadAlert]: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    [NotificationType.BranchUpdate]: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    [NotificationType.SystemAlert]: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  };

  const typeColors = {
    [NotificationType.Info]: '#60a5fa',
    [NotificationType.Warning]: '#fbbf24',
    [NotificationType.Error]: '#ef4444',
    [NotificationType.Success]: '#34d399',
    [NotificationType.TaskAssigned]: '#a78bfa',
    [NotificationType.TaskCompleted]: '#34d399',
    [NotificationType.TaskOverdue]: '#ef4444',
    [NotificationType.TaskUpdated]: '#60a5fa',
    [NotificationType.Reminder]: '#fb923c',
    [NotificationType.WorkloadAlert]: '#fbbf24',
    [NotificationType.BranchUpdate]: '#60a5fa',
    [NotificationType.SystemAlert]: '#ef4444',
  };

  return (
    <div
      onClick={notification.read ? undefined : onMarkAsRead}
      style={{
        background: notification.read ? theme.background.secondary : `${theme.accent.primary}10`,
        borderRadius: '12px',
        padding: '14px',
        cursor: notification.read ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        border: notification.read ? 'none' : `1px solid ${theme.accent.primary}30`,
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
        <div
          style={{
            color: typeColors[notification.type] || theme.accent.primary,
            flexShrink: 0,
          }}
        >
          {typeIcons[notification.type] || typeIcons[NotificationType.Info]}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
            <h4 style={{
              color: theme.text.primary,
              fontSize: '13px',
              fontWeight: 500,
            }}>
              {notification.title}
            </h4>

            {!notification.read && (
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: theme.accent.primary,
                  flexShrink: 0,
                  marginLeft: '8px',
                }}
              />
            )}
          </div>

          <p style={{
            color: theme.text.secondary,
            fontSize: '12px',
            marginBottom: '4px',
          }}>
            {notification.message}
          </p>

          <span style={{
            color: theme.text.tertiary,
            fontSize: '10px',
          }}>
            {new Date(notification.createdAt).toLocaleString()}
          </span>

          {notification.actionUrl && notification.actionLabel && (
            <div style={{ marginTop: '8px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(notification.actionUrl, '_blank');
                }}
                style={{
                  background: theme.accent.primary,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  fontSize: '11px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {notification.actionLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}