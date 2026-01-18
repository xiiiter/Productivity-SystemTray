// frontend/services/api.ts

import { invoke } from "@tauri-apps/api/core";

export async function invokeCommand<T>(
  command: string,
  args?: Record<string, unknown>
): Promise<T> {
  try {
    const result = await invoke<T>(command, args);
    return result;
  } catch (error) {
    console.error(`Error invoking command ${command}:`, error);
    throw error;
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}