# VOXIS - Voice Assistant

VOXIS is a powerful, privacy-focused voice assistant built with TypeScript. It offers seamless voice interaction, animated visual feedback, local machine control, and web summarization/search features via the Brave Search API. VOXIS maintains chat history and user information (non-sensitive) for personalized, context-aware conversations. Its UI features a dynamic animated circle visualizer that responds to both user and assistant speech.

---

## Features

- **Voice Interaction**
  - Speak commands and queries to interact naturally.
  - Converts speech to text and responds with text-to-speech.

- **Animated Circle Visualizer**
  - Displays a circular waveform that dynamically animates to voice input/output.

- **Local Computer Control**
  - Executes system actions (open apps, manage files, etc.) securely via backend service.

- **Web Search & Topic Summarization**
  - Summarizes any topic using Brave Search API.
  - After summarizing, asks if you want a full web search; opens browser if requested.

- **Contextual Memory & Personalization**
  - Tracks chat history for contextual follow-ups.
  - Remembers user info (name, preferences, topics).

- **Privacy & Security**
  - NO sensitive credentials stored.
  - Local actions performed only on explicit user request.

---

## Example Workflow

1. **User:** "Tell me about quantum computing."
2. **VOXIS:** Summarizes topic, speaks response, animates visualizer.
3. **VOXIS:** "Do you want to search this on the web?"
4. **User:** "Yes."
5. **VOXIS:** Opens Brave Search in browser.
6. **VOXIS:** All interactions logged in chat history for future context.

---

## Technology Stack

- **Language:** TypeScript
- **Frontend:** 
  - React 18 with Wouter for routing
  - Tailwind CSS for styling
  - Radix UI components
  - Framer Motion for animations
  - Web Speech API for voice recognition and synthesis
- **Backend:** 
  - Node.js with Express
  - OpenAI API (GPT-5) for AI responses
  - Zod for validation
- **Build Tools:**
  - Vite for frontend bundling
  - tsx for TypeScript execution
  - esbuild for backend bundling

---

## Repository Structure

```plaintext
VOXIS/
│
├── client/                           # Frontend application
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── VoiceVisualizer.tsx   # Animated circle visualizer
│   │   │   ├── ChatInterface.tsx     # Chat UI
│   │   │   ├── VoiceControls.tsx     # Voice control buttons
│   │   │   ├── SystemInfo.tsx        # System information display
│   │   │   └── ui/                   # Reusable UI components
│   │   ├── pages/
│   │   │   └── VoiceAssistant.tsx    # Main voice assistant page
│   │   ├── hooks/
│   │   │   ├── useSpeechRecognition.ts  # Speech recognition hook
│   │   │   └── useSpeechSynthesis.ts    # Text-to-speech hook
│   │   ├── App.tsx                   # Main app component
│   │   └── main.tsx                  # React entry point
│   └── index.html                    # HTML template
│
├── server/                           # Backend server
│   ├── index.ts                      # Express server entry
│   ├── routes.ts                     # API routes
│   ├── lib/
│   │   └── openai.ts                 # OpenAI integration
│   ├── storage.ts                    # Data storage
│   └── vite.ts                       # Vite dev server setup
│
├── shared/
│   └── schema.ts                     # Shared types and schemas
│
├── .env.example                      # Environment variables template
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite configuration
└── README.md                         # This file
```

---

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/tarun89034/VOXIS.git
   cd VOXIS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_actual_openai_api_key_here
     ```
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Optionally update the SESSION_SECRET with a secure random string

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5000`

5. **Build for production** (optional)
   ```bash
   npm run build
   npm start
   ```

---

## Customization

- Modify OpenAI integration in `server/lib/openai.ts`
- Add new API routes in `server/routes.ts`
- Change visualizer appearance in `client/src/components/VoiceVisualizer.tsx`
- Add new UI components in `client/src/components/`
- Update voice assistant behavior in `client/src/pages/VoiceAssistant.tsx`

---

## Contributing

1. Fork the repository.
2. Create your branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -am 'Add feature'`).
4. Push to branch (`git push origin feature/my-feature`).
5. Open a pull request.

---

## License

MIT License

---

## Contact

For support or questions, open an issue or contact [tarun89034](https://github.com/tarun89034).
