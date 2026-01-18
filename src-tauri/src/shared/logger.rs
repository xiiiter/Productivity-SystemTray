// src-tauri/src/shared/logger.rs

use serde_json::Value;

pub fn log_action(user_id: &str, action: &str, resource: &str, details: Value) {
    let timestamp = chrono::Utc::now().to_rfc3339();
    
    if cfg!(debug_assertions) {
        println!(
            "[{}] User: {} | Action: {} | Resource: {} | Details: {}",
            timestamp, user_id, action, resource, details
        );
    }
}