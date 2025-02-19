# YouTube Quiz Generator

An AI tool that automatically generates interactive quizzes from YouTube videos.

## Features

- Automatic quiz generation
- Multiple choice questions
- Explanations for answers
- Interactive quiz interface
- Score tracking
- Context-aware questions
- Embedded video player

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables:
Create a `.env.local` file in the root directory and add your Truffle AI API key:
```
TRUFFLE_API_KEY=your_api_key_here
YOUTUBE_QUIZ_AGENT_ID=your_agent_id_here
```

3. Run the development server:
```bash
npm run dev
```

4. Navigate to `/youtube-quiz` to start creating quizzes

## How It Works

1. User provides a YouTube URL
2. AI analyzes video content
3. Generates relevant questions and answers
4. Creates explanations for correct answers
5. Presents interactive quiz interface
6. Tracks and displays user score

## Potential Improvements

1. Add different question types
2. Implement difficulty levels
3. Add quiz sharing
4. Include timed quizzes
5. Add progress tracking
6. Implement quiz analytics
7. Add custom quiz templates
