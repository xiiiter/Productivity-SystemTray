// src-tauri/src/shared/error.rs

use std::fmt;

#[derive(Debug)]
pub enum AppError {
    NotFound(String),
    ValidationError(String),
    PermissionDenied(String),
    External(String),
    Internal(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::NotFound(msg) => write!(f, "Not found: {}", msg),
            AppError::ValidationError(msg) => write!(f, "Validation error: {}", msg),
            AppError::PermissionDenied(msg) => write!(f, "Permission denied: {}", msg),
            AppError::External(msg) => write!(f, "External error: {}", msg),
            AppError::Internal(msg) => write!(f, "Internal error: {}", msg),
        }
    }
}

impl std::error::Error for AppError {}