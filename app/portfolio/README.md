# AI Portfolio Chat

An interactive AI chat interface that represents your professional portfolio and can answer questions about your experience.

## Features

- Natural conversation about professional experience
- Context-aware responses
- Suggested questions
- Markdown support
- Real-time typing indicators
- Mobile-responsive design

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables:
Create a `.env.local` file in the root directory and add your Truffle AI API key:
```
TRUFFLE_API_KEY=your_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

5. Navigate to `/portfolio` to start chatting

## Creating Your Own AI Portfolio Agent

1. Navigate to the Truffle AI Dashboard at `dashboard.truffle.ai`
2. Sign up or log in to your account
3. Click on "Create New Agent"
4. Upload your resume (PDF or Word format)
5. Customize the agent's personality and response style
6. Click "Create Agent"
7. Copy your new agent ID
8. Use the agent ID in the `api/route.ts` file

## How It Works

1. The AI agent is loaded with your resume/portfolio context
2. Users can ask questions about your experience
3. The agent provides natural, conversational responses
4. Suggested questions help guide the conversation

## Potential Improvements

1. Add support for multiple resume versions
2. Implement meeting scheduling
3. Add file attachment support
4. Include interactive portfolio examples
5. Add voice interaction
6. Implement multi-language support
7. Add analytics for common questions

