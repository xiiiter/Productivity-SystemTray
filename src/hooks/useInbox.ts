// frontend/hooks/useInbox.ts

import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Task, TaskFilter, CreateTaskRequest, UpdateTaskRequest, TaskListResponse } from '../types/task_types';

export function useInbox(filter?: TaskFilter) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: TaskListResponse = await invoke('get_tasks', {
        filter,
        sort: null,
        page: 1,
        pageSize: 100,
      });
      
      setTasks(response.tasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err as string);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(async (request: CreateTaskRequest): Promise<Task> => {
    try {
      const userId = 'current-user-id'; // TODO: Get from auth context
      const task: Task = await invoke('create_task', {
        userId,
        request,
      });
      
      setTasks(prev => [task, ...prev]);
      return task;
    } catch (err) {
      console.error('Failed to create task:', err);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (request: UpdateTaskRequest): Promise<Task> => {
    try {
      const userId = 'current-user-id'; // TODO: Get from auth context
      const updatedTask: Task = await invoke('update_task', {
        userId,
        request,
      });
      
      setTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
      
      return updatedTask;
    } catch (err) {
      console.error('Failed to update task:', err);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string): Promise<void> => {
    try {
      const userId = 'current-user-id'; // TODO: Get from auth context
      await invoke('delete_task', {
        userId,
        taskId,
      });
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      throw err;
    }
  }, []);

  const refreshTasks = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
  };
}