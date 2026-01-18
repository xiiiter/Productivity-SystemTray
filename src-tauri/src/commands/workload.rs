// src-tauri/src/commands/workload.rs

use crate::services::workload_service::WorkloadService;
use crate::models::workload::*;

#[tauri::command]
pub async fn get_workload(user_id: String) -> Result<Workload, String> {
    let service = WorkloadService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.get_workload(&user_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_workload_summary(
    user_id: String,
    start_date: String,
    end_date: String,
) -> Result<WorkloadSummary, String> {
    let service = WorkloadService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.get_workload_summary(&user_id, &start_date, &end_date)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn validate_work_hours(user_id: String) -> Result<WorkHoursValidation, String> {
    let service = WorkloadService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.validate_work_hours(&user_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_workload_exception(
    user_id: String,
    request: CreateExceptionRequest,
) -> Result<WorkloadException, String> {
    let service = WorkloadService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.create_exception(&user_id, request)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn approve_workload_exception(
    manager_id: String,
    exception_id: String,
    approved: bool,
    notes: Option<String>,
) -> Result<WorkloadException, String> {
    let service = WorkloadService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    let request = ApproveExceptionRequest {
        exception_id,
        approved,
        notes,
    };
    
    service.approve_exception(&manager_id, request)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_work_status(user_id: String) -> Result<WorkStatus, String> {
    let service = WorkloadService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.get_work_status(&user_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn check_if_can_work(user_id: String) -> Result<bool, String> {
    let service = WorkloadService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    let validation = service.validate_work_hours(&user_id)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(validation.is_within_hours)
}

#[tauri::command]
pub async fn get_weekly_schedule(user_id: String) -> Result<Vec<WorkSchedule>, String> {
    let service = WorkloadService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    let workload = service.get_workload(&user_id)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(workload.schedule)
}

#[tauri::command]
pub async fn update_workload(
    user_id: String,
    request: UpdateWorkloadRequest,
) -> Result<Workload, String> {
    let service = WorkloadService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    let mut workload = service.get_workload(&user_id)
        .await
        .map_err(|e| e.to_string())?;
    
    if let Some(weekly_hours) = request.weekly_hours {
        workload.weekly_hours = weekly_hours;
    }
    
    if let Some(schedule) = request.schedule {
        workload.schedule = schedule;
    }
    
    if let Some(timezone) = request.timezone {
        workload.timezone = timezone;
    }
    
    Ok(workload)
}

#[tauri::command]
pub async fn get_overtime_hours(user_id: String, start: String, end: String) -> Result<f64, String> {
    let service = WorkloadService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    let summary = service.get_workload_summary(&user_id, &start, &end)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(summary.overtime_hours)
}