use crate::audio_capture::AudioCapture;
use crate::deepgram_client::DeepgramClient;
use std::sync::Arc;
use tokio::sync::{mpsc, Mutex};
use tauri::AppHandle;

pub struct SessionManager {
    audio_capture: Arc<AudioCapture>,
    api_key: String,
    current_session: Arc<Mutex<Option<tokio::task::JoinHandle<()>>>>,
}

impl SessionManager {
    pub fn new(api_key: String) -> Self {
        Self {
            audio_capture: Arc::new(AudioCapture::new()),
            api_key,
            current_session: Arc::new(Mutex::new(None)),
        }
    }

    pub async fn start_recording(&self, app_handle: AppHandle) -> Result<(), String> {
        let mut session_lock = self.current_session.lock().await;
        if session_lock.is_some() {
            return Err("Recording is already in progress".into());
        }

        let (tx, rx) = mpsc::channel::<Vec<u8>>(1000);
        let audio_capture = self.audio_capture.clone();
        let api_key = self.api_key.clone();

        let handle = tokio::spawn(async move {
            let (stop_tx, stop_rx) = tokio::sync::oneshot::channel::<()>();
            
            // Channel to pass the detected sample rate back to the async task
            let (rate_tx, rate_rx) = tokio::sync::oneshot::channel::<u32>();

            std::thread::spawn(move || {
                let (stream, sample_rate) = match audio_capture.start(tx) {
                    Ok(s) => s,
                    Err(e) => {
                        eprintln!("Failed to start audio capture: {}", e);
                        return;
                    }
                };
                
                let _ = rate_tx.send(sample_rate);
                let _ = stop_rx.blocking_recv();
                drop(stream);
            });

            // Wait for the thread to tell us the actual hardware sample rate
            let sample_rate = match rate_rx.await {
                Ok(rate) => rate,
                Err(_) => 16000, // Fallback
            };

            let client = DeepgramClient::new(api_key);
            if let Err(e) = client.stream(rx, app_handle, sample_rate).await {
                eprintln!("Deepgram stream error: {}", e);
            }
            
            let _ = stop_tx.send(());
        });

        *session_lock = Some(handle);
        Ok(())
    }

    pub async fn stop_recording(&self) -> Result<(), String> {
        let mut session_lock = self.current_session.lock().await;
        if let Some(handle) = session_lock.take() {
            handle.abort();
        }
        Ok(())
    }
}

unsafe impl Send for SessionManager {}
unsafe impl Sync for SessionManager {}
