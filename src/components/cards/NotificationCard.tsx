// frontend/src/components/cards/NotificationCard.tsx

import { Notification, NotificationType } from '../../types/notification_types';
import { Theme } from '../../views/Theme';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: () => void;
  theme: Theme;
}

export function NotificationCard({ notification, onMarkAsRead, theme }: NotificationCardProps) {
  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.TaskAssigned:
        return '📌';
      case NotificationType.TaskCompleted:
        return '✅';
      case NotificationType.Reminder:
        return '⏰';
      case NotificationType.Info:
        return 'ℹ️';
    }
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.TaskAssigned:
        return theme.accent.primary;
      case NotificationType.TaskCompleted:
        return theme.accent.success;
      case NotificationType.Reminder:
        return theme.accent.warning;
      case NotificationType.Info:
        return theme.accent.info;
    }
  };

  const getTypeName = (type: NotificationType) => {
    switch (type) {
      case NotificationType.TaskAssigned:
        return 'Task Assigned';
      case NotificationType.TaskCompleted:
        return 'Task Completed';
      case NotificationType.Reminder:
        return 'Reminder';
      case NotificationType.Info:
        return 'Info';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className="card-hover gpu-accelerated"
      onClick={!notification.read ? onMarkAsRead : undefined}
      style={{
        background: notification.read 
          ? theme.background.secondary
          : `${getTypeColor(notification.notification_type)}10`,
        borderRadius: '14px',
        padding: '18px',
        border: `2px solid ${
          notification.read 
            ? theme.border.secondary
            : getTypeColor(notification.notification_type) + '40'
        }`,
        transition: `all ${theme.animation.duration.normal} ${theme.animation.timing}`,
        cursor: notification.read ? 'default' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Unread Indicator */}
      {!notification.read && (
        <div
          className="badge-pulse"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: getTypeColor(notification.notification_type),
            boxShadow: `0 0 12px ${getTypeColor(notification.notification_type)}`,
          }}
        />
      )}

      <div style={{
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start',
      }}>
        {/* Icon */}
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: `${getTypeColor(notification.notification_type)}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          flexShrink: 0,
        }}>
          {getTypeIcon(notification.notification_type)}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Type and Time */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            gap: '12px',
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              color: getTypeColor(notification.notification_type),
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {getTypeName(notification.notification_type)}
            </span>

            <span style={{
              fontSize: '12px',
              color: theme.text.tertiary,
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}>
              {formatTime(notification.created_at)}
            </span>
          </div>

          {/* Title */}
          <h4 style={{
            color: theme.text.primary,
            fontSize: '16px',
            fontWeight: 700,
            marginBottom: '6px',
            letterSpacing: '-0.01em',
            opacity: notification.read ? 0.7 : 1,
          }}>
            {notification.title}
          </h4>

          {/* Message */}
          <p style={{
            color: theme.text.secondary,
            fontSize: '14px',
            lineHeight: '1.5',
            marginBottom: notification.action_url ? '12px' : '0',
            opacity: notification.read ? 0.7 : 1,
          }}>
            {notification.message}
          </p>

          {/* Action Button */}
          {notification.action_url && (
            <button
              className="button-press"
              onClick={(e) => {
                e.stopPropagation();
                window.open(notification.action_url, '_blank');
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: `2px solid ${getTypeColor(notification.notification_type)}`,
                background: `${getTypeColor(notification.notification_type)}20`,
                color: getTypeColor(notification.notification_type),
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: `all ${theme.animation.duration.normal} ${theme.animation.timing}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = getTypeColor(notification.notification_type);
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${getTypeColor(notification.notification_type)}20`;
                e.currentTarget.style.color = getTypeColor(notification.notification_type);
              }}
            >
              View Details
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}