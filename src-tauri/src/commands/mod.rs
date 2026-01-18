// src-tauri/src/commands/mod.rs

pub mod branch;
pub mod inbox;
pub mod metric;
pub mod notifications;
pub mod workload;

// Re-export all commands for easy registration in main.rs
pub use branch::*;
pub use inbox::*;
pub use metric::*;
pub use notifications::*;
pub use workload::*;