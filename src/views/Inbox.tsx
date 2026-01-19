import { useState } from 'react';
import { useTheme } from '../App';
import { useBranch } from '../hooks/useBranch';
import { useInbox } from '../hooks/useInbox';
import { TaskCard } from '../components/cards/TaskCard';
import { CreateTaskModal } from '../components/modals/CreateTaskModal';
import { TaskFilter, TaskStatus } from '../types/task_types';

export function Inbox() {
  const { theme } = useTheme();
  const { currentBranch } = useBranch();
  const [filter, setFilter] = useState<TaskFilter>({
    branchId: currentBranch?.id,
  });
  const { tasks, loading, createTask, updateTask, deleteTask } = useInbox(filter);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleFilterStatus = (status?: TaskStatus) => {
    setFilter(prev => ({
      ...prev,
      status: status ? [status] : undefined,
    }));
  };

  if (!currentBranch) {
    return (
      <div style={{ padding: '20px', color: theme.text.secondary }}>
        Please select a branch first
      </div>
    );
  }

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
          Inbox
        </h2>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            background: theme.accent.primary,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          + New Task
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
      }}>
        {['All', 'Pending', 'In Progress', 'Done'].map((label) => {
          const status = label === 'All' ? undefined :
            label === 'Pending' ? TaskStatus.Pending :
            label === 'In Progress' ? TaskStatus.InProgress :
            TaskStatus.Done;
          
          const isActive = filter.status?.[0] === status || (label === 'All' && !filter.status);

          return (
            <button
              key={label}
              onClick={() => handleFilterStatus(status)}
              style={{
                background: isActive ? theme.background.active : theme.background.secondary,
                color: isActive ? theme.accent.primary : theme.text.secondary,
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ color: theme.text.secondary }}>Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: theme.text.secondary,
        }}>
          No tasks found
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
              theme={theme}
            />
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