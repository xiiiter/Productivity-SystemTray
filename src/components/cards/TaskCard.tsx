// src/components/cards/TaskCard.tsx

import { useState } from 'react';
import { Task, TaskStatus, UpdateTaskInput } from '../../types/task_types';

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: string, input: UpdateTaskInput) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  theme: any;
}

export function TaskCard({ task, onUpdate, onDelete, theme }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (status: TaskStatus) => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      await onUpdate(task.id, { status });
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (isUpdating) return;
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      setIsUpdating(true);
      await onDelete(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const statusColors = {
    pending: '#fbbf24',
    in_progress: '#60a5fa',
    done: '#34d399',
    cancelled: '#ef4444',
  };

  const priorityColors = {
    low: '#9ca3af',
    medium: '#fbbf24',
    high: '#fb923c',
    urgent: '#ef4444',
  };

  return (
    <div
      style={{
        background: theme.background.secondary,
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        opacity: isUpdating ? 0.6 : 1,
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            color: theme.text.primary,
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '8px',
          }}>
            {task.title}
          </h3>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                background: `${statusColors[task.status]}20`,
                color: statusColors[task.status],
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 500,
              }}
            >
              {task.status.replace('_', ' ')}
            </span>

            <span
              style={{
                background: `${priorityColors[task.priority]}20`,
                color: priorityColors[task.priority],
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 500,
              }}
            >
              {task.priority}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: theme.text.secondary,
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: `1px solid ${theme.divider}`,
          }}
        >
          {task.description && (
            <p style={{
              color: theme.text.secondary,
              fontSize: '12px',
              marginBottom: '12px',
            }}>
              {task.description}
            </p>
          )}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {Object.values(TaskStatus).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={task.status === status || isUpdating}
                style={{
                  background: task.status === status ? theme.accent.primary : theme.background.hover,
                  color: task.status === status ? '#fff' : theme.text.primary,
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  cursor: task.status === status || isUpdating ? 'not-allowed' : 'pointer',
                  opacity: task.status === status || isUpdating ? 0.5 : 1,
                }}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}