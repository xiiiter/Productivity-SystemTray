// src-tauri/src/commands/branch.rs

use crate::services::branch_service::BranchService;
use crate::models::branch::{Branch, BranchSelection};

#[tauri::command]
pub async fn get_all_branches() -> Result<Vec<Branch>, String> {
    let service = BranchService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.get_all_branches()
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_branch_by_id(branch_id: String) -> Result<Branch, String> {
    let service = BranchService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.get_branch_by_id(&branch_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn select_branch(branch_id: String, user_id: String) -> Result<BranchSelection, String> {
    let service = BranchService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.select_branch(&branch_id, &user_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn clear_branch(user_id: String) -> Result<(), String> {
    let service = BranchService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.clear_branch(&user_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn validate_branch(branch_id: String, user_id: String) -> Result<bool, String> {
    let service = BranchService::new()
        .await
        .map_err(|e| e.to_string())?;
    
    service.validate_branch(&branch_id, &user_id)
        .await
        .map_err(|e| e.to_string())
}