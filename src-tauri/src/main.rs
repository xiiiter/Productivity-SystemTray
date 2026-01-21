#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod models;
mod services;
mod integrations;
mod shared;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            use tauri::{
                menu::{Menu, MenuItemBuilder},
                tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
                Manager, PhysicalPosition,
            };

            let quit = MenuItemBuilder::with_id("quit", "Sair").build(app)?;
            let menu = Menu::with_items(app, &[&quit])?;

            let _tray = TrayIconBuilder::new()
                .menu(&menu)
                .tooltip("Productivity")
                .icon(app.default_window_icon().unwrap().clone())
                .on_menu_event(|app, event| {
                    if event.id().as_ref() == "quit" {
                        app.exit(0);
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("popup") {
                            match window.is_visible() {
                                Ok(true) => {
                                    let _ = window.hide();
                                }
                                _ => {
                                    if let Ok(monitor) = window.current_monitor() {
                                        if let Some(monitor) = monitor {
                                            let screen_size = monitor.size();
                                            let window_size = window.outer_size().unwrap_or_default();
                                            
                                            let x = screen_size.width as i32 - window_size.width as i32 - 10;
                                            let y = screen_size.height as i32 - window_size.height as i32 - 50;
                                            
                                            let _ = window.set_position(PhysicalPosition::new(x, y));
                                        }
                                    }
                                    
                                    let _ = window.show();
                                    let _ = window.set_focus();
                                }
                            }
                        }
                    }
                })
                .build(app)?;

            if let Some(window) = app.get_webview_window("popup") {
                let window_clone = window.clone();
                window.on_window_event(move |event| {
                    if let tauri::WindowEvent::Focused(false) = event {
                        let _ = window_clone.hide();
                    }
                });
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Branch commands
            commands::get_all_branches,
            commands::get_branch_by_id,
            commands::select_branch,
            commands::get_current_branch,
            commands::clear_branch,
            
            // Task/Inbox commands
            commands::get_tasks,
            commands::create_task,
            commands::update_task_status,
            commands::delete_task,
            commands::mark_task_complete,
            
            // Metrics commands
            commands::get_branch_metrics,
            
            // Notification commands
            commands::get_notifications,
            commands::mark_notification_as_read,
            commands::mark_all_notifications_as_read,
            commands::create_notification,
            
            // Workload commands
            commands::get_workload,
            commands::get_weekly_schedule,
        ])
        .run(tauri::generate_context!())
        .expect("erro ao executar aplicação tauri");
}