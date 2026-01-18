// src-tauri/src/commands/notifications.rs

use crate::services::notification_service::NotificationService;
use crate::models::notification::*;

#[tauri::command]
pub async fn get_notifications(
    user_id: String,
    filter: Option<NotificationFilter>,
) -> Result<NotificationListResponse, String> {
    let service = NotificationService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.get_notifications(&user_id, filter)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn mark_notification_as_read(
    user_id: String,
    notification_ids: Vec<String>,
) -> Result<(), String> {
    let service = NotificationService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    let request = MarkAsReadRequest { notification_ids };
    
    service.mark_as_read(&user_id, request)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn mark_all_notifications_as_read(user_id: String) -> Result<(), String> {
    let service = NotificationService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.mark_all_as_read(&user_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_notification_stats(user_id: String) -> Result<NotificationStats, String> {
    let service = NotificationService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.get_notification_stats(&user_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_unread_count(user_id: String) -> Result<u32, String> {
    let service = NotificationService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    let stats = service.get_notification_stats(&user_id)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(stats.unread)
}

#[tauri::command]
pub async fn update_notification_settings(
    user_id: String,
    settings: NotificationSettings,
) -> Result<NotificationSettings, String> {
    let service = NotificationService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    let request = UpdateSettingsRequest { settings };
    
    service.update_notification_settings(&user_id, request)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_notification(
    user_id: String,
    notification_id: String,
) -> Result<(), String> {
    let service = NotificationService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    // Mark as read instead of deleting (soft delete)
    let request = MarkAsReadRequest {
        notification_ids: vec![notification_id],
    };
    
    service.mark_as_read(&user_id, request)
        .await
        .map_err(|e| e.to_string())
}