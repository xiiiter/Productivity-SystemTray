use crate::models::notification::*;
use crate::services::sheets_service::{SheetsService, SheetRow};
use crate::shared::error::AppError;
use chrono::Utc;
use uuid::Uuid;
use tauri::AppHandle;

pub struct NotificationService {
    sheets: SheetsService,
}

impl NotificationService {
    pub async fn new(app: &AppHandle) -> Result<Self, AppError> {
        let sheets = SheetsService::new(app).await?;
        Ok(Self { sheets })
    }

    pub async fn get_notifications(
        &self,
        user_id: &str,
        filter: Option<NotificationFilter>,
    ) -> Result<NotificationListResponse, AppError> {
        let rows: Vec<SheetRow> = self.sheets.get_notifications_by_user(user_id).await?;
        
        let mut notifications: Vec<Notification> = rows
            .into_iter()
            .filter_map(|row| self.parse_notification_from_row(&row.data, row.row_number).ok())
            .collect();

        if let Some(filter) = &filter {
            if let Some(read) = filter.read {
                notifications.retain(|n| n.read == read);
            }
        }

        let unread_count = notifications.iter().filter(|n| !n.read).count() as u32;
        let total = notifications.len() as u32;
        
        Ok(NotificationListResponse {
            notifications,
            unread_count,
            total,
            has_more: false,
        })
    }

    pub async fn mark_as_read(&self, _user_id: &str, notification_id: &str) -> Result<(), AppError> {
        let rows = self.sheets.get_tasks().await?;
        let row = rows.into_iter()
            .find(|r| r.data.get(0).map(|s| s.as_str()) == Some(notification_id))
            .ok_or_else(|| AppError::NotFound("Notification not found".into()))?;

        self.sheets.mark_notification_read(row.row_number).await
    }

    pub async fn mark_all_as_read(&self, user_id: &str) -> Result<(), AppError> {
        self.sheets.mark_all_notifications_read(user_id).await
    }

    pub async fn create_notification(
        &self,
        user_id: &str,
        title: String,
        message: String,
        n_type: String,
        priority: String,
        url: Option<String>,
    ) -> Result<Notification, AppError> {
        let notification = Notification {
            id: Uuid::new_v4().to_string(),
            user_id: user_id.to_string(),
            title,
            message,
            notification_type: n_type,
            priority,
            read: false,
            read_at: None,
            action_url: url,
            action_label: None,
            expires_at: None,
            metadata: NotificationMetadata {
                branch_id: None,
                color: None,
                exception_id: None,
                task_id: None,
                icon: None,
                related_users: None,
                sound_enabled: None,
            },
            created_at: Utc::now().to_rfc3339(),
        };

        let row_data = self.notification_to_row_data(&notification);
        self.sheets.add_notification(row_data).await?;
        Ok(notification)
    }

    fn parse_notification_from_row(&self, data: &[String], _row_num: usize) -> Result<Notification, AppError> {
        if data.len() < 7 { 
            return Err(AppError::NotFound("Invalid row".into())); 
        }
        Ok(Notification {
            id: data[1].clone(),
            user_id: data[0].clone(),
            title: data[2].clone(),
            message: data[3].clone(),
            notification_type: data[4].clone(),
            priority: data[5].clone(),
            read: data[6].to_lowercase() == "read" || data[6].to_lowercase() == "true",
            read_at: data.get(11).filter(|s| !s.is_empty()).cloned(),
            action_url: data.get(7).cloned(),
            action_label: data.get(8).cloned(),
            expires_at: data.get(9).filter(|s| !s.is_empty()).cloned(),
            metadata: NotificationMetadata {
                branch_id: None,
                color: None,
                exception_id: None,
                task_id: None,
                icon: None,
                related_users: None,
                sound_enabled: None,
            },
            created_at: data.get(10).cloned().unwrap_or_else(|| Utc::now().to_rfc3339()),
        })
    }

    fn notification_to_row_data(&self, n: &Notification) -> Vec<String> {
        vec![
            n.user_id.clone(),
            n.id.clone(),
            n.title.clone(),
            n.message.clone(),
            n.notification_type.clone(),
            n.priority.clone(),
            if n.read { "READ" } else { "UNREAD" }.to_string(),
            n.action_url.clone().unwrap_or_default(),
            n.action_label.clone().unwrap_or_default(),
            n.expires_at.clone().unwrap_or_default(),
            n.created_at.clone(),
            n.read_at.clone().unwrap_or_default(),
        ]
    }
}