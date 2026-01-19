// src/hooks/useInbox.ts

import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/task_service';
import { Task, TaskFilter, CreateTaskInput, UpdateTaskInput } from '../types/task_types';

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
      const data = await taskService.getTasks(filter);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = useCallback(async (input: CreateTaskInput) => {
    try {
      const newTask = await taskService.createTask(input);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (taskId: string, input: UpdateTaskInput) => {
    try {
      const updated = await taskService.updateTask(taskId, input);
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
      return updated;
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
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