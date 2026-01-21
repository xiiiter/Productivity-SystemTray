// src-tauri/src/models/branch.rs

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Branch {
    pub id: String,
    pub name: String,
    pub manager: String,
    pub active: bool,
    #[serde(default)]
    pub config: BranchConfig,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BranchConfig {
    #[serde(default)]
    pub working_hours: WorkingHours,
}

impl Default for BranchConfig {
    fn default() -> Self {
        Self {
            working_hours: WorkingHours::default(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WorkingHours {
    pub start: String,
    pub end: String,
}

impl Default for WorkingHours {
    fn default() -> Self {
        Self {
            start: "08:00".to_string(),
            end: "18:00".to_string(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BranchSelection {
    pub user_id: String,
    pub branch_id: String,
    pub selected_at: String,
}