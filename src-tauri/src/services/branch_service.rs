// src-tauri/src/services/branch_service.rs

use crate::models::branch::{Branch, BranchSelection, BranchConfig};
use crate::integrations::google_sheets::SheetsClient;
use crate::shared::error::AppError;
use chrono::Utc;

pub struct BranchService {
    sheets: SheetsClient,
}

impl BranchService {
    pub async fn new() -> Result<Self, AppError> {
        let sheets = SheetsClient::new().await?;
        Ok(Self { sheets })
    }

    pub async fn get_all_branches(&self) -> Result<Vec<Branch>, AppError> {
        let range = "Branches!A2:E";
        let values = self.sheets.read_range(range).await?;

        let mut branches = Vec::new();
        for row in values {
            if row.len() >= 5 {
                let config: BranchConfig = match serde_json::from_str(&row[4]) {
                    Ok(c) => c,
                    Err(_) => BranchConfig::default(),
                };

                branches.push(Branch {
                    id: row[0].to_string(),
                    name: row[1].to_string(),
                    manager: row[2].to_string(),
                    active: row[3].to_lowercase() == "true",
                    config,
                });
            }
        }

        Ok(branches)
    }

    pub async fn get_branch_by_id(&self, branch_id: &str) -> Result<Branch, AppError> {
        let branches = self.get_all_branches().await?;
        branches
            .into_iter()
            .find(|b| b.id == branch_id)
            .ok_or_else(|| AppError::NotFound("Branch not found".to_string()))
    }

    pub async fn select_branch(&self, branch_id: &str, user_id: &str) -> Result<BranchSelection, AppError> {
        self.get_branch_by_id(branch_id).await?;

        Ok(BranchSelection {
            branch_id: branch_id.to_string(),
            selected_at: Utc::now().to_rfc3339(),
            user_id: user_id.to_string(),
        })
    }

    pub async fn clear_branch(&self, _user_id: &str) -> Result<(), AppError> {
        Ok(())
    }

    pub async fn validate_branch(&self, branch_id: &str, _user_id: &str) -> Result<bool, AppError> {
        match self.get_branch_by_id(branch_id).await {
            Ok(branch) => Ok(branch.active),
            Err(_) => Ok(false),
        }
    }
}