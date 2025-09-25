import OpenAI from "openai";

// The newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface VoiceAssistantResponse {
  content: string;
  suggestWebSearch?: boolean;
  searchQuery?: string;
  action?: 'search' | 'system_info' | 'none';
}

export async function processVoiceCommand(
  message: string, 
  conversationHistory: Array<{ role: 'user' | 'assistant', content: string }> = []
): Promise<VoiceAssistantResponse> {
  try {
    // Build conversation context
    const messages = [
      {
        role: "system" as const,
        content: `You are VOXIS, an intelligent voice assistant designed for seamless interaction. You help users with:

1. Answering questions and providing explanations
2. Web search suggestions for current information
3. System information queries
4. General assistance and conversation

Guidelines:
- Be conversational and helpful
- Keep responses concise but informative for voice interaction
- Suggest web search when the user asks about current events, recent news, real-time data, or specific research topics
- For questions about local system info (time, browser, platform), indicate you can provide that
- Always maintain a friendly, professional tone
- Respond in JSON format with content, suggestWebSearch boolean, searchQuery (if applicable), and action

Example response format:
{
  "content": "I can help you with that. Here's what I found...",
  "suggestWebSearch": false,
  "action": "none"
}

For web search suggestions:
{
  "content": "That's an interesting topic! I can provide some basic information, but would you like me to search the web for the most current details?",
  "suggestWebSearch": true,
  "searchQuery": "recent developments in quantum computing 2024",
  "action": "search"
}`
      },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      {
        role: "user" as const,
        content: message
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-5", // The newest OpenAI model is "gpt-5" which was released August 7, 2025
      messages,
      response_format: { type: "json_object" },
      max_completion_tokens: 500
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      content: result.content || "I'm here to help! Could you please rephrase your question?",
      suggestWebSearch: result.suggestWebSearch || false,
      searchQuery: result.searchQuery,
      action: result.action || 'none'
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      content: "I'm experiencing some technical difficulties right now. Please try again in a moment.",
      suggestWebSearch: false,
      action: 'none'
    };
  }
}

export async function generateSystemResponse(systemAction: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // The newest OpenAI model is "gpt-5" which was released August 7, 2025
      messages: [
        {
          role: "system",
          content: "You are VOXIS. Provide a brief, friendly response for system actions. Keep it under 50 words and conversational for voice interaction."
        },
        {
          role: "user",
          content: `Generate a response for this system action: ${systemAction}`
        }
      ],
      max_completion_tokens: 100
    });

    return response.choices[0].message.content || "System action completed.";
  } catch (error) {
    console.error('OpenAI API error for system response:', error);
    return "System action completed.";
  }
}