// frontend/src/components/modals/CreateTaskModal.tsx

import { useState } from 'react';
import { CreateTaskRequest, TaskPriority } from '../../types/task_types';
import { Theme } from '../../views/Theme';

interface CreateTaskModalProps {
  onClose: () => void;
  onCreate: (request: CreateTaskRequest) => Promise<any>;
  theme: Theme;
}

export function CreateTaskModal({ onClose, onCreate, theme }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    setIsSubmitting(true);

    try {
      const request: CreateTaskRequest = {
        branch_id: 'current-branch-id', // TODO: Get from context
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        due_date: dueDate || undefined,
        estimated_hours: estimatedHours ? parseFloat(estimatedHours) : undefined,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      await onCreate(request);
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: theme.background.overlay,
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="scale-in"
        style={{
          background: theme.background.modal,
          borderRadius: '20px',
          padding: '32px',
          maxWidth: '500px',
          width: '100%',
          border: `1px solid ${theme.border.secondary}`,
          boxShadow: theme.shadow.large,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <h2 style={{
            color: theme.text.primary,
            fontSize: '24px',
            fontWeight: 800,
            letterSpacing: '-0.03em',
          }}>
            Create New Task
          </h2>

          <button
            onClick={onClose}
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {/* Title */}
          <div>
            <label style={{
              display: 'block',
              color: theme.text.secondary,
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '8px',
            }}>
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              autoFocus
              style={{
                width: '100%',
                padding: '14px 16px',
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
          </div>

          {/* Description */}
          <div>
            <label style={{
              display: 'block',
              color: theme.text.secondary,
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '8px',
            }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={4}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: `2px solid ${theme.border.secondary}`,
                background: theme.background.secondary,
                color: theme.text.primary,
                fontSize: '15px',
                fontWeight: 500,
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
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
          </div>

          {/* Priority */}
          <div>
            <label style={{
              display: 'block',
              color: theme.text.secondary,
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '8px',
            }}>
              Priority
            </label>
            <div style={{
              display: 'flex',
              gap: '10px',
            }}>
              {[
                { value: TaskPriority.High, label: 'High', color: theme.accent.error },
                { value: TaskPriority.Medium, label: 'Medium', color: theme.accent.warning },
                { value: TaskPriority.Low, label: 'Low', color: theme.accent.info },
              ].map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  className="button-press"
                  onClick={() => setPriority(value)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: `2px solid ${priority === value ? color : theme.border.secondary}`,
                    background: priority === value ? `${color}20` : theme.background.secondary,
                    color: priority === value ? color : theme.text.primary,
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: `all ${theme.animation.duration.normal} ${theme.animation.timing}`,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date and Estimated Hours */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}>
            <div>
              <label style={{
                display: 'block',
                color: theme.text.secondary,
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '8px',
              }}>
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
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
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.border.secondary;
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: theme.text.secondary,
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '8px',
              }}>
                Estimated Hours
              </label>
              <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="0"
                min="0"
                step="0.5"
                style={{
                  width: '100%',
                  padding: '14px 16px',
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
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.border.secondary;
                }}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={{
              display: 'block',
              color: theme.text.secondary,
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '8px',
            }}>
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., urgent, bug, feature"
              style={{
                width: '100%',
                padding: '14px 16px',
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
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.border.secondary;
              }}
            />
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '8px',
          }}>
            <button
              type="button"
              className="button-press"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: `2px solid ${theme.border.secondary}`,
                background: theme.background.secondary,
                color: theme.text.primary,
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: `all ${theme.animation.duration.normal} ${theme.animation.timing}`,
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button-press"
              disabled={isSubmitting || !title.trim()}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: `linear-gradient(135deg, ${theme.accent.primary} 0%, ${theme.accent.secondary} 100%)`,
                color: '#fff',
                fontSize: '15px',
                fontWeight: 700,
                cursor: isSubmitting || !title.trim() ? 'not-allowed' : 'pointer',
                opacity: isSubmitting || !title.trim() ? 0.5 : 1,
                boxShadow: `0 8px 24px ${theme.accent.glow}`,
                transition: `all ${theme.animation.duration.normal} ${theme.animation.timing}`,
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}