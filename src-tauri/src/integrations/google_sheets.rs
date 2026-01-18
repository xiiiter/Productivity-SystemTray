// src-tauri/src/integrations/google_sheets.rs

use crate::shared::error::AppError;
use google_sheets4::{
    api::ValueRange,
    hyper::{self, client::HttpConnector},
    hyper_rustls::{self, HttpsConnector},
    oauth2::{self, ServiceAccountAuthenticator},
    Sheets,
};

const SPREADSHEET_ID: &str = "YOUR_SPREADSHEET_ID_HERE";
const SERVICE_ACCOUNT_KEY: &str = "amplified-name-484715-i1-4384a7a2d183.json";

pub struct SheetsClient {
    hub: Sheets<HttpsConnector<HttpConnector>>,
}

impl SheetsClient {
    pub async fn new() -> Result<Self, AppError> {
        let service_account_key = oauth2::read_service_account_key(SERVICE_ACCOUNT_KEY)
            .await
            .map_err(|e| AppError::External(format!("Failed to read service account key: {}", e)))?;

        let auth = ServiceAccountAuthenticator::builder(service_account_key)
            .build()
            .await
            .map_err(|e| AppError::External(format!("Failed to authenticate: {}", e)))?;

        let client = hyper::Client::builder().build(
            hyper_rustls::HttpsConnectorBuilder::new()
                .with_native_roots()
                .map_err(|e| AppError::External(format!("Failed to build HTTPS connector: {}", e)))?
                .https_or_http()
                .enable_http1()
                .build(),
        );

        let hub = Sheets::new(client, auth);

        Ok(Self { hub })
    }

    pub async fn read_range(&self, range: &str) -> Result<Vec<Vec<String>>, AppError> {
        let result = self
            .hub
            .spreadsheets()
            .values_get(SPREADSHEET_ID, range)
            .doit()
            .await
            .map_err(|e| AppError::External(format!("Failed to read from Sheets: {}", e)))?;

        let values = result
            .1
            .values
            .unwrap_or_default()
            .into_iter()
            .map(|row| {
                row.into_iter()
                    .map(|v| v.to_string().trim_matches('"').to_string())
                    .collect()
            })
            .collect();

        Ok(values)
    }

    pub async fn write_range(&self, range: &str, values: Vec<Vec<String>>) -> Result<(), AppError> {
        let value_range = ValueRange {
            major_dimension: None,
            range: Some(range.to_string()),
            values: Some(
                values
                    .into_iter()
                    .map(|row| row.into_iter().map(|v| serde_json::Value::String(v)).collect())
                    .collect(),
            ),
        };

        self.hub
            .spreadsheets()
            .values_append(value_range, SPREADSHEET_ID, range)
            .value_input_option("RAW")
            .doit()
            .await
            .map_err(|e| AppError::External(format!("Failed to write to Sheets: {}", e)))?;

        Ok(())
    }

    pub async fn update_cell(&self, range: &str, value: String) -> Result<(), AppError> {
        self.write_range(range, vec![vec![value]]).await
    }
}