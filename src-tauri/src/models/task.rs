// src-tauri/src/models/task.rs

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub description: String,
    pub branch_id: String,
    pub assigned_to: String,
    pub assigned_by: String,
    pub status: TaskStatus,
    pub priority: TaskPriority,
    pub created_at: String,
    pub updated_at: String,
    pub completed_at: Option<String>,
    pub due_date: Option<String>,
    pub estimated_hours: Option<f64>,
    pub actual_hours: Option<f64>,
    pub tags: Vec<String>,
    pub metadata: TaskMetadata,
}

impl Task {
    pub fn new(
        id: String,
        title: String,
        description: String,
        branch_id: String,
        assigned_to: String,
        assigned_by: String,
        priority: TaskPriority,
    ) -> Self {
        let now = chrono::Utc::now().to_rfc3339();
        Self {
            id,
            title,
            description,
            branch_id,
            assigned_to,
            assigned_by,
            status: TaskStatus::Pending,
            priority,
            created_at: now.clone(),
            updated_at: now,
            completed_at: None,
            due_date: None,
            estimated_hours: None,
            actual_hours: None,
            tags: Vec::new(),
            metadata: TaskMetadata::default(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum TaskStatus {
    Pending,
    InProgress,
    Done,
    Cancelled,
    OnHold,
}

impl TaskStatus {
    pub fn from_str(s: &str) -> Option<Self> {
        match s.to_lowercase().as_str() {
            "pending" => Some(TaskStatus::Pending),
            "in_progress" => Some(TaskStatus::InProgress),
            "done" => Some(TaskStatus::Done),
            "cancelled" => Some(TaskStatus::Cancelled),
            "on_hold" => Some(TaskStatus::OnHold),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum TaskPriority {
    Low,
    Normal,
    High,
    Urgent,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskMetadata {
    pub source: String,
    pub last_modified_by: String,
    pub version: u32,
    pub attachments: Option<Vec<String>>,
    pub comments: Option<Vec<TaskComment>>,
}

impl Default for TaskMetadata {
    fn default() -> Self {
        Self {
            source: "manual".to_string(),
            last_modified_by: "system".to_string(),
            version: 1,
            attachments: None,
            comments: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskComment {
    pub id: String,
    pub user_id: String,
    pub content: String,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateTaskRequest {
    pub title: String,
    pub description: String,
    pub assigned_to: String,
    pub priority: TaskPriority,
    pub due_date: Option<String>,
    pub estimated_hours: Option<f64>,
    pub tags: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateTaskRequest {
    pub id: String,
    pub title: Option<String>,
    pub description: Option<String>,
    pub status: Option<TaskStatus>,
    pub priority: Option<TaskPriority>,
    pub assigned_to: Option<String>,
    pub due_date: Option<String>,
    pub estimated_hours: Option<f64>,
    pub actual_hours: Option<f64>,
    pub tags: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskFilter {
    pub status: Option<TaskStatus>,
    pub priority: Option<TaskPriority>,
    pub assigned_to: Option<String>,
    pub branch_id: Option<String>,
    pub tags: Option<Vec<String>>,
    pub search: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskSort {
    pub field: String,
    pub order: SortOrder,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum SortOrder {
    Asc,
    Desc,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskListResponse {
    pub tasks: Vec<Task>,
    pub total: u32,
    pub page: u32,
    pub page_size: u32,
    pub has_more: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskStats {
    pub total: u32,
    pub by_status: HashMap<String, u32>,
    pub by_priority: HashMap<String, u32>,
    pub overdue: u32,
    pub completed_today: u32,
    pub average_completion_time: f64,
}