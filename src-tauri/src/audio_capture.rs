use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use std::sync::Arc;
use tokio::sync::mpsc;

pub struct AudioCapture {}

impl AudioCapture {
    pub fn new() -> Self {
        Self {}
    }

    pub fn start(
        &self,
        tx: mpsc::Sender<Vec<u8>>,
    ) -> Result<(cpal::Stream, u32), String> {
        let host = cpal::default_host();
        let device = host
            .default_input_device()
            .ok_or("No input device found")?;

        let config: cpal::StreamConfig = device
            .default_input_config()
            .map_err(|e| e.to_string())?
            .into();

        let sample_rate = config.sample_rate.0;
        let channels = config.channels as usize;
        
        println!("Starting audio capture: {}Hz, {} channels", sample_rate, channels);

        let tx = Arc::new(tx);
        let stream = device
            .build_input_stream(
                &config,
                move |data: &[f32], _: &cpal::InputCallbackInfo| {
                    let mut pcm_data = Vec::with_capacity(data.len() * 2);
                    
                    for chunk in data.chunks_exact(channels) {
                        let mono_sample = chunk.iter().sum::<f32>() / (channels as f32);
                        let sample_i16 = (mono_sample * i16::MAX as f32) as i16;
                        pcm_data.extend_from_slice(&sample_i16.to_le_bytes());
                    }

                    // Log a small indicator every few chunks
                    let _ = tx.blocking_send(pcm_data);
                },
                |err| {
                    eprintln!("Audio stream error: {}", err);
                },
                None,
            )
            .map_err(|e| e.to_string())?;

        stream.play().map_err(|e| e.to_string())?;

        Ok((stream, sample_rate))
    }
}

unsafe impl Send for AudioCapture {}
unsafe impl Sync for AudioCapture {}
