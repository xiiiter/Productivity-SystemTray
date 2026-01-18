// src-tauri/src/services/workload_service.rs

use crate::models::workload::*;
use crate::integrations::google_sheets::SheetsClient;
use crate::shared::error::AppError;
use chrono::{Utc, Datelike};

pub struct WorkloadService {
    sheets: SheetsClient,
}

impl WorkloadService {
    pub async fn new() -> Result<Self, AppError> {
        let sheets = SheetsClient::new().await?;
        Ok(Self { sheets })
    }

    pub async fn get_workload(&self, user_id: &str) -> Result<Workload, AppError> {
        let range = "Workload!A2:F";
        let values = self.sheets.read_range(range).await?;

        let mut schedule = Vec::new();
        for row in values.iter() {
            if row.len() >= 6 && row[0] == user_id {
                schedule.push(WorkSchedule {
                    weekday: row[2].parse().unwrap_or(1),
                    start_time: row[3].clone(),
                    end_time: row[4].clone(),
                    break_start: None,
                    break_end: None,
                    active: true,
                });
            }
        }

        Ok(Workload {
            user_id: user_id.to_string(),
            branch_id: "1".to_string(),
            weekly_hours: 40.0,
            monthly_hours: 160.0,
            schedule,
            timezone: "UTC-3".to_string(),
            exceptions: Vec::new(),
        })
    }

    pub async fn get_workload_summary(&self, _user_id: &str, _start: &str, _end: &str) -> Result<WorkloadSummary, AppError> {
        Ok(WorkloadSummary {
            period: DateRange {
                start: "2026-01-01".to_string(),
                end: "2026-01-31".to_string(),
            },
            total_hours_worked: 160.0,
            total_hours_scheduled: 160.0,
            utilization_rate: 100.0,
            overtime_hours: 0.0,
            pending_exceptions: 0,
            calendar: Vec::new(),
        })
    }

    pub async fn validate_work_hours(&self, user_id: &str) -> Result<WorkHoursValidation, AppError> {
        let workload = self.get_workload(user_id).await?;
        let now = Utc::now();
        let weekday = now.weekday().num_days_from_monday() as u8 + 1;

        let schedule = workload.schedule.iter()
            .find(|s| s.weekday == weekday);

        let is_within = schedule.is_some();

        Ok(WorkHoursValidation {
            is_within_hours: is_within,
            current_time: now.to_rfc3339(),
            schedule: schedule.cloned(),
            message: if is_within {
                "Within working hours".to_string()
            } else {
                "Outside working hours".to_string()
            },
            next_available_time: None,
        })
    }

    pub async fn create_exception(&self, user_id: &str, request: CreateExceptionRequest) -> Result<WorkloadException, AppError> {
        let id = uuid::Uuid::new_v4().to_string();
        
        Ok(WorkloadException {
            id,
            user_id: user_id.to_string(),
            date: request.date,
            exception_type: request.exception_type,
            reason: request.reason,
            start_time: request.start_time,
            end_time: request.end_time,
            hours: request.hours,
            approved_by: None,
            approved_at: None,
            status: "pending".to_string(),
        })
    }

    pub async fn approve_exception(&self, _manager_id: &str, request: ApproveExceptionRequest) -> Result<WorkloadException, AppError> {
        Ok(WorkloadException {
            id: request.exception_id,
            user_id: "user1".to_string(),
            date: "2026-01-20".to_string(),
            exception_type: "overtime".to_string(),
            reason: "Project deadline".to_string(),
            start_time: None,
            end_time: None,
            hours: Some(2.0),
            approved_by: Some("manager1".to_string()),
            approved_at: Some(Utc::now().to_rfc3339()),
            status: if request.approved { "approved" } else { "rejected" }.to_string(),
        })
    }

    pub async fn get_work_status(&self, _user_id: &str) -> Result<WorkStatus, AppError> {
        Ok(WorkStatus {
            is_working: true,
            current_session: Some(WorkSession {
                start_time: "09:00".to_string(),
                elapsed_hours: 3.5,
            }),
            today_hours: 3.5,
            week_hours: 20.0,
            remaining_hours_today: 4.5,
            remaining_hours_week: 20.0,
        })
    }
}