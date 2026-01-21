use crate::models::workload::*;
use crate::integrations::google_sheets::SheetsClient;
use crate::shared::error::AppError;
use tauri::AppHandle;

pub struct WorkloadService {
    sheets: SheetsClient,
}

impl WorkloadService {
    pub async fn new(app: &AppHandle) -> Result<Self, AppError> {
        let sheets = SheetsClient::new(app).await?;
        Ok(Self { sheets })
    }

    pub async fn get_workload(&self, user_id: &str) -> Result<Workload, AppError> {
        let values = self.sheets.read_range("Workload!A2:F").await?;

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
            timezone: "UTC".to_string(),
            exceptions: Vec::new(),
        })
    }
}