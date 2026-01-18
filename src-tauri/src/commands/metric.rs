// src-tauri/src/commands/metric.rs

use crate::services::metrics_service::MetricsService;
use crate::models::metrics::{MetricsData, MetricsFilter, ForecastData};

#[tauri::command]
pub async fn get_branch_metrics(filter: MetricsFilter) -> Result<MetricsData, String> {
    let service = MetricsService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.get_branch_metrics(&filter)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_user_metrics(user_id: String, filter: MetricsFilter) -> Result<MetricsData, String> {
    let service = MetricsService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.get_user_metrics(&user_id, &filter)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn export_metrics(filter: MetricsFilter, format: String) -> Result<String, String> {
    let service = MetricsService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.export_metrics(&filter, &format)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_metrics_forecast(user_id: String, days: u32) -> Result<ForecastData, String> {
    let service = MetricsService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.get_forecast(&user_id, days)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_productivity_score(user_id: String, period: String) -> Result<f64, String> {
    let filter = MetricsFilter {
        start_date: None,
        end_date: None,
        branch_id: None,
        user_id: Some(user_id.clone()),
        period,
    };
    
    let service = MetricsService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    let metrics = service.get_user_metrics(&user_id, &filter)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(metrics.summary.productivity_score)
}

#[tauri::command]
pub async fn compare_periods(
    user_id: String,
    current_start: String,
    current_end: String,
    previous_start: String,
    previous_end: String,
) -> Result<serde_json::Value, String> {
    let service = MetricsService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    let current_filter = MetricsFilter {
        start_date: Some(current_start),
        end_date: Some(current_end),
        branch_id: None,
        user_id: Some(user_id.clone()),
        period: "custom".to_string(),
    };
    
    let previous_filter = MetricsFilter {
        start_date: Some(previous_start),
        end_date: Some(previous_end),
        branch_id: None,
        user_id: Some(user_id.clone()),
        period: "custom".to_string(),
    };
    
    let current = service.get_user_metrics(&user_id, &current_filter)
        .await
        .map_err(|e| e.to_string())?;
    
    let previous = service.get_user_metrics(&user_id, &previous_filter)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(serde_json::json!({
        "current": current.summary,
        "previous": previous.summary,
        "comparison": current.comparisons.vs_last_period,
    }))
}