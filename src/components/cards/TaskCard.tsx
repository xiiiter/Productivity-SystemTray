// frontend/src/components/cards/TaskCard.tsx

import { useState } from 'react';
import { Task, TaskStatus, TaskPriority, UpdateTaskRequest } from '../../types/task_types';
import { Theme } from '../../views/Theme';

interface TaskCardProps {
  task: Task;
  onUpdate: (request: UpdateTaskRequest) => Promise<Task>;
  onDelete: (taskId: string) => Promise<void>;
  theme: Theme;
}

export function TaskCard({ task, onUpdate, onDelete, theme }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleStatusChange = async (status: TaskStatus) => {
    setIsUpdating(true);
    try {
      await onUpdate({ id: task.id, status });
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await onDelete(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const getPriorityColor = (priority?: TaskPriority) => {
    switch (priority) {
      case TaskPriority.High:
        return theme.accent.error;
      case TaskPriority.Medium:
        return theme.accent.warning;
      case TaskPriority.Low:
        return theme.accent.info;
      default:
        return theme.text.tertiary;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Pending:
        return theme.text.secondary;
      case TaskStatus.InProgress:
        return theme.accent.warning;
      case TaskStatus.Done:
        return theme.accent.success;
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== TaskStatus.Done;

  return (
    <div
      className="card-hover gpu-accelerated"
      style={{
        background: task.status === TaskStatus.Done 
          ? `${theme.accent.success}10` 
          : theme.background.secondary,
        borderRadius: '16px',
        padding: '20px',
        border: `2px solid ${
          isOverdue 
            ? theme.accent.error + '60'
            : task.status === TaskStatus.Done
            ? theme.accent.success + '40'
            : theme.border.secondary
        }`,
        transition: `all ${theme.animation.duration.normal} ${theme.animation.timing}`,
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            color: theme.text.primary,
            fontSize: '17px',
            fontWeight: 700,
            marginBottom: '8px',
            letterSpacing: '-0.02em',
            textDecoration: task.status === TaskStatus.Done ? 'line-through' : 'none',
            opacity: task.status === TaskStatus.Done ? 0.7 : 1,
          }}>
            {task.title}
          </h3>
          
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            {/* Status Badge */}
            <span style={{
              padding: '4px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              background: `${getStatusColor(task.status)}20`,
              color: getStatusColor(task.status),
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
            }}>
              {task.status}
            </span>

            {/* Priority Badge */}
            {task.priority && (
              <span style={{
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                background: `${getPriorityColor(task.priority)}20`,
                color: getPriorityColor(task.priority),
                letterSpacing: '0.01em',
                textTransform: 'uppercase',
              }}>
                {task.priority}
              </span>
            )}

            {/* Overdue Badge */}
            {isOverdue && (
              <span className="badge-pulse" style={{
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                background: `${theme.accent.error}20`,
                color: theme.accent.error,
                letterSpacing: '0.01em',
                textTransform: 'uppercase',
              }}>
                Overdue
              </span>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              color: theme.text.secondary,
              transition: `all ${theme.animation.duration.fast} ${theme.animation.timing}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.background.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>

          {showMenu && (
            <div
              className="scale-in"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: theme.background.modal,
                borderRadius: '12px',
                padding: '8px',
                boxShadow: theme.shadow.large,
                border: `1px solid ${theme.border.secondary}`,
                zIndex: 10,
                minWidth: '180px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  handleDelete();
                  setShowMenu(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: theme.accent.error,
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: `all ${theme.animation.duration.fast} ${theme.animation.timing}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.accent.error + '20';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Delete Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p style={{
          color: theme.text.secondary,
          fontSize: '14px',
          marginBottom: '12px',
          lineHeight: '1.5',
        }}>
          {isExpanded ? task.description : task.description.substring(0, 100) + (task.description.length > 100 ? '...' : '')}
        </p>
      )}

      {/* Metadata */}
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        fontSize: '13px',
        color: theme.text.tertiary,
        marginBottom: isExpanded ? '16px' : '0',
      }}>
        {task.due_date && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📅</span>
            <span>{new Date(task.due_date).toLocaleDateString()}</span>
          </div>
        )}
        
        {task.estimated_hours && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⏱</span>
            <span>{task.estimated_hours}h</span>
          </div>
        )}

        {task.assigned_to && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>👤</span>
            <span>{task.assigned_to}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          marginBottom: isExpanded ? '16px' : '0',
        }}>
          {task.tags.map(tag => (
            <span
              key={tag}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                background: `${theme.accent.primary}15`,
                color: theme.accent.primary,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {isExpanded && (
        <div className="slide-down" style={{
          display: 'flex',
          gap: '8px',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: `1px solid ${theme.border.divider}`,
        }}>
          {task.status !== TaskStatus.Pending && (
            <button
              className="button-press"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(TaskStatus.Pending);
              }}
              disabled={isUpdating}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: `2px solid ${theme.border.secondary}`,
                background: 'transparent',
                color: theme.text.primary,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: `all ${theme.animation.duration.normal} ${theme.animation.timing}`,
              }}
            >
              ⏸️ Pending
            </button>
          )}

          {task.status !== TaskStatus.InProgress && (
            <button
              className="button-press"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(TaskStatus.InProgress);
              }}
              disabled={isUpdating}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: `2px solid ${theme.accent.warning}`,
                background: `${theme.accent.warning}20`,
                color: theme.accent.warning,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: `all ${theme.animation.duration.normal} ${theme.animation.timing}`,
              }}
            >
              ▶️ In Progress
            </button>
          )}

          {task.status !== TaskStatus.Done && (
            <button
              className="button-press"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(TaskStatus.Done);
              }}
              disabled={isUpdating}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: `2px solid ${theme.accent.success}`,
                background: `${theme.accent.success}20`,
                color: theme.accent.success,
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: `all ${theme.animation.duration.normal} ${theme.animation.timing}`,
              }}
            >
              ✅ Done
            </button>
          )}
        </div>
      )}
    </div>
  );
}