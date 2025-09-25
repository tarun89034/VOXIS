import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Copy, Volume2, ExternalLink } from 'lucide-react';

export interface ChatMessageProps {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isPlaying?: boolean;
  onPlay?: () => void;
  onCopy?: () => void;
  onSearchWeb?: () => void;
  showWebSearch?: boolean;
}

export default function ChatMessage({
  content,
  sender,
  timestamp,
  isPlaying = false,
  onPlay,
  onCopy,
  onSearchWeb,
  showWebSearch = false
}: ChatMessageProps) {
  const isUser = sender === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
      {/* Avatar */}
      <Avatar className="w-8 h-8 shrink-0">
        {isUser ? (
          <>
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">U</AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-accent to-primary text-white text-sm">AI</AvatarFallback>
          </>
        )}
      </Avatar>

      {/* Message content */}
      <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message bubble */}
        <div className={`px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-primary text-primary-foreground ml-auto' 
            : 'bg-card border border-card-border'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>

        {/* Timestamp and actions */}
        <div className={`flex items-center gap-2 mt-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-muted-foreground">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          {/* Action buttons */}
          <div className={`flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
            isUser ? 'flex-row-reverse' : 'flex-row'
          }`}>
            {!isUser && onPlay && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={onPlay}
                data-testid="button-play-message"
              >
                <Volume2 className={`h-3 w-3 ${isPlaying ? 'text-primary' : ''}`} />
              </Button>
            )}
            
            {onCopy && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={onCopy}
                data-testid="button-copy-message"
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
            
            {showWebSearch && onSearchWeb && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={onSearchWeb}
                data-testid="button-search-web"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}