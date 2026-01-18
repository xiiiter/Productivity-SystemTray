// src-tauri/src/models/metrics.rs

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MetricsData {
    pub period: DateRange,
    pub branch: BranchInfo,
    pub summary: MetricsSummary,
    pub trends: Vec<MetricsTrend>,
    pub comparisons: MetricsComparison,
    pub top_performers: Option<Vec<PerformerMetrics>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DateRange {
    pub start: String,
    pub end: String,
    pub label: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BranchInfo {
    pub id: String,
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MetricsSummary {
    pub total_hours: f64,
    pub total_tasks: u32,
    pub completed_tasks: u32,
    pub pending_tasks: u32,
    pub in_progress_tasks: u32,
    pub completion_rate: f64,
    pub average_task_time: f64,
    pub productivity_score: f64,
}

impl MetricsSummary {
    pub fn new() -> Self {
        Self {
            total_hours: 0.0,
            total_tasks: 0,
            completed_tasks: 0,
            pending_tasks: 0,
            in_progress_tasks: 0,
            completion_rate: 0.0,
            average_task_time: 0.0,
            productivity_score: 0.0,
        }
    }

    pub fn calculate_completion_rate(&mut self) {
        if self.total_tasks > 0 {
            self.completion_rate = (self.completed_tasks as f64 / self.total_tasks as f64) * 100.0;
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MetricsTrend {
    pub date: String,
    pub hours: f64,
    pub tasks_completed: u32,
    pub productivity: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MetricsComparison {
    pub vs_last_period: PeriodComparison,
    pub vs_goal: GoalComparison,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PeriodComparison {
    pub hours: PercentageChange,
    pub tasks: PercentageChange,
    pub productivity: PercentageChange,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PercentageChange {
    pub value: f64,
    pub previous_value: f64,
    pub change: f64,
    pub change_percent: f64,
    pub trend: String, // "up", "down", "stable"
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GoalComparison {
    pub hours: GoalProgress,
    pub tasks: GoalProgress,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GoalProgress {
    pub current: f64,
    pub target: f64,
    pub percentage: f64,
    pub status: String, // "on_track", "behind", "ahead"
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PerformerMetrics {
    pub user_id: String,
    pub name: String,
    pub hours: f64,
    pub tasks_completed: u32,
    pub productivity_score: f64,
    pub rank: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MetricsFilter {
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub branch_id: Option<String>,
    pub user_id: Option<String>,
    pub period: String, // "day", "week", "month", "quarter", "year"
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ForecastData {
    pub predicted_hours: Vec<f64>,
    pub predicted_tasks: Vec<u32>,
    pub confidence: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExportRequest {
    pub format: String, // "csv", "xlsx", "pdf"
    pub filter: MetricsFilter,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MetricsAlert {
    pub id: String,
    pub metric_type: String,
    pub threshold: f64,
    pub current_value: f64,
    pub severity: String, // "info", "warning", "critical"
    pub message: String,
    pub created_at: String,
}