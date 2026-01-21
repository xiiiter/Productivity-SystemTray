import { useState, useEffect } from 'react';
import { useTheme } from '../App';
import { useBranch } from '../hooks/useBranch';
import { useInbox } from '../hooks/useInbox';
import { TaskCard } from '../components/cards/TaskCard';
import { CreateTaskModal } from '../components/modals/CreateTaskModal';
import { TaskFilter, TaskStatus, TaskPriority } from '../types/task_types';
import { Theme } from '../views/Theme';

export function Inbox() {
  const { theme } = useTheme();
  const { currentBranch } = useBranch();
  const [filter, setFilter] = useState<TaskFilter>({
    branchId: currentBranch?.id,
  });
  const { tasks, loading, createTask, updateTask, deleteTask, refreshTasks } = useInbox(filter);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | undefined>();

  useEffect(() => {
    if (currentBranch) {
      setFilter(prev => ({ ...prev, branchId: currentBranch.id }));
    }
  }, [currentBranch]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshTasks();
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshTasks]);

  const handleFilterStatus = (status?: TaskStatus) => {
    setFilter(prev => ({
      ...prev,
      status: status ? [status] : undefined,
    }));
  };

  const handleFilterPriority = (priority?: TaskPriority) => {
    setSelectedPriority(priority);
    setFilter(prev => ({
      ...prev,
      priority: priority ? [priority] : undefined,
    }));
  };

  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      task.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  if (!currentBranch) {
    return <EmptyState theme={theme} message="No branch selected" />;
  }

  const statusFilters = [
    { label: 'All', status: undefined, icon: '📋' },
    { label: 'Pending', status: TaskStatus.Pending, icon: '⏸️' },
    { label: 'In Progress', status: TaskStatus.InProgress, icon: '▶️' },
    { label: 'Done', status: TaskStatus.Done, icon: '✅' },
  ];

  const priorityFilters = [
    { label: 'All Priority', priority: undefined, color: theme.text.secondary },
    { label: 'High', priority: TaskPriority.High, color: theme.accent.error },
    { label: 'Medium', priority: TaskPriority.Medium, color: theme.accent.warning },
    { label: 'Low', priority: TaskPriority.Low, color: theme.accent.info },
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
            background: `linear-gradient(135deg, ${theme.text.primary} 0%, ${theme.accent.primary} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Inbox
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
              {filteredTasks.length}
            </span>
            {filteredTasks.length === 1 ? 'task' : 'tasks'}
          </p>
        </div>

        <button
          className="button-press"
          onClick={() => setShowCreateModal(true)}
          style={{
            background: `linear-gradient(135deg, ${theme.accent.primary} 0%, ${theme.accent.secondary} 100%)`,
            color: '#fff',
            border: 'none',
            borderRadius: '14px',
            padding: '12px 24px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '-0.02em',
            boxShadow: `0 8px 24px ${theme.accent.glow}`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: `all ${theme.animation.duration.normal} ${theme.animation.timing}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
            e.currentTarget.style.boxShadow = `0 12px 32px ${theme.accent.glowStrong}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = `0 8px 24px ${theme.accent.glow}`;
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Task
        </button>
      </div>

      {/* Search and Filters */}
      <div className="slide-in" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 44px',
              borderRadius: '12px',
              border: `2px solid ${theme.border.secondary}`,
              background: theme.background.secondary,
              color: theme.text.primary,
              fontSize: '15px',
              fontWeight: 500,
              outline: 'none',
              transition: `all ${theme.animation.duration.normal} ${theme.animation.timing}`,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.accent.primary;
              e.currentTarget.style.boxShadow = `0 0 0 4px ${theme.accent.glow}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = theme.border.secondary;
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <svg 
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: 0.5,
            }}
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke={theme.text.secondary} 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>

        {/* Status Filters */}
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}>
          {statusFilters.map(({ label, status, icon }, index) => {
            const isActive = filter.status?.[0] === status || (label === 'All' && !filter.status);

            return (
              <button
                key={label}
                className="button-press slide-in"
                onClick={() => handleFilterStatus(status)}
                style={{
                  background: isActive 
                    ? `linear-gradient(135deg, ${theme.accent.primary} 0%, ${theme.accent.secondary} 100%)`
                    : theme.background.secondary,
                  color: isActive ? '#fff' : theme.text.primary,
                  border: isActive 
                    ? 'none'
                    : `2px solid ${theme.border.secondary}`,
                  borderRadius: '12px',
                  padding: '10px 18px',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                  transition: `all ${theme.animation.duration.normal} ${theme.animation.timing}`,
                  boxShadow: isActive 
                    ? `0 4px 16px ${theme.accent.glow}` 
                    : theme.shadow.small,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  animationDelay: `${index * 0.05}s`,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = theme.background.hover;
                    e.currentTarget.style.borderColor = theme.accent.primary;
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

        {/* Priority Filters */}
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}>
          {priorityFilters.map(({ label, priority, color }, index) => {
            const isActive = selectedPriority === priority;

            return (
              <button
                key={label}
                className="button-press slide-in-right"
                onClick={() => handleFilterPriority(priority)}
                style={{
                  background: isActive ? color + '20' : theme.background.secondary,
                  color: isActive ? color : theme.text.secondary,
                  border: `2px solid ${isActive ? color : theme.border.secondary}`,
                  borderRadius: '10px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                  transition: `all ${theme.animation.duration.normal} ${theme.animation.timing}`,
                  animationDelay: `${index * 0.05}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = color;
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = theme.border.secondary;
                  }
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState theme={theme} />
      ) : filteredTasks.length === 0 ? (
        <EmptyState 
          theme={theme} 
          message={searchQuery ? 'No tasks match your search' : 'No tasks found'}
          action={!searchQuery && !filter.status ? {
            label: 'Create your first task',
            onClick: () => setShowCreateModal(true),
          } : undefined}
        />
      ) : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '14px',
          flex: 1,
        }}>
          {filteredTasks.map((task, index) => (
            <div
              key={task.id}
              className="slide-in gpu-accelerated"
              style={{
                animationDelay: `${index * 0.04}s`,
              }}
            >
              <TaskCard
                task={task}
                onUpdate={updateTask}
                onDelete={deleteTask}
                theme={theme}
              />
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createTask}
          theme={theme}
        />
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
        Loading tasks...
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ 
  theme, 
  message, 
  action 
}: { 
  theme: Theme; 
  message: string;
  action?: { label: string; onClick: () => void };
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
        ✓
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
      {action && (
        <button
          className="button-press bounce-in"
          onClick={action.onClick}
          style={{
            marginTop: '20px',
            background: `linear-gradient(135deg, ${theme.accent.primary} 0%, ${theme.accent.secondary} 100%)`,
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: `0 8px 24px ${theme.accent.glow}`,
            animationDelay: '0.3s',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}