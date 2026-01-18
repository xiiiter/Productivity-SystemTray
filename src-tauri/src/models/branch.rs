// src-tauri/src/models/branch.rs

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Branch {
    pub id: String,
    pub name: String,
    pub manager: String,
    pub active: bool,
    pub config: BranchConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BranchConfig {
    pub timezone: String,
    pub working_hours: WorkingHours,
    pub features: BranchFeatures,
    pub notifications: NotificationConfig,
}

impl Default for BranchConfig {
    fn default() -> Self {
        Self {
            timezone: "UTC-3".to_string(),
            working_hours: WorkingHours::default(),
            features: BranchFeatures::default(),
            notifications: NotificationConfig::default(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkingHours {
    pub start: String,
    pub end: String,
    pub break_start: Option<String>,
    pub break_end: Option<String>,
    pub work_days: Vec<u8>, // 1-7 (Monday-Sunday)
}

impl Default for WorkingHours {
    fn default() -> Self {
        Self {
            start: "09:00".to_string(),
            end: "18:00".to_string(),
            break_start: Some("12:00".to_string()),
            break_end: Some("13:00".to_string()),
            work_days: vec![1, 2, 3, 4, 5], // Monday to Friday
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BranchFeatures {
    pub time_tracking: bool,
    pub task_management: bool,
    pub notifications: bool,
    pub metrics: bool,
    pub workload_management: bool,
}

impl Default for BranchFeatures {
    fn default() -> Self {
        Self {
            time_tracking: true,
            task_management: true,
            notifications: true,
            metrics: true,
            workload_management: true,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NotificationConfig {
    pub enabled: bool,
    pub email: bool,
    pub push: bool,
    pub in_app: bool,
}

impl Default for NotificationConfig {
    fn default() -> Self {
        Self {
            enabled: true,
            email: true,
            push: true,
            in_app: true,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BranchSelection {
    pub branch_id: String,
    pub selected_at: String,
    pub user_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BranchListResponse {
    pub branches: Vec<Branch>,
    pub total: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BranchStats {
    pub total_users: u32,
    pub active_users: u32,
    pub total_tasks: u32,
    pub completed_tasks: u32,
    pub total_hours: f64,
}