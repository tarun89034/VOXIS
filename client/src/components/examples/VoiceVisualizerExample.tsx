import { useState } from 'react';
import VoiceVisualizer from '../VoiceVisualizer';
import { Button } from '@/components/ui/button';

export default function VoiceVisualizerExample() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0.5);

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <VoiceVisualizer 
        isListening={isListening}
        isSpeaking={isSpeaking}
        audioLevel={audioLevel}
      />
      
      <div className="flex gap-4">
        <Button 
          variant={isListening ? "default" : "outline"}
          onClick={() => {
            setIsListening(!isListening);
            setIsSpeaking(false);
          }}
          data-testid="button-listening"
        >
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </Button>
        
        <Button 
          variant={isSpeaking ? "default" : "outline"}
          onClick={() => {
            setIsSpeaking(!isSpeaking);
            setIsListening(false);
          }}
          data-testid="button-speaking"
        >
          {isSpeaking ? 'Stop Speaking' : 'Start Speaking'}
        </Button>
      </div>
      
      <div className="w-32">
        <label className="text-sm text-muted-foreground">Audio Level</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={audioLevel}
          onChange={(e) => setAudioLevel(parseFloat(e.target.value))}
          className="w-full"
          data-testid="input-audio-level"
        />
      </div>
    </div>
  );
}