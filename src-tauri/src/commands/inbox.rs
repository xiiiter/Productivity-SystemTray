// src-tauri/src/commands/inbox.rs

use crate::services::inbox_service::InboxService;
use crate::models::task::*;

#[tauri::command]
pub async fn get_tasks(
    filter: Option<TaskFilter>,
    sort: Option<TaskSort>,
    page: u32,
    page_size: u32,
) -> Result<TaskListResponse, String> {
    let service = InboxService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.get_tasks(filter, sort, page, page_size)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_task_by_id(task_id: String) -> Result<Task, String> {
    let service = InboxService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.get_task_by_id(&task_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_task(user_id: String, request: CreateTaskRequest) -> Result<Task, String> {
    let service = InboxService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.create_task(&user_id, request)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_task(user_id: String, request: UpdateTaskRequest) -> Result<Task, String> {
    let service = InboxService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.update_task(&user_id, request)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_task(user_id: String, task_id: String) -> Result<(), String> {
    let service = InboxService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.delete_task(&user_id, &task_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_task_stats(branch_id: Option<String>) -> Result<TaskStats, String> {
    let service = InboxService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.get_task_stats(branch_id.as_deref())
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn mark_task_complete(user_id: String, task_id: String) -> Result<Task, String> {
    let service = InboxService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    let request = UpdateTaskRequest {
        id: task_id,
        title: None,
        description: None,
        status: Some(TaskStatus::Done),
        priority: None,
        assigned_to: None,
        due_date: None,
        estimated_hours: None,
        actual_hours: None,
        tags: None,
    };
    
    service.update_task(&user_id, request)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn assign_task(
    user_id: String,
    task_id: String,
    assigned_to: String,
) -> Result<Task, String> {
    let service = InboxService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    let request = UpdateTaskRequest {
        id: task_id,
        title: None,
        description: None,
        status: None,
        priority: None,
        assigned_to: Some(assigned_to),
        due_date: None,
        estimated_hours: None,
        actual_hours: None,
        tags: None,
    };
    
    service.update_task(&user_id, request)
        .await
        .map_err(|e| e.to_string())
}