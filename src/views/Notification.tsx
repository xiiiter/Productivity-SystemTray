// frontend/views/Notifications.tsx

import { useTheme } from '../App';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationCard } from '../components/cards/NotificationCard';

export function Notifications() {
  const { theme } = useTheme();
  const userId = 'current-user-id'; // Get from auth context
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications(userId);

  return (
    <div style={{ padding: '20px', height: '100%', overflow: 'auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h2 style={{
          color: theme.text.primary,
          fontSize: '18px',
          fontWeight: 500,
        }}>
          Notifications
          {unreadCount > 0 && (
            <span style={{
              marginLeft: '8px',
              background: theme.accent.primary,
              color: '#fff',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 600,
            }}>
              {unreadCount}
            </span>
          )}
        </h2>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              background: 'transparent',
              color: theme.accent.primary,
              border: 'none',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ color: theme.text.secondary }}>Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: theme.text.secondary,
        }}>
          No notifications
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => markAsRead([notification.id])}
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  );
}