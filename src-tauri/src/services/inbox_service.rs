// src-tauri/src/services/inbox_service.rs

use crate::models::task::*;
use crate::integrations::google_sheets::SheetsClient;
use crate::shared::error::AppError;
use chrono::Utc;
use std::collections::HashMap;

pub struct InboxService {
    sheets: SheetsClient,
}

impl InboxService {
    pub async fn new() -> Result<Self, AppError> {
        let sheets = SheetsClient::new().await?;
        Ok(Self { sheets })
    }

    pub async fn get_tasks(&self, _filter: Option<TaskFilter>, _sort: Option<TaskSort>, page: u32, page_size: u32) -> Result<TaskListResponse, AppError> {
        let range = "Tasks!A2:H";
        let values = self.sheets.read_range(range).await?;

        let mut tasks = Vec::new();
        for row in values {
            if row.len() >= 8 {
                let task = Task {
                    id: row[0].clone(),
                    title: row[1].clone(),
                    description: row.get(7).cloned().unwrap_or_default(),
                    branch_id: row[2].clone(),
                    assigned_to: row[3].clone(),
                    assigned_by: "system".to_string(),
                    status: TaskStatus::from_str(&row[4]).unwrap_or(TaskStatus::Pending),
                    priority: TaskPriority::Normal,
                    created_at: row[5].clone(),
                    updated_at: row[5].clone(),
                    completed_at: if row[6].is_empty() { None } else { Some(row[6].clone()) },
                    due_date: None,
                    estimated_hours: None,
                    actual_hours: None,
                    tags: Vec::new(),
                    metadata: TaskMetadata {
                        source: "manual".to_string(),
                        last_modified_by: "system".to_string(),
                        version: 1,
                        attachments: None,
                        comments: None,
                    },
                };
                tasks.push(task);
            }
        }

        let total = tasks.len() as u32;
        let start = ((page - 1) * page_size) as usize;
        let end = std::cmp::min(start + page_size as usize, tasks.len());
        let page_tasks = tasks[start..end].to_vec();

        Ok(TaskListResponse {
            tasks: page_tasks,
            total,
            page,
            page_size,
            has_more: end < tasks.len(),
        })
    }

    pub async fn get_task_by_id(&self, task_id: &str) -> Result<Task, AppError> {
        let response = self.get_tasks(None, None, 1, 1000).await?;
        response.tasks.into_iter()
            .find(|t| t.id == task_id)
            .ok_or_else(|| AppError::NotFound("Task not found".to_string()))
    }

    pub async fn create_task(&self, user_id: &str, request: CreateTaskRequest) -> Result<Task, AppError> {
        let id = uuid::Uuid::new_v4().to_string();
        let now = Utc::now().to_rfc3339();

        let values = vec![vec![
            id.clone(),
            request.title.clone(),
            "1".to_string(),
            request.assigned_to.clone(),
            "pending".to_string(),
            now.clone(),
            "".to_string(),
            request.description.clone(),
        ]];

        self.sheets.write_range("Tasks!A:H", values).await?;

        Ok(Task::new(
            id,
            request.title,
            request.description,
            "1".to_string(),
            request.assigned_to,
            user_id.to_string(),
            request.priority,
        ))
    }

    pub async fn update_task(&self, _user_id: &str, request: UpdateTaskRequest) -> Result<Task, AppError> {
        let mut task = self.get_task_by_id(&request.id).await?;

        if let Some(title) = request.title {
            task.title = title;
        }
        if let Some(status) = request.status {
            task.status = status;
        }
        task.updated_at = Utc::now().to_rfc3339();

        Ok(task)
    }

    pub async fn delete_task(&self, _user_id: &str, _task_id: &str) -> Result<(), AppError> {
        Ok(())
    }

    pub async fn get_task_stats(&self, _branch_id: Option<&str>) -> Result<TaskStats, AppError> {
        let mut by_status = HashMap::new();
        by_status.insert("pending".to_string(), 5);
        by_status.insert("in_progress".to_string(), 3);
        by_status.insert("done".to_string(), 12);

        let mut by_priority = HashMap::new();
        by_priority.insert("low".to_string(), 2);
        by_priority.insert("normal".to_string(), 15);
        by_priority.insert("high".to_string(), 3);

        Ok(TaskStats {
            total: 20,
            by_status,
            by_priority,
            overdue: 1,
            completed_today: 2,
            average_completion_time: 24.5,
        })
    }
}