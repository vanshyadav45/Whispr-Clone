use futures_util::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use tokio::sync::mpsc;
use tokio_tungstenite::{
    connect_async,
    tungstenite::protocol::Message,
};
use tauri::{AppHandle, Emitter};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DeepgramResponse {
    pub channel: Channel,
    pub is_final: bool,
    pub speech_final: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Channel {
    pub alternatives: Vec<Alternative>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Alternative {
    pub transcript: String,
    pub confidence: f64,
}

pub struct DeepgramClient {
    api_key: String,
}

impl DeepgramClient {
    pub fn new(api_key: String) -> Self {
        Self { api_key }
    }

    pub async fn stream(
        &self,
        mut rx: mpsc::Receiver<Vec<u8>>,
        app_handle: AppHandle,
        sample_rate: u32,
    ) -> Result<(), String> {
        let url = format!(
            "wss://api.deepgram.com/v1/listen?model=nova-3&encoding=linear16&sample_rate={}&channels=1&interim_results=true&punctuate=true",
            sample_rate
        );
        
        println!("Connecting to Deepgram with sample rate: {}...", sample_rate);
        
        use tokio_tungstenite::tungstenite::client::IntoClientRequest;
        let mut request = url.into_client_request().map_err(|e| e.to_string())?;
        request.headers_mut().insert(
            "Authorization",
            format!("Token {}", self.api_key).parse().unwrap(),
        );

        let (ws_stream, _) = connect_async(request)
            .await
            .map_err(|e| e.to_string())?;

        println!("Connected to Deepgram!");

        let (mut write, mut read) = ws_stream.split();
        let app_handle_clone = app_handle.clone();
        
        let read_task = tokio::spawn(async move {
            while let Some(msg) = read.next().await {
                match msg {
                    Ok(Message::Text(text)) => {
                        if let Ok(response) = serde_json::from_str::<DeepgramResponse>(&text) {
                            if !response.channel.alternatives[0].transcript.is_empty() {
                                println!("Transcript: {}", response.channel.alternatives[0].transcript);
                            }
                            if let Err(e) = app_handle_clone.emit("transcript-result", response) {
                                eprintln!("Failed to emit transcript event: {}", e);
                            }
                        }

                    }
                    Ok(Message::Close(frame)) => {
                        println!("Deepgram closed connection: {:?}", frame);
                        break;
                    },
                    Err(e) => {
                        eprintln!("WS Read Error: {}", e);
                        break;
                    }
                    _ => {}
                }
            }
        });

        let mut chunk_count = 0;
        while let Some(data) = rx.recv().await {
            chunk_count += 1;
            if chunk_count % 100 == 0 {
                println!("Sent 100 audio chunks to Deepgram...");
            }
            if write.send(Message::Binary(data)).await.is_err() {
                break;
            }
        }

        println!("Audio stream ended, closing connection...");
        let _ = write.send(Message::Close(None)).await;
        let _ = read_task.await;

        Ok(())
    }
}
