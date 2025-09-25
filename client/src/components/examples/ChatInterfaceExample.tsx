import { useState } from 'react';
import ChatInterface from '../ChatInterface';

export default function ChatInterfaceExample() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      content: 'What can you help me with today?',
      sender: 'user' as const,
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      content: `I can help you with a wide range of tasks! Here are some things I can do:

• Answer questions and provide explanations on various topics
• Help with research and web searches
• Assist with system information and basic computer tasks
• Provide real-time information and current events
• Help with writing, analysis, and creative tasks

Try asking me anything or use voice commands for hands-free interaction!`,
      sender: 'assistant' as const,
      timestamp: new Date(Date.now() - 240000),
      showWebSearch: true
    },
    {
      id: '3',
      content: 'Tell me about the latest developments in artificial intelligence.',
      sender: 'user' as const,
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: `Thank you for your message: "${message}". This is a demo response. In the full application, this would be processed by the AI assistant with real-time speech synthesis and intelligent responses.`,
        sender: 'assistant' as const,
        timestamp: new Date(),
        showWebSearch: message.toLowerCase().includes('search') || message.toLowerCase().includes('research')
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="h-96 w-full max-w-2xl">
      <ChatInterface
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        onClearHistory={() => setMessages([])}
        onPlayMessage={(id) => console.log('Playing message:', id)}
        onCopyMessage={(id) => console.log('Copying message:', id)}
        onSearchWeb={(id) => console.log('Searching web for message:', id)}
        className="h-full"
      />
    </div>
  );
}