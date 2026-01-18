// frontend/hooks/useInbox.ts

import { useState, useEffect, useCallback } from 'react';
import { inboxService } from '../services/inbox.service';
import { Task, TaskFilter, CreateTaskRequest, UpdateTaskRequest } from '../types/task.types';

export function useInbox(filter?: TaskFilter) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await inboxService.getTasks(filter);
      setTasks(response.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = useCallback(async (request: CreateTaskRequest) => {
    const newTask = await inboxService.createTask(request);
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback(async (request: UpdateTaskRequest) => {
    const updated = await inboxService.updateTask(request);
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    return updated;
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    await inboxService.deleteTask(taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refresh: loadTasks,
  };
}