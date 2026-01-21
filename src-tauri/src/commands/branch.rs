// src-tauri/src/commands/branch.rs

use crate::services::branch_service::BranchService;
use crate::models::branch::{Branch, BranchSelection};

#[tauri::command]
pub async fn get_all_branches(app: tauri::AppHandle) -> Result<Vec<Branch>, String> {
    println!("🔵 get_all_branches called");
    let service = BranchService::new(&app).await.map_err(|e| e.to_string())?;
    service.get_all_branches().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_branch_by_id(
    app: tauri::AppHandle,
    branch_id: String
) -> Result<Branch, String> {
    println!("🔵 get_branch_by_id called with branch_id: {}", branch_id);
    let service = BranchService::new(&app).await.map_err(|e| e.to_string())?;
    service.get_branch_by_id(&branch_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn select_branch(
    app: tauri::AppHandle,
    branch_id: String,
    user_id: String
) -> Result<BranchSelection, String> {
    println!("🔵 select_branch called");
    println!("   branch_id: {}", branch_id);
    println!("   user_id: {}", user_id);
    
    let service = BranchService::new(&app).await.map_err(|e| e.to_string())?;
    service.select_branch(&user_id, &branch_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_current_branch(
    app: tauri::AppHandle,
    user_id: String
) -> Result<Option<Branch>, String> {
    println!("🔵 get_current_branch called with user_id: {}", user_id);
    let service = BranchService::new(&app).await.map_err(|e| e.to_string())?;
    service.get_current_branch(&user_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn clear_branch(
    app: tauri::AppHandle,
    user_id: String
) -> Result<(), String> {
    println!("🔵 clear_branch called with user_id: {}", user_id);
    let service = BranchService::new(&app).await.map_err(|e| e.to_string())?;
    service.clear_branch(&user_id).await.map_err(|e| e.to_string())
}