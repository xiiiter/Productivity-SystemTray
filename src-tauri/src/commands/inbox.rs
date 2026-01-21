// src-tauri/src/commands/inbox.rs

use crate::services::inbox_service::InboxService;
use crate::models::task::*;

#[tauri::command]
pub async fn get_tasks(
    app: tauri::AppHandle,
    filter: Option<TaskFilter>,
    sort: Option<TaskSort>,
    page: u32,
    page_size: u32,
) -> Result<TaskListResponse, String> {
    let service = InboxService::new(&app).await.map_err(|e| e.to_string())?;
    service.get_tasks(filter, sort, page, page_size).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_task(
    app: tauri::AppHandle,
    request: CreateTaskRequest
) -> Result<Task, String> {
    let service = InboxService::new(&app).await.map_err(|e| e.to_string())?;
    service.create_task(request).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_task_status(
    app: tauri::AppHandle,
    task_id: String,
    status: TaskStatus,
) -> Result<Task, String> {
    let service = InboxService::new(&app).await.map_err(|e| e.to_string())?;
    service.update_task_status(&task_id, status).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_task(
    app: tauri::AppHandle,
    task_id: String
) -> Result<(), String> {
    let service = InboxService::new(&app).await.map_err(|e| e.to_string())?;
    service.delete_task(&task_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn mark_task_complete(
    app: tauri::AppHandle,
    task_id: String
) -> Result<Task, String> {
    let service = InboxService::new(&app).await.map_err(|e| e.to_string())?;
    service.update_task_status(&task_id, TaskStatus::Done).await.map_err(|e| e.to_string())
}

// REMOVIDOS comandos que usam métodos inexistentes:
// - get_task_by_id (não existe)
// - update_task (não existe, use update_task_status)
// - get_task_stats (não existe)
// - assign_task (não existe)