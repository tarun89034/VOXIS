import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Trash2 } from 'lucide-react';
import ChatMessage, { type ChatMessageProps } from './ChatMessage';

interface ChatInterfaceProps {
  messages?: Omit<ChatMessageProps, 'onPlay' | 'onCopy' | 'onSearchWeb'>[];
  onSendMessage?: (message: string) => void;
  onClearHistory?: () => void;
  onPlayMessage?: (messageId: string) => void;
  onCopyMessage?: (messageId: string) => void;
  onSearchWeb?: (messageId: string) => void;
  isTyping?: boolean;
  className?: string;
}

export default function ChatInterface({
  messages = [],
  onSendMessage,
  onClearHistory,
  onPlayMessage,
  onCopyMessage,
  onSearchWeb,
  isTyping = false,
  className = ''
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <Card className={`flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-card-border">
        <h3 className="font-semibold text-foreground">Conversation</h3>
        {onClearHistory && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClearHistory}
            className="text-muted-foreground hover:text-destructive"
            data-testid="button-clear-history"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Messages area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
              </div>
              <h4 className="text-lg font-medium text-foreground mb-2">Ready to assist</h4>
              <p className="text-sm text-muted-foreground max-w-sm">
                Start a conversation by speaking or typing a message. I can help with questions, research, and system tasks.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                {...message}
                onPlay={onPlayMessage ? () => onPlayMessage(message.id) : undefined}
                onCopy={onCopyMessage ? () => onCopyMessage(message.id) : undefined}
                onSearchWeb={onSearchWeb ? () => onSearchWeb(message.id) : undefined}
              />
            ))
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-sm">
                AI
              </div>
              <div className="bg-card border border-card-border px-4 py-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t border-card-border">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            data-testid="input-message"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!inputValue.trim()}
            data-testid="button-send"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}