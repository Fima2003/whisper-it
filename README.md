# Whisper-IT: Real-Time Transcription & Translation

Whisper-IT is a modern web application for real-time speech transcription and translation, built with Vite, React, Tailwind CSS, Nanostores, and Astro. It leverages OpenAI's Whisper API for accurate speech-to-text and provides a seamless, responsive user experience.

## Features

- **Real-Time Transcription:**
  - Start, pause, resume, and stop live audio transcription.
  - Transcriptions are processed using OpenAI's Whisper API.
- **History Management:**
  - Save, name, and view past transcriptions.
  - Transcriptions are stored in the browser's localStorage for privacy and offline access.
- **Translation (Optional):**
  - Translate transcribed text into English.
- **Modern UI:**
  - Responsive design with Tailwind CSS.
  - Accessible controls and clear feedback for all actions.
- **Astro Integration:**
  - Astro handles routing and layout, embedding React components for dynamic features.

## Tech Stack

- **Frontend:** React (functional components, hooks)
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Framework:** Astro (for routing, layouts, and SSR)
- **API:** OpenAI Whisper (via custom API endpoints) and Cloud Translation API

## Usage

1. **Start Transcription:**
   - Click the microphone button to begin live transcription.
   - Pause/resume as needed; stop to finish and save.
2. **Save & View History:**
   - Name and save your transcription.
   - Access previous transcriptions from the History page.
3. **Translation:**
   - (If enabled) Translate your transcription to other languages.

## Development

- **Install dependencies:**
  ```sh
  npm install
  ```
- **Run the dev server:**
  ```sh
  npm run dev
  ```
- **Build for production:**
  ```sh
  npm run build
  ```

## Contributing

- Follow the coding standards in Copilot Instructions.
- Use functional React components, and Tailwind for styling.
- Keep code modular, type-safe, and well-documented.
