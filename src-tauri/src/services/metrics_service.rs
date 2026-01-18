// src-tauri/src/services/metrics_service.rs

use crate::models::metrics::*;
use crate::integrations::google_sheets::SheetsClient;
use crate::shared::error::AppError;

pub struct MetricsService {
    sheets: SheetsClient,
}

impl MetricsService {
    pub async fn new() -> Result<Self, AppError> {
        let sheets = SheetsClient::new().await?;
        Ok(Self { sheets })
    }

    pub async fn get_branch_metrics(&self, filter: &MetricsFilter) -> Result<MetricsData, AppError> {
        // Buscar dados brutos do Sheets
        let time_tracking = self.sheets.read_range("TimeTracking!A2:F").await?;
        let tasks = self.sheets.read_range("Tasks!A2:H").await?;

        // Calcular métricas
        let mut summary = MetricsSummary::new();
        summary.total_hours = self.calculate_total_hours(&time_tracking);
        summary.total_tasks = tasks.len() as u32;
        summary.completed_tasks = self.count_completed_tasks(&tasks);
        summary.pending_tasks = summary.total_tasks - summary.completed_tasks;
        summary.calculate_completion_rate();

        let trends = self.calculate_trends(&time_tracking);
        let comparisons = self.calculate_comparisons(&time_tracking, &tasks);

        Ok(MetricsData {
            period: DateRange {
                start: filter.start_date.clone().unwrap_or_default(),
                end: filter.end_date.clone().unwrap_or_default(),
                label: filter.period.clone(),
            },
            branch: BranchInfo {
                id: filter.branch_id.clone().unwrap_or_default(),
                name: "Branch Name".to_string(),
            },
            summary,
            trends,
            comparisons,
            top_performers: None,
        })
    }

    pub async fn get_user_metrics(&self, _user_id: &str, filter: &MetricsFilter) -> Result<MetricsData, AppError> {
        self.get_branch_metrics(filter).await
    }

    pub async fn export_metrics(&self, _filter: &MetricsFilter, format: &str) -> Result<String, AppError> {
        Ok(format!("/exports/metrics.{}", format))
    }

    pub async fn get_forecast(&self, _user_id: &str, days: u32) -> Result<ForecastData, AppError> {
        Ok(ForecastData {
            predicted_hours: vec![8.0; days as usize],
            predicted_tasks: vec![5; days as usize],
            confidence: 0.75,
        })
    }

    fn calculate_total_hours(&self, data: &Vec<Vec<String>>) -> f64 {
        data.iter()
            .filter_map(|row| row.get(3))
            .filter_map(|s| s.parse::<f64>().ok())
            .sum()
    }

    fn count_completed_tasks(&self, tasks: &Vec<Vec<String>>) -> u32 {
        tasks.iter()
            .filter(|row| row.get(4).map(|s| s == "done").unwrap_or(false))
            .count() as u32
    }

    fn calculate_trends(&self, _data: &Vec<Vec<String>>) -> Vec<MetricsTrend> {
        vec![]
    }

    fn calculate_comparisons(&self, _time: &Vec<Vec<String>>, _tasks: &Vec<Vec<String>>) -> MetricsComparison {
        MetricsComparison {
            vs_last_period: PeriodComparison {
                hours: PercentageChange {
                    value: 40.0,
                    previous_value: 38.0,
                    change: 2.0,
                    change_percent: 5.26,
                    trend: "up".to_string(),
                },
                tasks: PercentageChange {
                    value: 10.0,
                    previous_value: 8.0,
                    change: 2.0,
                    change_percent: 25.0,
                    trend: "up".to_string(),
                },
                productivity: PercentageChange {
                    value: 85.0,
                    previous_value: 80.0,
                    change: 5.0,
                    change_percent: 6.25,
                    trend: "up".to_string(),
                },
            },
            vs_goal: GoalComparison {
                hours: GoalProgress {
                    current: 40.0,
                    target: 40.0,
                    percentage: 100.0,
                    status: "on_track".to_string(),
                },
                tasks: GoalProgress {
                    current: 10.0,
                    target: 12.0,
                    percentage: 83.33,
                    status: "behind".to_string(),
                },
            },
        }
    }
}