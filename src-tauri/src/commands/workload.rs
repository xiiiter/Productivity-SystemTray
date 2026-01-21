// src-tauri/src/commands/workload.rs

use crate::services::workload_service::WorkloadService;
use crate::models::workload::*;

#[tauri::command]
pub async fn get_workload(
    app: tauri::AppHandle,
    user_id: String
) -> Result<Workload, String> {
    let service = WorkloadService::new(&app).await.map_err(|e| e.to_string())?;
    service.get_workload(&user_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_weekly_schedule(
    app: tauri::AppHandle,
    user_id: String
) -> Result<Vec<WorkSchedule>, String> {
    let service = WorkloadService::new(&app).await.map_err(|e| e.to_string())?;
    let workload = service.get_workload(&user_id).await.map_err(|e| e.to_string())?;
    Ok(workload.schedule)
}

// REMOVIDOS comandos que usam métodos inexistentes:
// - get_workload_summary (não existe)
// - validate_work_hours (não existe)
// - create_workload_exception (não existe)
// - approve_workload_exception (não existe)
// - get_work_status (não existe)
// - check_if_can_work (não existe)
// - update_workload (não existe)
// - get_overtime_hours (não existe)
//
// Esses métodos precisam ser implementados primeiro em workload_service.rs