// src/services/task_service.ts

import { invoke } from "@tauri-apps/api/core";
import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskFilter,
  CreateTaskInput,
  UpdateTaskInput,
} from "../types/task_types";

class TaskService {
  async getTasks(filter?: TaskFilter): Promise<Task[]> {
    try {
      const tasks = await invoke<Task[]>("get_tasks", { filter });
      return tasks;
    } catch (error) {
      console.error("Error getting tasks:", error);
      return [];
    }
  }

  async getTask(taskId: string): Promise<Task> {
    try {
      const task = await invoke<Task>("get_task", { taskId });
      return task;
    } catch (error) {
      console.error("Error getting task:", error);
      throw error;
    }
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    try {
      const task = await invoke<Task>("create_task", { input });
      return task;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
    try {
      const task = await invoke<Task>("update_task", { taskId, input });
      return task;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      await invoke("delete_task", { taskId });
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  async getUserTasks(userId: string): Promise<Task[]> {
    return this.getTasks({ assignedTo: userId });
  }

  async getBranchTasks(branchId: string): Promise<Task[]> {
    return this.getTasks({ branchId });
  }
}

export const taskService = new TaskService();