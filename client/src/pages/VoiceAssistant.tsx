import { useState, useEffect, useRef, useCallback } from 'react';
import VoiceVisualizer from '@/components/VoiceVisualizer';
import ChatInterface from '@/components/ChatInterface';
import VoiceControls from '@/components/VoiceControls';
import SystemInfo from '@/components/SystemInfo';
import ThemeToggle from '@/components/ThemeToggle';
import { type ChatMessageProps } from '@/components/ChatMessage';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

export default function VoiceAssistant() {
  const [isMuted, setIsMuted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const autoTurnOffRef = useRef<NodeJS.Timeout>();
  
  const [messages, setMessages] = useState<Omit<ChatMessageProps, 'onPlay' | 'onCopy' | 'onSearchWeb'>[]>([
    {
      id: '1',
      content: 'Hello! I\'m VOXIS, your AI voice assistant. Say "arise" to activate me or "sleep" to deactivate. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date(Date.now() - 60000),
      showWebSearch: false
    }
  ]);

  // Web search handler
  const handleWebSearch = useCallback(async (messageId?: string, searchQuery?: string) => {
    try {
      let query = searchQuery;
      
      if (messageId && !query) {
        const message = messages.find(m => m.id === messageId);
        query = message?.content || 'AI voice assistant';
      }
      
      if (!query) {
        query = 'AI voice assistant';
      }

      const result = await fetch('/api/search/web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const response = await result.json();

      if (response.success) {
        window.open(response.searchUrl, '_blank');
      }
    } catch (error) {
      console.error('Web search error:', error);
      window.open('https://search.brave.com/search?q=' + encodeURIComponent(searchQuery || 'AI voice assistant'), '_blank');
    }
  }, [messages]);

  // Process message with OpenAI
  const processMessage = useCallback(async (message: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Get conversation history for context
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      // Process with OpenAI
      const result = await fetch('/api/voice/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversationHistory })
      });

      const response = await result.json();

      if (response.success) {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          content: response.response.content,
          sender: 'assistant' as const,
          timestamp: new Date(),
          showWebSearch: response.response.suggestWebSearch
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // Speak the response
        if (!isMuted && speechSynthesis.isSupported) {
          speechSynthesis.speak(response.response.content);
        }

        // Handle web search suggestion
        if (response.response.suggestWebSearch && response.response.searchQuery) {
          // Automatically open web search after a delay
          setTimeout(() => {
            handleWebSearch(undefined, response.response.searchQuery);
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: 'I\'m experiencing some technical difficulties. Please try again.',
        sender: 'assistant' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, isMuted, handleWebSearch]);

  // Voice command handlers
  const handleAriseCommand = useCallback(() => {
    setIsActive(true);
    setIsMinimized(false);
    
    // Add system message
    const ariseMessage = {
      id: Date.now().toString(),
      content: 'VOXIS activated. I\'m ready to assist you.',
      sender: 'assistant' as const,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, ariseMessage]);
    
    // Start listening
    if (speechRecognition.isSupported) {
      speechRecognition.start();
    }
    
    // Speak activation message
    if (!isMuted && speechSynthesis.isSupported) {
      speechSynthesis.speak('VOXIS activated. How can I help you?');
    }
  }, [isMuted]);

  const handleSleepCommand = useCallback(() => {
    setIsActive(false);
    setIsMinimized(true);
    
    // Stop listening and speaking
    speechRecognition.stop();
    speechSynthesis.stop();
    
    // Add system message
    const sleepMessage = {
      id: Date.now().toString(),
      content: 'VOXIS going to sleep. Say "arise" to reactivate.',
      sender: 'assistant' as const,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, sleepMessage]);
    
    // Speak sleep message
    if (!isMuted && speechSynthesis.isSupported) {
      speechSynthesis.speak('Going to sleep. Say arise to reactivate.');
    }
  }, [isMuted]);

  // Speech result handler
  const handleSpeechResult = useCallback(async (transcript: string) => {
    // Check for voice commands
    if (transcript.toLowerCase().includes('arise')) {
      handleAriseCommand();
      return;
    }
    if (transcript.toLowerCase().includes('sleep')) {
      handleSleepCommand();
      return;
    }

    // Don't process messages if not active
    if (!isActive) {
      return;
    }

    await processMessage(transcript);
  }, [isActive, handleAriseCommand, handleSleepCommand, processMessage]);

  // Speech Recognition
  const speechRecognition = useSpeechRecognition({
    onResult: useCallback((transcript: string, isFinal: boolean) => {
      setCurrentTranscript(transcript);
      if (isFinal && transcript.trim()) {
        handleSpeechResult(transcript.trim());
        setCurrentTranscript('');
      }
    }, [handleSpeechResult]),
    onError: useCallback((error: string) => {
      console.error('Speech recognition error:', error);
      setConnectionStatus('disconnected');
    }, []),
    onStart: useCallback(() => {
      setConnectionStatus('connected');
    }, []),
    onEnd: useCallback(() => {
      setCurrentTranscript('');
    }, [])
  });

  // Speech Synthesis
  const speechSynthesis = useSpeechSynthesis({
    onStart: useCallback(() => {
      // Speech synthesis started
    }, []),
    onEnd: useCallback(() => {
      // Speech synthesis ended
    }, []),
    onError: useCallback((error: string) => {
      console.error('Speech synthesis error:', error);
    }, [])
  });

  const { isListening, audioLevel: micAudioLevel } = speechRecognition;
  const { isSpeaking, audioLevel: speakAudioLevel } = speechSynthesis;

  // Calculate combined audio level from mic and speech
  const audioLevel = isListening ? micAudioLevel : isSpeaking ? speakAudioLevel : 0.1;

  // Auto-turn off functionality
  useEffect(() => {
    if (isActive && !isListening && !isSpeaking) {
      autoTurnOffRef.current = setTimeout(() => {
        handleSleepCommand();
      }, 60000); // 60 seconds
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
  }, [isActive, isListening, isSpeaking, handleSleepCommand]);

  // Keyboard shortcuts (spacebar for push-to-talk when minimized)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isMinimized && e.code === 'Space') {
        e.preventDefault();
        if (!isActive) {
          handleAriseCommand();
        } else {
          handleToggleMic();
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isMinimized, isActive]);

  const handleSendMessage = useCallback((message: string) => {
    processMessage(message);
  }, [processMessage]);

  const handleToggleMic = useCallback(() => {
    if (!isActive) {
      handleAriseCommand();
      return;
    }

    if (isListening) {
      speechRecognition.stop();
    } else {
      speechSynthesis.stop(); // Stop speaking when starting to listen
      speechRecognition.start();
    }
  }, [isActive, isListening, speechRecognition, speechSynthesis, handleAriseCommand]);

  const handleSystemInfo = () => {
    setShowSystemInfo(!showSystemInfo);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      speechSynthesis.stop();
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="voice-assistant-container">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-primary" data-testid="app-title">
              VOXIS
            </h1>
            <div className="flex items-center gap-2">
              <div 
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' : 
                  connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                data-testid={`status-${connectionStatus}`}
              />
              <span className="text-sm text-muted-foreground">
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMinimize}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              data-testid="button-minimize"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? '⬆️' : '⬇️'}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="max-w-6xl mx-auto p-4">
          <div className={`grid gap-6 transition-all duration-300 ${
            isMinimized ? 'grid-cols-1' : 'lg:grid-cols-[1fr,400px]'
          }`}>
            
            {/* Left Panel - Voice Visualizer and Controls */}
            <div className="space-y-6">
              {/* Voice Visualizer */}
              <div className="flex justify-center">
                <VoiceVisualizer
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  isActive={isActive}
                  audioLevel={audioLevel}
                  isMinimized={isMinimized}
                  data-testid="voice-visualizer"
                />
              </div>

              {/* Voice Controls */}
              {!isMinimized && (
                <VoiceControls
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  isMuted={isMuted}
                  isActive={isActive}
                  connectionStatus={connectionStatus}
                  onToggleMic={handleToggleMic}
                  onToggleMute={handleMute}
                  onActivate={handleAriseCommand}
                  onDeactivate={handleSleepCommand}
                  data-testid="voice-controls"
                />
              )}

              {/* Current Transcript */}
              {currentTranscript && !isMinimized && (
                <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-muted-foreground mb-1">Listening...</p>
                  <p className="text-accent font-medium" data-testid="current-transcript">
                    {currentTranscript}
                  </p>
                </div>
              )}
            </div>

            {/* Right Panel - Chat and System Info */}
            {!isMinimized && (
              <div className="space-y-6">
                {/* Chat Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                      showChat 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                    data-testid="button-chat-toggle"
                  >
                    Chat
                  </button>
                  <button
                    onClick={handleSystemInfo}
                    className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                      showSystemInfo 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                    data-testid="button-system-info"
                  >
                    System
                  </button>
                </div>

                {/* Chat Interface */}
                {showChat && (
                  <ChatInterface
                    messages={messages}
                    isTyping={isTyping && isActive}
                    onSendMessage={handleSendMessage}
                    onClearHistory={() => setMessages([])}
                    onPlayMessage={(id) => {
                      console.log('Playing message:', id);
                      if (isActive) {
                        const message = messages.find(m => m.id === id);
                        if (message && speechSynthesis.isSupported) {
                          speechSynthesis.speak(message.content);
                        }
                      }
                    }}
                    onCopyMessage={(id) => {
                      const message = messages.find(m => m.id === id);
                      if (message) {
                        navigator.clipboard.writeText(message.content);
                      }
                    }}
                    onSearchWeb={handleWebSearch}
                    data-testid="chat-interface"
                  />
                )}

                {/* System Info */}
                {showSystemInfo && (
                  <SystemInfo
                    isActive={isActive}
                    isListening={isListening}
                    isSpeaking={isSpeaking}
                    connectionStatus={connectionStatus}
                    audioLevel={audioLevel}
                    data-testid="system-info"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Minimized mode instructions */}
      {isMinimized && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm border border-border rounded-lg px-4 py-2">
          <p className="text-sm text-muted-foreground text-center" data-testid="minimized-instructions">
            Press <kbd className="px-1 py-0.5 bg-accent/20 rounded text-xs">Space</kbd> to activate voice or say "arise"
          </p>
        </div>
      )}
    </div>
  );
}