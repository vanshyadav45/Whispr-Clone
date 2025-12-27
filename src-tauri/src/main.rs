// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod audio_capture;
mod deepgram_client;
mod session_manager;
mod commands;

use session_manager::SessionManager;
use dotenvy::dotenv;
use std::env;

fn main() {
    dotenv().ok();
    
    let api_key = env::var("DEEPGRAM_API_KEY").unwrap_or_else(|_| "".to_string());
    
    if api_key.is_empty() || api_key == "YOUR_DEEPGRAM_API_KEY_HERE" {
        println!("\n\x1b[31;1mCRITICAL ERROR: Deepgram API Key is missing or using placeholder!\x1b[0m");
        println!("\x1b[33mPlease update line 1 in your .env file with a real key from console.deepgram.com\x1b[0m\n");
    }
    
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .manage(SessionManager::new(api_key))
        .invoke_handler(tauri::generate_handler![
            commands::start_recording,
            commands::stop_recording,
            commands::save_transcript,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
