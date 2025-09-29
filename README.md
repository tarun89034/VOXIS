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

- **Main language:** TypeScript
- **Frontend:** TypeScript, CSS, Web Audio API (for visualizer)
- **Backend:** TypeScript/Node.js (for local actions, Brave Search API integration)
- **Memory:** In-memory or persistent storage for chat history/user info

---

## Repository Structure

```plaintext
VOXIS/
│
├── src/
│   ├── components/
│   │   ├── VoiceVisualizer.tsx      # Animated circle visualizer component
│   │   ├── ChatWindow.tsx           # Main chat UI
│   │   ├── MicrophoneInput.tsx      # Handles mic input
│   │   └── ...                      # Other UI components
│   ├── backend/
│   │   ├── index.ts                 # Main backend entry
│   │   ├── localActions.ts          # Local system command handlers
│   │   ├── braveSearch.ts           # Brave Search API integration
│   │   ├── memory.ts                # Chat/user info storage
│   │   └── ...                      # Other backend modules
│   ├── utils/
│   │   ├── speechToText.ts          # Speech recognition helpers
│   │   ├── textToSpeech.ts          # TTS helpers
│   │   └── ...
│   ├── App.tsx                      # Main app entry
│   └── index.tsx                    # React entrypoint
│
├── public/
│   ├── index.html                   # App HTML template
│   └── ...
│
├── package.json
├── tsconfig.json
├── README.md
└── ...
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

3. **Set up Brave Search API**
   - Sign up for a free API key at [Brave Search API](https://search.brave.com/api).
   - Add your key to backend config (e.g., `.env` or `config.ts`).

4. **Run the app**
   ```bash
   npm start
   ```

---

## Customization

- Add new local actions by extending `src/backend/localActions.ts`.
- Change visualizer appearance in `src/components/VoiceVisualizer.tsx`.
- Enhance memory by updating `src/backend/memory.ts`.

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
