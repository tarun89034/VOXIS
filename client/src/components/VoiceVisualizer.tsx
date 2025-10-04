import { useState, useEffect, useRef } from 'react';

interface VoiceVisualizerProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  audioLevel?: number;
  isMinimized?: boolean;
  isActive?: boolean;
}

export default function VoiceVisualizer({ 
  isListening = false, 
  isSpeaking = false,
  audioLevel = 0,
  isMinimized = false,
  isActive = false
}: VoiceVisualizerProps) {
  const [waveData, setWaveData] = useState<number[]>(Array(24).fill(0));
  const [innerWaveData, setInnerWaveData] = useState<number[]>(Array(16).fill(0));
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isListening || isSpeaking) {
      // Create sophisticated waveform animation with multiple layers
      const animate = () => {
        const time = Date.now() * 0.001;
        
        // Outer wave rings - more dynamic and organic
        setWaveData(prev => prev.map((_, i) => {
          const angle = (i / prev.length) * Math.PI * 2;
          const baseFreq = Math.sin(time * 2 + angle * 3) * 0.4;
          const midFreq = Math.sin(time * 4 + angle * 6) * 0.3;
          const highFreq = Math.sin(time * 8 + angle * 12) * 0.2;
          const noise = (Math.random() - 0.5) * 0.1;
          
          const combined = (baseFreq + midFreq + highFreq + noise) * 0.5 + 0.5;
          return Math.max(0.05, combined * (audioLevel * 0.8 + 0.2));
        }));

        // Inner wave patterns - circular bars radiating from center
        setInnerWaveData(prev => prev.map((_, i) => {
          const angle = (i / prev.length) * Math.PI * 2;
          const wave1 = Math.sin(time * 3 + angle * 4) * 0.5;
          const wave2 = Math.sin(time * 6 + angle * 8) * 0.3;
          const combined = (wave1 + wave2) * 0.5 + 0.5;
          return Math.max(0.1, combined * (audioLevel * 0.9 + 0.1));
        }));
        
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      setWaveData(Array(24).fill(0.05));
      setInnerWaveData(Array(16).fill(0.1));
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, isSpeaking, audioLevel]);

  const getStateColor = () => {
    if (isSpeaking) return 'from-accent via-primary to-accent';
    if (isListening) return 'from-primary via-blue-400 to-primary';
    return 'from-muted-foreground/20 to-muted-foreground/5';
  };

  const size = isMinimized ? 'w-32 h-32' : 'w-48 h-48';
  const centerSize = isMinimized ? 'w-8 h-8' : 'w-16 h-16';
  const dotSize = isMinimized ? 'w-4 h-4' : 'w-8 h-8';

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow effect */}
      <div 
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 ${
          isListening || isSpeaking ? 'bg-primary/30 scale-125' : 'bg-transparent scale-100'
        }`}
      />
      
      {/* Main circular container */}
      <div className={`relative ${size} rounded-full bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-card-border/50 shadow-2xl transition-all duration-300`}>
        
        {/* Outer waveform rings - sophisticated circular pattern */}
        {waveData.map((level, index) => {
          const angle = (index / waveData.length) * 360;
          const radius = 35 + level * 25;
          const thickness = Math.max(1, level * 4);
          
          return (
            <div
              key={`outer-${index}`}
              className="absolute rounded-full"
              style={{
                width: `${radius * 2}%`,
                height: `${radius * 2}%`,
                top: `${50 - radius}%`,
                left: `${50 - radius}%`,
                border: `${thickness}px solid hsl(var(--primary) / ${level * 0.6 + 0.1})`,
                transform: `rotate(${angle}deg)`,
                transition: 'all 0.05s ease-out'
              }}
            />
          );
        })}

        {/* Inner radial waveform bars */}
        {innerWaveData.map((level, index) => {
          const angle = (index / innerWaveData.length) * 360;
          const length = 15 + level * 20;
          
          return (
            <div
              key={`inner-${index}`}
              className="absolute"
              style={{
                width: '2px',
                height: `${length}%`,
                background: `linear-gradient(to top, hsl(var(--primary) / ${level * 0.8}), hsl(var(--accent) / ${level * 0.6}))`,
                top: `${50 - length/2}%`,
                left: '50%',
                transformOrigin: `0px ${length/2}%`,
                transform: `translate(-50%, 0) rotate(${angle}deg)`,
                borderRadius: '1px',
                transition: 'all 0.05s ease-out'
              }}
            />
          );
        })}

        {/* Central core with VOXIS branding */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${centerSize} rounded-full bg-gradient-to-br ${getStateColor()} flex items-center justify-center transition-all duration-300 shadow-lg`}>
            <div className={`${dotSize} rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center`}>
              {!isMinimized && (
                <span className="text-xs font-bold text-primary">V</span>
              )}
            </div>
          </div>
        </div>

        {/* Active pulse rings */}
        {(isListening || isSpeaking) && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </>
        )}
      </div>

      {/* Status indicator - only show when not minimized */}
      {!isMinimized && (
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
          <div className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 backdrop-blur-sm border ${
            isSpeaking 
              ? 'bg-accent/90 text-accent-foreground border-accent/30' 
              : isListening 
                ? 'bg-primary/90 text-primary-foreground border-primary/30' 
                : 'bg-card/90 text-muted-foreground border-card-border/30'
          }`}>
            {isSpeaking ? 'VOXIS Speaking' : isListening ? 'VOXIS Listening' : 'Say "Arise" to activate'}
          </div>
        </div>
      )}
    </div>
  );
}