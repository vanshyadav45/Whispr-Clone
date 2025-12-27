import { useRecording } from './hooks/useRecording';
import { useTranscript } from './hooks/useTranscript';
import { PushToTalkButton } from './components/PushToTalkButton';
import { TranscriptPanel } from './components/TranscriptPanel';
import { StatusIndicator } from './components/StatusIndicator';
import { Controls } from './components/Controls';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { save } from '@tauri-apps/plugin-dialog';

function App() {
  const { state, error, toggleRecording } = useRecording();
  const { finalTranscript, interimTranscript, clearTranscript } = useTranscript();

  const handleCopy = async () => {
    if (!finalTranscript) return;
    await navigator.clipboard.writeText(finalTranscript);
  };

  const handleSave = async () => {
    if (!finalTranscript) return;
    try {
      const path = await save({
        filters: [{
          name: 'Text',
          extensions: ['txt']
        }]
      });
      if (path) {
        // In Tauri V2, we might need to handle the path properly
        // For now, assuming simple string path
        await writeTextFile(path, finalTranscript);
      }
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-4xl mx-auto p-8 flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Wispr Clone
          </h1>
          <p className="text-slate-400 mt-1">Production-grade real-time transcription</p>
        </div>
        <StatusIndicator
          connected={true}
          recording={state === 'recording'}
        />
      </header>

      <main className="flex-1 flex flex-col gap-6 min-h-0">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Transcript
          </h2>
          <Controls
            onCopy={handleCopy}
            onClear={clearTranscript}
            onSave={handleSave}
            disabled={!finalTranscript}
          />
        </div>

        <TranscriptPanel
          final={finalTranscript}
          interim={interimTranscript}
        />

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            Error: {error}
          </div>
        )}
      </main>

      <footer className="mt-auto pt-8 flex justify-center">
        <PushToTalkButton
          state={state}
          onClick={toggleRecording}
        />
      </footer>
    </div>
  );
}

export default App;
