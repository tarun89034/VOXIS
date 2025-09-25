import { useState, useEffect } from 'react';
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
  
  // Mock chat messages for demo //todo: remove mock functionality
  const [messages, setMessages] = useState<Omit<ChatMessageProps, 'onPlay' | 'onCopy' | 'onSearchWeb'>[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI voice assistant. How can I help you today?',
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

  const handleSendMessage = (message: string) => {
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
        "I understand you're asking about: \"" + message + "\". In a full implementation, I would process this using advanced AI and provide detailed responses with optional web search integration.",
        "That's an interesting question! I would analyze your request and provide comprehensive information, possibly suggesting: \"Would you like me to search this on the web?\"",
        "I can help you with that! In the complete system, I would use speech recognition, AI processing, and text-to-speech to provide a seamless voice interaction experience.",
        "Great question! I would search my knowledge base and potentially web sources to give you the most current and accurate information about: \"" + message + "\""
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
    setIsListening(!isListening);
    if (isSpeaking) setIsSpeaking(false);
    
    // Simulate voice recognition with mock message //todo: remove mock functionality
    if (!isListening) {
      setTimeout(() => {
        if (Math.random() > 0.7) {
          const voiceQueries = [
            "What's the weather like today?",
            "Tell me about machine learning",
            "How do quantum computers work?",
            "Search for recent AI developments"
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-background/80" />
          </div>
          <h1 className="text-xl font-semibold">Voice Assistant</h1>
        </div>
        
        <div className="flex items-center gap-2">
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
              {isListening 
                ? "Listening... Speak your command or question"
                : isSpeaking 
                  ? "Speaking... Assistant is responding"
                  : "Ready to assist. Click the microphone or type your message"
              }
            </p>
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
              isTyping={isTyping}
              onSendMessage={handleSendMessage}
              onClearHistory={() => setMessages([])}
              onPlayMessage={(id) => {
                console.log('Playing message:', id);
                setIsSpeaking(true);
                setTimeout(() => setIsSpeaking(false), 2000);
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