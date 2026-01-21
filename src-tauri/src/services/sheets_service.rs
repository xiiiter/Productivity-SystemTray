// src-tauri/src/services/sheets_service.rs

use crate::integrations::google_sheets::SheetsClient;
use crate::shared::error::AppError;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SheetRow {
    pub row_number: usize,
    pub data: Vec<String>,
}

pub struct SheetsService {
    client: SheetsClient,
}

impl SheetsService {
    pub async fn new(app: &AppHandle) -> Result<Self, AppError> {
        let client = SheetsClient::new(app).await?;
        Ok(Self { client })
    }

    // --- Branch Operations ---
    pub async fn get_branches(&self) -> Result<Vec<SheetRow>, AppError> {
        let values = self.client.read_range("Branches!A2:Z").await?;
        Ok(values
            .into_iter()
            .enumerate()
            .map(|(idx, data)| SheetRow {
                row_number: idx + 2,
                data,
            })
            .collect())
    }

    // --- User Selection Operations ---
    pub async fn get_user_selections(&self) -> Result<Vec<SheetRow>, AppError> {
        let values = self.client.read_range("UserSelections!A2:C").await?;
        Ok(values
            .into_iter()
            .enumerate()
            .map(|(idx, data)| SheetRow {
                row_number: idx + 2,
                data,
            })
            .collect())
    }

    pub async fn get_user_selection(&self, user_id: &str) -> Result<Option<SheetRow>, AppError> {
        let all_selections = self.get_user_selections().await?;
        Ok(all_selections
            .into_iter()
            .find(|row| row.data.get(0).map(|s| s.as_str()) == Some(user_id)))
    }

    pub async fn set_user_selection(&self, user_id: &str, branch_id: &str) -> Result<(), AppError> {
        let now = chrono::Utc::now().to_rfc3339();
        if let Some(existing) = self.get_user_selection(user_id).await? {
            let data = vec![user_id.to_string(), branch_id.to_string(), now];
            self.update_user_selection(existing.row_number, data).await?;
        } else {
            let data = vec![user_id.to_string(), branch_id.to_string(), now];
            let _ = self.add_user_selection(data).await?;
        }
        Ok(())
    }

    async fn add_user_selection(&self, data: Vec<String>) -> Result<usize, AppError> {
        let existing = self.get_user_selections().await?;
        let next_row = existing.len() + 2;
        let range = format!("UserSelections!A{}:C", next_row);
        self.client.write_range(&range, vec![data]).await?;
        Ok(next_row)
    }

    // FIXED: Changed to 'pub' so branch_service.rs can call it
    pub async fn update_user_selection(&self, row_number: usize, data: Vec<String>) -> Result<(), AppError> {
        let range = format!("UserSelections!A{}:C", row_number);
        self.client.write_range(&range, vec![data]).await
    }

    // --- Task Operations (FIXED: Added missing methods for inbox_service) ---
    pub async fn get_tasks(&self) -> Result<Vec<SheetRow>, AppError> {
        let values = self.client.read_range("Tasks!A2:Z").await?;
        Ok(values.into_iter().enumerate().map(|(idx, data)| SheetRow {
            row_number: idx + 2,
            data,
        }).collect())
    }

    pub async fn add_task(&self, data: Vec<String>) -> Result<usize, AppError> {
        let existing = self.get_tasks().await?;
        let next_row = existing.len() + 2;
        let range = format!("Tasks!A{}:Z", next_row);
        self.client.write_range(&range, vec![data]).await?;
        Ok(next_row)
    }

    pub async fn update_task(&self, row_number: usize, data: Vec<String>) -> Result<(), AppError> {
        let range = format!("Tasks!A{}:Z", row_number);
        self.client.write_range(&range, vec![data]).await
    }

    pub async fn delete_task(&self, row_number: usize) -> Result<(), AppError> {
        // In Sheets, we usually "delete" by clearing the row or marking a status.
        // Here we clear it with empty strings.
        let empty_data = vec![vec!["".to_string(); 10]]; 
        let range = format!("Tasks!A{}:Z", row_number);
        self.client.write_range(&range, empty_data).await
    }

    // --- Notification Operations (FIXED: Added missing methods) ---
    pub async fn get_notifications_by_user(&self, user_id: &str) -> Result<Vec<SheetRow>, AppError> {
        let values = self.client.read_range("Notifications!A2:Z").await?;
        Ok(values.into_iter().enumerate()
            .map(|(idx, data)| SheetRow { row_number: idx + 2, data })
            .filter(|row| row.data.get(0).map(|s| s.as_str()) == Some(user_id))
            .collect())
    }

    pub async fn add_notification(&self, data: Vec<String>) -> Result<usize, AppError> {
        let values = self.client.read_range("Notifications!A2:Z").await?;
        let next_row = values.len() + 2;
        let range = format!("Notifications!A{}:Z", next_row);
        self.client.write_range(&range, vec![data]).await?;
        Ok(next_row)
    }

    pub async fn mark_notification_read(&self, row_number: usize) -> Result<(), AppError> {
        // Assuming status is in column D (index 3)
        let range = format!("Notifications!D{}", row_number);
        self.client.update_cell(&range, "READ".to_string()).await
    }

    pub async fn mark_all_notifications_read(&self, user_id: &str) -> Result<(), AppError> {
        let notes = self.get_notifications_by_user(user_id).await?;
        for note in notes {
            self.mark_notification_read(note.row_number).await?;
        }
        Ok(())
    }
}