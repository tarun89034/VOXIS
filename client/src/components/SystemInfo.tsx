import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Clock, Globe, Cpu } from 'lucide-react';

interface SystemInfoProps {
  className?: string;
}

export default function SystemInfo({ className = '' }: SystemInfoProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemData, setSystemData] = useState({
    browser: '',
    platform: '',
    language: '',
    timezone: '',
    online: navigator.onLine
  });

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Get system information
    setSystemData({
      browser: navigator.userAgent.split(' ').pop()?.split('/')[0] || 'Unknown',
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      online: navigator.onLine
    });

    // Listen for online/offline events
    const handleOnline = () => setSystemData(prev => ({ ...prev, online: true }));
    const handleOffline = () => setSystemData(prev => ({ ...prev, online: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Monitor className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">System Information</h3>
        </div>

        {/* Time and Date */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-lg font-mono font-semibold" data-testid="text-current-time">
              {formatTime(currentTime)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground pl-5" data-testid="text-current-date">
            {formatDate(currentTime)}
          </p>
        </div>

        {/* System Details */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Connection:</span>
            <Badge variant={systemData.online ? "default" : "destructive"} className="text-xs">
              {systemData.online ? 'Online' : 'Offline'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Platform:</span>
            <span className="font-mono" data-testid="text-platform">{systemData.platform}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Browser:</span>
            <span className="font-mono" data-testid="text-browser">{systemData.browser}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Language:</span>
            <span className="font-mono">{systemData.language}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Timezone:</span>
            <span className="font-mono text-xs">{systemData.timezone}</span>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex gap-2 pt-2 border-t border-card-border">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${systemData.online ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-muted-foreground">Network</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">Voice Ready</span>
          </div>
        </div>
      </div>
    </Card>
  );
}