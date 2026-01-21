// src-tauri/src/commands/metric.rs

use crate::services::metrics_service::MetricsService;
use crate::models::metrics::{MetricsData, MetricsFilter};

#[tauri::command]
pub async fn get_branch_metrics(
    app: tauri::AppHandle,
    filter: MetricsFilter
) -> Result<MetricsData, String> {
    let service = MetricsService::new(&app).await.map_err(|e| e.to_string())?;
    service.get_branch_metrics(&filter).await.map_err(|e| e.to_string())
}

// REMOVIDOS comandos que usam métodos inexistentes:
// - get_user_metrics (não existe no MetricsService)
// - export_metrics (não existe)
// - get_metrics_forecast (não existe)
// - get_productivity_score (não existe)
// - compare_periods (não existe)
//
// Esses métodos precisam ser implementados primeiro em metrics_service.rs