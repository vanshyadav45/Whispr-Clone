# Wispr Clone

A production-grade desktop transcription application built with Tauri, React, and Deepgram.

## Features
- **Push-to-Talk**: Real-time streaming transcription with visual feedback.
- **Deepgram Nova-3**: Uses the latest STT model for high accuracy and low latency.
- **Cost Optimized**: WebSocket connection is only active during recording.
- **Cross-Platform**: Works on Windows, macOS, and Linux.
- **Modern UI**: Glassmorphism design with Tailwind CSS and Framer Motion.

## Setup

1. **Get a Deepgram API Key**: Sign up at [Deepgram](https://deepgram.com/).
2. **Configure Environment**:
   - Create a `.env` file in the root directory.
   - Add your API key: `DEEPGRAM_API_KEY=your_api_key_here`.
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Run in Development**:
   ```bash
   npm run tauri dev
   ```

## Architecture
- **Frontend**: React 18, Tailwind CSS, Lucide icons.
- **Backend**: Rust (Tauri), `cpal` for audio capture, `tokio-tungstenite` for WebSockets.
- **Data Flow**: Audio chunked in Rust -> Streamed to Deepgram -> JSON results emitted to React -> UI updated.

## Cost Optimization
- WebSocket connections are established only when the recording starts and closed immediately after.
- Mono audio at 16kHz/44.1kHz reduces bandwidth.
- Uses Nova-3 model for optimal cost/performance ratio.
