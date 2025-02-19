# AI-Powered Journal Demo

An intelligent journaling application that provides real-time writing suggestions using Truffle AI.

## Features

- Real-time AI writing suggestions
- Dark/light mode support
- Local storage for entries
- Search functionality
- Markdown support
- Entry management (create, edit, delete)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables:
Create a `.env.local` file in the root directory and add your Truffle AI API key:
```
TRUFFLE_API_KEY=your_api_key_here
JOURNAL_AGENT_ID=your_agent_id_here
```

3. Run the development server:
```bash
npm run dev
```

4. Navigate to `/journal-demo` to start journaling

## How It Works

1. As you write, the app detects when you start a new line
2. It sends the current context to the Truffle AI agent
3. The agent provides contextual suggestions for continuing your entry
4. Suggestions can be accepted with Tab or dismissed with Escape

## Potential Improvements

1. Add cloud sync functionality
2. Implement journal prompts/templates
3. Add sentiment analysis for entries
4. Include mood tracking
5. Add export functionality
6. Implement collaborative journaling
7. Add voice-to-text support
