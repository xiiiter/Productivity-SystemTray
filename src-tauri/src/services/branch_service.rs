use crate::models::branch::{Branch, BranchSelection, BranchConfig};
use crate::services::sheets_service::SheetsService;
use crate::shared::error::AppError;
use chrono::Utc;
use tauri::AppHandle;

pub struct BranchService {
    sheets: SheetsService,
}

impl BranchService {
    pub async fn new(app: &AppHandle) -> Result<Self, AppError> {
        let sheets = SheetsService::new(app).await?;
        Ok(Self { sheets })
    }

    pub async fn get_all_branches(&self) -> Result<Vec<Branch>, AppError> {
        let rows = self.sheets.get_branches().await?;
        
        let mut branches = Vec::new();
        for row in rows {
            if row.data.len() >= 4 {
                let config = if row.data.len() >= 5 && !row.data[4].is_empty() {
                    serde_json::from_str(&row.data[4]).unwrap_or_default()
                } else {
                    BranchConfig::default()
                };

                branches.push(Branch {
                    id: row.data[0].clone(),
                    name: row.data[1].clone(),
                    manager: row.data[2].clone(),
                    active: row.data[4].to_lowercase() == "true" || row.data[4] == "1" || row.data[4].to_lowercase() == "yes" || row.data[4].to_lowercase() == "active" || row.data[4].to_lowercase() == "enabled" || row.data[4].to_lowercase() == "on" || row.data[4].to_lowercase() == "verdadeiro",
                    config,
                    created_at: if row.data.len() >= 6 { row.data[5].clone() } else { Utc::now().to_rfc3339() },
                });
            }
        }
        Ok(branches)
    }

    pub async fn get_branch_by_id(&self, id: &str) -> Result<Branch, AppError> {
        let branches = self.get_all_branches().await?;
        branches.into_iter()
            .find(|b| b.id == id)
            .ok_or_else(|| AppError::NotFound(format!("Branch not found: {}", id)))
    }

    pub async fn select_branch(&self, user_id: &str, branch_id: &str) -> Result<BranchSelection, AppError> {
        let branch = self.get_branch_by_id(branch_id).await?;
        if !branch.active {
            return Err(AppError::NotFound("Cannot select inactive branch".into()));
        }

        self.sheets.set_user_selection(user_id, branch_id).await?;

        Ok(BranchSelection {
            branch_id: branch_id.to_string(),
            selected_at: Utc::now().to_rfc3339(),
            user_id: user_id.to_string(),
        })
    }

    pub async fn get_current_branch(&self, user_id: &str) -> Result<Option<Branch>, AppError> {
        if let Some(selection) = self.sheets.get_user_selection(user_id).await? {
            if selection.data.len() >= 2 {
                let branch_id = &selection.data[1];
                match self.get_branch_by_id(branch_id).await {
                    Ok(branch) if branch.active => Ok(Some(branch)),
                    _ => Ok(None),
                }
            } else {
                Ok(None)
            }
        } else {
            Ok(None)
        }
    }

    pub async fn clear_branch(&self, user_id: &str) -> Result<(), AppError> {
        if let Some(selection) = self.sheets.get_user_selection(user_id).await? {
            let empty_data = vec![
                user_id.to_string(),
                String::new(),
                Utc::now().to_rfc3339(),
            ];
            self.sheets.update_user_selection(selection.row_number, empty_data).await?;
        }
        Ok(())
    }
}