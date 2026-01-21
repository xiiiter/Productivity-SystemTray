// src-tauri/src/commands/notifications.rs

use crate::services::notification_service::NotificationService;
use crate::models::notification::*;

#[tauri::command]
pub async fn get_notifications(
    app: tauri::AppHandle,
    user_id: String,
    filter: Option<NotificationFilter>,
) -> Result<NotificationListResponse, String> {
    let service = NotificationService::new(&app).await.map_err(|e| e.to_string())?;
    service.get_notifications(&user_id, filter).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn mark_notification_as_read(
    app: tauri::AppHandle,
    user_id: String,
    notification_id: String,
) -> Result<(), String> {
    let service = NotificationService::new(&app).await.map_err(|e| e.to_string())?;
    service.mark_as_read(&user_id, &notification_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn mark_all_notifications_as_read(
    app: tauri::AppHandle,
    user_id: String
) -> Result<(), String> {
    let service = NotificationService::new(&app).await.map_err(|e| e.to_string())?;
    service.mark_all_as_read(&user_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_notification(
    app: tauri::AppHandle,
    user_id: String,
    title: String,
    message: String,
    notification_type: String,
    priority: String,
    action_url: Option<String>,
) -> Result<Notification, String> {
    let service = NotificationService::new(&app).await.map_err(|e| e.to_string())?;
    service.create_notification(&user_id, title, message, notification_type, priority, action_url)
        .await
        .map_err(|e| e.to_string())
}

// REMOVIDOS comandos que usam métodos inexistentes:
// - get_notification_stats (não existe)
// - get_unread_count (não existe)
// - update_notification_settings (não existe)
// - delete_notification (pode usar mark_as_read como alternativa)