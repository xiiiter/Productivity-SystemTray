import { useEffect, useState } from 'react';
import { useTheme } from '../App';
import { useNotifications } from '../hooks/useNotification';
import { NotificationCard } from '../components/cards/NotificationCard';
import { NotificationType } from '../types/notification_types';
import { Theme } from '../views/Theme';

export function Notifications() {
  const { theme } = useTheme();
  const userId = 'current-user-id'; // Get from auth context
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, refreshNotifications } = useNotifications(userId);
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshNotifications();
    }, 15000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const filteredNotifications = notifications.filter(notification => {
    if (showUnreadOnly && notification.read) return false;
    if (filter !== 'all' && notification.notification_type !== filter) return false;
    return true;
  });

  const typeFilters = [
    { label: 'All', type: 'all' as const, icon: '📋', color: theme.text.primary },
    { label: 'Tasks', type: NotificationType.TaskAssigned, icon: '📌', color: theme.accent.primary },
    { label: 'Completed', type: NotificationType.TaskCompleted, icon: '✅', color: theme.accent.success },
    { label: 'Reminders', type: NotificationType.Reminder, icon: '⏰', color: theme.accent.warning },
    { label: 'Info', type: NotificationType.Info, icon: 'ℹ️', color: theme.accent.info },
  ];

  return (
    <div style={{ 
      padding: '32px 24px', 
      height: '100%', 
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div className="fade-in" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '28px',
      }}>
        <div>
          <h2 style={{
            color: theme.text.primary,
            fontSize: '32px',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}>
            <span style={{
              background: `linear-gradient(135deg, ${theme.text.primary} 0%, ${theme.accent.primary} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <span 
                className="scale-in badge-pulse"
                style={{
                  background: `linear-gradient(135deg, ${theme.accent.error} 0%, ${theme.accent.warning} 100%)`,
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '6px 14px',
                  fontSize: '15px',
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  boxShadow: `0 4px 16px ${theme.accent.error}60`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '32px',
                }}
              >
                {unreadCount}
              </span>
            )}
          </h2>
          <p style={{
            color: theme.text.secondary,
            fontSize: '15px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: `${theme.accent.primary}20`,
              color: theme.accent.primary,
              fontSize: '13px',
              fontWeight: 700,
            }}>
              {filteredNotifications.length}
            </span>
            {filteredNotifications.length === 1 ? 'notification' : 'notifications'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            className="button-press slide-in-right"
            onClick={markAllAsRead}
            style={{
              background: 'transparent',
              color: theme.accent.primary,
              border: `2px solid ${theme.accent.primary}`,
              borderRadius: '12px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: `all ${theme.animation.duration.normal} ${theme.animation.timing}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.accent.primary;
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
              e.currentTarget.style.boxShadow = `0 8px 20px ${theme.accent.glow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = theme.accent.primary;
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="slide-in" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {/* Toggle Unread */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <button
            className="button-press"
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            style={{
              background: showUnreadOnly 
                ? `linear-gradient(135deg, ${theme.accent.primary} 0%, ${theme.accent.secondary} 100%)`
                : theme.background.secondary,
              color: showUnreadOnly ? '#fff' : theme.text.primary,
              border: showUnreadOnly ? 'none' : `2px solid ${theme.border.secondary}`,
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: showUnreadOnly ? 700 : 600,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: `all ${theme.animation.duration.normal} ${theme.animation.timing}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: showUnreadOnly ? `0 4px 16px ${theme.accent.glow}` : theme.shadow.small,
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '6px',
              border: `2px solid ${showUnreadOnly ? '#fff' : theme.accent.primary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: showUnreadOnly ? '#fff' : 'transparent',
              transition: `all ${theme.animation.duration.fast} ${theme.animation.timing}`,
            }}>
              {showUnreadOnly && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={theme.accent.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
            Show unread only
          </button>
        </div>

        {/* Type Filters */}
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}>
          {typeFilters.map(({ label, type, icon, color }, index) => {
            const isActive = filter === type;

            return (
              <button
                key={label}
                className="button-press slide-in"
                onClick={() => setFilter(type)}
                style={{
                  background: isActive 
                    ? `${color}20`
                    : theme.background.secondary,
                  color: isActive ? color : theme.text.primary,
                  border: `2px solid ${isActive ? color : theme.border.secondary}`,
                  borderRadius: '12px',
                  padding: '10px 18px',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                  transition: `all ${theme.animation.duration.normal} ${theme.animation.timing}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  animationDelay: `${index * 0.05}s`,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = theme.background.hover;
                    e.currentTarget.style.borderColor = color;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = theme.background.secondary;
                    e.currentTarget.style.borderColor = theme.border.secondary;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{icon}</span>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState theme={theme} />
      ) : filteredNotifications.length === 0 ? (
        <EmptyState 
          theme={theme} 
          message={showUnreadOnly ? 'No unread notifications' : 'No notifications'}
          subtitle={showUnreadOnly 
            ? 'You\'re all caught up!' 
            : 'New notifications will appear here'}
        />
      ) : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          flex: 1,
        }}>
          {filteredNotifications.map((notification, index) => (
            <div
              key={notification.id}
              className="slide-in gpu-accelerated"
              style={{
                animationDelay: `${index * 0.04}s`,
              }}
            >
              <NotificationCard
                notification={notification}
                onMarkAsRead={() => markAsRead([notification.id])}
                theme={theme}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Loading State Component
function LoadingState({ theme }: { theme: Theme }) {
  return (
    <div style={{ 
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
    }}>
      <div
        className="spinner"
        style={{
          width: '40px',
          height: '40px',
          border: `3px solid ${theme.background.secondary}`,
          borderTop: `3px solid ${theme.accent.primary}`,
          borderRadius: '50%',
        }}
      />
      <div style={{ 
        color: theme.text.secondary,
        fontSize: '16px',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      }}>
        Loading notifications...
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ 
  theme, 
  message,
  subtitle 
}: { 
  theme: Theme; 
  message: string;
  subtitle: string;
}) {
  return (
    <div className="fade-in" style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '60px 20px',
    }}>
      <div className="float" style={{ 
        fontSize: '96px',
        marginBottom: '24px',
        opacity: 0.3,
        filter: 'grayscale(1)',
      }}>
        🔔
      </div>
      <div style={{
        fontSize: '20px',
        fontWeight: 700,
        color: theme.text.primary,
        marginBottom: '12px',
        letterSpacing: '-0.02em',
      }}>
        {message}
      </div>
      <div style={{
        fontSize: '15px',
        color: theme.text.tertiary,
        maxWidth: '320px',
      }}>
        {subtitle}
      </div>
    </div>
  );
}