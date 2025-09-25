import ChatMessage from '../ChatMessage';

export default function ChatMessageExample() {
  const messages = [
    {
      id: '1',
      content: 'Tell me about quantum computing and how it differs from classical computing.',
      sender: 'user' as const,
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: '2',
      content: `Quantum computing is a revolutionary approach to computation that leverages quantum mechanical phenomena like superposition and entanglement. Unlike classical computers that use bits (0 or 1), quantum computers use quantum bits or "qubits" that can exist in multiple states simultaneously.

Key differences include:
• Parallel processing: Quantum computers can process many possibilities at once
• Exponential scaling: Adding qubits exponentially increases computing power
• Specialized applications: Particularly powerful for cryptography, optimization, and simulation

Would you like me to search for more detailed information about quantum computing applications?`,
      sender: 'assistant' as const,
      timestamp: new Date(Date.now() - 60000),
      showWebSearch: true
    },
    {
      id: '3',
      content: 'Yes, please search for recent quantum computing breakthroughs.',
      sender: 'user' as const,
      timestamp: new Date()
    }
  ];

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          {...message}
          onPlay={() => console.log('Playing message:', message.id)}
          onCopy={() => console.log('Copying message:', message.id)}
          onSearchWeb={() => console.log('Searching web for:', message.content)}
        />
      ))}
    </div>
  );
}