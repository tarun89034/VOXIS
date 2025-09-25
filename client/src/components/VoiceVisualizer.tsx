import { useState, useEffect, useRef } from 'react';

interface VoiceVisualizerProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  audioLevel?: number;
}

export default function VoiceVisualizer({ 
  isListening = false, 
  isSpeaking = false,
  audioLevel = 0 
}: VoiceVisualizerProps) {
  const [waveData, setWaveData] = useState<number[]>(Array(12).fill(0));
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isListening || isSpeaking) {
      // Simulate real-time waveform animation
      const animate = () => {
        setWaveData(prev => prev.map((_, i) => {
          const base = Math.sin(Date.now() * 0.002 + i * 0.5) * 0.5 + 0.5;
          const variation = Math.sin(Date.now() * 0.008 + i * 1.2) * 0.3;
          return Math.max(0.1, (base + variation) * (audioLevel * 0.7 + 0.3));
        }));
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      setWaveData(Array(12).fill(0.1));
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, isSpeaking, audioLevel]);

  const getStateColor = () => {
    if (isSpeaking) return 'from-accent to-primary';
    if (isListening) return 'from-primary to-primary/70';
    return 'from-muted-foreground/30 to-muted-foreground/10';
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow effect */}
      <div 
        className={`absolute inset-0 rounded-full blur-xl transition-all duration-300 ${
          isListening || isSpeaking ? 'bg-primary/20 scale-110' : 'bg-transparent scale-100'
        }`}
      />
      
      {/* Main circular container */}
      <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-card to-card/50 border border-card-border shadow-lg">
        {/* Central avatar area */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getStateColor()} flex items-center justify-center transition-all duration-300`}>
            <div className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm" />
          </div>
        </div>

        {/* Animated waveform rings */}
        {waveData.map((level, index) => (
          <div
            key={index}
            className="absolute rounded-full border border-primary/40"
            style={{
              width: `${80 + level * 60}%`,
              height: `${80 + level * 60}%`,
              top: `${10 - level * 30}%`,
              left: `${10 - level * 30}%`,
              opacity: level * 0.8,
              transform: `rotate(${index * 30}deg)`,
              borderWidth: `${Math.max(1, level * 3)}px`,
              transition: 'all 0.1s ease-out'
            }}
          />
        ))}

        {/* Pulse effect during speaking */}
        {isSpeaking && (
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
        )}
      </div>

      {/* Status indicator */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
        <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
          isSpeaking 
            ? 'bg-accent text-accent-foreground' 
            : isListening 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground'
        }`}>
          {isSpeaking ? 'Speaking' : isListening ? 'Listening' : 'Ready'}
        </div>
      </div>
    </div>
  );
}