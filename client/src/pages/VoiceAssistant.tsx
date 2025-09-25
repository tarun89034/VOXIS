import { useState, useEffect, useRef } from 'react';
import VoiceVisualizer from '@/components/VoiceVisualizer';
import ChatInterface from '@/components/ChatInterface';
import VoiceControls from '@/components/VoiceControls';
import SystemInfo from '@/components/SystemInfo';
import ThemeToggle from '@/components/ThemeToggle';
import { type ChatMessageProps } from '@/components/ChatMessage';

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0.3);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const autoTurnOffRef = useRef<NodeJS.Timeout>();
  
  // Mock chat messages for demo //todo: remove mock functionality
  const [messages, setMessages] = useState<Omit<ChatMessageProps, 'onPlay' | 'onCopy' | 'onSearchWeb'>[]>([
    {
      id: '1',
      content: 'Hello! I\'m VOXIS, your AI voice assistant. Say "arise" to activate me or "sleep" to deactivate. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date(Date.now() - 60000),
      showWebSearch: false
    }
  ]);

  // Simulate audio level changes when listening or speaking
  useEffect(() => {
    if (isListening || isSpeaking) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 0.8 + 0.2);
      }, 150);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0.1);
    }
  }, [isListening, isSpeaking]);

  // Auto-turn off functionality
  useEffect(() => {
    if (isActive && !isListening && !isSpeaking) {
      // Auto turn off after 60 seconds of inactivity
      autoTurnOffRef.current = setTimeout(() => {
        setIsActive(false);
        setIsMinimized(true);
        console.log('VOXIS auto-sleep after inactivity');
      }, 60000);
    } else {
      if (autoTurnOffRef.current) {
        clearTimeout(autoTurnOffRef.current);
      }
    }

    return () => {
      if (autoTurnOffRef.current) {
        clearTimeout(autoTurnOffRef.current);
      }
    };
  }, [isActive, isListening, isSpeaking]);

  // Voice command simulation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Demo: Press 'A' for "arise", 'S' for "sleep", 'M' for minimize toggle
      if (e.key.toLowerCase() === 'a') {
        handleAriseCommand();
      } else if (e.key.toLowerCase() === 's') {
        handleSleepCommand();
      } else if (e.key.toLowerCase() === 'm') {
        setIsMinimized(!isMinimized);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isMinimized]);

  const handleAriseCommand = () => {
    setIsActive(true);
    setIsMinimized(false);
    setIsListening(true);
    
    // Add system message
    const ariseMessage = {
      id: Date.now().toString(),
      content: 'VOXIS activated. I\'m ready to assist you.',
      sender: 'assistant' as const,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, ariseMessage]);
    
    setTimeout(() => setIsListening(false), 2000);
  };

  const handleSleepCommand = () => {
    setIsActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    setIsMinimized(true);
    
    // Add system message
    const sleepMessage = {
      id: Date.now().toString(),
      content: 'VOXIS going to sleep. Say "arise" to reactivate.',
      sender: 'assistant' as const,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, sleepMessage]);
  };

  const handleSendMessage = (message: string) => {
    // Check for voice commands
    if (message.toLowerCase().includes('arise')) {
      handleAriseCommand();
      return;
    }
    if (message.toLowerCase().includes('sleep')) {
      handleSleepCommand();
      return;
    }

    // Don't process messages if not active
    if (!isActive) {
      return;
    }

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI thinking and response
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "VOXIS here! I understand you're asking about: \"" + message + "\". In a full implementation, I would process this using advanced AI and provide detailed responses with optional web search integration.",
        "That's an interesting question! VOXIS would analyze your request and provide comprehensive information, possibly suggesting: \"Would you like me to search this on the web?\"",
        "I can help you with that! VOXIS uses speech recognition, AI processing, and text-to-speech to provide a seamless voice interaction experience.",
        "Great question! VOXIS would search knowledge bases and web sources to give you the most current and accurate information about: \"" + message + "\""
      ];
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'assistant' as const,
        timestamp: new Date(),
        showWebSearch: message.toLowerCase().includes('search') || message.toLowerCase().includes('web') || Math.random() > 0.6
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Simulate speech synthesis
      if (!isMuted) {
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 3000);
      }
    }, 1500 + Math.random() * 1000);
  };

  const handleToggleMic = () => {
    if (!isActive) {
      handleAriseCommand();
      return;
    }

    setIsListening(!isListening);
    if (isSpeaking) setIsSpeaking(false);
    
    // Simulate voice recognition with mock message //todo: remove mock functionality
    if (!isListening) {
      setTimeout(() => {
        if (Math.random() > 0.6) {
          const voiceQueries = [
            "What's the weather like today?",
            "Tell me about machine learning",
            "How do quantum computers work?",
            "Search for recent AI developments",
            "arise",
            "sleep"
          ];
          handleSendMessage(voiceQueries[Math.floor(Math.random() * voiceQueries.length)]);
        }
        setIsListening(false);
      }, 2000 + Math.random() * 3000);
    }
  };

  const handleWebSearch = (messageId?: string) => {
    if (messageId) {
      console.log('Opening web search for message:', messageId);
    }
    // Simulate opening browser
    window.open('https://search.brave.com/search?q=AI+voice+assistant', '_blank');
  };

  const handleSystemInfo = () => {
    setShowSystemInfo(!showSystemInfo);
  };

  // Minimized mode - only show waveform
  if (isMinimized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative">
        <div 
          className="cursor-pointer"
          onClick={() => setIsMinimized(false)}
          data-testid="button-expand"
        >
          <VoiceVisualizer
            isListening={isListening}
            isSpeaking={isSpeaking}
            audioLevel={audioLevel}
            isMinimized={true}
          />
        </div>
        
        {/* Minimized controls overlay */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-card-border rounded-full px-4 py-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-muted-foreground">
              {isActive ? 'VOXIS Active' : 'VOXIS Sleeping'}
            </span>
            <span className="text-xs text-muted-foreground/60">• Click to expand</span>
          </div>
        </div>
        
        {/* Demo instructions overlay */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="bg-card/80 backdrop-blur-sm border border-card-border rounded-lg px-4 py-3">
            <p className="text-sm text-muted-foreground mb-2">Demo Controls:</p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>Press 'A' for "arise"</span>
              <span>Press 'S' for "sleep"</span>
              <span>Press 'M' to toggle minimize</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-xs font-bold text-white">V</span>
          </div>
          <h1 className="text-xl font-semibold">VOXIS</h1>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'
          }`}>
            {isActive ? 'Active' : 'Sleeping'}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded-md hover-elevate"
            data-testid="button-minimize"
          >
            Minimize
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded-md hover-elevate"
            data-testid="button-toggle-chat"
          >
            {showChat ? 'Hide Chat' : 'Show Chat'}
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Central Voice Interface */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          {/* Voice Visualizer */}
          <div className="mb-8">
            <VoiceVisualizer
              isListening={isListening}
              isSpeaking={isSpeaking}
              audioLevel={audioLevel}
              isMinimized={false}
            />
          </div>

          {/* Voice Controls */}
          <VoiceControls
            isListening={isListening}
            isMuted={isMuted}
            connectionStatus={connectionStatus}
            onToggleMic={handleToggleMic}
            onToggleMute={() => setIsMuted(!isMuted)}
            onSettings={() => console.log('Opening settings')}
            onWebSearch={() => handleWebSearch()}
            onSystemInfo={handleSystemInfo}
          />

          {/* Status Message */}
          <div className="mt-6 text-center max-w-md">
            <p className="text-sm text-muted-foreground">
              {!isActive 
                ? 'VOXIS is sleeping. Say "arise" or click the microphone to activate'
                : isListening 
                  ? "VOXIS is listening... Speak your command or question"
                  : isSpeaking 
                    ? "VOXIS is responding..."
                    : 'VOXIS is ready. Say "sleep" to deactivate or ask me anything'
              }
            </p>
            
            {/* Demo Instructions */}
            <div className="mt-4 text-xs text-muted-foreground/60">
              <p>Demo: Press 'A' for "arise" • Press 'S' for "sleep" • Press 'M' to minimize</p>
            </div>
          </div>

          {/* System Info Overlay */}
          {showSystemInfo && (
            <div className="absolute bottom-8 right-8">
              <SystemInfo />
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-96 border-l border-border">
            <ChatInterface
              messages={messages}
              isTyping={isTyping && isActive}
              onSendMessage={handleSendMessage}
              onClearHistory={() => setMessages([])}
              onPlayMessage={(id) => {
                console.log('Playing message:', id);
                if (isActive) {
                  setIsSpeaking(true);
                  setTimeout(() => setIsSpeaking(false), 2000);
                }
              }}
              onCopyMessage={(id) => {
                const message = messages.find(m => m.id === id);
                if (message) {
                  navigator.clipboard.writeText(message.content);
                  console.log('Copied message to clipboard');
                }
              }}
              onSearchWeb={handleWebSearch}
              className="h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}