// src-tauri/src/services/notification_service.rs

use crate::models::notification::*;
use crate::integrations::google_sheets::SheetsClient;
use crate::shared::error::AppError;
use std::collections::HashMap;

pub struct NotificationService {
    sheets: SheetsClient,
}

impl NotificationService {
    pub async fn new() -> Result<Self, AppError> {
        let sheets = SheetsClient::new().await?;
        Ok(Self { sheets })
    }

    pub async fn get_notifications(&self, user_id: &str, _filter: Option<NotificationFilter>) -> Result<NotificationListResponse, AppError> {
        let range = "Notifications!A2:G";
        let values = self.sheets.read_range(range).await?;

        let mut notifications = Vec::new();
        let mut unread_count = 0;

        for row in values {
            if row.len() >= 7 && row[1] == user_id {
                let read = row[5] == "1";
                if !read {
                    unread_count += 1;
                }

                notifications.push(Notification {
                    id: row[0].clone(),
                    user_id: row[1].clone(),
                    notification_type: row[2].clone(),
                    priority: row[3].clone(),
                    message: row[4].clone(),
                    title: "Notification".to_string(),
                    action_url: None,
                    action_label: None,
                    metadata: NotificationMetadata {
                        task_id: None,
                        branch_id: None,
                        exception_id: None,
                        icon: None,
                        color: None,
                        sound_enabled: Some(true),
                        related_users: None,
                    },
                    read,
                    created_at: row[6].clone(),
                    read_at: None,
                    expires_at: None,
                });
            }
        }

        let total = notifications.len() as u32;

        Ok(NotificationListResponse {
            notifications,
            total,
            unread_count,
            has_more: false,
        })
    }

    pub async fn mark_as_read(&self, _user_id: &str, _request: MarkAsReadRequest) -> Result<(), AppError> {
        Ok(())
    }

    pub async fn mark_all_as_read(&self, _user_id: &str) -> Result<(), AppError> {
        Ok(())
    }

    pub async fn get_notification_stats(&self, _user_id: &str) -> Result<NotificationStats, AppError> {
        let mut by_type = HashMap::new();
        by_type.insert("task_assigned".to_string(), 5);
        by_type.insert("deadline_approaching".to_string(), 2);

        let mut by_priority = HashMap::new();
        by_priority.insert("normal".to_string(), 5);
        by_priority.insert("high".to_string(), 2);

        Ok(NotificationStats {
            total: 7,
            unread: 3,
            by_type,
            by_priority,
            last_24h: 5,
        })
    }

    pub async fn update_notification_settings(&self, _user_id: &str, request: UpdateSettingsRequest) -> Result<NotificationSettings, AppError> {
        Ok(request.settings)
    }
}