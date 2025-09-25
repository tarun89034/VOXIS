import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Settings, 
  Volume2, 
  VolumeX,
  Globe,
  Monitor
} from 'lucide-react';

interface VoiceControlsProps {
  isListening?: boolean;
  isMuted?: boolean;
  connectionStatus?: 'connected' | 'connecting' | 'disconnected';
  onToggleMic?: () => void;
  onToggleMute?: () => void;
  onSettings?: () => void;
  onWebSearch?: () => void;
  onSystemInfo?: () => void;
  className?: string;
}

export default function VoiceControls({
  isListening = false,
  isMuted = false,
  connectionStatus = 'connected',
  onToggleMic,
  onToggleMute,
  onSettings,
  onWebSearch,
  onSystemInfo,
  className = ''
}: VoiceControlsProps) {
  const [isRecording, setIsRecording] = useState(false);

  const handleMicToggle = () => {
    setIsRecording(!isRecording);
    onToggleMic?.();
  };

  const getConnectionBadge = () => {
    const variants: Record<typeof connectionStatus, { variant: "default" | "secondary" | "outline" | "destructive", text: string }> = {
      connected: { variant: "default", text: "Connected" },
      connecting: { variant: "secondary", text: "Connecting" },
      disconnected: { variant: "destructive", text: "Disconnected" }
    };
    
    return variants[connectionStatus];
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Connection Status */}
      <Badge 
        variant={getConnectionBadge().variant}
        className="text-xs font-medium"
        data-testid="badge-connection"
      >
        {getConnectionBadge().text}
      </Badge>

      {/* Primary Mic Control */}
      <div className="relative">
        <Button
          size="icon"
          variant={isListening ? "default" : "outline"}
          className={`h-16 w-16 rounded-full ${
            isListening ? 'animate-pulse shadow-lg shadow-primary/25' : ''
          }`}
          onClick={handleMicToggle}
          data-testid="button-mic-toggle"
        >
          {isListening ? (
            <Mic className="h-8 w-8" />
          ) : (
            <MicOff className="h-8 w-8" />
          )}
        </Button>
        
        {/* Recording indicator */}
        {isListening && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full animate-pulse">
            <div className="w-full h-full bg-destructive rounded-full animate-ping" />
          </div>
        )}
      </div>

      {/* Secondary Controls */}
      <div className="flex items-center gap-2">
        {/* Volume Control */}
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10"
          onClick={onToggleMute}
          data-testid="button-volume"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>

        {/* Web Search */}
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10"
          onClick={onWebSearch}
          data-testid="button-web-search"
        >
          <Globe className="h-5 w-5" />
        </Button>

        {/* System Info */}
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10"
          onClick={onSystemInfo}
          data-testid="button-system-info"
        >
          <Monitor className="h-5 w-5" />
        </Button>

        {/* Settings */}
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10"
          onClick={onSettings}
          data-testid="button-settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 text-xs text-muted-foreground">
        <span>Say "Hey Assistant" to activate</span>
      </div>
    </div>
  );
}