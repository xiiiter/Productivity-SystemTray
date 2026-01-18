// src-tauri/src/models/notification.rs

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Notification {
    pub id: String,
    pub user_id: String,
    pub notification_type: String,
    pub priority: String,
    pub title: String,
    pub message: String,
    pub action_url: Option<String>,
    pub action_label: Option<String>,
    pub metadata: NotificationMetadata,
    pub read: bool,
    pub created_at: String,
    pub read_at: Option<String>,
    pub expires_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NotificationMetadata {
    pub task_id: Option<String>,
    pub branch_id: Option<String>,
    pub exception_id: Option<String>,
    pub icon: Option<String>,
    pub color: Option<String>,
    pub sound_enabled: Option<bool>,
    pub related_users: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NotificationFilter {
    pub notification_type: Option<String>,
    pub priority: Option<String>,
    pub read: Option<bool>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NotificationListResponse {
    pub notifications: Vec<Notification>,
    pub total: u32,
    pub unread_count: u32,
    pub has_more: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarkAsReadRequest {
    pub notification_ids: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NotificationStats {
    pub total: u32,
    pub unread: u32,
    pub by_type: HashMap<String, u32>,
    pub by_priority: HashMap<String, u32>,
    pub last_24h: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NotificationSettings {
    pub enabled: bool,
    pub email: bool,
    pub push: bool,
    pub in_app: bool,
    pub sound: bool,
    pub types: HashMap<String, bool>,
    pub quiet_hours: Option<QuietHours>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuietHours {
    pub enabled: bool,
    pub start: String,
    pub end: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateSettingsRequest {
    pub settings: NotificationSettings,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateNotificationRequest {
    pub user_id: String,
    pub notification_type: String,
    pub priority: String,
    pub title: String,
    pub message: String,
    pub action_url: Option<String>,
    pub action_label: Option<String>,
    pub metadata: Option<NotificationMetadata>,
    pub expires_at: Option<String>,
}