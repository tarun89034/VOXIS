import { useState } from 'react';
import VoiceControls from '../VoiceControls';

export default function VoiceControlsExample() {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <VoiceControls
        isListening={isListening}
        isMuted={isMuted}
        connectionStatus={connectionStatus}
        onToggleMic={() => setIsListening(!isListening)}
        onToggleMute={() => setIsMuted(!isMuted)}
        onSettings={() => console.log('Opening settings')}
        onWebSearch={() => console.log('Opening web search')}
        onSystemInfo={() => console.log('Showing system info')}
      />
      
      {/* Demo Controls */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setConnectionStatus('connected')}
          className="px-3 py-1 text-xs bg-green-500 text-white rounded"
        >
          Connected
        </button>
        <button
          onClick={() => setConnectionStatus('connecting')}
          className="px-3 py-1 text-xs bg-yellow-500 text-white rounded"
        >
          Connecting
        </button>
        <button
          onClick={() => setConnectionStatus('disconnected')}
          className="px-3 py-1 text-xs bg-red-500 text-white rounded"
        >
          Disconnected
        </button>
      </div>
    </div>
  );
}