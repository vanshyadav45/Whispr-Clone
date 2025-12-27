use crate::session_manager::SessionManager;
use tauri::{AppHandle, State};

#[tauri::command]
pub async fn start_recording(
    app_handle: AppHandle,
    session_manager: State<'_, SessionManager>,
) -> Result<(), String> {
    session_manager.start_recording(app_handle).await
}

#[tauri::command]
pub async fn stop_recording(
    session_manager: State<'_, SessionManager>,
) -> Result<(), String> {
    session_manager.stop_recording().await
}

#[tauri::command]
pub async fn save_transcript(
    _content: String,
    _filename: String,
) -> Result<(), String> {
    Ok(())
}
