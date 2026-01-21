use crate::models::task::*;
use crate::services::sheets_service::{SheetsService, SheetRow};
use crate::shared::error::AppError;
use chrono::Utc;
use uuid::Uuid;
use tauri::AppHandle;

pub struct InboxService {
    sheets: SheetsService,
}

impl InboxService {
    pub async fn new(app: &AppHandle) -> Result<Self, AppError> {
        let sheets = SheetsService::new(app).await?;
        Ok(Self { sheets })
    }

    pub async fn get_tasks(
        &self,
        filter: Option<TaskFilter>,
        _sort: Option<TaskSort>,
        _page: u32,
        _page_size: u32,
    ) -> Result<TaskListResponse, AppError> {
        let rows: Vec<SheetRow> = self.sheets.get_tasks().await?;
        
        let mut tasks: Vec<Task> = rows
            .into_iter()
            .filter_map(|row| self.parse_task_from_row(&row.data).ok())
            .collect();

        if let Some(filter) = &filter {
            if let Some(branch_id) = &filter.branch_id {
                tasks.retain(|t| &t.branch_id == branch_id);
            }
            if let Some(assigned_to) = &filter.assigned_to {
                tasks.retain(|t| &t.assigned_to == assigned_to);
            }
            if let Some(status) = &filter.status {
                tasks.retain(|t| &t.status == status);
            }
        }

        let total = tasks.len() as u32;
        Ok(TaskListResponse {
            tasks,
            total,
            page: _page,
            page_size: _page_size,
            has_more: false,
        })
    }

    pub async fn create_task(&self, request: CreateTaskRequest) -> Result<Task, AppError> {
        let task = Task {
            id: Uuid::new_v4().to_string(),
            title: request.title,
            description: request.description,
            branch_id: String::new(),
            assigned_to: request.assigned_to,
            assigned_by: "system".to_string(),
            status: TaskStatus::Pending,
            priority: request.priority,
            due_date: request.due_date,
            estimated_hours: request.estimated_hours,
            actual_hours: None,
            tags: request.tags.unwrap_or_default(),
            created_at: Utc::now().to_rfc3339(),
            updated_at: Utc::now().to_rfc3339(),
            completed_at: None,
            metadata: TaskMetadata::default(),
        };

        let row_data = self.task_to_row_data(&task);
        self.sheets.add_task(row_data).await?;
        Ok(task)
    }

    pub async fn update_task_status(&self, task_id: &str, status: TaskStatus) -> Result<Task, AppError> {
        let rows: Vec<SheetRow> = self.sheets.get_tasks().await?;
        let sheet_row = rows.into_iter()
            .find(|r| r.data.get(0).map(|s| s.as_str()) == Some(task_id))
            .ok_or_else(|| AppError::NotFound("Task not found".into()))?;

        let mut task = self.parse_task_from_row(&sheet_row.data)?;
        task.status = status.clone();
        task.updated_at = Utc::now().to_rfc3339();
        
        if matches!(status, TaskStatus::Done) {
            task.completed_at = Some(Utc::now().to_rfc3339());
        }

        let row_data = self.task_to_row_data(&task);
        self.sheets.update_task(sheet_row.row_number, row_data).await?;
        Ok(task)
    }

    pub async fn delete_task(&self, task_id: &str) -> Result<(), AppError> {
        let rows: Vec<SheetRow> = self.sheets.get_tasks().await?;
        let sheet_row = rows.into_iter()
            .find(|r| r.data.get(0).map(|s| s.as_str()) == Some(task_id))
            .ok_or_else(|| AppError::NotFound("Task not found".into()))?;

        self.sheets.delete_task(sheet_row.row_number).await
    }

    fn parse_task_from_row(&self, data: &[String]) -> Result<Task, AppError> {
        if data.len() < 8 { 
            return Err(AppError::NotFound("Invalid row".into())); 
        }
        Ok(Task {
            id: data[0].clone(),
            title: data[1].clone(),
            description: data[2].clone(),
            branch_id: data[3].clone(),
            assigned_to: data[4].clone(),
            assigned_by: data[5].clone(),
            status: serde_json::from_str(&format!("\"{}\"", data[6])).unwrap_or(TaskStatus::Pending),
            priority: match data[7].as_str() {
                "High" => TaskPriority::High,
                "Urgent" => TaskPriority::Urgent,
                _ => TaskPriority::Normal,
            },
            due_date: data.get(8).filter(|s| !s.is_empty()).cloned(),
            estimated_hours: data.get(9).and_then(|s| s.parse().ok()),
            actual_hours: data.get(10).and_then(|s| s.parse().ok()),
            tags: Vec::new(),
            created_at: data.get(11).cloned().unwrap_or_else(|| Utc::now().to_rfc3339()),
            updated_at: data.get(12).cloned().unwrap_or_else(|| Utc::now().to_rfc3339()),
            completed_at: data.get(13).filter(|s| !s.is_empty()).cloned(),
            metadata: TaskMetadata::default(),
        })
    }

    fn task_to_row_data(&self, task: &Task) -> Vec<String> {
        vec![
            task.id.clone(),
            task.title.clone(),
            task.description.clone(),
            task.branch_id.clone(),
            task.assigned_to.clone(),
            task.assigned_by.clone(),
            format!("{:?}", task.status),
            format!("{:?}", task.priority),
            task.due_date.clone().unwrap_or_default(),
            task.estimated_hours.map(|h| h.to_string()).unwrap_or_default(),
            task.actual_hours.map(|h| h.to_string()).unwrap_or_default(),
            task.created_at.clone(),
            task.updated_at.clone(),
            task.completed_at.clone().unwrap_or_default(),
        ]
    }
}