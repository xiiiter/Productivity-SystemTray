// src-tauri/src/models/workload.rs

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Workload {
    pub user_id: String,
    pub branch_id: String,
    pub weekly_hours: f64,
    pub monthly_hours: f64,
    pub schedule: Vec<WorkSchedule>,
    pub timezone: String,
    pub exceptions: Vec<WorkloadException>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkSchedule {
    pub weekday: u8, // 1-7 (Monday-Sunday)
    pub start_time: String,
    pub end_time: String,
    pub break_start: Option<String>,
    pub break_end: Option<String>,
    pub active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkloadException {
    pub id: String,
    pub user_id: String,
    pub date: String,
    pub exception_type: String, // "absence", "overtime", "half_day", "holiday"
    pub reason: String,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
    pub hours: Option<f64>,
    pub approved_by: Option<String>,
    pub approved_at: Option<String>,
    pub status: String, // "pending", "approved", "rejected"
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateExceptionRequest {
    pub date: String,
    pub exception_type: String,
    pub reason: String,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
    pub hours: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApproveExceptionRequest {
    pub exception_id: String,
    pub approved: bool,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkloadSummary {
    pub period: DateRange,
    pub total_hours_worked: f64,
    pub total_hours_scheduled: f64,
    pub utilization_rate: f64,
    pub overtime_hours: f64,
    pub pending_exceptions: u32,
    pub calendar: Vec<DayWorkload>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DateRange {
    pub start: String,
    pub end: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DayWorkload {
    pub date: String,
    pub scheduled_hours: f64,
    pub worked_hours: f64,
    pub status: String, // "working", "off", "exception"
    pub exceptions: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkHoursValidation {
    pub is_within_hours: bool,
    pub current_time: String,
    pub schedule: Option<WorkSchedule>,
    pub message: String,
    pub next_available_time: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkStatus {
    pub is_working: bool,
    pub current_session: Option<WorkSession>,
    pub today_hours: f64,
    pub week_hours: f64,
    pub remaining_hours_today: f64,
    pub remaining_hours_week: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkSession {
    pub start_time: String,
    pub elapsed_hours: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateWorkloadRequest {
    pub weekly_hours: Option<f64>,
    pub schedule: Option<Vec<WorkSchedule>>,
    pub timezone: Option<String>,
}